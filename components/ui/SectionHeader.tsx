type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl dark:text-white">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
