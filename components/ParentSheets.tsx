"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Download, Printer } from "lucide-react";
import type { ParentSheet } from "@/data/parentSheets";

export function ParentSheets({ sheets }: { sheets: ParentSheet[] }) {
  const [printing, setPrinting] = useState<string | null>(null);

  function printSheet(id: string) {
    flushSync(() => setPrinting(id));
    try { window.print(); } finally { setPrinting(null); }
  }

  return <div className="parent-sheets grid gap-10">
    {sheets.map(sheet => <article key={sheet.id} className={`parent-sheet border-t border-slate-200 pt-6 dark:border-slate-800 ${printing === sheet.id ? "is-printing" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="mb-1 text-xs text-slate-500 dark:text-slate-400">{sheet.category}</p><h2 className="text-xl font-semibold tracking-tight">{sheet.title}</h2></div>
        {!sheet.pdf && <button type="button" onClick={() => printSheet(sheet.id)} aria-label={`Stampa la scheda: ${sheet.title}`} className="no-print inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950"><Printer className="size-4" aria-hidden="true" />Stampa</button>}
      </div>
      <div className="mt-5 max-w-prose space-y-3 text-base leading-7 text-slate-700 dark:text-slate-300">{sheet.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}</div>
      {sheet.whenToCall.length > 0 && <section className="mt-6 max-w-prose border-l-2 border-blue-700 pl-4 dark:border-blue-300"><h3 className="mb-2 font-semibold">Quando contattare il pediatra</h3><ul className="list-disc space-y-2 pl-5 text-sm leading-6">{sheet.whenToCall.map(item => <li key={item}>{item}</li>)}</ul></section>}
      {sheet.pdf && <div className="mt-5">
        <p className="text-xs text-slate-500 dark:text-slate-400">PDF · {sheet.pdf.pages} pagina A4 · Pronto per la stampa</p>
        <div className="no-print mt-3 flex flex-wrap gap-3">
          <a href={sheet.pdf.url} target="_blank" rel="noopener noreferrer" aria-label={`Apri e stampa: ${sheet.title}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300"><Printer className="size-4" aria-hidden="true" />Apri e stampa</a>
          <a href={sheet.pdf.url} download aria-label={`Scarica PDF: ${sheet.title}`} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950"><Download className="size-4" aria-hidden="true" />Scarica PDF</a>
        </div>
      </div>}
      <footer className="mt-6 flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>{sheet.pdf ? `${sheet.pdf.attribution} · Fonte del ${sheet.pdf.sourceDate}` : "Dr Nicolò Tesio · Appunti di Pediatria"}</span>
        <span>{sheet.pdf ? "Reimpaginato il" : "Aggiornato il"} {new Date(sheet.updatedAt + "T12:00:00").toLocaleDateString("it-IT")}</span>
      </footer>
    </article>)}
  </div>;
}
