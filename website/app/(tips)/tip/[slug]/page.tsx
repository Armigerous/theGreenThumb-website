import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Tip/Header";
import Tip from "@/components/Tips/Tip/Tip";
import TipDetails from "@/components/Tips/Tip/TipDetails";
import { fetchAllTipSlugs, fetchTipBySlug } from "@/lib/utils";
import { notFound } from "next/navigation";

export const experimental_ppr = true;

export async function generateStaticParams() {
  const slugs = await fetchAllTipSlugs();
  return slugs.map(({ slug }) => ({
    slug,
  }));
}

const TipPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const tip = await fetchTipBySlug(slug);

  if (!tip) {
    notFound();
  }

  return (
    <MaxWidthWrapper className="scroll-smooth">
      <article>
        <Header tip={tip} />
        <TipDetails tip={tip} />
        <Tip tip={tip} />
      </article>
    </MaxWidthWrapper>
  );
};

export default TipPage;
