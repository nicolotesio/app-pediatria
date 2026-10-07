"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("theme"); } catch { /* Use system preference. */ }
    const enabled = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Theme remains active for this session. */ }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={dark ? "Attiva modalità giorno" : "Attiva modalità notte"} aria-label={dark ? "Attiva modalità giorno" : "Attiva modalità notte"} aria-pressed={dark}
      className="grid size-11 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-800 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-blue-950 dark:hover:text-blue-100"
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
