import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Send, Calendar, Clock, Loader2, Save } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import StatusBadge from '../components/StatusBadge'
import PriorityDot from '../components/PriorityDot'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

const noteVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.25, ease: 'easeOut' } 
  }
}

export default function TicketDetail() {
  const { ticket_id } = useParams()
  
  // Data State
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Control Panel Inputs State
  const [status, setStatus] = useState('Open')
  const [priority, setPriority] = useState('Medium')
  const [noteText, setNoteText] = useState('')
  
  // Optimistic UI Backup variables for rollbacks
  const [prevStatus, setPrevStatus] = useState('Open')
  const [prevPriority, setPrevPriority] = useState('Medium')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const textareaRef = useRef(null)

  // Fetch ticket details
  const fetchTicketDetail = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/tickets/${ticket_id}`)
      if (res.ok) {
        const data = await res.json()
        setTicket(data)
        setStatus(data.status)
        setPriority(data.priority)
        setPrevStatus(data.status)
        setPrevPriority(data.priority)
      } else {
        toast.error('Ticket not found')
      }
    } catch (err) {
      console.error('Error fetching ticket:', err)
      toast.error('Failed to load ticket detail.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTicketDetail()
  }, [ticket_id])

  // Submit Note Keyboard Shortcut (Ctrl+Enter)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleAddNoteSubmit()
    }
  }

  // Handle Note Submission (Optimistic UI)
  const handleAddNoteSubmit = async () => {
    if (!noteText.trim() || isAddingNote) return

    const pendingNoteText = noteText.trim()
    setNoteText('')
    setIsAddingNote(true)

    // Save current notes structure for rollback
    const originalNotes = [...ticket.notes]

    // Create an optimistic note item
    const optimisticNote = {
      note_text: pendingNoteText,
      created_at: new Date().toISOString()
    }

    // Optimistically update frontend state
    setTicket((prev) => ({
      ...prev,
      notes: [optimisticNote, ...prev.notes]
    }))

    try {
      const res = await fetch(`/api/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_text: pendingNoteText })
      })

      if (res.ok) {
        const data = await res.json()
        toast.success('Activity note added')
        // Update updated_at locally
        setTicket((prev) => ({
          ...prev,
          updated_at: data.updated_at
        }))
      } else {
        // Rollback on error
        setTicket((prev) => ({
          ...prev,
          notes: originalNotes
        }))
        toast.error('Failed to save note. Rolled back.')
      }
    } catch (err) {
      console.error('Error adding note:', err)
      // Rollback on network error
      setTicket((prev) => ({
        ...prev,
        notes: originalNotes
      }))
      toast.error('Connection error. Failed to add note.')
    } finally {
      setIsAddingNote(false)
    }
  }

  // Handle Controls Save (Optimistic UI updates)
  const handleSaveChanges = async () => {
    if (isUpdating) return
    setIsUpdating(true)

    // Save previous states for rollback
    const previousStatus = prevStatus
    const previousPriority = prevPriority

    // Optimistic UI updates
    setPrevStatus(status)
    setPrevPriority(priority)
    setTicket((prev) => ({
      ...prev,
      status,
      priority
    }))

    try {
      const res = await fetch(`/api/tickets/${ticket_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Ticket updated')
        setTicket((prev) => ({
          ...prev,
          updated_at: data.updated_at
        }))
      } else {
        // Rollback states
        setStatus(previousStatus)
        setPriority(previousPriority)
        setPrevStatus(previousStatus)
        setPrevPriority(previousPriority)
        setTicket((prev) => ({
          ...prev,
          status: previousStatus,
          priority: previousPriority
        }))
        toast.error(data.error || 'Failed to update ticket changes. Rolled back.')
      }
    } catch (err) {
      console.error('Error saving changes:', err)
      // Rollback
      setStatus(previousStatus)
      setPriority(previousPriority)
      setPrevStatus(previousStatus)
      setPrevPriority(previousPriority)
      setTicket((prev) => ({
        ...prev,
        status: previousStatus,
        priority: previousPriority
      }))
      toast.error('Connection error. Rolled back updates.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading CRM ticket detail records...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-bold">Ticket not found</h3>
        <p className="text-sm text-gray-500">The ticket you are trying to view does not exist or was deleted.</p>
        <Link to="/" className="btn-primary inline-block text-xs font-semibold">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        
        {/* Back Link Header */}
        <div className="flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Two-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Column (60% split => 3 columns in lg grid) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header info card */}
            <div className="glass-card p-6 flex flex-col gap-4 border border-white/50 dark:border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                  {ticket.ticket_id}
                </span>
                <StatusBadge status={ticket.status} />
                <PriorityDot priority={ticket.priority} />
              </div>

              <h2 className="text-xl font-bold text-gray-950 dark:text-gray-50 tracking-tight leading-snug">
                {ticket.subject}
              </h2>

              <div className="h-px bg-gray-100 dark:bg-gray-800/40 w-full" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                {/* Customer initials row */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    {ticket.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {ticket.customer_name}
                    </span>
                    <span>{ticket.customer_email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 sm:text-right">
                  <span className="flex items-center gap-1.5 justify-start sm:justify-end">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {format(new Date(ticket.created_at), "MMM d, yyyy 'at' hh:mm a")}</span>
                  </span>
                  <span className="flex items-center gap-1.5 justify-start sm:justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated: {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="glass-card p-6 space-y-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Problem Description
              </span>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Control Panel: Status & Priority selection */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Update Ticket Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Status Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Status Code
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input-field appearance-none cursor-pointer pr-10 font-medium"
                      disabled={isUpdating}
                    >
                      <option value="Open">🔵 Open</option>
                      <option value="In Progress">🟡 In Progress</option>
                      <option value="Closed">🟢 Closed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Priority Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Priority Tier
                  </label>
                  <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    {['Low', 'Medium', 'High'].map((p) => {
                      const isActive = priority === p
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`flex-1 text-center py-2 text-[11px] font-bold rounded-lg transition-all ${
                            isActive
                              ? 'gradient-brand text-white shadow-sm'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                          }`}
                          disabled={isUpdating}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Save changes action */}
              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSaveChanges}
                  className="btn-primary flex items-center gap-1.5 text-xs font-semibold rounded-xl"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

          </div>

          {/* Right Column (40% split => 2 columns in lg grid) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Note activities history */}
            <div className="glass-card p-6 flex flex-col h-full border border-white/50 dark:border-white/[0.08] min-h-[500px] justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800/40">
                  <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Activity Notes
                  </h3>
                </div>

                {/* Notes log list */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 max-h-[360px] overflow-y-auto pr-1"
                >
                  {ticket.notes.length > 0 ? (
                    ticket.notes.map((note, index) => (
                      <motion.div
                        key={note.id || index}
                        variants={noteVariants}
                        className="flex gap-2.5 items-start p-3 bg-gray-50/50 dark:bg-gray-850/30 border border-gray-200/20 dark:border-gray-800/20 rounded-xl"
                      >
                        {/* Datastraw Support Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 select-none">
                          DS
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-xs text-gray-800 dark:text-gray-200 leading-normal whitespace-pre-wrap">
                            {note.note_text}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-xs text-gray-400 font-medium">No activity yet. Add a note below.</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Add Note interactive textarea */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/40 flex flex-col gap-2.5">
                <div className={`rounded-xl transition-all duration-200 ${focusedField === 'note' ? 'gradient-border ring-2 ring-indigo-500/30' : ''}`}>
                  <textarea
                    ref={textareaRef}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocusedField('note')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    placeholder="Add a note or update... (Ctrl+Enter to submit)"
                    className="input-field resize-none bg-white/40 dark:bg-gray-900/40"
                    disabled={isAddingNote}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    Use <kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700">Ctrl+Enter</kbd> to save
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddNoteSubmit}
                    className="btn-primary p-2 text-xs font-bold rounded-xl flex items-center justify-center"
                    disabled={!noteText.trim() || isAddingNote}
                  >
                    {isAddingNote ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </PageTransition>
  )
}
