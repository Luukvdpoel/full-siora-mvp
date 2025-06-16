import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, prisma } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const personas = await prisma.persona.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(personas)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { title, persona } = await req.json()
  if (!title || !persona) {
    return NextResponse.json({ error: 'Missing title or persona' }, { status: 400 })
  }

  const result = await prisma.persona.create({
    data: {
      title,
      data: persona,
      userId: session.user.id
    }
  })

  return NextResponse.json(result)
}

