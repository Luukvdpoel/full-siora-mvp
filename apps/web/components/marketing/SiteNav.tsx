const links = [
  { href: '#features', label: 'How it works' },
  { href: '/creator', label: 'Creators' },
  { href: '/brands', label: 'Brands' },
  { href: '/auth/login', label: 'Login' },
];

export default function SiteNav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 text-sm">
        <a href="/" className="font-semibold tracking-tight">Siora</a>
        <div className="hidden sm:flex gap-6 text-white/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
