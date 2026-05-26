import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Plus } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ onMenuToggle }) {
  const location = useLocation()

  // Generate dynamic page header titles from pathnames
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard'
    if (location.pathname === '/create') return 'Create Ticket'
    if (location.pathname.startsWith('/ticket/')) {
      const parts = location.pathname.split('/')
      return `Ticket Detail — ${parts[2] || ''}`
    }
    return 'Datastraw CRM'
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl px-4 py-3 md:px-8 flex items-center justify-between rounded-none">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden transition-colors"
          aria-label="Toggle Navigation Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Primary CTA - Create Ticket */}
        {location.pathname !== '/create' && (
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-1.5 text-xs md:text-sm font-semibold rounded-xl px-3 py-1.5 md:px-4 md:py-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Ticket</span>
            </motion.button>
          </Link>
        )}

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

        {/* Sun/Moon Toggle Theme switch */}
        <ThemeToggle />
      </div>
    </header>
  )
}
