type BadgeProps = {
  children: React.ReactNode;
  tone?: "teal" | "blue" | "amber" | "slate" | "red";
  size?: "sm" | "md";
};

const tones = {
  teal: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900",
  blue: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900",
  amber: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900",
  red: "bg-red-50 text-red-800 ring-red-200 dark:bg-red-950 dark:text-red-200 dark:ring-red-900",
  slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
};

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-sm"
};

export function Badge({ children, tone = "slate", size = "sm" }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-md font-medium ring-1 ${sizes[size]} ${tones[tone]}`}>{children}</span>;
}
