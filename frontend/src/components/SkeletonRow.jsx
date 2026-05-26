import React from 'react'

export default function SkeletonRow() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i} className="border-b border-gray-100 dark:border-gray-800/40 animate-pulse">
          {/* Ticket ID */}
          <td className="px-6 py-4.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-16" />
          </td>
          
          {/* Customer */}
          <td className="px-6 py-4.5">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md w-32" />
            </div>
          </td>
          
          {/* Subject */}
          <td className="px-6 py-4.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-48" />
          </td>
          
          {/* Status */}
          <td className="px-6 py-4.5">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          </td>
          
          {/* Priority */}
          <td className="px-6 py-4.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-14" />
          </td>
          
          {/* Created Date */}
          <td className="px-6 py-4.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-20" />
          </td>
          
          {/* Action */}
          <td className="px-6 py-4.5 text-right">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-16 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  )
}
