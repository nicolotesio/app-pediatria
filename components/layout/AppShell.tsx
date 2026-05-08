import Link from "next/link";
import { Activity, Baby, BookOpenText, Calculator, Home, LifeBuoy, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/emergenze", label: "Emergenze", icon: LifeBuoy },
  { href: "/calcolatori", label: "Calcolatori", icon: Calculator },
  { href: "/appunti", label: "Appunti", icon: BookOpenText },
  { href: "/risorse", label: "Risorse", icon: Activity },
  { href: "/genitori", label: "Genitori", icon: Baby },
  { href: "/cerca", label: "Cerca", icon: Search }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-teal-700 text-sm font-bold text-white">PN</span>
            <span>
              <span className="block text-base font-semibold">Appunti di Pediatria</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">di Dr Nicolò Tesio</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-6">
          {navItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
