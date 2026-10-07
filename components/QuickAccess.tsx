"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Star, Ambulance, Brain, Pill, Droplets, ChartSpline, Calculator, BookOpenText, Ruler } from "lucide-react";
import { searchIndex } from "@/lib/content/search";
const defaults = ["/emergenze/wetflag", "/appunti/terapia-antibiotica"];
function toolIcon(href: string) {
  if (href.includes("gcs") || href.includes("epilettico")) return Brain;
  if (href.startsWith("/emergenze")) return Ambulance;
  if (href.includes("infusionale")) return Droplets;
  if (href.includes("crescita") || href.includes("intergrowth") || href.endsWith("/ines")) return ChartSpline;
  if (href.includes("altezza") || href.includes("superficie")) return Ruler;
  if (href.startsWith("/calcolatori")) return Calculator;
  if (href.includes("farmaci") || href.includes("terapia")) return Pill;
  return BookOpenText;
}
export function QuickAccess() {
  const [favorites, setFavorites] = useState<string[]>(defaults);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const choices = searchIndex.filter((item, i, all) => (item.type === "Calcolatore" || item.type === "Appunto") && all.findIndex(other => other.href === item.href) === i);
  useEffect(() => {
    try { const saved: unknown = JSON.parse(localStorage.getItem("pediatria-favorites") ?? "null"); if (Array.isArray(saved) && saved.every(item => typeof item === "string")) setFavorites(saved.filter(href => searchIndex.some(item => item.href === href))); } catch { /* Keep defaults when storage is unavailable. */ }
  }, []);
  function toggle(href: string) {
    const next = favorites.includes(href) ? favorites.filter(value => value !== href) : [...favorites, href];
    setFavorites(next);
    try { localStorage.setItem("pediatria-favorites", JSON.stringify(next)); setNotice(""); } catch { setNotice("Preferiti aggiornati per questa sessione; salvataggio locale non disponibile."); }
  }
  return <section aria-labelledby="quick-title">
    <div className="mb-3 flex items-center justify-between gap-3"><h2 id="quick-title" className="text-base font-semibold">Preferiti</h2><button type="button" aria-expanded={editing} aria-controls="favorite-options" onClick={() => setEditing(!editing)} className="min-h-11 rounded-lg px-2 text-sm font-medium text-blue-700 dark:text-blue-300">{editing ? "Fine" : "Personalizza"}</button></div>
    {editing && <div id="favorite-options" className="mb-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">{choices.map(item => <label key={item.href} className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={favorites.includes(item.href)} onChange={() => toggle(item.href)} className="peer sr-only" /><Star aria-hidden="true" className="size-5 shrink-0 text-slate-400 peer-checked:fill-blue-700 peer-checked:text-blue-700 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blue-500 dark:peer-checked:fill-blue-300 dark:peer-checked:text-blue-300" />{item.title}</label>)}</div>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{favorites.map(href => { const item = choices.find(choice => choice.href === href); const Icon = toolIcon(href); return item ? <Link href={href} key={href} className="group flex min-h-28 flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300  dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"><span className="flex items-center justify-between text-blue-700 dark:text-blue-300"><Icon className="size-5" aria-hidden="true" /><ArrowUpRight className="size-4 text-slate-400" /></span><span className="text-sm font-semibold leading-5">{item.title}</span></Link> : null; })}</div>
    {favorites.length === 0 && <p className="rounded-xl bg-white p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">Scegli i tuoi strumenti con “Personalizza”.</p>}
    <p role="status" className="text-sm text-slate-500 dark:text-slate-400">{notice}</p>
  </section>;
}
