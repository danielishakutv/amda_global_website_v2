import { NextResponse } from "next/server";
import { checkLock, clientIp, recordFailure } from "@/lib/admin-server";
import { saveMessage } from "@/lib/contact-server";
import { findCountry } from "@/lib/countries";
import { announceLead } from "@/lib/toko-leads";
import type { ContactInput, ContactMessage } from "@/lib/messages";

// Google Form passthrough — submissions keep flowing to the sheet exactly as
// before, while a copy lands in the dashboard inbox.
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLScPiZduQtrerFxLYNNpRMH0t_APcn1am5vT1d0Z81m5tQtWRw/formResponse";

const GOOGLE_FORM_FIELD_IDS = {
  name: "entry.392051163",
  email: "entry.1428123184",
  phone: "entry.1584093821",
  service: "entry.1626562734",
  description: "entry.1360398789",
} as const;

const GOOGLE_FORM_HIDDEN: Record<string, string> = {
  fvv: "1",
  fbzx: "-4384942993879802654",
  pageHistory: "0",
};

function normalizePhone(rawPhone: string, countryIso: string): string {
  const raw = rawPhone.trim();
  if (!raw) return "";
  const country = findCountry(countryIso);
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  return `${country.dial}${digits}`;
}

async function forwardToGoogle(msg: ContactMessage): Promise<void> {
  const body = new URLSearchParams();
  body.append(GOOGLE_FORM_FIELD_IDS.name, msg.name);
  body.append(GOOGLE_FORM_FIELD_IDS.email, msg.email);
  body.append(GOOGLE_FORM_FIELD_IDS.phone, normalizePhone(msg.phone, msg.countryIso));
  body.append(GOOGLE_FORM_FIELD_IDS.service, msg.service);
  body.append(GOOGLE_FORM_FIELD_IDS.description, msg.description);
  Object.entries(GOOGLE_FORM_HIDDEN).forEach(([k, v]) => body.append(k, v));
  await fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(8000),
  });
}

export async function POST(req: Request) {
  // Light anti-spam: max 5 submissions per IP per 15 minutes.
  const ip = clientIp(req);
  const lock = await checkLock(`contact:${ip}`);
  if (lock.locked) {
    return NextResponse.json({ ok: false, reason: "too-many" }, { status: 429 });
  }

  let input: ContactInput;
  try {
    input = (await req.json()) as ContactInput;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // Length caps: reject oversized fields so a single request can't bloat the
  // message store or forward a huge payload to Google. Checked before trim so
  // the raw wire size is bounded too.
  const LIMITS = { name: 120, email: 254, phone: 32, countryIso: 8, service: 120, description: 4000 } as const;
  const tooLong = (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).some(
    (k) => typeof input[k] === "string" && (input[k] as string).length > LIMITS[k]
  );
  if (tooLong) {
    return NextResponse.json({ ok: false, reason: "too-long" }, { status: 400 });
  }

  const errors: string[] = [];
  if (!input.name?.trim()) errors.push("name");
  if (!input.email?.trim() || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email");
  if (!input.service) errors.push("service");
  if (!input.description?.trim()) errors.push("description");
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, reason: "validation", fields: errors }, { status: 400 });
  }

  await recordFailure(`contact:${ip}`);

  let msg: ContactMessage;
  try {
    msg = await saveMessage(input);
  } catch {
    return NextResponse.json({ ok: false, reason: "save-failed" }, { status: 500 });
  }

  // Both notifications are best-effort and run in PARALLEL: the message is
  // already on disk, so neither may fail the request, and neither should make
  // the visitor wait on the other's timeout.
  //
  // Not `.catch(() => {})`: a lead that never reached anybody is something
  // somebody needs to know, so each outcome is classified and logged.
  //
  // This site holds no bot token and no recipient list. It posts the lead to
  // the Toko hub, which owns who hears about it for this project.
  const phoneE164 = normalizePhone(msg.phone, msg.countryIso);
  const [sheet, telegram] = await Promise.allSettled([
    forwardToGoogle(msg),
    announceLead({
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      phoneE164,
      service: msg.service,
      message: msg.description,
      source: "amdaglobal.com contact form",
      actionUrl: "https://amdaglobal.com/admin/",
    }),
  ]);

  if (sheet.status === "rejected") {
    console.error(
      `[contact] Google Form forward failed for ${msg.id}: ${
        sheet.reason instanceof Error ? sheet.reason.message : String(sheet.reason)
      } — message is still in the dashboard inbox`,
    );
  }
  if (telegram.status === "fulfilled" && !telegram.value.ok) {
    console.error(
      `[contact] lead notification failed for ${msg.id}: ${telegram.value.reason} — ${telegram.value.detail}`,
    );
  } else if (telegram.status === "rejected") {
    console.error(`[contact] lead notification threw for ${msg.id}: ${String(telegram.reason)}`);
  }

  return NextResponse.json({ ok: true });
}
