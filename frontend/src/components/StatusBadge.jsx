import React from 'react'
import { motion } from 'framer-motion'

export default function StatusBadge({ status }) {
  const getStyles = () => {
    switch (status) {
      case 'Open':
        return {
          badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/30',
          dot: 'bg-sky-500'
        }
      case 'In Progress':
        return {
          badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
          dot: 'bg-amber-500'
        }
      case 'Closed':
        return {
          badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
          dot: 'bg-emerald-500'
        }
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/30',
          dot: 'bg-gray-500'
        }
    }
  }

  const styles = getStyles()

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-all ${styles.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      <span>{status}</span>
    </motion.div>
  )
}
