"use client";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PersonaPDF from '../../../../components/pdf/PersonaPDF';
import Link from 'next/link';

export const metadata = {
  title: 'Education Center',
  description: 'Resources for creators to work with brands',
};

export default function EducationPage() {
  const sampleData = {
    persona: 'A creative storyteller with a passion for lifestyle content.',
    tone: 'Confident',
    niche: 'Lifestyle',
  };
  return (
    <main className="min-h-screen bg-Siora-dark text-white p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-Siora-accent">Education Center</h1>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-Siora-accent-soft">Tips on Pitching Brands</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Research each brand and align your proposal with their values.</li>
          <li>Showcase previous work that matches their aesthetic.</li>
          <li>Explain how your audience overlaps with their target market.</li>
          <li>Keep outreach concise and professional.</li>
        </ul>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-Siora-accent-soft">Guides</h2>
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Pitching Brands Video"
            allowFullScreen
          />
        </div>
        <Link
          href="/guides/pitching.pdf"
          className="text-Siora-accent hover:text-Siora-hover underline"
        >
          Pitching Brands PDF
        </Link>
        <PDFDownloadLink
          document={<PersonaPDF data={sampleData} />}
          fileName="persona.pdf"
        >
          {({ loading }) => (
            <button
              type="button"
              className="mt-2 bg-Siora-accent hover:bg-Siora-hover transition-colors duration-200 text-white px-4 py-2 rounded-md disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Preparing...' : 'Download Persona PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </section>
    </main>
  );
}
