import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: {
    default: "Appunti di Pediatria",
    template: "%s | Appunti di Pediatria"
  },
  description: "Webapp personale per appunti, risorse e strumenti clinici in pediatria.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Appunti di Pediatria",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Appunti di Pediatria"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <div id="app-shell">
          <AppShell>{children}</AppShell>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
