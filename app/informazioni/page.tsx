import Link from "next/link";
import { Info, MessageSquarePlus, ShieldAlert } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function InformationPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="INFORMAZIONI" />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-blue-700 dark:text-blue-300" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Il progetto</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Questa webapp è un progetto personale di Dr Nicolò Tesio, pensato per avere rapidamente a disposizione informazioni e tool clinici utili nella pratica pediatrica.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Nota di utilizzo</h2>
            <p className="mt-2 text-sm leading-6">
              L&apos;app non sostituisce linee guida, protocolli locali o giudizio clinico. Verificare sempre fonti, dosi, concentrazioni disponibili e condizioni del paziente.
            </p>
          </div>
        </div>
      </section>

      <Link
        href="/feedback"
        className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950"
      >
        <MessageSquarePlus className="mt-0.5 size-5 shrink-0" />
        <span>
          <span className="block text-lg font-semibold">Suggerisci una miglioria</span>
          <span className="mt-2 block text-sm leading-6 text-blue-900 dark:text-blue-100">Invia feedback, errori o idee per nuovi contenuti.</span>
        </span>
      </Link>
    </div>
  );
}
