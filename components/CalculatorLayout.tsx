import { SourceBox } from "@/components/ui/SourceBox";
import { WarningBox } from "@/components/ui/WarningBox";

type CalculatorLayoutProps = {
  title?: string;
  description?: string;
  source?: string;
  updatedAt?: string;
  validity?: string;
  units?: string;
  children: React.ReactNode;
  unframed?: boolean;
  showSource?: boolean;
  warning?: React.ReactNode;
  warningPlacement?: "side" | "bottom";
};

export function CalculatorLayout({
  title,
  description,
  source,
  updatedAt,
  validity,
  units,
  children,
  unframed = false,
  showSource = true,
  warning,
  warningPlacement = "side"
}: CalculatorLayoutProps) {
  const warningBox = (
    <WarningBox title={null}>
      {warning ?? "Strumento di supporto clinico. Verificare sempre dosi, linee guida locali, peso reale e condizioni del paziente."}
    </WarningBox>
  );

  if (warningPlacement === "bottom") {
    return (
      <section className="grid gap-5">
        <div className={unframed ? undefined : "rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"}>
          {title ? <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h2> : null}
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
          <div className={title || description ? "mt-5" : undefined}>{children}</div>
        </div>
        {showSource && source && updatedAt && validity && units ? <SourceBox source={source} updatedAt={updatedAt} validity={validity} units={units} /> : null}
        {warningBox}
      </section>
    );
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className={unframed ? undefined : "rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"}>
        {title ? <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h2> : null}
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
        <div className={title || description ? "mt-5" : undefined}>{children}</div>
      </div>
      <div className="space-y-4">
        {showSource && source && updatedAt && validity && units ? <SourceBox source={source} updatedAt={updatedAt} validity={validity} units={units} /> : null}
        {warningBox}
      </div>
    </section>
  );
}
