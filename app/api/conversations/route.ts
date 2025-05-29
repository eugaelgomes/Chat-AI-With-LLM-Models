import prisma from '../../lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../../lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 })
  }

  const conversations = await prisma.conversation.findMany({
    where: { 
      user: {  // Obs::Alterar para minúsculo
        email: session.user.email
      } 
    },
    orderBy: { updatedAt: 'desc' }
  })

  return NextResponse.json(conversations)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, messages, model } = await req.json()
  const now = new Date()

  const conversation = await prisma.conversation.upsert({
    where: { id },
    update: { 
      messages, 
      model, 
      updatedAt: now 
    },
    create: {
      id,
      messages,
      model,
      updatedAt: now,
      user: { connect: { email: session.user.email } }
    }
  })

  return NextResponse.json(conversation)
}