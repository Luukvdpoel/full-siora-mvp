"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics/track";
import { toast } from "react-hot-toast";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["creator", "brand"]).optional(),
  igHandle: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function WaitlistForm({ source = "hero-cta" }: { source?: string }) {
  const search = useSearchParams();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "creator",
      utmSource: search.get("utm_source") || undefined,
      utmMedium: search.get("utm_medium") || undefined,
      utmCampaign: search.get("utm_campaign") || undefined,
      source,
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const qs = new URLSearchParams({
      utm_source: values.utmSource || "",
      utm_medium: values.utmMedium || "",
      utm_campaign: values.utmCampaign || "",
      source: values.source || "",
    });
    try {
      const res = await fetch(`/api/waitlist?${qs.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          role: values.role,
          igHandle: values.igHandle,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      track("waitlist_submitted", { role: values.role, source: values.source });
      toast.success(json.emailed ? "Check your email!" : "You're on the list!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
    >
      <input type="hidden" {...form.register("utmSource")} />
      <input type="hidden" {...form.register("utmMedium")} />
      <input type="hidden" {...form.register("utmCampaign")} />
      <input type="hidden" {...form.register("source")} />
      <div>
        <label className="block text-sm" htmlFor="role">
          I'm a
        </label>
        <select
          id="role"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 focus:ring-2 focus:ring-indigo-500"
          {...form.register("role")}
        >
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
      </div>
      <div>
        <label className="block text-sm" htmlFor="email">
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
      <div>
        <label className="block text-sm" htmlFor="igHandle">
          Instagram handle (optional)
        </label>
        <input
          id="igHandle"
          type="text"
          className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-800 p-2 focus:ring-2 focus:ring-indigo-500"
          placeholder="@username"
          {...form.register("igHandle")}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-white transition-all duration-300 hover:translate-y-[1px] hover:bg-indigo-500"
      >
        {loading ? "Joining..." : "Join waitlist"}
      </button>
    </form>
  );
}
