import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import StatusBadge from './StatusBadge'
import PriorityDot from './PriorityDot'
import SkeletonRow from './SkeletonRow'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06
    }
  }
}

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: 'easeOut' } 
  }
}

export default function TicketTable({ tickets, isLoading }) {
  const isOlderThan48Hours = (createdAt) => {
    const createdDate = new Date(createdAt)
    const difference = new Date() - createdDate
    const hours = difference / (1000 * 60 * 60)
    return hours > 48
  }

  const getAgeTooltip = (createdAt) => {
    const days = differenceInDays(new Date(), new Date(createdAt))
    return `Open for ${days} days — needs attention`
  }

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-2xl border border-gray-200/50 dark:border-gray-800/50 glass-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/40 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200/50 dark:border-gray-800/50 glass-card shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/40 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none">
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Created</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-gray-100 dark:divide-gray-800/40 text-sm"
        >
          {tickets.map((ticket) => {
            const hasWarning = isOlderThan48Hours(ticket.created_at) && ticket.status !== 'Closed'
            const ageTooltip = hasWarning ? getAgeTooltip(ticket.created_at) : ''

            return (
              <motion.tr
                key={ticket.ticket_id}
                variants={rowVariants}
                className={`group hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-colors relative duration-150 ${
                  hasWarning ? 'border-l-[4px] border-l-amber-500 pl-[20px]' : ''
                }`}
                title={ageTooltip}
              >
                {/* Monospace Ticket ID */}
                <td className="px-6 py-4.5 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <div className="flex items-center gap-1.5">
                    {ticket.ticket_id}
                    {hasWarning && (
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" title={ageTooltip} />
                    )}
                  </div>
                </td>

                {/* Customer Initials & Details */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                      {ticket.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                        {ticket.customer_name}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[150px]">
                        {ticket.customer_email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Subject Description */}
                <td className="px-6 py-4.5 font-medium text-gray-900 dark:text-gray-200 max-w-[260px] truncate">
                  {ticket.subject}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4.5">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Priority Dot */}
                <td className="px-6 py-4.5">
                  <PriorityDot priority={ticket.priority} />
                </td>

                {/* Relative Created Date */}
                <td className="px-6 py-4.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </td>

                {/* Action View */}
                <td className="px-6 py-4.5 text-right whitespace-nowrap">
                  <Link to={`/ticket/${ticket.ticket_id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/60 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </Link>
                </td>
              </motion.tr>
            )
          })}
        </motion.tbody>
      </table>
    </div>
  )
}
