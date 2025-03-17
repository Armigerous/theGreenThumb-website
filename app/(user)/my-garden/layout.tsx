import { MaxWidthWrapper } from "@/components/maxWidthWrapper";

export default function MyGardenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MaxWidthWrapper className="pt-8">{children}</MaxWidthWrapper>;
}
