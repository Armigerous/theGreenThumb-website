import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") ?? "Plant Details";

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
            backgroundColor: "#fff",
            padding: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              textAlign: "center",
            }}
          >
            {title}
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
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
