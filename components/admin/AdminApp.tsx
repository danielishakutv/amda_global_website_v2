"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  BookOpenText,
  Briefcase,
  Sparkles,
  MessagesSquare,
  User,
  Settings2,
  LogOut,
  Save,
  Download,
  Upload,
  RotateCcw,
  Eye,
  ShieldAlert,
  Inbox,
  MailOpen,
  Trash2,
  CheckCircle2,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { DEFAULT_CONTENT, type SiteContent, type TestimonialItem } from "@/lib/site-content";
import {
  saveSiteContent,
  resetSiteContent,
  exportSiteContent,
  contentLastUpdated,
} from "@/lib/content-store";
import {
  apiChangePassword,
  apiDeleteMessage,
  apiInbox,
  apiLogout,
  apiMarkMessage,
  apiMe,
  audit,
  readAudit,
  type InboxMessage,
} from "@/lib/admin-auth";
import { Logo } from "../ui/Logo";
import { Field, TextInput, TextArea, Card } from "./fields";

type Section =
  | "overview"
  | "messages"
  | "hero"
  | "story"
  | "services"
  | "why"
  | "testimonials"
  | "founder"
  | "settings";

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "messages", label: "Messages", icon: <Inbox size={16} /> },
  { id: "hero", label: "Top of homepage", icon: <ImageIcon size={16} /> },
  { id: "story", label: "About story", icon: <BookOpenText size={16} /> },
  { id: "services", label: "Services & prices", icon: <Briefcase size={16} /> },
  { id: "why", label: "Why choose us", icon: <Sparkles size={16} /> },
  { id: "testimonials", label: "Customer reviews", icon: <MessagesSquare size={16} /> },
  { id: "founder", label: "Founder & team", icon: <User size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings2 size={16} /> },
];

