"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
    const text = encodeURIComponent("Join me on Siora!");
    const url = encodeURIComponent(link);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(link);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`, "_blank");
  };

  return (
    <div className="space-y-2">
      <input
        readOnly
        value={link}
        className="w-full rounded-md bg-gray-800 border border-gray-700 p-2 text-sm"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={copy}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button
          onClick={shareTwitter}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
        >
          Share on Twitter
        </Button>
        <Button
          onClick={shareLinkedIn}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
        >
          Share on LinkedIn
        </Button>
      </div>
    </div>
  );
}
