import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'

export default function App() {
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Initialize Dark Mode on mount
  useEffect(() => {
    const theme = localStorage.getItem('crm-theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (theme === 'dark' || (!theme && systemPrefersDark)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Listen for the "Esc" key to close the mobile sidebar drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Sidebar: Desktop fixed + Mobile responsive drawer */}
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:pl-[240px] min-h-screen">
        <Navbar 
          onMenuToggle={() => setIsMobileSidebarOpen(prev => !prev)} 
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[1400px] mx-auto pb-16 md:pb-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateTicket />} />
              <Route path="/ticket/:ticket_id" element={<TicketDetail />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
