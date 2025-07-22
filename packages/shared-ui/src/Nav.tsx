import React from 'react';
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ElementType } from "react";

export interface NavLink {
  href: string;
  label: string;
  icon?: ElementType;
}

export function Nav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6 mb-6">
      {links.map((l) => {
        const active = pathname === l.href;
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              active
                ? 'bg-Siora-accent text-white shadow-Siora-hover'
                : 'text-gray-300 hover:text-white hover:bg-Siora-light'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
