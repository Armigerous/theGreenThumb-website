import { MaxWidthWrapper } from "@/components/maxWidthWrapper";
import Header from "@/components/Tips/Header";
import SearchBar from "@/components/Tips/SearchBar";

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MaxWidthWrapper>
      <Header />
      <SearchBar />
      {children}
    </MaxWidthWrapper>
  );
}
