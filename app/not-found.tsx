import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-4 py-10 text-center">
      <p className="text-5xl font-bold text-blue-700 dark:text-blue-300">404</p>
      <h1 className="text-xl font-semibold text-slate-950 dark:text-white">Pagina non trovata</h1>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">L&apos;indirizzo non corrisponde a nessuna pagina dell&apos;app.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Torna alla home</Link>
        <Link href="/cerca" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900">Cerca nell&apos;app</Link>
      </div>
    </div>
  );
}
