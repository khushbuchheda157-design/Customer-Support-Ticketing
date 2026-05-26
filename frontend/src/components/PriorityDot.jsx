import React from 'react'

export default function PriorityDot({ priority }) {
  const getStyles = () => {
    switch (priority) {
      case 'High':
        return {
          dot: 'bg-rose-500 shadow-rose-500/20',
          text: 'text-rose-700 dark:text-rose-400 font-semibold'
        }
      case 'Medium':
        return {
          dot: 'bg-amber-500 shadow-amber-500/20',
          text: 'text-amber-700 dark:text-amber-400 font-semibold'
        }
      case 'Low':
        return {
          dot: 'bg-emerald-500 shadow-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-400 font-semibold'
        }
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-600 dark:text-gray-400 font-semibold'
        }
    }
  }

  const styles = getStyles()

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full shadow-sm animate-pulse-slow ${styles.dot}`} />
      <span className={styles.text}>{priority}</span>
    </div>
  )
}
