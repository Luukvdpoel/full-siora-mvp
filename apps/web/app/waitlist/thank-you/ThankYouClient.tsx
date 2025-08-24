"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics/track";
import { toast, Toaster } from "react-hot-toast";

interface Props {
  code: string;
  referrals: number;
  confirmed: boolean;
  verified: boolean;
}

export default function ThankYouClient({ code, referrals, confirmed, verified }: Props) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://usesiora.com"}/?ref=${code}`;

  useEffect(() => {
    track("thank_you_view");
    if (verified) {
      toast.success("Email verified");
      track("waitlist_verified");
    }
  }, [verified]);

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    track("referral_share_click", { channel: "copy" });
    toast.success("Link copied");
  };

  return (
    <div className="py-20 text-center">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-semibold">You're in.</h1>
      <p className="mt-2 text-white/70">Invite friends for earlier access.</p>
      {!confirmed && (
        <div className="mt-4 rounded-md bg-yellow-500/10 px-4 py-2 text-sm text-yellow-500">
          Please confirm your email—check your inbox.
        </div>
      )}
      <span className="mt-6 inline-block rounded-full bg-zinc-900 px-3 py-1 text-sm">
        {referrals}/5
      </span>
      <div className="mx-auto mt-6 max-w-md">
        <input
          readOnly
          value={shareUrl}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-center"
        />
        <button
          onClick={copy}
          className="mt-3 w-full rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
        >
          Copy link
        </button>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("referral_share_click", { channel: "twitter" })}
            className="underline"
          >
            Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("referral_share_click", { channel: "linkedin" })}
            className="underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
