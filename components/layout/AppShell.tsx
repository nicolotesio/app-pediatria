import Link from "next/link";
import Image from "next/image";
import { Ambulance, Baby, BookOpenText, Calculator, ExternalLink, Home, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/emergenze", label: "Emergenze", icon: Ambulance },
  { href: "/calcolatori", label: "Calcolatori", icon: Calculator },
  { href: "/appunti", label: "Appunti", icon: BookOpenText },
  { href: "/risorse", label: "Risorse", icon: ExternalLink },
  { href: "/genitori", label: "Genitori", icon: Baby },
  { href: "/cerca", label: "Cerca", icon: Search }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon-512.png"
              alt=""
              aria-hidden="true"
              width={56}
              height={56}
              className="size-12 shrink-0 rounded-md sm:size-14"
              priority
            />
            <span>
              <span className="block text-2xl font-semibold leading-tight sm:text-3xl">
                Appunti di <span className="text-blue-700 dark:text-blue-300">Pediatria</span>
              </span>
              <span className="block text-sm text-slate-500 sm:text-base dark:text-slate-400">Dr Nicolò Tesio</span>
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
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-100"
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
              <Link key={item.href} href={item.href} className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
