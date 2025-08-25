"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { track } from "@/lib/analytics/track";
import { toast } from "react-hot-toast";

const schema = z.object({
  role: z.enum(["creator", "brand"]),
  email: z.string().email(),
  website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

export default function WaitlistForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const referredBy = searchParams.get("ref") || undefined;
  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;
  const utmCampaign = searchParams.get("utm_campaign") || undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "creator", email: "", website: "" },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track("waitlist_form_view");
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (values.website) return; // honeypot
    setLoading(true);
    track("waitlist_form_submit", { role: values.role, utmSource, utmMedium, utmCampaign });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          role: values.role,
          referredBy,
          utmSource,
          utmMedium,
          utmCampaign,
          website: values.website,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.referralCode) throw new Error(json.error || "Signup failed");
      if (referredBy) track("referral_signup", { referredBy });
      router.push(`/waitlist/thank-you?code=${json.referralCode}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const role = form.watch("role");

  return (
    <section id="waitlist" className="py-16">
      <h2 className="text-3xl font-semibold tracking-tight text-center">Join the early access list</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6"
      >
        <input type="text" className="hidden" {...form.register("website")} />
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => form.setValue("role", "creator")}
            className={`px-3 py-1 text-sm rounded-md ${role === "creator" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-white/70"}`}
          >
            Creator
          </button>
          <button
            type="button"
            onClick={() => form.setValue("role", "brand")}
            className={`px-3 py-1 text-sm rounded-md ${role === "brand" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-white/70"}`}
          >
            Brand
          </button>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 focus:ring-2 focus:ring-indigo-500"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
        >
          {loading ? "Joining..." : "Join"}
        </button>
        {session?.user ? (
          <div className="text-center text-sm">
            <a href="/dashboard" className="text-indigo-400 hover:underline">
              Go to Dashboard
            </a>
          </div>
        ) : (
          <div className="flex justify-center gap-4 text-sm">
            <a href="/auth/login?role=brand" className="text-indigo-400 hover:underline">
              Sign in as Brand
            </a>
            <a href="/instagram/login" className="text-indigo-400 hover:underline">
              Sign in with Instagram
            </a>
          </div>
        )}
      </form>
    </section>
  );
}
