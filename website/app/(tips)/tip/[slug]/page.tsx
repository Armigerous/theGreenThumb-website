import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Tip/Header";
import Tip from "@/components/Tips/Tip/Tip";
import TipDetails from "@/components/Tips/Tip/TipDetails";
import { client } from "@/sanity/lib/client";
import {
  ALL_POSTS_SLUGS_QUERY,
  POST_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export const experimental_ppr = true;

export async function generateStaticParams() {
  const slugs = await client.fetch(ALL_POSTS_SLUGS_QUERY);
  return slugs.map((post) => ({
    slug: post.slug,
  }));
}

const TipPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const tip = await client.fetch(POST_BY_SLUG_QUERY, { slug });

  if (!tip) {
    notFound();
  }

  return (
    <MaxWidthWrapper>
      <article>
        <Header tip={tip} />
        <TipDetails tip={tip} />
        <Tip tip={tip} />
      </article>
    </MaxWidthWrapper>
  );
};

export default TipPage;
