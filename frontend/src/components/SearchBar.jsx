import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ onSearch, placeholder = 'Search customer, email, subject, description...' }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Trigger search with 300ms debounce
  const triggerDebouncedSearch = useCallback((val) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(val)
    }, 300)
  }, [onSearch])

  const handleChange = (e) => {
    const val = e.target.value
    setValue(val)
    triggerDebouncedSearch(val)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Bind keydown shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only focus if '/' is pressed and user is not in a text field
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-10 pr-10 py-3 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:shadow-md"
      />

      {/* Keyboard Shortcut Indicator */}
      {!value && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex items-center h-5 select-none px-1.5 font-mono text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            /
          </kbd>
        </div>
      )}

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Clear Search Input"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
  )
}
