'use client';
import React from 'react';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "shared-ui";
import { Label } from "@/components/ui/label";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "Twitter"];

export default function CampaignBriefForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [persona, setPersona] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [deliverables, setDeliverables] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      persona,
      platforms,
      deliverables,
      budget,
      deadline,
      notes,
    };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range</Label>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="$1,000 - $5,000"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="persona">Ideal Creator Persona</Label>
          <Textarea
            id="persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Platforms</Label>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`platform-${p}`}
                  checked={platforms.includes(p)}
                  onCheckedChange={() => togglePlatform(p)}
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="deliverables">Content Deliverables</Label>
          <Input
            id="deliverables"
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
            placeholder="e.g. 3 Reels + 1 Story"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Extra Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Create Campaign
      </Button>
    </form>
  );
}
