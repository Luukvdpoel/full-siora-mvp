"use client";

import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { creators } from "@/app/data/creators";

export default function SharePersonaPage() {
  const params = useParams();
  const slugParam =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";

  const persona = creators.find(
    (c) => c.handle.replace(/^@/, "").toLowerCase() === slugParam.toLowerCase()
  );

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
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{persona.name}</h1>
            <p className="text-sm text-gray-500">{persona.handle}</p>
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Export PDF
          </button>
        </header>
        <section className="bg-white rounded-lg shadow p-6 space-y-4" id="persona-content">
          <p className="text-gray-700">{persona.summary}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold">Platform</h3>
              <p>{persona.platform}</p>
            </div>
            <div>
              <h3 className="font-semibold">Followers</h3>
              <p>{persona.followers.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-semibold">Engagement</h3>
              <p>{persona.engagementRate}%</p>
            </div>
            <div>
              <h3 className="font-semibold">Tone</h3>
              <p>{persona.tone}</p>
            </div>
          </div>
          <div className="prose max-w-none">
            <ReactMarkdown>{persona.markdown ?? ""}</ReactMarkdown>
          </div>
        </section>
      </div>
    </main>
  );
}
