import { Tip } from "@/types/Tip";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";
import slugify from "slugify";

const Content = ({ tip }: { tip: Tip }) => {
  const { body } = tip;

  if (!body || body.length === 0) {
    return <p>No content available.</p>;
  }

  // Function to generate slugs for headings
  const generateSlug = (text: string) =>
    slugify(text, { lower: true, strict: true });

  // Custom components for Portable Text
  const components: Partial<PortableTextReactComponents> = {
    types: {
      image: ({
        value,
      }: {
        value: {
          imageUrl: string;
          alt?: string;
          width?: number;
          height?: number;
        };
      }) => {
        if (!value?.imageUrl) {
          return null; // Gracefully handle missing image URLs
        }

        return (
          <Image
            src={value.imageUrl}
            alt={value.alt || "Image"}
            width={value.width || 300}
            height={value.height || 200}
            style={{ maxWidth: "100%", height: "auto" }}
            className="rounded-lg"
          />
        );
      },
    },
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => {
        const text = children ? String(children) : "";
        const slug = generateSlug(text);
        return <h1 id={slug}>{children}</h1>;
      },
      h2: ({ children }: { children?: React.ReactNode }) => {
        const text = children ? String(children) : "";
        const slug = generateSlug(text);
        return <h2 id={slug}>{children}</h2>;
      },
      h3: ({ children }: { children?: React.ReactNode }) => {
        const text = children ? String(children) : "";
        const slug = generateSlug(text);
        return <h3 id={slug}>{children}</h3>;
      },
      h4: ({ children }: { children?: React.ReactNode }) => {
        const text = children ? String(children) : "";
        const slug = generateSlug(text);
        return <h4 id={slug}>{children}</h4>;
      },
    },
  };

  return (
    <article className="prose max-w-none text-lg font-normal">
      <PortableText value={body} components={components} />
    </article>
  );
};

export default Content;
