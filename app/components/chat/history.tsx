"use client";

import { motion } from "framer-motion";
import { useTheme } from "../../context/theme";
import { useChat } from "./chat-context";
import { useEffect, useState } from "react";
import { IoIosTrash } from "react-icons/io";

export default function Sidebar() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const {
    pastChats,
    startNewChat,
    loadChat,
    loadChats,
    isLoadingChats,
    loadError,
    deleteChat
  } = useChat()

  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadChats()
  }, [loadChats])

  const chatsToShow = showAll ? pastChats : pastChats.slice(0, 5)

  const getModelName = (id: string | undefined) => {
    return id || "Unknown"
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Tem certeza que deseja excluir esta conversa?")
    if (confirm) {
      await deleteChat(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`SectionOne w-full lg:w-80 rounded-2xl border flex flex-col h-full order-first lg:order-none ${
        isDark ? "bg-black border-gray-800/50" : "bg-white border-gray-300"
      }`}
    >
      <div
        className={`px-4 p-2 h-12 border-b rounded-t-2xl flex justify-between ${
          isDark ? "bg-gray-950 border-gray-800" : "bg-gray-100 border-gray-300"
        }`}
      >
        <button className={`${isDark ? "text-white" : "text-black"} text-base font-bold`}>
          History
        </button>
        <button
          onClick={startNewChat}
          className="text-[#1aec33] text-base font-bold hover:underline"
        >
          New Chat
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-2 ${isDark ? "text-white" : "text-black"}`}>
        {isLoadingChats ? (
          <p className={`text-sm text-center mt-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Loading chat history...
          </p>
        ) : loadError ? (
          <p className={`text-sm text-center mt-8 text-red-500`}>
            Error to loading: {loadError}
          </p>
        ) : pastChats.length > 0 ? (
          <>
            <ul className="space-y-2">
              {chatsToShow.map((chat) => {
                const firstAnswer = chat.history.find(m => m.type === "answer")
                const modelUsed = firstAnswer?.model ? getModelName(firstAnswer.model) : "Unknown"

                return (
                  <li
                    key={chat.id}
                    className={`group relative cursor-pointer p-2 rounded text-sm transition-colors ${
                      isDark
                        ? "bg-gray-900 hover:bg-gray-800"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="font-medium truncate pr-6">{chat.title}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(chat.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs px-2 py-1 rounded">
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Model:
                        </span>{" "}
                        {modelUsed}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(chat.id)
                      }}
                      className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs ${
                        isDark ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-600"
                      }`}
                      title="Delete chat"
                    >
                      <IoIosTrash size={16} />
                    </button>
                  </li>
                )
              })}
            </ul>

            {pastChats.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`text-sm font-semibold hover:underline ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {showAll ? "Ver menos" : "Ver mais"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={`text-sm text-center mt-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No chat history
          </p>
        )}
      </div>
    </motion.div>
  )
}
