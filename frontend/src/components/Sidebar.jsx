import React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Ticket, 
  Inbox, 
  Clock, 
  CheckCircle2, 
  X 
} from 'lucide-react'

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeStatus = searchParams.get('status')

  // Navigation config
  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/',
      active: location.pathname === '/' && !activeStatus
    },
    {
      label: 'All Tickets',
      icon: Ticket,
      to: '/?status=',
      active: location.pathname === '/' && activeStatus === ''
    },
    {
      label: 'Open',
      icon: Inbox,
      to: '/?status=Open',
      active: location.pathname === '/' && activeStatus === 'Open'
    },
    {
      label: 'In Progress',
      icon: Clock,
      to: '/?status=In Progress',
      active: location.pathname === '/' && activeStatus === 'In Progress'
    },
    {
      label: 'Closed',
      icon: CheckCircle2,
      to: '/?status=Closed',
      active: location.pathname === '/' && activeStatus === 'Closed'
    }
  ]

  // Shared inner content of the sidebar
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-800/50">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-glow">
            DS
          </div>
          <span className="font-extrabold text-lg tracking-tight gradient-text">
            Datastraw CRM
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden text-gray-400 hover:text-gray-600"
          aria-label="Close Mobile Sidebar Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${item.active ? 'active' : ''}`}
            >
              <Icon className={`w-4 h-4 ${item.active ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer User Avatar */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-950/20">
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-md">
          DC
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
            Deepak Chheda
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
            Support Agent • Datastraw
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 z-30 w-[240px] hidden md:block">
        {renderSidebarContent()}
      </aside>

      {/* 2. Mobile Drawer Mode */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm md:hidden"
            />
            {/* Sliding Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[240px] md:hidden shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
