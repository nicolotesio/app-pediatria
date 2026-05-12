"use client";

import { useEffect, useState } from "react";

const SPLASH_MIN_MS = 900;
const SPLASH_MAX_MS = 3000;

export function ServiceWorkerRegister() {
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("app-splash-active", isCheckingForUpdates);

    return () => {
      document.body.classList.remove("app-splash-active");
    };
  }, [isCheckingForUpdates]);

  useEffect(() => {
    let isMounted = true;
    let hideTimer: number | undefined;
    let maxTimer: number | undefined;

    const hideSplash = (startedAt: number) => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(hideTimer);

      const remainingMs = Math.max(SPLASH_MIN_MS - (Date.now() - startedAt), 0);
      hideTimer = window.setTimeout(() => {
        if (isMounted) setIsCheckingForUpdates(false);
      }, remainingMs);
    };

    const showSplashWhile = (task: Promise<unknown>) => {
      const startedAt = Date.now();
      setIsCheckingForUpdates(true);

      maxTimer = window.setTimeout(() => {
        if (isMounted) setIsCheckingForUpdates(false);
      }, SPLASH_MAX_MS);

      task.catch(() => undefined).finally(() => hideSplash(startedAt));
    };

    if (!("serviceWorker" in navigator)) {
      hideSplash(Date.now());
      return () => {
        isMounted = false;
        window.clearTimeout(hideTimer);
        window.clearTimeout(maxTimer);
      };
    }

    if (process.env.NODE_ENV !== "production") {
      const clearDevelopmentCache = navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister().catch(() => undefined))))
        .then(() => {
          if (!("caches" in window)) return;
          return caches
            .keys()
            .then((keys) => Promise.all(keys.filter((key) => key.startsWith("pedianotes-")).map((key) => caches.delete(key).catch(() => undefined))));
        });

      showSplashWhile(clearDevelopmentCache);

      return () => {
        isMounted = false;
        window.clearTimeout(hideTimer);
        window.clearTimeout(maxTimer);
      };
    }

    if (process.env.NODE_ENV === "production") {
      let refreshing = false;

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((registration) => {
          const activateWaitingWorker = () => {
            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
          };

          showSplashWhile(registration.update().catch(() => undefined));
          activateWaitingWorker();

          registration.addEventListener("updatefound", () => {
            const worker = registration.installing;
            worker?.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                activateWaitingWorker();
              }
            });
          });

          const updateOnResume = () => {
            if (document.visibilityState === "visible") {
              showSplashWhile(registration.update().catch(() => undefined));
            }
          };

          document.addEventListener("visibilitychange", updateOnResume);
        })
        .catch(() => hideSplash(Date.now()));
    }

    return () => {
      isMounted = false;
      window.clearTimeout(hideTimer);
      window.clearTimeout(maxTimer);
    };
  }, []);

  if (!isCheckingForUpdates) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-300 px-8 text-center text-slate-950">
      <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
        Appunti di <span className="text-blue-500">Pediatria</span>
        <span className="block text-base font-normal text-slate-600 sm:text-lg">Dr Nicolò Tesio</span>
      </h1>
    </div>
  );
}
