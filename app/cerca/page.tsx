import { SearchPageClient } from "@/components/SearchPageClient";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function SearchPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="CERCA" />
      <SearchPageClient />
    </div>
  );
}
