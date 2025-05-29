'use client';

import Link from "next/link";
import Image from "next/image";
import { IoIosLogOut, IoMdClose } from "react-icons/io";
import { FiSun, FiMoon } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "./../context/theme";
import { useState } from "react";
import cw_logo from "../assets/logo-codaweb-nobg.png";

export default function Header() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className={`Header w-full px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 border-b
        ${theme === 'dark'
          ? 'bg-gray-900 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-900'}`}>

        {/* Logo + Nome */}
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-lg sm:text-xl">
              <span className="font-normal">CodaWeb</span>
              <span className="text-primary-500 font-bold">AI</span>
            </div>
            <Image
              src={cw_logo}
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </Link>

          {/* Botão hambúrguer - visível apenas em sm ou menor */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-md border"
            aria-label="Abrir menu"
          >
            {menuOpen ? <IoMdClose size={24} /> : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu normal para telas maiores */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'text-yellow-300' : 'text-gray-700'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {session?.user ? (
            <>
              <span className="text-sm sm:text-base">{session.user.name}</span>
              {session.user.image && (
                <button title="Profile" onClick={() => setIsModalOpen(true)}>
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </button>
              )}
              <button
                title="Logout"
                onClick={() => signOut({ callbackUrl: '/' })}
                className={`text-lg hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
              >
                <IoIosLogOut />
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm sm:text-base font-bold hover:underline">
              Sign In {":)"}
            </Link>
          )}
        </div>

        {/* Menu responsivo em telas pequenas */}
        {menuOpen && (
          <div className={`sm:hidden mt-2 w-full flex flex-col gap-4 rounded-lg p-4 
            ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>

            <button onClick={toggleTheme} className="flex items-center gap-2">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
              <span>Theme</span>
            </button>

            {session?.user ? (
              <>
                <span>{session.user.name}</span>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 hover:text-red-500"
                >
                  <IoIosLogOut />
                  <span>Sign Out {":/"} </span>
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:underline">
                Sign In {":)"}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal de perfil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className={`relative z-10 rounded-lg p-6 max-w-md w-full mx-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <button
              title="Close"
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
            >
              <IoMdClose size={24} />
            </button>

            <div className="flex flex-col items-center space-y-4">
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              )}

              <div className="w-full text-center space-y-2">
                <h2 className="text-xl font-bold">{session?.user?.name || "Nome não disponível"}</h2>
                <p className="text-sm opacity-80">{session?.user?.email || "Email não disponível"}</p>

                <div className="pt-4 border-t mt-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Provider:</span> {session?.user?.provider || "N/A"}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (confirm("Do you really want to delete your account? This action cannot be undone.")) {
                      const res = await fetch("/api/user/delete", { method: "DELETE" })
                      if (res.ok) {
                        alert("Account deleted successfully.")
                        signOut({ callbackUrl: "/" })
                      } else {
                        alert("Error to delete your account. Try again later.")
                      }
                    }
                  }}
                  className="text-sm text-red-500 hover:underline mt-4"
                >
                  Delete Account
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
