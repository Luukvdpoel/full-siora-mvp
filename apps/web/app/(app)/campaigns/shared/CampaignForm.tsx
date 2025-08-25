"use client";

import * as React from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

const TONES = ["", "Playful", "Serious", "Bold", "Aspirational", "Educational"];

export default function CampaignForm({
  initial,
  action,
  dangerZone,
}: {
  initial?: {
    title: string;
    brief: string;
    niche: string | null;
    targetTone: string | null;
    budgetEUR: number | null;
  };
  action: (state: any, formData: FormData) => Promise<any>;
  dangerZone?: React.ReactNode;
}) {
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  async function onAction(_: any, fd: FormData) {
    const res = await action(_, fd);
    if (res?.ok === false && res.errors) {
      setErrors(res.errors as Record<string, string[]>);
      return;
    }
  }

  return (
    <form action={onAction} className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <Field label="Title" name="title" error={errors.title}>
        <input
          name="title"
          defaultValue={initial?.title || ""}
          required
          className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 outline-none"
          placeholder="Eco-friendly Summer Launch"
        />
      </Field>

      <Field label="Brief" name="brief" error={errors.brief}>
        <textarea
          name="brief"
          defaultValue={initial?.brief || ""}
          required
          rows={8}
          className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 outline-none"
          placeholder="What is the product, who is the audience, what tone/values, deliverables, regions, budget..."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Niche" name="niche" error={errors.niche}>
          <input
            name="niche"
            defaultValue={initial?.niche || ""}
            className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 outline-none"
            placeholder="Skincare / Fitness / Tech..."
          />
        </Field>

        <Field label="Target tone" name="targetTone" error={errors.targetTone}>
          <select
            name="targetTone"
            defaultValue={initial?.targetTone || ""}
            className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 outline-none"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t || "—"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Budget (EUR)" name="budgetEUR" error={errors.budgetEUR}>
        <input
          name="budgetEUR"
          type="number"
          min={0}
          defaultValue={initial?.budgetEUR ?? ""}
          className="w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2 outline-none"
          placeholder="5000"
        />
      </Field>

      <div className="mt-5 flex items-center gap-3">
        <SubmitButton />
        <Link
          href="/campaigns"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>

      {dangerZone}
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <label className="mb-1 block text-sm text-white/80" htmlFor={name}>
        {label}
      </label>
      {children}
      {!!error?.length && (
        <div className="mt-1 text-xs text-red-300">{error.join(", ")}</div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-white/90 px-4 py-2 text-gray-900 hover:bg-white disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save & view matches"}
    </button>
  );
}

