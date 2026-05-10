import Link from "next/link";

type CardProps = {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  meta?: React.ReactNode;
  inlineHeader?: boolean;
};

export function Card({ title, description, href, children, meta, inlineHeader = false }: CardProps) {
  const content = (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900">
      {inlineHeader ? (
        <div className="mb-2 flex items-center gap-3">
          {meta ? <div className="shrink-0">{meta}</div> : null}
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
        </div>
      ) : (
        <>
          {meta ? <div className="mb-3">{meta}</div> : null}
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
        </>
      )}
      {description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
