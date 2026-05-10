import { ShieldCheck } from "lucide-react";

type SourceBoxProps = {
  source: string;
  updatedAt: string;
  validity?: string;
  units?: string;
};

export function SourceBox({ source, updatedAt, validity, units }: SourceBoxProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-700 dark:text-blue-300" />
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="font-semibold text-slate-950 dark:text-white">Fonte/riferimento</dt>
            <dd className="text-slate-600 dark:text-slate-300">{source}</dd>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-950 dark:text-white">Aggiornato</dt>
              <dd className="text-slate-600 dark:text-slate-300">{updatedAt}</dd>
            </div>
            {validity ? (
              <div>
                <dt className="font-semibold text-slate-950 dark:text-white">Validità</dt>
                <dd className="text-slate-600 dark:text-slate-300">{validity}</dd>
              </div>
            ) : null}
            {units ? (
              <div>
                <dt className="font-semibold text-slate-950 dark:text-white">Unità</dt>
                <dd className="text-slate-600 dark:text-slate-300">{units}</dd>
              </div>
            ) : null}
          </div>
        </dl>
      </div>
    </aside>
  );
}
