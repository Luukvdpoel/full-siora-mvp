"use client";
import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { track } from "@/lib/analytics/track";

interface Props {
  verified: boolean;
}

export default function ThankYouClient({ verified }: Props) {
  useEffect(() => {
    track("thank_you_view");
    if (verified) {
      toast.success("Email verified");
      track("waitlist_verified");
    }
  }, [verified]);
  return <Toaster position="top-right" />;
}
