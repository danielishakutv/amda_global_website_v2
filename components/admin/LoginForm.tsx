"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { Logo } from "../ui/Logo";
import { apiLogin, apiStatus } from "@/lib/admin-auth";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [lockSecs, setLockSecs] = useState(0);

  useEffect(() => {
    apiStatus().then((s) => setConfigured(s.configured));
  }, []);

  useEffect(() => {
    if (lockSecs <= 0) return;
    const t = setTimeout(() => setLockSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [lockSecs]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (lockSecs > 0) return;
    setBusy(true);
    const res = await apiLogin(username, password);
    setBusy(false);
    if (res.ok) {
      router.replace("/admin");
      return;
    }
    if (res.reason === "locked") {
      setLockSecs(Math.ceil((res.retryAfterMs ?? 0) / 1000));
      setError("Too many failed attempts — try again in 15 minutes.");
    } else if (res.reason === "not-configured") {
      setConfigured(false);
      setError("Admin login is not configured on this server.");
    } else if (res.reason === "network") {
      setError("Cannot reach the server. Check your connection and try again.");
    } else {
      setError("Wrong username or password. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream font-sans">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo height={36} />
        <span className="text-xs font-medium text-muted">AMDA Global Solutions</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card sm:p-10">
            <h1 className="font-display text-2xl font-semibold text-navy">Welcome back</h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to manage the AMDA website.</p>

            {configured === false ? (
              <div className="mt-6 space-y-3 rounded-2xl border border-amber/40 bg-amber/10 p-4 text-sm leading-relaxed text-navy/85">
                <p className="font-semibold">Login isn&apos;t set up on this server yet.</p>
                <ol className="list-decimal space-y-1.5 pl-5">
                  <li>
                    Run <code className="font-mono text-[13px]">npm run admin:hash "password" username</code> on the server.
                  </li>
                  <li>
                    Set <code className="font-mono text-[13px]">ADMIN_USERNAME</code>,{" "}
                    <code className="font-mono text-[13px]">ADMIN_SALT</code>,{" "}
                    <code className="font-mono text-[13px]">ADMIN_HASH</code> and{" "}
                    <code className="font-mono text-[13px]">ADMIN_SESSION_SECRET</code>, then restart.
                  </li>
                </ol>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium text-navy">
                    Username
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-navy/15 bg-white px-4 transition-all focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/15">
                    <User size={16} className="shrink-0 text-muted" />
                    <input
                      id="admin-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      disabled={lockSecs > 0}
                      className="w-full bg-transparent py-4 text-sm text-navy outline-none placeholder:text-muted/70 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-navy">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-navy/15 bg-white px-4 transition-all focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/15">
                    <Lock size={16} className="shrink-0 text-muted" />
                    <input
                      id="admin-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      disabled={lockSecs > 0}
                      className="w-full min-w-0 flex-1 bg-transparent py-4 text-sm text-navy outline-none placeholder:text-muted/70 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-cream hover:text-navy"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {lockSecs > 0 && (
                  <p className="text-sm text-muted">
                    Locked for {Math.floor(lockSecs / 60)}m {lockSecs % 60}s.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || lockSecs > 0 || !username || !password}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
                >
                  {busy && <Loader2 size={16} className="animate-spin" />}
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </form>
            )}
          </div>
          <p className="mt-5 text-center text-xs text-muted">
            Authorized editors only. Sessions expire after 2 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
