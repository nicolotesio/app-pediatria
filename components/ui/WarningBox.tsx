import { TriangleAlert } from "lucide-react";

export function WarningBox({ children, title = "Attenzione" }: { children: React.ReactNode; title?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <div className="flex items-center gap-3">
        <TriangleAlert className="size-5 shrink-0" />
        <div>
          {title ? <p className="font-semibold">{title}</p> : null}
          <div className={title ? "mt-1 text-sm leading-6" : "text-sm leading-6"}>{children}</div>
        </div>
      </div>
    </div>
  );
}
