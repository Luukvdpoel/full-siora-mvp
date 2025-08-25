"use client";
import { useState } from "react";
import posthog from "posthog-js";

export default function ReferralLinkClient({ code }: { code: string }) {
  const link = `https://usesiora.com/signup?ref=${code}`;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      posthog.capture("referral_link_copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mt-8">
      <p className="text-sm text-white/70">
        Invite a friend → earn <b>200 credits</b>.
      </p>
      <div className="mt-2 flex gap-2">
        <input className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm" value={link} readOnly />
        <button
          onClick={copy}
          className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
