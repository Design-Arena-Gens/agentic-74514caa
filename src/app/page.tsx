"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AGENT_TONE_GUIDELINES, BUSINESS_PROFILE, QUICK_REPLIES } from "@/lib/business";
import { generateAgentReply } from "@/lib/agent";

type ChatMessage = {
  id: string;
  role: "agent" | "user";
  title?: string;
  body: string;
  timestamp: string;
};

const formatTimestamp = (date: Date) =>
  date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const now = new Date();
    return [
      {
        id: crypto.randomUUID(),
        role: "agent",
        title: "স্বাগতম LuminaTech Solutions-এ!",
        body:
          "আশাকরি আপনি ভালো আছেন। আমি আপনার AI business guide. বলুন, আজ কীভাবে সাহায্য করব?",
        timestamp: formatTimestamp(now),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const toneHints = useMemo(
    () => [
      AGENT_TONE_GUIDELINES.greeting,
      AGENT_TONE_GUIDELINES.style,
      AGENT_TONE_GUIDELINES.promise,
    ],
    [],
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || isBusy) return;
    const now = new Date();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      body: content.trim(),
      timestamp: formatTimestamp(now),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsBusy(true);

    await new Promise((resolve) => setTimeout(resolve, 450));

    const response = generateAgentReply(content, { now: new Date() });
    const agentMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "agent",
      title: response.title,
      body: response.body,
      timestamp: formatTimestamp(new Date()),
    };
    setMessages((prev) => [...prev, agentMessage]);
    setIsBusy(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-300">
              {BUSINESS_PROFILE.name}
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Your AI Business Agent
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              {BUSINESS_PROFILE.tagline}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-4 text-xs leading-relaxed text-slate-300">
            <p className="font-medium text-emerald-200">Tone Reminders</p>
            <ul className="mt-2 space-y-1">
              {toneHints.map((hint) => (
                <li key={hint}>• {hint}</li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between gap-6 px-6 py-8 sm:flex-row">
        <section className="flex w-full flex-1 flex-col rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.45)]">
          <div
            ref={containerRef}
            className="flex-1 space-y-4 overflow-y-auto px-6 py-6 text-sm sm:text-base"
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={`flex ${message.role === "agent" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-[0_10px_30px_-15px_rgba(15,118,110,0.7)] ${
                    message.role === "agent"
                      ? "bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-400/30"
                      : "bg-slate-800 text-slate-100 ring-1 ring-slate-700/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-wide text-emerald-200/90">
                    <span>{message.role === "agent" ? "Lumina AI" : "You"}</span>
                    <span className="text-[11px] text-emerald-100/60">
                      {message.timestamp}
                    </span>
                  </div>
                  {message.title ? (
                    <h3 className="mt-2 text-sm font-semibold text-emerald-100">
                      {message.title}
                    </h3>
                  ) : null}
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-100">
                    {message.body}
                  </p>
                </div>
              </article>
            ))}
            {isBusy ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100 ring-1 ring-emerald-400/20">
                  <span className="flex h-2 w-2 animate-ping rounded-full bg-emerald-300" />
                  typing…
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/5 bg-slate-900/40 px-6 py-4">
            <div className="flex flex-wrap gap-2 pb-3">
              {QUICK_REPLIES.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-400/20"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(input);
              }}
            >
              <label htmlFor="message" className="sr-only">
                Ask LuminaTech agent
              </label>
              <input
                id="message"
                name="message"
                autoComplete="off"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isBusy}
                placeholder="Type your question… সহজ ভাষায় বলুন"
                className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500"
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <aside className="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-200 sm:max-w-sm">
          <div>
            <h2 className="text-lg font-semibold text-emerald-200">
              Why teams pick us
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {BUSINESS_PROFILE.shortDescription}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">
              Core products
            </p>
            <ul className="space-y-3">
              {BUSINESS_PROFILE.coreProducts.map((item) => (
                <li key={item.name} className="rounded-xl bg-white/5 p-3">
                  <p className="font-medium text-emerald-100">
                    {item.name} · {item.price}
                  </p>
                  <p className="text-xs text-slate-300">{item.summary}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">
              Availability
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Onboarding: {BUSINESS_PROFILE.availability.onboarding}</li>
              <li>• Support: {BUSINESS_PROFILE.availability.support}</li>
              <li>• Demos: {BUSINESS_PROFILE.availability.demos}</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200">
              Need a human?
            </p>
            <p className="text-xs text-slate-300">
              Email: {BUSINESS_PROFILE.contact.email}
            </p>
            <p className="text-xs text-slate-300">
              Phone: {BUSINESS_PROFILE.contact.phone}
            </p>
            <p className="text-xs text-slate-500">
              Office: {BUSINESS_PROFILE.contact.address}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
