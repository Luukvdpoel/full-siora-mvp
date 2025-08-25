"use client";
import { useState } from "react";
import { Twitter, Linkedin } from "lucide-react";
import { track } from "@/lib/analytics/track";

interface Props {
  code: string;
}

export default function ReferralLinkBox({ code }: Props) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://usesiora.com";
  const link = `${base}/?ref=${code}`;
  const [copied, setCopied] = useState(false);

    const copy = async () => {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const shareTwitter = () => {
      track("referral_share_click", { channel: "twitter" });
      const text = encodeURIComponent("Join me on Siora!");
      const url = encodeURIComponent(link);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    };

    const shareLinkedIn = () => {
      track("referral_share_click", { channel: "linkedin" });
      const url = encodeURIComponent(link);
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`, "_blank");
    };

  return (
      <div className="space-y-2">
        <input
          readOnly
          value={link}
          className="w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            onClick={shareTwitter}
            className="rounded-lg border border-zinc-700 p-3 text-white/70 hover:text-white"
          >
            <Twitter className="size-4" />
          </button>
          <button
            onClick={shareLinkedIn}
            className="rounded-lg border border-zinc-700 p-3 text-white/70 hover:text-white"
          >
            <Linkedin className="size-4" />
          </button>
        </div>
      </div>
    );
  }
