"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { sections } from "@/lib/content/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const parent = sections.find(item => item.href !== "/" && pathname.startsWith(item.href + "/"));
  return <div className="min-h-screen">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:text-blue-800">Vai al contenuto</a>
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Appunti di Pediatria, vai alla home" className="flex min-w-0 items-center gap-2.5">
          <Image src="/favicon-512.png" alt="" aria-hidden="true" width={44} height={44} className="size-10 shrink-0 rounded-lg" priority />
          <span className="text-xl font-semibold leading-tight sm:text-2xl">Appunti di <span className="text-blue-700 dark:text-blue-300">Pediatria</span></span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav aria-label="Navigazione principale" className="hidden items-center gap-1 xl:flex">
            {sections.slice(0, 4).map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={"rounded-lg px-3 py-2 text-sm font-medium " + (active(item.href) ? "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800")}>{item.title}</Link>)}
          </nav>
          <Link href="/cerca" aria-label="Cerca in tutta l’app" aria-current={pathname === "/cerca" ? "page" : undefined} className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800"><Search className="size-5" /></Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
    <main id="main-content" className="mx-auto max-w-6xl px-4 pb-28 pt-7 sm:px-6 sm:pt-9 xl:pb-10">
      {parent && <Link href={parent.href} className="mb-5 inline-flex min-h-8 items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"><ChevronLeft className="size-4" />{parent.title}</Link>}
      {children}
    </main>
    <nav aria-label="Navigazione mobile" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur xl:hidden dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto grid max-w-xl grid-cols-4">{sections.slice(0, 4).map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={"flex min-h-[72px] flex-col items-center justify-center gap-1 text-[11px] font-medium " + (active(item.href) ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400")}><span className={"rounded-xl px-4 py-1 " + (active(item.href) ? "bg-blue-50 dark:bg-blue-950" : "")}><Icon className="size-5" /></span>{item.title}</Link>; })}</div>
    </nav>
  </div>;
}
