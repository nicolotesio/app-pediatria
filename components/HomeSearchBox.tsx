"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { filterSearchItems } from "@/lib/content/search";
import { Badge } from "@/components/ui/Badge";
import { SearchBar } from "@/components/ui/SearchBar";

export function HomeSearchBox() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => filterSearchItems(query).slice(0, 5), [query]);
  const hasQuery = query.trim().length > 0;

  return (
    <section>
      <SearchBar value={query} onChange={setQuery} placeholder="Cerca appunti, risorse o schede" />
      {hasQuery ? (
        <div className="mt-3 grid gap-2">
          {results.length > 0 ? (
            results.map((item) => (
              <Link key={`${item.type}-${item.id}`} href={item.href} className="rounded-md border border-slate-200 p-3 hover:border-blue-300 dark:border-slate-800">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge tone="blue">{item.type}</Badge>
                  <Badge>{item.category}</Badge>
                </div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
              </Link>
            ))
          ) : (
            <p className="rounded-md border border-slate-200 p-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">Nessun risultato.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
