import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  const { id } = params

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  try {
    const deleted = await prisma.conversation.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, deleted })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ error: "Erro interno ao deletar" }, { status: 500 })
  }
}
