/**
 * External dependencies.
 */
import sharp from "sharp";

export const POST = async (req, res) => {
  const formData = await req.formData();
  const file = formData.get("file");
  const quality = parseInt(formData.get("quality"));

  if (!file) {
    return new Response(JSON.stringify({ error: "No files received." }), {
      status: 400,
    });
  }

  if (!quality || quality < 1 || quality > 99) {
    return new Response(JSON.stringify({ error: "Invalid inputs." }), {
      status: 400,
    });
  }

  const regex = /(?:\.([^.]+))?$/;
  const format = regex.exec(file.name)[1];
  const _format = format?.toUpperCase();

  const formats = ["PNG", "JPG", "JPEG", "WEBP", "AVIF"];

  if (!formats.includes(_format)) {
    return new Response(JSON.stringify({ error: "File not supported." }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name.replaceAll(" ", "_");
  const newFilename = originalFilename.replace(/\.\w+$/, `.${format}`);

  if (Buffer.byteLength(buffer) >= 104857600) {
    return new Response(JSON.stringify({ error: "File size exceed limit." }), {
      status: 400,
    });
  }

  try {
    let sharpInstance = sharp(buffer);

    // Apply format-specific optimizations
    switch (_format) {
      case "JPG":
      case "JPEG":
        sharpInstance = sharpInstance.jpeg({ quality: quality });
        break;
      case "PNG":
        sharpInstance = sharpInstance.png({
          compressionLevel: Math.floor(quality / 10),
        });
        break;
      case "WEBP":
        sharpInstance = sharpInstance.webp({ quality: quality });
        break;
      case "AVIF":
        sharpInstance = sharpInstance.avif({ quality: quality });
        break;
      default:
        throw new Error("Unsupported format");
    }

    const outputBuffer = await sharpInstance.toBuffer();

    return new Response(
      JSON.stringify({
        file: outputBuffer.toString("base64"),
        filename: newFilename,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
};
