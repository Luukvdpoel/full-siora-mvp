"use client";

import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { creators } from "@/app/data/creators";

export default function PersonaPage() {
  const params = useParams();
  const slugParam = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const persona = creators.find(
    (c) => c.handle.replace(/^@/, "").toLowerCase() === slugParam.toLowerCase()
  );

  const downloadMarkdown = () => {
    if (!persona) return;
    const blob = new Blob([persona.markdown ?? ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugParam || "persona"}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    if (!persona) return;
    const element = document.getElementById("persona-content");
    if (!element) return;
    const doc = new jsPDF();
    doc.html(element, {
      callback: () => doc.save(`${slugParam || "persona"}.pdf`),
      html2canvas: { scale: 0.6 },
    });
  };

  if (!persona) {
    return <main className="p-8 text-center">Persona not found.</main>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={downloadMarkdown}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Download .md
        </button>
        <button
          type="button"
          onClick={downloadPdf}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Download .pdf
        </button>
      </div>
      <div id="persona-content" className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{persona.markdown}</ReactMarkdown>
      </div>
    </main>
  );
}
