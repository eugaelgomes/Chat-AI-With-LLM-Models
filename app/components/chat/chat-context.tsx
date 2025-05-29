"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from "react";
import debounce from "lodash.debounce";

interface ChatMessage {
  type: "question" | "answer"
  content: string
  model?: string
}

interface ChatSession {
  id: string
  history: ChatMessage[]
  title: string
  timestamp: number
  model?: string
}

interface ChatContextType {
  chatHistory: ChatMessage[]
  setChatHistory: (history: ChatMessage[]) => void
  pastChats: ChatSession[]
  currentChatId: string | null
  startNewChat: () => void
  loadChat: (chat: ChatSession) => void
  saveCurrentChat: () => Promise<void>
  loadChats: () => Promise<void>
  isLoggedIn: boolean
  isLoadingChats: boolean
  loadError: string | null
  deleteChat: (id: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)
const MAX_TITLE_LENGTH = 40
const LOCAL_STORAGE_KEY = "guestChats"

export function ChatProvider({ children, userId }: { children: ReactNode, userId?: string }) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [pastChats, setPastChats] = useState<ChatSession[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const isLoggedIn = !!userId

  const generateChatTitle = useCallback((firstQuestion: string) => {
    if (!firstQuestion) return "New Chat"
    return firstQuestion.length > MAX_TITLE_LENGTH
      ? `${firstQuestion.substring(0, MAX_TITLE_LENGTH)}...`
      : firstQuestion
  }, [])

  const loadChats = useCallback(async () => {
    setIsLoadingChats(true)
    setLoadError(null)

    try {
      let loadedChats: ChatSession[] = []

      if (userId) {
        const response = await fetch("/api/conversations")
        if (response.ok) {
          const conversations = await response.json()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          loadedChats = conversations.map((conv: any) => ({
            id: conv.id,
            history: conv.messages,
            title: conv.title || `Conversation in ${new Date(conv.createdAt).toLocaleDateString()}`,
            timestamp: new Date(conv.createdAt).getTime(),
            model: conv.model
          }))
        } else {
          throw new Error("Occurred an error while loading conversations")
        }
      } else {
        const savedChats = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (savedChats) {
          loadedChats = JSON.parse(savedChats)
        }
      }

      setPastChats(loadedChats)

      if (!currentChatId && loadedChats.length === 0) {
        setCurrentChatId(crypto.randomUUID())
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Occurred and error while loading conversation", error)
      setLoadError(error.message || "Erro desconhecido")
    } finally {
      setIsLoadingChats(false)
    }
  }, [userId, currentChatId])

  const startNewChat = useCallback(() => {
    setChatHistory([])
    setCurrentChatId(crypto.randomUUID())
  }, [])

  const loadChat = useCallback((chat: ChatSession) => {
    setChatHistory(chat.history)
    setCurrentChatId(chat.id)
  }, [])

  const saveCurrentChat = useCallback(async () => {
    if (!currentChatId) return

    const firstQuestion = chatHistory.find(m => m.type === "question")?.content || ""
    const title = generateChatTitle(firstQuestion)
    const model = chatHistory.find(m => m.model)?.model || "default"

    const updatedChat: ChatSession = {
      id: currentChatId,
      history: [...chatHistory],
      title,
      timestamp: Date.now(),
      model
    }

    try {
      if (userId) {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentChatId,
            messages: chatHistory,
            title,
            model
          })
        })

        if (!response.ok) throw new Error("Error to save conversation")
      } else {
        const existingChats = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
        const existingIndex = existingChats.findIndex((c: ChatSession) => c.id === currentChatId)

        existingChats[existingIndex >= 0 ? existingIndex : existingChats.length] = updatedChat
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existingChats))
      }

      setPastChats(prev => {
        const existingIndex = prev.findIndex(c => c.id === currentChatId)
        return existingIndex >= 0
          ? prev.map(c => c.id === currentChatId ? updatedChat : c)
          : [updatedChat, ...prev]
      })
    } catch (error) {
      console.error("Error to save conversation", error)
    }
  }, [chatHistory, currentChatId, userId, generateChatTitle])
  // Debounced save
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(debounce(() => {
    saveCurrentChat()
  }, 1000), [saveCurrentChat])

  useEffect(() => {
    if (currentChatId) {
      debouncedSave()
    }
  }, [chatHistory, currentChatId, debouncedSave])

  const deleteChat = useCallback(async (id: string) => {
  try {
    if (userId) {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Error to delete conversation")
      }
    } else {
      const existingChats = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
      const updatedChats = existingChats.filter((chat: ChatSession) => chat.id !== id)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedChats))
    }

    setPastChats(prev => prev.filter(chat => chat.id !== id))

    // Se o chat deletado for o atual, inicie um novo
    if (currentChatId === id) {
      startNewChat()
    }
  } catch (error) {
    console.error("Error to delete conversation", error)
  }
}, [userId, currentChatId, startNewChat])


  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        pastChats,
        currentChatId,
        startNewChat,
        loadChat,
        saveCurrentChat,
        loadChats,
        isLoggedIn,
        isLoadingChats,
        loadError,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
