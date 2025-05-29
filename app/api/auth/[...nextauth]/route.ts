import NextAuth from "next-auth";
import { authOptions } from "../../../lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Força uso de rotas dinâmicas
export const dynamic = "force-dynamic";