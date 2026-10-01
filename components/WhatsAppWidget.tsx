"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Logo } from "./ui/Logo";

const WHATSAPP_NUMBER = "2347077798418";
const DEFAULT_MESSAGE = "Hello! I would like to inquire about your services.";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Perf: defer floating widget until browser is idle + 2.5s so it never
    // competes with hero/LCP. Same UI, just appears slightly later.
    let t: ReturnType<typeof setTimeout>;
    const mount = () => {
      t = setTimeout(() => setMounted(true), 2500);
    };
    if ("requestIdleCallback" in window) {
      const idle = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(mount);
      return () => {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idle);
        clearTimeout(t);
      };
    }
    mount();
    return () => clearTimeout(t);
  }, []);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim() || DEFAULT_MESSAGE;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setMessage("");
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="whatsapp-widget fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card sm:w-80"
            role="dialog"
            aria-label="Chat with AMDA team"
          >
            {/* Header */}
            <div className="flex items-start gap-3 bg-navy p-5 text-white">
              <Logo variant="onDark" height={40} className="shrink-0" />
              <div className="flex-1">
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Typically replies instantly
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="bg-cream/60 p-5">
              <div className="rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm">
                <p className="text-sm text-navy">
                  👋 Hi there! How can we help you build your brand today?
                </p>
                <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
                  — AMDA Team
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-navy/10 bg-white p-3"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-navy/15 bg-cream px-4 py-2.5 text-sm text-navy placeholder:text-muted/70 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                aria-label="Message"
              />
              <button
                type="submit"
                aria-label="Send via WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-600"
              >
                <Send size={16} strokeWidth={2.5} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={open}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-card transition-colors hover:bg-emerald-600"
      >
        <span aria-hidden className="absolute inset-0 -z-10 motion-safe:animate-ping rounded-full bg-emerald-400/40" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={22} fill="currentColor" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
