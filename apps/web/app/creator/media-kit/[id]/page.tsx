import type { FullPersona } from "@creator/types/persona";
import { prisma } from "@creator/lib/auth";

interface PageParams {
  params: { id: string };
}

export default async function MediaKitIdPage({ params }: PageParams) {
  const record = await prisma.persona.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!record) {
    return <main className="p-6">Persona not found.</main>;
  }

  const persona = record.data as FullPersona;

  const captions =
    persona.interests && persona.interests.length > 0
      ? persona.interests.slice(0, 3).map((i) => `Loving ${i}!`)
      : ["Example caption one", "Example caption two", "Example caption three"];

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{persona.name}</h1>
      <div className="space-y-4">
        <section className="border border-white/10 rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Bio</h2>
          <p className="text-sm text-foreground/80 whitespace-pre-line">{persona.summary}</p>
        </section>
        <section className="border border-white/10 rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Tone</h2>
          <p className="text-sm text-foreground/80">{(persona as any).tone ?? persona.vibe ?? persona.personality}</p>
        </section>
        {persona.platforms && persona.platforms.length > 0 && (
          <section className="border border-white/10 rounded-lg p-4 space-y-2">
            <h2 className="text-xl font-semibold">Platforms</h2>
            <ul className="list-disc list-inside text-sm text-foreground/80">
              {persona.platforms.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="border border-white/10 rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Voorbeeld Captions</h2>
          <ul className="list-disc list-inside text-sm text-foreground/80">
            {captions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="border border-white/10 rounded-lg p-4 space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          {record.user?.name && <p className="text-sm text-foreground/80">{record.user.name}</p>}
          {record.user?.email && (
            <p className="text-sm">
              <a href={`mailto:${record.user.email}`} className="underline">
                {record.user.email}
              </a>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
