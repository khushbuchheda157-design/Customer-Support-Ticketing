import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { HelpCircle, ChevronRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import PriorityDot from './PriorityDot'

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: 'easeOut' } 
  }
}

export default function TicketCard({ ticket }) {
  const navigate = useNavigate()

  const isOlderThan48Hours = (createdAt) => {
    const createdDate = new Date(createdAt)
    const difference = new Date() - createdDate
    const hours = difference / (1000 * 60 * 60)
    return hours > 48
  }

  const handleCardClick = () => {
    navigate(`/ticket/${ticket.ticket_id}`)
  }

  const hasWarning = isOlderThan48Hours(ticket.created_at) && ticket.status !== 'Closed'
  const days = differenceInDays(new Date(), new Date(ticket.created_at))

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`glass-card p-5 flex flex-col justify-between cursor-pointer border-t-[4px] relative active:bg-indigo-50/10 dark:active:bg-indigo-950/10 transition-colors select-none ${
        hasWarning ? 'border-t-amber-500' : 'border-t-transparent'
      }`}
      style={{ minHeight: '44px' }} // Ensures accessibility touch-target compliance
    >
      {/* Top row: Ticket ID and Status */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {ticket.ticket_id}
        </span>
        <StatusBadge status={ticket.status} />
      </div>

      {/* Ticket metadata */}
      <div className="mt-3.5 space-y-1.5">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1">
          {ticket.subject}
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] font-bold text-gray-600 dark:text-gray-300">
            {ticket.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
            {ticket.customer_name}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-100 dark:bg-gray-800/40" />

      {/* Footer information */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-3">
          <PriorityDot priority={ticket.priority} />
          <span className="text-[10px]">•</span>
          <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
          {hasWarning && (
            <span className="flex items-center gap-1 text-amber-500 text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              <HelpCircle className="w-3 h-3" />
              <span>{days}d open</span>
            </span>
          )}
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  )
}
