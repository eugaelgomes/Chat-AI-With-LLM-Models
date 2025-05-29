// app/context/providers.tsx
"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type SessionIdContextType = {
  sessionId: string | null;
  isLoading: boolean;
};

const SessionIdContext = createContext<SessionIdContextType>({
  sessionId: null,
  isLoading: true,
});

export function useSessionId() {
  return useContext(SessionIdContext);
}

// Mudei para named export para consistência
export function SessionProviders({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<SessionIdContextType>({
    sessionId: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/session');
        
        if (!res.ok) {
          throw new Error('Failed to fetch session');
        }
        
        const data = await res.json();
        setSessionState({
          sessionId: data.sessionId,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching session:', error);
        setSessionState({
          sessionId: null,
          isLoading: false,
        });
      }
    };

    fetchSession();
  }, []);

  return (
    <NextAuthProvider>
      <SessionIdContext.Provider value={sessionState}>
        {children}
      </SessionIdContext.Provider>
    </NextAuthProvider>
  );
}