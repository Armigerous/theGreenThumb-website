import React from "react";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";

// Custom components for rendering different block types
const components: PortableTextReactComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      return (
        <div className="my-4">
          {value && value.asset ? (
            <Image
              src={value.asset.url}
              width={value.asset.metadata.dimensions.width}
              height={value.asset.metadata.dimensions.height}
              alt={value.alt || "Image"}
              className="rounded-lg shadow-md"
            />
          ) : (
            <p>Missing image</p>
          )}
        </div>
      );
    },
  },
};

const Content = ({ tip }: { tip: TipType }) => {
  const { body } = tip;

  if (!body || body.length === 0) {
    return <p>No content available.</p>;
  }

  return (
    <article className="prose max-w-none text-lg font-normal">
      <PortableText value={body} components={components} />
    </article>
  );
};

export default Content;
