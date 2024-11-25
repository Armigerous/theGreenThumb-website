// import { FilterPanel } from "@/components/Database/Filter/FilterPanel";
// import { SidebarProvider } from "@/components/ui/sidebar";

export default function PlantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {/* <SidebarProvider> */}
      {/* <FilterPanel /> */}

      {children}
      {/* </SidebarProvider> */}
    </main>
  );
}
