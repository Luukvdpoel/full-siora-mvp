import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions, prisma } from '@lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const persona = await prisma.persona.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(persona);
}
