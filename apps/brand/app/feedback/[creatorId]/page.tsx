"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import creators from "../../../../web/app/data/mock_creators_200.json";

export default function CreatorFeedback({ params }: { params: { creatorId: string } }) {
  const creator = (creators as any[]).find(c => c.id === params.creatorId);
  const [rating, setRating] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [comments, setComments] = useState("");
  const [existing, setExisting] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/feedback?creatorId=${params.creatorId}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setExisting(data) : []);
  }, [params.creatorId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandId: 'brand1',
        creatorId: params.creatorId,
        rating,
        communication,
        reliability,
        comments,
        type: 'brand_to_creator',
      }),
    });
    setComments('');
    const res = await fetch(`/api/feedback?creatorId=${params.creatorId}`);
    const data = await res.json();
    setExisting(Array.isArray(data) ? data : []);
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Feedback for {creator?.name ?? params.creatorId}</h1>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">Overall Rating (1-5)
          <input type="number" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full p-2 rounded bg-Siora-light text-white" />
        </label>
        <label className="block">Communication (1-5)
          <input type="number" min="1" max="5" value={communication} onChange={e => setCommunication(Number(e.target.value))} className="w-full p-2 rounded bg-Siora-light text-white" />
        </label>
        <label className="block">Reliability (1-5)
          <input type="number" min="1" max="5" value={reliability} onChange={e => setReliability(Number(e.target.value))} className="w-full p-2 rounded bg-Siora-light text-white" />
        </label>
        <label className="block">Comments
          <textarea value={comments} onChange={e => setComments(e.target.value)} className="w-full p-2 rounded bg-Siora-light text-white" />
        </label>
        <button type="submit" className="px-4 py-2 bg-Siora-accent rounded">Submit</button>
      </form>
      {existing.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Previous Feedback</h2>
          <ul className="space-y-1 text-sm">
            {existing.map(f => (
              <li key={f.id} className="border-b border-white/20 pb-1">{f.comments} - {f.rating}/5</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
