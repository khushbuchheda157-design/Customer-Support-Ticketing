import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Filter, Inbox, ChevronDown, Plus } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import StatsBar from '../components/StatsBar'
import SearchBar from '../components/SearchBar'
import TicketTable from '../components/TicketTable'
import TicketCard from '../components/TicketCard'
import SkeletonCard from '../components/SkeletonCard'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  
  // Local state for other filters to avoid heavy URL polling during rapid type
  const [priorityFilter, setPriorityFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Data lists & loading states
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [isTicketsLoading, setIsTicketsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  // Custom UI Dropdowns open states
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)

  // Fetch Tickets matching filters
  const fetchTickets = useCallback(async () => {
    setIsTicketsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)
      if (searchQuery) params.append('search', searchQuery)

      const res = await fetch(`/api/tickets?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setTickets(data)
      }
    } catch (err) {
      console.error('Error fetching tickets:', err)
    } finally {
      setIsTicketsLoading(false)
    }
  }, [statusFilter, priorityFilter, searchQuery])

  // Fetch Dashboard Statistics
  const fetchStats = async () => {
    setIsStatsLoading(true)
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setIsStatsLoading(false)
    }
  }

  // Refetch tickets whenever filter conditions change
  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  // Fetch stats once on component mount, or on status change to sync counters
  useEffect(() => {
    fetchStats()
  }, [statusFilter])

  // Handles search inputs from child SearchBar
  const handleSearch = (val) => {
    setSearchQuery(val)
  }

  const handleStatusFilterChange = (status) => {
    setSearchParams(prev => {
      if (status) {
        prev.set('status', status)
      } else {
        prev.delete('status')
      }
      return prev
    })
    setIsStatusDropdownOpen(false)
  }

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority)
    setIsPriorityDropdownOpen(false)
  }

  return (
    <PageTransition>
      <div className="space-y-6 md:space-y-8">
        
        {/* 1. Live Stats Bar */}
        <StatsBar stats={stats} isLoading={isStatsLoading} />

        {/* 2. Interactive ToolBar */}
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          {/* Live debounced SearchBar */}
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            
            {/* Custom Status Dropdown */}
            <div className="relative flex-1 lg:flex-none">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full lg:w-44 flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all select-none"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span>{statusFilter || 'All Statuses'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isStatusDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-2 p-1.5 z-20 glass-card dark:border-gray-800/60 shadow-lg text-sm flex flex-col gap-0.5"
                    >
                      {['', 'Open', 'In Progress', 'Closed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilterChange(status)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-semibold ${
                            (statusFilter === status)
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {status || 'All Statuses'}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Priority Dropdown */}
            <div className="relative flex-1 lg:flex-none">
              <button
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                className="w-full lg:w-44 flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all select-none"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span>{priorityFilter || 'All Priorities'}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isPriorityDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsPriorityDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 mt-2 p-1.5 z-20 glass-card dark:border-gray-800/60 shadow-lg text-sm flex flex-col gap-0.5"
                    >
                      {['', 'Low', 'Medium', 'High'].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => handlePriorityFilterChange(priority)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors font-semibold ${
                            (priorityFilter === priority)
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {priority || 'All Priorities'}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* 3. Ticket Listing Table/Card System */}
        <div className="w-full">
          {isTicketsLoading ? (
            <>
              {/* Desktop skeleton table */}
              <div className="hidden md:block">
                <TicketTable tickets={[]} isLoading={true} />
              </div>
              {/* Mobile skeleton cards */}
              <div className="block md:hidden">
                <SkeletonCard />
              </div>
            </>
          ) : tickets.length > 0 ? (
            <>
              {/* Desktop table view */}
              <div className="hidden md:block">
                <TicketTable tickets={tickets} isLoading={false} />
              </div>
              {/* Mobile responsive cards list */}
              <div className="block md:hidden">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-4"
                >
                  {tickets.map((ticket) => (
                    <TicketCard key={ticket.ticket_id} ticket={ticket} />
                  ))}
                </motion.div>
              </div>
            </>
          ) : (
            /* 4. Complete Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card py-16 px-6 text-center max-w-xl mx-auto flex flex-col items-center gap-4 justify-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 shadow-sm animate-pulse-slow">
                <Inbox className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  No tickets found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We couldn't find any tickets matching your search query or selected filtration parameters.
                </p>
              </div>
              <Link to="/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary mt-2 flex items-center gap-2 text-sm font-semibold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create first ticket</span>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

      </div>
    </PageTransition>
  )
}
