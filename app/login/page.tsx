"use client"
import { Suspense } from 'react'
import Image from "next/image"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTheme } from '../context/theme'

function LoginComponent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/") // Redireciona para a página do chat após login
    }
  }, [status, router])

  const handleLogin = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/" }) // Atualizado para redirecionar para /chat
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col   ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xs rounded-xl border border-gray-800 shadow-lg p-6 space-y-4">
          <h1 className="text-xl font-bold text-white text-center">Welcome Back</h1>

          <div className="space-y-3">
            <button
              onClick={() => handleLogin("google")}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2.5 px-4 text-white transition-colors"
            >
              <Image
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                height={20}
                width={20}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>

            <button
              onClick={() => handleLogin("github")}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2.5 px-4 text-white transition-colors"
            >
              <Image
                src="https://github.githubassets.com/favicons/favicon-dark.svg"
                alt="GitHub logo"
                height={20}
                width={20}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">Continue with GitHub</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginComponent />
    </Suspense>
  )
}