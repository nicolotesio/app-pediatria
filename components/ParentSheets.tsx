import { FileText } from "lucide-react";
import type { ParentSheet } from "@/data/parentSheets";

export function ParentSheets({ sheets }: { sheets: ParentSheet[] }) {
  const categories = Array.from(new Set(sheets.map(sheet => sheet.category)));

  return <div className="grid gap-8">
    {categories.map(category => {
      const items = sheets.filter(sheet => sheet.category === category);
      const sources = Array.from(new Set(items.flatMap(sheet => sheet.pdf ? [`${sheet.pdf.attribution} · ${sheet.pdf.sourceDate}`] : [])));
      return <section key={category} aria-labelledby={`category-${items[0].id}`}>
        <h2 id={`category-${items[0].id}`} className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{category}</h2>
        <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {items.map(sheet => <article key={sheet.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
            <div className="min-w-0 flex-1 basis-64">
              <h3 className="text-base font-semibold">{sheet.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{sheet.content}</p>
            </div>
            {sheet.pdf && <a href={sheet.pdf.url} target="_blank" rel="noopener noreferrer" aria-label={`Apri PDF: ${sheet.title} (nuova scheda)`} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-slate-700 dark:text-blue-300 dark:hover:bg-slate-900"><FileText className="size-4" aria-hidden="true" />Apri PDF</a>}
          </article>)}
        </div>
        {sources.map(source => <p key={source} className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{source}</p>)}
      </section>;
    })}
  </div>;
}
