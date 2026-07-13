import Link from "next/link";

type CardProps = {
  title: string;
  description?: string;
  href?: string;
  children?: React.ReactNode;
  meta?: React.ReactNode;
  inlineHeader?: boolean;
  align?: "left" | "center";
  compact?: boolean;
};

export function Card({ title, description, href, children, meta, inlineHeader = false, align = "left", compact = false }: CardProps) {
  const isCentered = align === "center";

  const content = (
    <article className={`h-full rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 ${compact ? "flex min-h-14 items-center p-3 sm:min-h-16 sm:p-4" : "p-5"} ${isCentered ? "justify-center text-center" : ""}`}>
      {inlineHeader ? (
        <div className={`${description || children ? "mb-2" : ""} flex items-center gap-2 sm:gap-3 ${isCentered ? "justify-center" : ""}`}>
          {meta ? <div className="shrink-0">{meta}</div> : null}
          <h3 className="text-base font-semibold text-slate-950 sm:text-lg dark:text-white">{title}</h3>
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
