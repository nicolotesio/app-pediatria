import { Info, TriangleAlert } from "lucide-react";

export function WarningBox({ children, title, tone = "warning" }: { children: React.ReactNode; title?: React.ReactNode; tone?: "warning" | "info" }) {
  const Icon = tone === "info" ? Info : TriangleAlert;
  const heading = title === undefined ? (tone === "warning" ? "Attenzione" : null) : title;
  return (
    <div role="status" className={tone === "info" ? "rounded-xl border border-slate-200 bg-white p-4 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" : "rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"}>
      <div className="flex items-center gap-3">
        <Icon className="size-5 shrink-0" />
        <div>
          {heading ? <p className="font-semibold">{heading}</p> : null}
          <div className={heading ? "mt-1 text-sm leading-6" : "text-sm leading-6"}>{children}</div>
        </div>
      </div>
    </div>
  );
}
