"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { track } from "@/lib/analytics/track";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const schema = z.object({
  role: z.enum(["creator", "brand"]),
  email: z.string().email(),
  igHandle: z.string().optional(),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const WaitlistForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref") || undefined;
  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;
  const utmCampaign = searchParams.get("utm_campaign") || undefined;

  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "creator", email: "" },
  });

  useEffect(() => {
    track("waitlist_form_view");
  }, []);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          referredBy,
          utmSource,
          utmMedium,
          utmCampaign,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      track("waitlist_form_submit", {
        role: values.role,
        source: utmSource,
        utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign },
      });
      if (referredBy) {
        track("referral_signup", { referredBy });
      }
      router.push(`/waitlist/thank-you?code=${json.code}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isCreator = form.watch("role") === "creator";

  return (
    <section id="waitlist" className="py-16">
      <div className="mx-auto max-w-md">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl text-center">
          Join the early access list
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6"
        >
          <input type="text" className="hidden" {...form.register("website")} />
          <div className="mb-4">
            <Label>I am a</Label>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                onClick={() => form.setValue("role", "creator")}
                className={
                  form.watch("role") === "creator"
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800"
                }
              >
                Creator
              </Button>
              <Button
                type="button"
                onClick={() => form.setValue("role", "brand")}
                className={
                  form.watch("role") === "brand"
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800"
                }
              >
                Brand
              </Button>
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              {...form.register("email")}
            />
          </div>
          {isCreator && (
            <div className="mb-4">
              <Label htmlFor="igHandle">Instagram handle</Label>
              <Input
                id="igHandle"
                placeholder="@handle"
                className="focus:ring-2 focus:ring-indigo-500"
                {...form.register("igHandle")}
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-3"
          >
            {loading ? "Joining..." : "Join waitlist"}
          </Button>
          <div className="mt-4 text-center text-sm text-white/70">
            <SignedIn>
              <Link href="/dashboard" className="underline">
                Go to Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="flex justify-center gap-4">
                <Link href="/auth/login?role=brand" className="underline">
                  Sign in as Brand
                </Link>
                <Link href="/instagram/login" className="underline">
                  Sign in with Instagram
                </Link>
              </div>
            </SignedOut>
          </div>
        </form>
      </div>
    </section>
  );
};

export default WaitlistForm;
