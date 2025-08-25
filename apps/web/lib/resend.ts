import "server-only";
import { Resend } from "resend";

let _resend: Resend | null | undefined;

export function getResend(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY;
  _resend = key ? new Resend(key) : null;
  return _resend;
}

export function requireResend(): Resend {
  const resend = getResend();
  if (!resend) {
    throw new Error(
      "RESEND_API_KEY is not set on the server. Add it in Vercel → Project Settings → Environment Variables."
    );
  }
  return resend;
}
