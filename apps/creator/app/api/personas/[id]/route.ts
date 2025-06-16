import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, prisma } from '@/lib/auth'

interface Params {
  params: { id: string }
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const persona = await prisma.persona.findFirst({
    where: { id: params.id, userId: session.user.id }
  })

  if (!persona) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(persona)
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { title, persona } = await req.json()
  const updated = await prisma.persona.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: {
      ...(title && { title }),
      ...(persona && { data: persona })
    }
  })

  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const result = await prisma.persona.findUnique({ where: { id: params.id } })
  return NextResponse.json(result)
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const deleted = await prisma.persona.deleteMany({
    where: { id: params.id, userId: session.user.id }
  })

  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

