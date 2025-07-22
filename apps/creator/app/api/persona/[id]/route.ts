import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions, prisma } from '@lib/auth';

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { persona } = await req.json();
  if (!persona) {
    return NextResponse.json({ error: 'Missing persona' }, { status: 400 });
  }

  const updated = await prisma.persona.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: { data: persona },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const result = await prisma.persona.findUnique({ where: { id: params.id } });
  return NextResponse.json(result);
}
