"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Send, TriangleAlert } from "lucide-react";

type FeedbackType = "errore" | "miglioria" | "nuovo-contenuto" | "altro";
type SubmitState = "idle" | "sending" | "sent" | "error";

const feedbackTypes: Array<{ value: FeedbackType; label: string }> = [
  { value: "miglioria", label: "Miglioria" },
  { value: "errore", label: "Errore" },
  { value: "nuovo-contenuto", label: "Nuovo contenuto" },
  { value: "altro", label: "Altro" }
];

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("miglioria");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isConfigured = useMemo(() => {
    return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const trimmedMessage = message.trim();
  const canSubmit = isConfigured && acceptedPrivacy && trimmedMessage.length >= 10 && submitState !== "sending";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (website) {
      setSubmitState("sent");
      return;
    }

    if (!canSubmit) return;

    setSubmitState("sending");

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) {
        throw new Error("Supabase non configurato.");
      }

      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/feedback`, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          type,
          message: trimmedMessage,
          contact_email: contactEmail.trim() || null,
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          status: "new"
        })
      });

      if (!response.ok) {
        throw new Error("Invio non riuscito.");
      }

      setSubmitState("sent");
      setType("miglioria");
      setMessage("");
      setContactEmail("");
      setAcceptedPrivacy(false);
    } catch {
      setSubmitState("error");
      setErrorMessage("Non sono riuscito a inviare il feedback. Riprova tra poco.");
    }
  }

  if (submitState === "sent") {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-950 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold">Feedback inviato</h2>
            <p className="mt-2 text-sm leading-6">Grazie, il messaggio è stato salvato. Lo troverai nella tabella feedback di Supabase.</p>
            <button
              type="button"
              onClick={() => setSubmitState("idle")}
              className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Invia un altro feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {!isConfigured ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          Configura <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code> per attivare l&apos;invio.
        </div>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor="feedback-type" className="text-sm font-semibold text-slate-950 dark:text-white">
          Tipo
        </label>
        <select
          id="feedback-type"
          value={type}
          onChange={(event) => setType(event.target.value as FeedbackType)}
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
        >
          {feedbackTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="feedback-message" className="text-sm font-semibold text-slate-950 dark:text-white">
          Messaggio
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={7}
          maxLength={2000}
          placeholder="Descrivi cosa miglioreresti, cosa non funziona o quale contenuto vorresti aggiungere."
          className="resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
          required
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">{message.length}/2000 caratteri</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="feedback-email" className="text-sm font-semibold text-slate-950 dark:text-white">
          Email per ricontatto <span className="font-normal text-slate-500 dark:text-slate-400">(opzionale)</span>
        </label>
        <input
          id="feedback-email"
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          placeholder="nome@email.it"
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
        />
      </div>

      <div className="hidden">
        <label htmlFor="feedback-website">Sito web</label>
        <input id="feedback-website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <input
          type="checkbox"
          checked={acceptedPrivacy}
          onChange={(event) => setAcceptedPrivacy(event.target.checked)}
          className="mt-1 size-4 rounded border-amber-300 accent-blue-700"
        />
        <span>Confermo di non inserire dati identificativi di pazienti o informazioni cliniche riconducibili a persone reali.</span>
      </label>

      {submitState === "error" ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-400"
      >
        <Send className="size-4" />
        {submitState === "sending" ? "Invio..." : "Invia feedback"}
      </button>
    </form>
  );
}
