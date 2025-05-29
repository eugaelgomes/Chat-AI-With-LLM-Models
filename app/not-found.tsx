// app/not-found.tsx
'use client'

import Link from 'next/link'
import { useTheme } from './context/theme'
import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

export default function NotFound() {
  const { theme } = useTheme()

  return (
    <div className={`h-full flex items-center justify-center px-4 py-10 sm:py-20 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-4">
          <FiAlertTriangle size={64} className="text-yellow-500" />
        </div>
        <p className="text-xl font-semibold mb-2">Oops! Page not found.</p>
        <p className="text-gray-500 mb-6">Go to initial page.</p>

        <Link
          href="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full transition-colors"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  )
}
