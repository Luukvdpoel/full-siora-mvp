import React from 'react';
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export function Nav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4">
      {links.map((l) => {
        const active = pathname === l.href;
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active
                ? 'bg-Siora-accent text-white shadow-Siora-hover'
                : 'text-gray-300 hover:text-white hover:bg-Siora-light'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
