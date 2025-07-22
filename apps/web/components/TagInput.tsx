import React from 'react';
"use client";
import { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [value, setValue] = useState('');

  const addTag = () => {
    const tag = value.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setValue('');
  };

  const removeTag = (t: string) => {
    onChange(tags.filter((tag) => tag !== t));
  };

  return (
    <div className="p-2 border rounded bg-gray-100 dark:bg-Siora-light text-gray-900 dark:text-white border-gray-300 dark:border-Siora-border flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className="bg-indigo-600 text-white rounded px-2 py-0.5 flex items-center gap-1 text-xs">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1">×</button>
        </span>
      ))}
      <input
        className="flex-1 bg-transparent outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
