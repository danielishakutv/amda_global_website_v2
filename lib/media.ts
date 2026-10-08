// Classify a media URL/path by how it should be rendered, independent of a
// testimonial's category. Used by the public cards and the admin preview so a
// Training or Outreach item can hold a photo OR a video and render correctly.

export type MediaKind = "image" | "video" | "audio" | "none";

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i;
const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|oga|opus|wav|weba|flac)(\?|#|$)/i;

export function isYouTube(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

export function mediaKind(url: string | undefined | null): MediaKind {
  const u = (url ?? "").trim();
  if (!u) return "none";
  if (isYouTube(u) || VIDEO_EXT.test(u)) return "video";
  if (AUDIO_EXT.test(u)) return "audio";
  // Everything else (webp/png/jpg, remote image URLs, /api/uploads/*.webp) is an image.
  return "image";
}
