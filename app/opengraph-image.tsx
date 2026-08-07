import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.fullName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card generator. `buildMetadata` points every page here with its own
 * `?title=`, so each route gets a distinct card without a design pass.
 */
export default async function OpenGraphImage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const raw = params.title;
  const title = (Array.isArray(raw) ? raw[0] : raw) ?? siteConfig.fullName;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background:
          "linear-gradient(140deg, #14141b 0%, #1b1730 55%, #2a1f4d 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <LogoMark />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 30, fontWeight: 600 }}>
            {siteConfig.name}
          </span>
          <span style={{ fontSize: 20, color: "#a1a1aa" }}>
            {siteConfig.fullName}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: title.length > 34 ? 68 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa" }}>
          {siteConfig.tagline}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 24,
          color: "#a1a1aa",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#34d399",
          }}
        />
        Free · No sign-up · Works in your browser
      </div>
    </div>,
    size
  );
}

/**
 * The brand mark rebuilt in flexbox. Satori only implements a subset of SVG, so
 * `public/logo.svg` is reproduced with boxes here rather than referenced —
 * same 64-unit geometry, same colours, no renderer surprises at build time.
 */
function LogoMark() {
  const cell = {
    width: 16,
    height: 16,
    borderRadius: 4.7,
    background: "#ffffff",
  };

  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 18,
        padding: 14,
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        background: "linear-gradient(135deg, #8464fb, #5a44d8)",
      }}
    >
      <div style={cell} />
      <div style={{ ...cell, opacity: 0.62 }} />
      <div style={{ ...cell, opacity: 0.62 }} />
      <div style={{ ...cell, borderRadius: 999 }} />
    </div>
  );
}
