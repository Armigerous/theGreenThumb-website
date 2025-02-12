import Homepage from "@/components/Home/Homepage";
import Script from "next/script";

export default function Home() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The GreenThumb",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    logo: "/logo.png",
    description:
      "Merging the worlds of technology and agriculture for happier gardeners.",
  };

  return (
    <main>
      <Script
        id="json-ld-the-green-thumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <Homepage />
    </main>
  );
}
