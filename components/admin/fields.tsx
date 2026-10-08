"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, Trash2, ImageOff, Music, Film } from "lucide-react";
import { apiUpload } from "@/lib/admin-auth";
import { mediaKind } from "@/lib/media";

function uploadError(reason: string | undefined, accept: "image" | "media"): string {
  switch (reason) {
    case "too-large":
      return accept === "image"
        ? "That image is over 12MB — pick a smaller one."
        : "That file is too large (images 12MB, audio 25MB, video 64MB). For a long video, paste a YouTube link instead.";
    case "bad-type":
      return accept === "image"
        ? "Use a PNG, JPG, WebP, GIF or AVIF image."
        : "Use an image (PNG/JPG/WebP), audio (MP3/M4A/WAV) or video (MP4/WebM).";
    case "bad-image":
      return "That file isn't a readable image.";
    case "empty-file":
      return "That file is empty. Please choose the original media file and try again.";
    case "unauthorized":
      return "Session expired — please log in again.";
    default:
      return "Upload failed. Please try again.";
  }
}

const ACCEPT_ATTR = {
  image: "image/png,image/jpeg,image/webp,image/gif,image/avif",
  media:
    "image/png,image/jpeg,image/webp,image/gif,image/avif,audio/*,video/mp4,video/webm,video/quicktime,.mp3,.m4a,.aac,.ogg,.opus,.wav,.weba,.flac,.mp4,.webm,.mov",
} as const;

const IMAGE_FILE_RE = /\.(png|jpe?g|webp|gif|avif)$/i;

/**
 * Media field: live preview + drag-and-drop upload + manual path entry.
 * accept="image" takes images only; accept="media" also takes audio and video.
 * The preview adapts to whatever the current value points at (photo, clip or
 * voice note), so Training/Outreach items can hold any of them.
 */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  accept = "image",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  accept?: "image" | "media";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canUpload = true;
  const kind = mediaKind(value);

  const doUpload = async (file: File) => {
    setErr(null);
    // The file picker applies `accept`, but drag-and-drop does not. Keep image
    // fields image-only while still allowing blank-MIME images from Windows.
    if (accept === "image" && !file.type.startsWith("image/") && !IMAGE_FILE_RE.test(file.name)) {
      setErr(uploadError("bad-type", accept));
      return;
    }
    setBusy(true);
    const res = await apiUpload(file);
    setBusy(false);
    if (res.ok && res.url) {
      setBroken(false);
      onChange(res.url);
    } else {
      setErr(uploadError(res.reason, accept));
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
            kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                onError={() => setBroken(true)}
                className="h-full w-full object-cover"
              />
            ) : kind === "video" ? (
              <div className="flex flex-col items-center gap-1 text-navy/70">
                <Film size={20} />
                <span className="text-[0.6rem] font-medium">Video set</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-navy/70">
                <Music size={20} />
                <span className="text-[0.6rem] font-medium">Audio set</span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-1 px-2 text-center">
              {busy ? (
                <Loader2 size={20} className="animate-spin text-gold-deep" />
              ) : (
                <>
                  <ImageOff size={18} />
                  <span className="text-[0.6rem] leading-tight">{broken ? "Not found" : "Nothing yet"}</span>
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
            placeholder={accept === "image" ? "/api/uploads/… or paste a path" : "Upload a file, or paste a path / YouTube link"}
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
                {busy ? "Uploading…" : hasValue ? (accept === "image" ? "Replace image" : "Replace file") : (accept === "image" ? "Upload image" : "Upload file")}
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

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR[accept]}
        className="hidden"
        aria-label={`Upload ${label}`}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void doUpload(f);
          e.target.value = "";
        }}
      />
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
