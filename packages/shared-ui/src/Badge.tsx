import React from 'react';

export interface BadgeProps {
  label: string;
  className?: string;
}

export function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={
        'inline-block text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 rounded-full px-2 py-0.5 ' +
        (className || '')
      }
    >
      {label}
    </span>
  );
}

export default Badge;
