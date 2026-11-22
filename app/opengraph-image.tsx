import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Pritesh Kiri - Developer Relations Engineer at Harness and LitmusChaos maintainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(
    path.join(process.cwd(), "public/static/og/og-photo.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const topics = ["Chaos Engineering", "MCP & AI Agents", "Open Source", "Community"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#111010",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: 660,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 56px 56px 64px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#a3a3a3" }}>hey, I&apos;m</div>
            <div
              style={{
                fontSize: 84,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                marginTop: 8,
              }}
            >
              Pritesh Kiri
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#d4d4d4",
                marginTop: 28,
                lineHeight: 1.35,
              }}
            >
              Developer Relations Engineer at Harness & LitmusChaos maintainer
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 36,
              }}
            >
              {topics.map((topic) => (
                <div
                  key={topic}
                  style={{
                    fontSize: 22,
                    color: "#e5e5e5",
                    border: "1px solid #404040",
                    backgroundColor: "#1c1b1b",
                    borderRadius: 999,
                    padding: "8px 20px",
                  }}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 26, color: "#a3a3a3" }}>codewithcoffee.in</div>
        </div>
        <img
          src={photoSrc}
          width={540}
          height={630}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    size,
  );
}
