import { MaxWidthWrapper } from "@/components/maxWidthWrapper";

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaxWidthWrapper>{children}</MaxWidthWrapper>;
}
