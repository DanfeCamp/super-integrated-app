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
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          S
        </div>
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
