// app/context/app-context.tsx
"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme";
import { SessionProviders } from "./providers";

export function AppContext({ children }: { children: ReactNode }) {
  return (
    <NextAuthProvider>
      <ThemeProvider>
        <SessionProviders>
          {children}
        </SessionProviders>
      </ThemeProvider>
    </NextAuthProvider>
  );
}