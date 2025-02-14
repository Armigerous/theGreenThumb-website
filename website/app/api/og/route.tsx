import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scientificName =
      searchParams.get("scientificName") ?? "Plant Details";
    const commonNames = searchParams.get("commonNames") ?? "";
    const description = searchParams.get("description") ?? "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #f0f9f0, #ffffff)",
            padding: "40px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              background: "white",
              padding: "40px 60px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              width: "90%",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#4B5563",
                marginBottom: "16px",
              }}
            >
              North Carolina Growing Guide
            </div>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: "#166534",
                textAlign: "center",
                margin: "0",
                lineHeight: "1.2",
              }}
            >
              {scientificName}
            </h1>
            {commonNames && (
              <div
                style={{
                  fontSize: "32px",
                  color: "#4B5563",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                {commonNames}
              </div>
            )}
            {description && (
              <div
                style={{
                  fontSize: "24px",
                  color: "#4B5563",
                  marginTop: "16px",
                  textAlign: "center",
                  maxWidth: "800px",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: "openmoji",
      }
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`${e.message}`);
    } else {
      console.log("An unknown error occurred");
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
