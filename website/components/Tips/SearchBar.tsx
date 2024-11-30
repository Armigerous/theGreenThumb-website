import SearchBarDialog from "./SearchBarDialog";
import { fetchAllTipTitles } from "@/lib/utils";

export default async function SearchBar() {
  const tips = await fetchAllTipTitles();

  return <SearchBarDialog tips={tips} />;
}
