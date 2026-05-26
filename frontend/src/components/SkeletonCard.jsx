import React from 'react'

export default function SkeletonCard() {
  return (
    <div className="space-y-4 md:hidden w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card p-5 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          </div>
          
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
          </div>
          
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
          
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-16" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
