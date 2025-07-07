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
    <nav className="flex gap-4 text-sm mb-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={
            pathname === l.href
              ? "underline font-semibold"
              : "underline"
          }
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
