"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSearchItems } from "@/lib/content/search";
import { SearchBar } from "@/components/ui/SearchBar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterSearchItems(query), [query]);

  return (
    <div className="grid gap-5">
      <SearchBar value={query} onChange={setQuery} placeholder="Cerca appunti, risorse o schede" />
      {results.length === 0 ? (
        <EmptyState title="Nessun risultato" description="Prova con una categoria, un tag o una parola chiave diversa." />
      ) : (
        <div className="grid gap-3">
          {results.map((item) => (
            <Link key={`${item.type}-${item.id}`} href={item.href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone="blue">{item.type}</Badge>
                <Badge>{item.category}</Badge>
              </div>
              <h2 className="font-semibold text-slate-950 dark:text-white">{item.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
