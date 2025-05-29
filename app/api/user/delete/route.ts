import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import prisma from "../../../lib/prisma"

export async function DELETE() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    await prisma.user.delete({
      where: { email: session.user.email }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir perfil:", error)
    return NextResponse.json({ error: "Erro interno ao excluir perfil" }, { status: 500 })
  }
}
