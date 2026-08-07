/**
 * WAV encoding and Web Audio processing, kept free of React so both halves can
 * be reasoned about (and the maths checked) on their own.
 *
 * Everything here runs on the user's device: `decodeAudioData` handles whatever
 * codecs the browser already ships, and `OfflineAudioContext` does the
 * resampling and channel mixing. That means no encoder dependency, no wasm and
 * no upload — at the cost of only being able to write uncompressed PCM.
 */

export type BitDepth = 16 | 24 | 32;

/** `null` means "whatever the source already is". */
export interface ConvertOptions {
  sampleRate: number | null;
  channels: 1 | 2 | null;
  bitDepth: BitDepth;
  /** Seconds, relative to the start of the source. */
  start: number;
  end: number;
  normalise: boolean;
}

/**
 * Browsers reject an OfflineAudioContext outside this range. 8 kHz is the
 * telephone floor; above 96 kHz nothing consumer-grade benefits.
 */
export const MIN_SAMPLE_RATE = 8000;
export const MAX_SAMPLE_RATE = 96000;

export const SAMPLE_RATES = [48000, 44100, 32000, 22050, 16000, 8000] as const;

/**
 * Clamped so an exotic source rate can't take the OfflineAudioContext
 * constructor outside its legal range and throw — 192 kHz masters and 4 kHz
 * voice memos both exist, and neither should be a crash.
 */
export function resolveSampleRate(requested: number) {
  return Math.min(
    MAX_SAMPLE_RATE,
    Math.max(MIN_SAMPLE_RATE, Math.round(requested))
  );
}

/**
 * A decoded AudioBuffer holds 32-bit floats per channel, so memory is roughly
 * `duration × rate × channels × 4`. Ten minutes of 48 kHz stereo is already
 * ~230 MB, and the WAV on top of that doubles it — past this the tab is far
 * more likely to be killed than to finish, so refuse up front with a clear
 * message instead of dying halfway through.
 */
export const MAX_DURATION_SECONDS = 15 * 60;

export const ACCEPTED_TYPES =
  "audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.oga,.opus,.webm";

/** Peak amplitude across every channel, used to drive the normalise toggle. */
export function peakAmplitude(buffer: AudioBuffer): number {
  let peak = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const samples = buffer.getChannelData(channel);
    for (let i = 0; i < samples.length; i += 1) {
      const value = Math.abs(samples[i] as number);
      if (value > peak) peak = value;
    }
  }
  return peak;
}

/**
 * Trim, resample, remix and optionally normalise — all in one offline render
 * pass. The destination's channel count drives Web Audio's own down/up-mix, so
 * stereo→mono uses the spec's `0.5 × (L + R)` rather than something ad hoc.
 */
export async function processAudio(
  source: AudioBuffer,
  options: ConvertOptions,
  peak: number
): Promise<AudioBuffer> {
  const sampleRate = resolveSampleRate(options.sampleRate ?? source.sampleRate);
  const channels = options.channels ?? source.numberOfChannels;
  const duration = Math.max(0, options.end - options.start);
  const frames = Math.max(1, Math.round(duration * sampleRate));

  const context = new OfflineAudioContext(channels, frames, sampleRate);
  const node = context.createBufferSource();
  node.buffer = source;

  // Normalising a silent selection would divide by ~0 and blow up the noise
  // floor, so leave anything essentially silent alone.
  const gain = options.normalise && peak > 0.0001 ? 1 / peak : 1;

  if (gain !== 1) {
    const gainNode = context.createGain();
    gainNode.gain.value = gain;
    node.connect(gainNode);
    gainNode.connect(context.destination);
  } else {
    node.connect(context.destination);
  }

  node.start(0, options.start, duration);
  return context.startRendering();
}

/** Byte length of the WAV `encodeWav` will produce, without producing it. */
export function wavByteLength(buffer: AudioBuffer, bitDepth: BitDepth) {
  const bytesPerSample = bitDepth / 8;
  return 44 + buffer.length * buffer.numberOfChannels * bytesPerSample;
}

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

/**
 * Interleave and write a RIFF/WAVE file. 16- and 24-bit are integer PCM
 * (format 1); 32-bit is IEEE float (format 3), which is what every DAW expects
 * from a float export.
 *
 * Yields to the event loop between chunks so a ten-minute file reports honest
 * progress instead of freezing the tab, and so the cancel button stays live.
 */
export async function encodeWav(
  buffer: AudioBuffer,
  bitDepth: BitDepth,
  onProgress?: (fraction: number) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = channels * bytesPerSample;
  const dataBytes = frames * blockAlign;
  const isFloat = bitDepth === 32;

  const output = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(output);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM header size
  view.setUint16(20, isFloat ? 3 : 1, true); // 3 = IEEE float, 1 = integer
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  // Pulled out of the loop: `getChannelData` is a live view, and calling it per
  // frame turns a linear write into a per-sample lookup.
  const channelData = Array.from({ length: channels }, (_, channel) =>
    buffer.getChannelData(channel)
  );

  const CHUNK_FRAMES = 96_000; // ~2 seconds at 48 kHz
  let offset = 44;

  for (let start = 0; start < frames; start += CHUNK_FRAMES) {
    if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");

    const end = Math.min(start + CHUNK_FRAMES, frames);

    for (let frame = start; frame < end; frame += 1) {
      for (let channel = 0; channel < channels; channel += 1) {
        const raw = (channelData[channel] as Float32Array)[frame] as number;
        // Rendering can overshoot ±1; clamping here is what stops a hot mix
        // from wrapping around into a click.
        const sample = Math.max(-1, Math.min(1, raw));

        if (isFloat) {
          view.setFloat32(offset, sample, true);
        } else if (bitDepth === 16) {
          view.setInt16(offset, Math.round(sample * 32767), true);
        } else {
          const value = Math.round(sample * 8388607);
          view.setUint8(offset, value & 0xff);
          view.setUint8(offset + 1, (value >> 8) & 0xff);
          view.setUint8(offset + 2, (value >> 16) & 0xff);
        }
        offset += bytesPerSample;
      }
    }

    onProgress?.(end / frames);
    // A macrotask, not a microtask — `await Promise.resolve()` would drain
    // straight back without ever letting the browser paint.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return new Blob([output], { type: "audio/wav" });
}

/** `formatDuration(83.4)` → `"1:23.4"`. */
export function formatDuration(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe - minutes * 60;
  return `${minutes}:${rest.toFixed(1).padStart(4, "0")}`;
}
