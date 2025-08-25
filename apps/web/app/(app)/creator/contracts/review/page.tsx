'use client';
import React, { useState } from 'react';
import fairTemplates from '@/app/creator/data/fairContractTemplates';
import { detectContractRedFlags, ContractWarning } from 'shared-utils';
import ReactMarkdown from 'react-markdown';

export default function ReviewContractPage() {
  const [text, setText] = useState('');
  const [warnings, setWarnings] = useState<ContractWarning[]>([]);

  const analyze = (e: React.FormEvent) => {
    e.preventDefault();
    setWarnings(detectContractRedFlags(text));
  };

  const loadTemplate = (tmpl: string) => {
    setText(tmpl);
    setWarnings([]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Contract Assistant</h1>
      <form onSubmit={analyze} className="space-y-4">
        <textarea
          className="w-full h-40 p-2 rounded-md bg-zinc-800 text-white"
          placeholder="Paste contract text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {fairTemplates.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => loadTemplate(t.text)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1 rounded"
            >
              {t.title}
            </button>
          ))}
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white px-4 py-2 rounded-md">
          Analyze Contract
        </button>
      </form>
      {warnings.length > 0 && (
        <div className="space-y-2 border border-red-500 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-red-500">Potential Issues</h2>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((w, idx) => (
              <li key={idx}>{w.message}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-red-300">This deal may undervalue your influence. Want help negotiating?</p>
        </div>
      )}
      {warnings.length === 0 && text && (
        <p className="text-green-500">No major red flags detected.</p>
      )}
      {text && (
        <div className="prose prose-invert max-w-none border border-white/10 p-4 rounded-md">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}
