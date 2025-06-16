"use client";

import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { creators } from "@/app/data/creators";

export default function PersonaPage() {
  const params = useParams();
  const slugParam = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const persona = creators.find(
    (c) => c.handle.replace(/^@/, "").toLowerCase() === slugParam.toLowerCase()
  );

  if (!persona) {
    return <main className="p-8 text-center">Persona not found.</main>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{persona.markdown}</ReactMarkdown>
      </div>
    </main>
  );
}
