"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, Trash2, ImageOff } from "lucide-react";
import { apiUpload } from "@/lib/admin-auth";

function uploadError(reason?: string): string {
  switch (reason) {
    case "too-large":
      return "That image is over 12MB — pick a smaller one.";
    case "bad-type":
      return "Use a PNG, JPG, WebP, GIF or AVIF image.";
    case "bad-image":
      return "That file isn't a readable image.";
    case "unauthorized":
      return "Session expired — please log in again.";
    default:
      return "Upload failed. Please try again.";
  }
}

/**
 * Image/media field: live preview + drag-and-drop upload + manual path entry.
 * Upload is image-only (the server re-encodes to WebP); for video/audio the
 * upload button is hidden and the path is entered by hand, but the preview
 * still plays the file so the admin can confirm it.
 */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  media = "image",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  media?: "image" | "video" | "audio";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canUpload = media === "image";

  const doUpload = async (file: File) => {
    setErr(null);
    setBusy(true);
    const res = await apiUpload(file);
    setBusy(false);
    if (res.ok && res.url) {
      setBroken(false);
      onChange(res.url);
    } else {
      setErr(uploadError(res.reason));
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!canUpload) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void doUpload(file);
  };

  const hasValue = value.trim().length > 0;

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-navy/70">
        {label}
      </span>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Preview / drop zone */}
        <div
          onDragOver={(e) => {
            if (!canUpload) return;
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => canUpload && inputRef.current?.click()}
          role={canUpload ? "button" : undefined}
          tabIndex={canUpload ? 0 : undefined}
          onKeyDown={(e) => {
            if (canUpload && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`relative grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-cream/60 text-muted transition-colors ${
            canUpload ? "cursor-pointer" : ""
          } ${
            dragOver ? "border-gold bg-gold/10" : "border-navy/15 hover:border-navy/30"
          }`}
        >
          {hasValue && !broken ? (
            media === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                onError={() => setBroken(true)}
                className="h-full w-full object-cover"
              />
            ) : media === "video" ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              <div className="px-2 text-center text-[0.6rem] font-medium text-navy/70">
                Audio file set
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              {busy ? (
                <Loader2 size={20} className="animate-spin text-gold-deep" />
              ) : broken ? (
                <>
                  <ImageOff size={18} />
                  <span className="text-[0.6rem] leading-tight">Not found</span>
                </>
              ) : (
                <>
                  <ImageOff size={18} />
                  <span className="text-[0.6rem] leading-tight">No image</span>
                </>
              )}
            </div>
          )}
          {dragOver && (
            <div className="absolute inset-0 grid place-items-center bg-gold/20 text-xs font-semibold text-navy">
              Drop to upload
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className="input-field"
            value={value}
            placeholder={
              media === "image"
                ? "/uploads/… or paste a path"
                : media === "video"
                  ? "/testimonials/clip.mp4 or https://…"
                  : "/testimonials/voice.mp3 or https://…"
            }
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
          />
          <div className="flex flex-wrap gap-2">
            {canUpload && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-navy-soft disabled:opacity-60"
              >
                {busy ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                {busy ? "Uploading…" : hasValue ? "Replace image" : "Upload image"}
              </button>
            )}
            {hasValue && (
              <button
                type="button"
                onClick={() => {
                  setErr(null);
                  setBroken(false);
                  onChange("");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <Trash2 size={13} />
                Clear
              </button>
            )}
          </div>
          {err && <p className="text-xs font-medium text-red-700">{err}</p>}
        </div>
      </div>

      {canUpload && (
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          aria-label={`Upload ${label}`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void doUpload(f);
            e.target.value = "";
          }}
        />
      )}
      {hint && <span className="mt-2 block text-xs text-muted">{hint}</span>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-navy/70">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input-field ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`input-field resize-y ${props.className ?? ""}`} />;
}

export function Card({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}