function loadDraft(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem("amda-content-v1");
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as { content: SiteContent };
    return { ...DEFAULT_CONTENT, ...parsed.content };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function AdminApp() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [draft, setDraft] = useState<SiteContent>(DEFAULT_CONTENT);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, ms = 2600) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  const fetchInbox = async () => {
    setMessages(await apiInbox());
  };

  // Server is the source of truth: valid httpOnly session cookie required.
  // Middleware already redirects strangers to /admin/login; this covers
  // client-side transitions and expired sessions.
  useEffect(() => {
    let live = true;
    apiMe().then((ok) => {
      if (!live) return;
      if (ok) {
        setAuthed(true);
        setDraft(loadDraft());
        setSavedAt(contentLastUpdated());
        void fetchInbox();
      } else {
        router.replace("/admin/login");
      }
      setChecked(true);
    });
    const t = setInterval(async () => {
      if (!(await apiMe())) router.replace("/admin/login");
    }, 30_000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [router]);

  const doLogout = () => {
    void apiLogout().finally(() => router.replace("/admin/login"));
  };

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    // Brief beat so the spinner reads as real work, not a flicker.
    await new Promise((r) => setTimeout(r, 450));
    saveSiteContent(draft);
    audit("content-save", `section=${section}`);
    setSavedAt(new Date().toISOString());
    setDirty(false);
    setSaving(false);
    showToast("Saved — the site on this device is updated.");
  };

  const handleReset = () => {
    if (!confirm("Bring back the original texts? Your edits on this device will be cleared.")) return;
    resetSiteContent();
    setDraft(DEFAULT_CONTENT);
    audit("content-reset", "");
    setSavedAt(null);
    setDirty(false);
    showToast("Original texts restored.");
  };

  const handleExport = () => {
    const blob = new Blob([exportSiteContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amda-content.json";
    a.click();
    URL.revokeObjectURL(url);
    audit("content-export", "");
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const handleImport = async (f: File) => {
    try {
      const text = await f.text();
      const parsed = JSON.parse(text) as { content?: SiteContent } & SiteContent;
      const content = (parsed as { content?: SiteContent }).content ?? (parsed as SiteContent);
      if (!content.hero || !content.packages) throw new Error("bad file");
      saveSiteContent({ ...DEFAULT_CONTENT, ...content });
      setDraft({ ...DEFAULT_CONTENT, ...content });
      audit("content-import", f.name);
      setSavedAt(new Date().toISOString());
      setDirty(false);
      showToast("Backup loaded.");
    } catch {
      showToast("That file is not a valid backup.");
    }
  };

  const titles = useMemo(() => Object.fromEntries(NAV.map((n) => [n.id, n.label])), []);

  if (!checked || !authed) return null;

  return (
    <div className="min-h-screen bg-cream font-sans text-navy">
      <div className="flex min-h-screen">
        {/* Sidebar — fixed: stays put while content scrolls */}
        <aside className="hidden w-72 shrink-0 flex-col self-start bg-navy-deep text-cream lg:sticky lg:top-0 lg:flex lg:h-screen">
          <div className="border-b border-white/10 p-6">
            <Logo variant="onDark" height={40} />
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold">
              Admin Dashboard
            </p>
          </div>
          <nav className="admin-scroll flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin sections">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSection(n.id)}
                aria-current={section === n.id ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  section === n.id
                    ? "bg-gold/15 text-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {n.icon}
                <span className="flex-1 text-left">{n.label}</span>
                {n.id === "messages" && messages.some((m) => !m.read) && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-navy">
                    {messages.filter((m) => !m.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="space-y-2 border-t border-white/10 p-4">
            <a
              href="/"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Eye size={16} />
              View site
            </a>
                <button
                  type="button"
                  onClick={doLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-20 border-b border-navy/10 bg-cream/90 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-8">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy lg:hidden"
                aria-label="Open admin menu"
                onClick={() => setMobileNav(true)}
              >
                <Menu size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-display text-xl font-semibold sm:text-2xl">
                  {titles[section]}
                </h1>
                <p className="text-xs text-muted">
                  {dirty ? "Unsaved changes" : savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : "Guide defaults active"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-soft disabled:opacity-70"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
            {/* Mobile nav */}
            {mobileNav && (
              <nav className="grid grid-cols-2 gap-2 border-t border-navy/10 bg-cream p-4 lg:hidden" aria-label="Admin sections mobile">
                {NAV.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => { setSection(n.id); setMobileNav(false); }}
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${
                      section === n.id ? "border-navy bg-navy text-cream" : "border-navy/15 bg-white text-navy"
                    }`}
                  >
                    {n.icon}
                    {n.label}
                  </button>
                ))}
                <button
                  type="button"
              onClick={doLogout}
                  className="flex items-center gap-2 rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </nav>
            )}
          </header>

          <main className="space-y-6 px-4 py-8 sm:px-8">
            <div className="flex items-start gap-3 rounded-3xl border border-navy/15 bg-white p-5 text-sm text-navy">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-gold-deep" />
              <p>
                Signed in with a server session (httpOnly cookie). It expires
                after 2h idle 30min — Log out when done on shared computers.
              </p>
            </div>

            {section === "overview" && (
              <Overview
                draft={draft}
                messages={messages}
                onOpenMessages={() => {
                  setSection("messages");
                  void fetchInbox();
                }}
                onGo={(s: Section) => setSection(s)}
              />
            )}
            {section === "messages" && (
              <MessagesEditor messages={messages} onRefresh={fetchInbox} />
            )}
            {section === "hero" && <HeroEditor draft={draft} set={set} />}
            {section === "story" && <StoryEditor draft={draft} set={set} />}
            {section === "services" && <ServicesEditor draft={draft} set={set} />}
            {section === "why" && <WhyEditor draft={draft} set={set} />}
            {section === "testimonials" && <TestimonialsEditor draft={draft} set={set} />}
            {section === "founder" && <FounderEditor draft={draft} set={set} />}
            {section === "settings" && (
              <SettingsEditor
                draft={draft}
                set={set}
                onExport={handleExport}
                onReset={handleReset}
                fileRef={fileRef}
                onImportFile={handleImport}
              />
            )}

            <div className="flex flex-wrap gap-2 pb-10">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-soft disabled:opacity-70"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy hover:bg-navy hover:text-cream"
              >
                <Download size={15} />
                Download backup
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy hover:bg-navy hover:text-cream"
              >
                <Upload size={15} />
                Load backup
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                <RotateCcw size={15} />
                Reset to original texts
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                aria-label="Import content JSON"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleImport(f);
                  e.target.value = "";
                }}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="toast-pop fixed bottom-6 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-navy-deep p-4 text-cream shadow-card"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-white">
            <CheckCircle2 size={17} />
          </span>
          <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{toast}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Section editors ---------- */

function Overview({
  draft,
  messages,
  onOpenMessages,
  onGo,
}: {
  draft: SiteContent;
  messages: InboxMessage[];
  onOpenMessages: () => void;
  onGo: (s: Section) => void;
}) {
  const unread = messages.filter((m) => !m.read);
  const recent = messages.slice(0, 5);
  const stats = [
    { label: "New messages", value: String(unread.length), go: "messages" as Section, alert: unread.length > 0 },
    { label: "Customer reviews", value: String(draft.testimonials.length), go: "testimonials" as Section, alert: false },
    { label: "Team members", value: String((draft.team ?? []).length + 1), go: "founder" as Section, alert: false },
    { label: "Brand packages", value: String(draft.packages.length), go: "services" as Section, alert: false },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="overflow-hidden rounded-3xl bg-navy p-7 text-cream sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          AMDA website manager
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
          {unread.length > 0
            ? `You have ${unread.length} new message${unread.length === 1 ? "" : "s"}`
            : "Everything is up to date"}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-white/70">
          {unread.length > 0
            ? "People wrote through the contact form. Read and reply from here."
            : "No new contact messages. The site content below is what visitors see right now."}
        </p>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={onOpenMessages}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-soft"
          >
            <Inbox size={15} />
            Open inbox
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onGo(s.go)}
            className="rounded-3xl border border-navy/10 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <p className="flex items-center gap-2 font-display text-4xl font-semibold text-navy">
              {s.value}
              {s.alert && <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-label="needs attention" />}
            </p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent messages */}
        <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-navy">Latest messages</h3>
            <button
              type="button"
              onClick={onOpenMessages}
              className="text-sm font-semibold text-gold-deep hover:underline"
            >
              View all
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Nothing here yet. When someone fills the contact form, their message appears here.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-navy/10">
              {recent.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={onOpenMessages}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-label="unread" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-navy">
                        {m.name} <span className="font-normal text-muted">· {m.service}</span>
                      </span>
                      <span className="block truncate text-xs text-muted">{m.description}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {new Date(m.ts).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick actions + how it works */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-navy">Common tasks</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                { label: "Change homepage words", go: "hero" as Section },
                { label: "Update prices", go: "services" as Section },
                { label: "Add a customer review", go: "testimonials" as Section },
                { label: "Add a team member", go: "founder" as Section },
              ].map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => onGo(a.go)}
                  className="rounded-2xl border border-navy/15 px-4 py-3 text-left text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-cream"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-navy">How this works</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-navy/80">
              <li>Pick a section on the left, edit the boxes, press <strong>Save changes</strong> below.</li>
              <li>To change a photo, paste its file name (e.g. <code className="font-mono">/founder.webp</code>).</li>
              <li>Press <strong>Download backup</strong> in Settings before big changes.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function MessagesEditor({ messages, onRefresh }: { messages: InboxMessage[]; onRefresh: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mark = async (id: string, read: boolean) => {
    setBusy(true);
    await apiMarkMessage(id, read);
    await onRefresh();
    setBusy(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setBusy(true);
    await apiDeleteMessage(id);
    if (openId === id) setOpenId(null);
    await onRefresh();
    setBusy(false);
  };

  const refresh = async () => {
    setBusy(true);
    await onRefresh();
    setBusy(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {messages.length === 0
            ? "No messages yet — contact-form submissions will appear here."
            : `${messages.filter((m) => !m.read).length} unread of ${messages.length}`}
        </p>
        <button
          type="button"
          onClick={refresh}
          disabled={busy}
          className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-cream disabled:opacity-60"
        >
          {busy ? "Working…" : "Refresh"}
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center">
          <Inbox size={28} className="mx-auto text-muted" />
          <p className="mt-4 font-display text-lg font-semibold text-navy">Inbox is empty</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Every message sent through the website contact form lands here, and a copy still goes to Google Forms.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <li
                key={m.id}
                className={`overflow-hidden rounded-3xl border bg-white transition-colors ${
                  m.read ? "border-navy/10" : "border-gold/60 shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!m.read && !open) void mark(m.id, true);
                  }}
                  className="flex w-full items-center gap-3 p-5 text-left"
                >
                  {!m.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold" aria-label="unread" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {m.name} <span className="font-normal text-muted">· {m.service}</span>
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {m.email} · {new Date(m.ts).toLocaleString()}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-gold-deep">
                    {open ? "Hide" : "Read"}
                  </span>
                </button>

                {open && (
                  <div className="space-y-4 border-t border-navy/10 bg-cream/50 p-5">
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                      <p><span className="block text-xs font-semibold uppercase tracking-wider text-muted">Email</span>
                        <a href={`mailto:${m.email}`} className="font-medium text-navy hover:underline">{m.email}</a></p>
                      <p><span className="block text-xs font-semibold uppercase tracking-wider text-muted">Phone</span>
                        <span className="font-medium text-navy">{m.phone || "—"}</span></p>
                      <p><span className="block text-xs font-semibold uppercase tracking-wider text-muted">Service</span>
                        <span className="font-medium text-navy">{m.service}</span></p>
                    </div>
                    <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-navy/85">{m.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void mark(m.id, !m.read)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy hover:bg-navy hover:text-cream"
                      >
                        <MailOpen size={13} />
                        {m.read ? "Mark unread" : "Mark read"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(m.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function HeroEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const h = draft.hero;
  const edit = (k: keyof SiteContent["hero"], v: string) => set("hero", { ...h, [k]: v });
  return (
    <div className="grid gap-6">
      <Card title="Top of the homepage" sub="The first thing visitors see. Change the words or the background photo.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tag"><TextInput value={h.tag} onChange={(e) => edit("tag", e.target.value)} /></Field>
          <Field label="Background image" hint='e.g. /hero-bg.webp — empty = solid navy'><TextInput value={h.backgroundImage} onChange={(e) => edit("backgroundImage", e.target.value)} /></Field>
          <Field label="Title part 1"><TextInput value={h.titleA} onChange={(e) => edit("titleA", e.target.value)} /></Field>
          <Field label="Accent 1"><TextInput value={h.titleAccent1} onChange={(e) => edit("titleAccent1", e.target.value)} /></Field>
          <Field label="Title part 2"><TextInput value={h.titleB} onChange={(e) => edit("titleB", e.target.value)} /></Field>
          <Field label="Accent 2"><TextInput value={h.titleAccent2} onChange={(e) => edit("titleAccent2", e.target.value)} /></Field>
          <Field label="Title part 3"><TextInput value={h.titleC} onChange={(e) => edit("titleC", e.target.value)} /></Field>
          <Field label="Primary CTA"><TextInput value={h.primaryCta} onChange={(e) => edit("primaryCta", e.target.value)} /></Field>
        </div>
        <Field label="Subheading"><TextArea rows={3} value={h.sub} onChange={(e) => edit("sub", e.target.value)} /></Field>
        <Field label="Secondary CTA"><TextInput value={h.secondaryCta} onChange={(e) => edit("secondaryCta", e.target.value)} /></Field>
      </Card>
    </div>
  );
}

function StoryEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  return (
    <div className="grid gap-6">
      <Card title="Who we are + our story" sub="The About text. Leave one empty line between paragraphs.">
        <Field label="Who-we-are heading"><TextInput value={draft.whoWeAre.heading} onChange={(e) => set("whoWeAre", { ...draft.whoWeAre, heading: e.target.value })} /></Field>
        <Field label="Who-we-are sub"><TextArea rows={2} value={draft.whoWeAre.sub} onChange={(e) => set("whoWeAre", { ...draft.whoWeAre, sub: e.target.value })} /></Field>
        <Field label="Who-we-are body (blank line = new paragraph)"><TextArea rows={6} value={draft.whoWeAre.body.join("\n\n")} onChange={(e) => set("whoWeAre", { ...draft.whoWeAre, body: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} /></Field>
        <Field label="Story heading"><TextInput value={draft.story.heading} onChange={(e) => set("story", { ...draft.story, heading: e.target.value })} /></Field>
        <Field label="Story headline"><TextInput value={draft.story.headline} onChange={(e) => set("story", { ...draft.story, headline: e.target.value })} /></Field>
        <Field label="Story body (blank line = new paragraph)"><TextArea rows={10} value={draft.story.body.join("\n\n")} onChange={(e) => set("story", { ...draft.story, body: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })} /></Field>
      </Card>
      <Card title="Vision, mission, values" sub="Three short lines shown on the homepage.">
        <Field label="Vision"><TextInput value={draft.vision} onChange={(e) => set("vision", e.target.value)} /></Field>
        <Field label="Mission"><TextInput value={draft.mission} onChange={(e) => set("mission", e.target.value)} /></Field>
        <Field label="Core values (comma separated)"><TextInput value={draft.coreValues.join(", ")} onChange={(e) => set("coreValues", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field>
      </Card>
    </div>
  );
}

function ServicesEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  return (
    <div className="grid gap-6">
      <Card title="Brand packages" sub="Starter, Growth and Authority — names, prices and what's inside.">
        {draft.packages.map((p, i) => (
          <div key={p.id} className="rounded-2xl border border-navy/10 bg-cream/50 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold-deep">{p.name}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price"><TextInput value={p.price} onChange={(e) => set("packages", draft.packages.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} /></Field>
              <Field label="Description"><TextInput value={p.description} onChange={(e) => set("packages", draft.packages.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} /></Field>
            </div>
            <Field label="Features (comma separated)" hint="e.g. Brand Audit, Consultation, Recommendations">
              <TextInput value={p.features.join(", ")} onChange={(e) => set("packages", draft.packages.map((x, j) => (j === i ? { ...x, features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } : x)))} />
            </Field>
          </div>
        ))}
      </Card>

      <Card title="Business registration & trademark" sub="The CAC price list and trademark details.">
        <Field label="CAC title"><TextInput value={draft.cac.title} onChange={(e) => set("cac", { ...draft.cac, title: e.target.value })} /></Field>
        <Field label="CAC summary"><TextArea rows={2} value={draft.cac.summary} onChange={(e) => set("cac", { ...draft.cac, summary: e.target.value })} /></Field>
        {draft.cac.rows.map((r, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            <TextInput aria-label="Service label" value={r.label} onChange={(e) => set("cac", { ...draft.cac, rows: draft.cac.rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
            <TextInput aria-label="Service price" value={r.value} onChange={(e) => set("cac", { ...draft.cac, rows: draft.cac.rows.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} />
          </div>
        ))}
        <Field label="Trademark price"><TextInput value={draft.trademark.priceLabel} onChange={(e) => set("trademark", { ...draft.trademark, priceLabel: e.target.value })} /></Field>
        <Field label="Trademark summary"><TextArea rows={2} value={draft.trademark.summary} onChange={(e) => set("trademark", { ...draft.trademark, summary: e.target.value })} /></Field>
      </Card>

      <Card title="Compliance check" sub="The ₦20,000 audit. Paste the Google Form link when it's ready.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Audit price"><TextInput value={draft.complianceAudit.price} onChange={(e) => set("complianceAudit", { ...draft.complianceAudit, price: e.target.value })} /></Field>
          <Field label="Google Form URL" hint="Empty = placeholder button on the site"><TextInput value={draft.complianceAudit.formUrl} placeholder="https://docs.google.com/forms/…" onChange={(e) => set("complianceAudit", { ...draft.complianceAudit, formUrl: e.target.value })} /></Field>
        </div>
        <Field label="Audit summary"><TextArea rows={3} value={draft.complianceAudit.summary} onChange={(e) => set("complianceAudit", { ...draft.complianceAudit, summary: e.target.value })} /></Field>
      </Card>

      <Card title="Printing & publishing" sub="The list of print services. Separate items with commas.">
        <Field label="Summary"><TextArea rows={2} value={draft.printPublish.summary} onChange={(e) => set("printPublish", { ...draft.printPublish, summary: e.target.value })} /></Field>
        <Field label="Items (comma separated)"><TextInput value={draft.printPublish.items.join(", ")} onChange={(e) => set("printPublish", { ...draft.printPublish, items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Field>
      </Card>
    </div>
  );
}

function WhyEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  return (
    <Card title="Why choose us" sub="The 7 reasons shown on the homepage. Add, edit or remove.">
      {draft.whyChoose.map((w, i) => (
        <div key={i} className="grid gap-3 rounded-2xl border border-navy/10 bg-cream/50 p-4 sm:grid-cols-[1fr_2fr_auto]">
          <TextInput aria-label="Differentiator title" value={w.title} onChange={(e) => set("whyChoose", draft.whyChoose.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
          <TextInput aria-label="Differentiator body" value={w.body} onChange={(e) => set("whyChoose", draft.whyChoose.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))} />
          <button type="button" onClick={() => set("whyChoose", draft.whyChoose.filter((_, j) => j !== i))} className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => set("whyChoose", [...draft.whyChoose, { title: "New differentiator", body: "Describe it in one sentence." }])}
        className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-cream"
      >
        + Add item
      </button>
      <Card title="How we work (3 boxes)" sub="First box must stay “Online & In-Person Support”.">
        <div className="space-y-4">
          {draft.operatingModel.map((m, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <TextInput aria-label="Model title" value={m.title} onChange={(e) => set("operatingModel", draft.operatingModel.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
              <TextInput aria-label="Model body" value={m.body} onChange={(e) => set("operatingModel", draft.operatingModel.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))} />
            </div>
          ))}
        </div>
      </Card>
    </Card>
  );
}

function TestimonialsEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const add = (kind: TestimonialItem["kind"]) =>
    set("testimonials", [
      ...draft.testimonials,
      { id: `t-${Date.now()}`, client: "Client Name", project: "Project / Service", kind, quote: "", media: "" },
    ]);
  return (
    <div className="grid gap-6">
      <Card title="How many clients" sub="Leave empty until AMDA confirms the real number — the site will say “to be announced”.">
        <Field label="Confirmed figure (empty = placeholder)"><TextInput value={draft.clientCount} placeholder="e.g. 120+" onChange={(e) => set("clientCount", e.target.value)} /></Field>
      </Card>
      <Card title={`Customer reviews (${draft.testimonials.length})`} sub="One row per review: who, which service, what kind (written, photo, video, voice note), and the file. Empty file = placeholder box on the site.">
        <div className="flex flex-wrap gap-2">
          {(["written", "screenshot", "photo", "video", "audio", "delivery"] as TestimonialItem["kind"][]).map((k) => (
            <button key={k} type="button" onClick={() => add(k)} className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy hover:bg-navy hover:text-cream">
              + {k}
            </button>
          ))}
        </div>
        {draft.testimonials.map((t, i) => (
          <div key={t.id} className="space-y-3 rounded-2xl border border-navy/10 bg-cream/50 p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <TextInput aria-label="Client" value={t.client} onChange={(e) => set("testimonials", draft.testimonials.map((x, j) => (j === i ? { ...x, client: e.target.value } : x)))} />
              <TextInput aria-label="Project" value={t.project} onChange={(e) => set("testimonials", draft.testimonials.map((x, j) => (j === i ? { ...x, project: e.target.value } : x)))} />
              <select aria-label="Kind" value={t.kind} onChange={(e) => set("testimonials", draft.testimonials.map((x, j) => (j === i ? { ...x, kind: e.target.value as TestimonialItem["kind"] } : x)))} className="input-field">
                <option value="written">written</option>
                <option value="screenshot">screenshot</option>
                <option value="photo">photo</option>
                <option value="video">video</option>
                <option value="audio">audio</option>
                <option value="delivery">delivery</option>
              </select>
              <button type="button" onClick={() => set("testimonials", draft.testimonials.filter((_, j) => j !== i))} className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">
                Remove
              </button>
            </div>
            <TextInput aria-label="Media path" placeholder="/Outreach2026/… or https://… (empty = placeholder)" value={t.media ?? ""} onChange={(e) => set("testimonials", draft.testimonials.map((x, j) => (j === i ? { ...x, media: e.target.value } : x)))} />
            <TextArea aria-label="Quote" rows={2} placeholder="Written quote (optional for media items)" value={t.quote ?? ""} onChange={(e) => set("testimonials", draft.testimonials.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function FounderEditor({ draft, set }: { draft: SiteContent; set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void }) {
  const f = draft.founder;
  const team = draft.team ?? [];
  return (
    <div className="grid gap-6">
    <Card title="Founder" sub="Shows first on the site, always.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><TextInput value={f.name} onChange={(e) => set("founder", { ...f, name: e.target.value })} /></Field>
        <Field label="Title"><TextInput value={f.title} onChange={(e) => set("founder", { ...f, title: e.target.value })} /></Field>
      </div>
      <Field label="Bio"><TextArea rows={4} value={f.bio} onChange={(e) => set("founder", { ...f, bio: e.target.value })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Photo path" hint="e.g. /founder.webp"><TextInput value={f.photo} onChange={(e) => set("founder", { ...f, photo: e.target.value })} /></Field>
        <Field label="LinkedIn URL"><TextInput value={f.linkedin} placeholder="https://linkedin.com/in/…" onChange={(e) => set("founder", { ...f, linkedin: e.target.value })} /></Field>
      </div>
    </Card>
    <Card title={`Team members (${team.length})`} sub="Add people one by one with photo and job title. They appear in cards under the founder.">
      <button
        type="button"
        onClick={() => set("team", [...team, { id: `m-${Date.now()}`, name: "New Member", role: "Role / Title", bio: "", photo: "", linkedin: "" }])}
        className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-cream"
      >
        + Add member
      </button>
      {team.map((m, i) => (
        <div key={m.id} className="space-y-3 rounded-2xl border border-navy/10 bg-cream/50 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput aria-label="Member name" value={m.name} onChange={(e) => set("team", team.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <TextInput aria-label="Member role" value={m.role} onChange={(e) => set("team", team.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))} />
            <button type="button" onClick={() => set("team", team.filter((_, j) => j !== i))} className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">
              Remove
            </button>
          </div>
          <TextInput aria-label="Member photo path" placeholder="/team/member-photo.png (empty = initials)" value={m.photo} onChange={(e) => set("team", team.map((x, j) => (j === i ? { ...x, photo: e.target.value } : x)))} />
          <TextInput aria-label="Member LinkedIn URL" placeholder="https://linkedin.com/in/…" value={m.linkedin ?? ""} onChange={(e) => set("team", team.map((x, j) => (j === i ? { ...x, linkedin: e.target.value } : x)))} />
          <TextArea aria-label="Member bio" rows={2} placeholder="Short bio (optional)" value={m.bio ?? ""} onChange={(e) => set("team", team.map((x, j) => (j === i ? { ...x, bio: e.target.value } : x)))} />
        </div>
      ))}
    </Card>
    </div>
  );
}

function SettingsEditor({
  draft,
  set,
  onExport,
  onReset,
  fileRef,
  onImportFile,
}: {
  draft: SiteContent;
  set: <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => void;
  onExport: () => void;
  onReset: () => void;
  fileRef: React.RefObject<HTMLInputElement>;
  onImportFile: (f: File) => void;
}) {
  const [pw0, setPw0] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [audits, setAudits] = useState(readAudit());

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw1.length < 12) {
      setPwMsg("Use at least 12 characters.");
      return;
    }
    if (pw1 !== pw2) {
      setPwMsg("New passwords do not match.");
      return;
    }
    const res = await apiChangePassword(pw0, pw1);
    if (!res.ok) {
      setPwMsg(
        res.reason === "bad-current"
          ? "Current password is incorrect — nothing changed."
          : res.reason === "too-short"
            ? "Use at least 12 characters."
            : "Could not update — please log in again."
      );
      return;
    }
    setPw0("");
    setPw1("");
    setPw2("");
    setAudits(readAudit());
    setPwMsg("Password updated on the server. It takes effect immediately.");
  };

  return (
    <div className="grid gap-6">
      <Card title="Phone, email, address" sub="Shown in Contact and the footer. Keep the response time as written.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Response time"><TextInput value={draft.responseTime} onChange={(e) => set("responseTime", e.target.value)} /></Field>
          <Field label="Phone"><TextInput value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><TextInput value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Coverage"><TextInput value={draft.coverage} onChange={(e) => set("coverage", e.target.value)} /></Field>
        </div>
        <Field label="Business address"><TextArea rows={2} value={draft.address} onChange={(e) => set("address", e.target.value)} /></Field>
      </Card>

      <Card title="Change your password" sub="You'll be asked for the current one first.">
        <form onSubmit={changePw} className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password"><TextInput type="password" autoComplete="current-password" value={pw0} onChange={(e) => setPw0(e.target.value)} /></Field>
          <span className="hidden sm:block" />
          <Field label="New password (12+ chars)"><TextInput type="password" autoComplete="new-password" value={pw1} onChange={(e) => setPw1(e.target.value)} /></Field>
          <Field label="Confirm new"><TextInput type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream hover:bg-navy-soft">
              Update password
            </button>
            {pwMsg && <p className="mt-2 text-sm text-muted">{pwMsg}</p>}
          </div>
        </form>
      </Card>

      <Card title="Backup & restore" sub="Download a backup file of everything, or load one back. Reset brings back the original texts.">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onExport} className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream">Download backup</button>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold">Load backup</button>
          <button type="button" onClick={onReset} className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700">Reset texts</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" aria-label="Import content JSON" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImportFile(f); e.target.value = ""; }} />
        </div>
      </Card>

      <Card title="Security — how /admin is protected" sub="Enforced by the server, not the browser.">
        <ul className="list-disc space-y-2 pl-5 text-sm text-navy/80">
          <li><strong>Login:</strong> password checked with PBKDF2-SHA256 ×600k on the server. Hash + salt live in server env (or <code className="font-mono">data/admin-credentials.json</code> after a password change) — never in the page JS.</li>
          <li><strong>Sessions:</strong> HMAC-signed httpOnly cookies (Secure, SameSite=Strict). JavaScript cannot read them. 2h expiry, 30-min idle timeout, middleware blocks /admin without one.</li>
          <li><strong>Brute force:</strong> 5 wrong tries lock an IP out for 15 minutes.</li>
          <li><strong>To kill all sessions</strong> (e.g. after staff change): rotate <code className="font-mono">ADMIN_SESSION_SECRET</code> and restart the app.</li>
          <li>Never store client PII in testimonials beyond what clients consented to publish.</li>
        </ul>
      </Card>

      <Card title={`Audit log (${audits.length})`} sub="Logins, saves, imports — last 200 events on this device.">
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {audits.length === 0 && <p className="text-sm text-muted">No events yet.</p>}
          {[...audits].reverse().map((a, i) => (
            <p key={i} className="rounded-2xl bg-cream/70 px-4 py-2 font-mono text-xs text-navy/80">
              {a.ts} · {a.event} {a.detail}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
