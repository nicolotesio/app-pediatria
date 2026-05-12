import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Appunti di Pediatria",
    template: "%s | Appunti di Pediatria"
  },
  description: "Webapp personale di Dr Nicolò Tesio per appunti, risorse e strumenti clinici in pediatria.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="app-shell">
          <AppShell>{children}</AppShell>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
