"use client";
import { useState } from 'react';
import Sidebar from './chat/history';
import ChatArea from './chat/chat-box';
import { ChatProvider, useChat } from './chat/chat-context';
import { useTheme } from '../context/theme';

export default function ChatClientWrapper({ userId }: { userId?: string }) {
  const { theme } = useTheme()
  const [showSidebar, setShowSidebar] = useState(false)
  const isDark = theme === 'dark'
  function MobileHeader() {
    const { startNewChat } = useChat()

    return (
      <div
        className={`lg:hidden w-full flex gap-4 justify-between items-center px-4 py-2 rounded-2xl border ${isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-100 border-gray-300'}`}
      >
        <button
          onClick={() => setShowSidebar(true)}
          className={`text-sm font-medium flex-1 text-left ${isDark ? 'text-white' : 'text-black'} hover:underline`}
        >
          Chats History
        </button>
        <button
          onClick={startNewChat}
          className="text-sm font-medium text-[#1aec33] hover:underline"
        >
          New Chat
        </button>
      </div>
    )
  }

  return (
    <ChatProvider userId={userId}>
      <div className={`relative flex flex-col lg:flex-row h-full gap-4 p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>

        {/* Cabeçalho para mobile com dois botões */}
        <MobileHeader />

        {/* Modal para o sidebar no mobile */}
        {showSidebar && (
          <div
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center lg:hidden"
            onClick={() => setShowSidebar(false)}
          >
            <div
              className={`w-[90%] max-h-[90%] overflow-auto rounded-xl border shadow-xl ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-300'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>Chats History</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                >
                  Close
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Sidebar fixo para desktop */}
        <div className="hidden lg:block w-80">
          <Sidebar />
        </div>

        {/* Área do chat principal */}
        <div className="flex-1 overflow-auto">
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  )
}
