type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  descriptionClassName?: string;
};

export function SectionHeader({ eyebrow, title, description, descriptionClassName }: SectionHeaderProps) {
  return (
    <div className="max-w-5xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{eyebrow}</p> : null}
      <h1 className="text-2xl font-bold tracking-normal text-blue-700 sm:text-3xl dark:text-blue-300">{title}</h1>
      {description ? <p className={`mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 ${descriptionClassName ?? ""}`}>{description}</p> : null}
    </div>
  );
}
