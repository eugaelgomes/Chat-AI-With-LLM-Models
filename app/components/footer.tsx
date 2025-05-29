"use client";

import Link from "next/link";
import { useTheme } from "./../context/theme" ;

export default function Footer() {
  const { theme } = useTheme()

  return (
    <footer className={`w-full border-t ${theme === 'dark'
      ? 'bg-gray-900 border-gray-700'
      : 'bg-white border-gray-200'
      }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 lg:gap-8">
          <div className="flex items-center">
            <span className={`text-sm sm:text-base mr-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
              Developed by
            </span>
            <a
              href="https://github.com/eugaelgomes"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm sm:text-base underline hover:opacity-80 transition-opacity ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}
            >
              github.com/eugaelgomes
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/about"
              className={`text-sm sm:text-base hover:underline transition-all ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
            >
              About
            </Link>{/*

            <Link
              href="/support"
              className={`text-sm sm:text-base hover:underline transition-all ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
            >
              Contact / Support
            </Link>*/}
          </div>
        </div>
      </div>
    </footer>
  )
}