'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentRole = (session?.user as { role?: string })?.role ?? "";
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.replace("/auth/login");
  }, [status, session, router]);

  const save = async () => {
    if (!role || saving) return;
    setSaving(true);
    await fetch("/api/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setSaving(false);
    router.refresh();
  };

  if (!session) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-white bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light">
      <h1 className="text-3xl font-bold">Profile</h1>
      <label className="space-x-2">
        <span>Role:</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "brand" | "creator")}
          className="p-2 rounded bg-Siora-light text-white border border-Siora-border"
        >
          <option value="">Select...</option>
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
      </label>
      <button
        onClick={save}
        disabled={!role || saving}
        className="px-4 py-2 bg-Siora-accent rounded text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </main>
  );
}
