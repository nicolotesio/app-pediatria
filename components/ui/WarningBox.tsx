import { TriangleAlert } from "lucide-react";

export function WarningBox({ children, title = "Attenzione" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <div className="flex gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">{title}</p>
          <div className="mt-1 text-sm leading-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
