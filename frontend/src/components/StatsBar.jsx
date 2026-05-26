import React from 'react'
import { motion } from 'framer-motion'
import { Ticket, Inbox, Clock, CheckCircle2 } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } 
  }
}

export default function StatsBar({ stats, isLoading }) {
  const cards = [
    {
      key: 'total',
      label: 'Total Tickets',
      value: stats?.total,
      icon: Ticket,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
      isBrand: true
    },
    {
      key: 'open',
      label: 'Open',
      value: stats?.open,
      icon: Inbox,
      iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40',
      isBrand: false
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      value: stats?.in_progress,
      icon: Clock,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      isBrand: false
    },
    {
      key: 'closed',
      label: 'Closed',
      value: stats?.closed,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      isBrand: false
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 animate-pulse flex flex-col justify-between h-[106px]">
            <div className="flex items-start justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-10 mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.key}
            variants={cardVariants}
            className="glass-card p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top-right accent gradient overlay */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />

            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-2 flex items-baseline">
              <span className={`text-2xl font-extrabold tracking-tight ${card.isBrand ? 'gradient-text font-black' : 'text-gray-900 dark:text-gray-100'}`}>
                {card.value ?? 0}
              </span>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
