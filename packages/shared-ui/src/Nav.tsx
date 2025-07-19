"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLink {
  href: string;
  label: string;
}

export function Nav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-6 mb-8 text-sm">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`transition-colors hover:text-Siora-accent ${
            pathname === l.href ? 'text-Siora-accent font-semibold' : 'text-gray-300'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
