import { getServerSession } from 'next-auth'
import { authOptions } from './lib/auth'
import ChatClientWrapper from './components/chat-page'

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  return <ChatClientWrapper userId={session?.user?.id} />
}
