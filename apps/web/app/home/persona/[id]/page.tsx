import personas from '../../../../../data/personas.json';

interface Persona {
  id: string;
  title: string;
  handle: string;
  tone?: string;
}

export default function PersonaPage({ params }: { params: { id: string } }) {
  const persona = (personas as Persona[]).find(p => p.id === params.id);

  if (!persona) {
    return <main className="p-6">Persona not found.</main>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">{persona.title}</h1>
      <p className="text-gray-700">Handle: {persona.handle}</p>
      {persona.tone && <p className="text-gray-700">Tone: {persona.tone}</p>}
    </main>
  );
}
