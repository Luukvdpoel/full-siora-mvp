import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-radial from-Siora-dark via-Siora-mid to-Siora-light text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold">Welcome to Siora</h1>
        <div className="flex justify-center gap-4">
          <Link
            href="/brand"
            className="px-6 py-3 rounded-md bg-white text-black font-semibold"
          >
            I'm a Brand
          </Link>
          <Link
            href="/creator"
            className="px-6 py-3 rounded-md bg-white text-black font-semibold"
          >
            I'm a Creator
          </Link>
        </div>
      </div>
    </main>
  );
}
