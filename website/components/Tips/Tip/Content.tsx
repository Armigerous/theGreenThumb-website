import { PortableText } from "@portabletext/react";

// Custom components for rendering different block types

const Content = ({ tip }: { tip: TipType }) => {
  const { body } = tip;

  if (!body || body.length === 0) {
    return <p>No content available.</p>;
  }

  return (
    <article className="prose max-w-none text-lg font-normal">
      <PortableText value={body} />
    </article>
  );
};

export default Content;
