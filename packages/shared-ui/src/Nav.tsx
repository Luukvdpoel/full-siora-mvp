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
    <nav className="flex items-center gap-4 mb-6">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              active
                ? 'bg-Siora-accent text-white shadow-Siora-hover'
                : 'text-gray-300 hover:text-white hover:bg-Siora-light'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
