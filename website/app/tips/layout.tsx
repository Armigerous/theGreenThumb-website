import { MaxWidthWrapper } from "@/components/maxWidthHeader";

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaxWidthWrapper>{children}</MaxWidthWrapper>;
}
