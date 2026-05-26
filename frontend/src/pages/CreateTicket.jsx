import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'

export default function CreateTicket() {
  const navigate = useNavigate()

  // Form Fields State
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  // Validation / Loading States
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [shouldShake, setShouldShake] = useState(false)

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required'
    } else if (!emailRegex.test(customerEmail.trim())) {
      newErrors.customerEmail = 'Please provide a valid email address'
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject line is required'
    }

    if (!description.trim()) {
      newErrors.description = 'Problem description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setShouldShake(false)

    if (!validateForm()) {
      // Trigger horizontal shake animation on errors
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 500)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject,
          description,
          priority
        })
      })

      const data = await res.json()

      if (res.ok) {
        // Display custom glass-morphic toast
        toast.success(`Ticket ${data.ticket_id} created successfully`, {
          icon: '✓'
        })
        
        // Wait 1.5 seconds, then redirect to home
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        toast.error(data.error || 'Failed to create ticket')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      toast.error('Network error occurred. Try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto py-2">
        <motion.div
          animate={shouldShake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card p-6 md:p-8 w-full border border-white/50 dark:border-white/[0.08]"
        >
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800/40">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Create Support Ticket
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Open a new customer inquiry in the CRM database.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Cancel and Go Back"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Customer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <div className={`rounded-xl transition-all duration-200 ${focusedField === 'customerName' ? 'gradient-border ring-2 ring-indigo-500/30' : ''}`}>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onFocus={() => setFocusedField('customerName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter customer's full name"
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] font-semibold text-rose-500 tracking-wide mt-0.5">
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Customer Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Customer Email <span className="text-rose-500">*</span>
                </label>
                <div className={`rounded-xl transition-all duration-200 ${focusedField === 'customerEmail' ? 'gradient-border ring-2 ring-indigo-500/30' : ''}`}>
                  <input
                    type="text"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onFocus={() => setFocusedField('customerEmail')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="name@company.com"
                    className="input-field"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.customerEmail && (
                  <p className="text-[11px] font-semibold text-rose-500 tracking-wide mt-0.5">
                    {errors.customerEmail}
                  </p>
                )}
              </div>

            </div>

            {/* Priority Control */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Priority Level <span className="text-rose-500">*</span>
              </label>
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 w-full sm:w-80">
                {['Low', 'Medium', 'High'].map((p) => {
                  const isActive = priority === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                        isActive
                          ? 'gradient-brand text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                      disabled={isSubmitting}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Subject line <span className="text-rose-500">*</span>
              </label>
              <div className={`rounded-xl transition-all duration-200 ${focusedField === 'subject' ? 'gradient-border ring-2 ring-indigo-500/30' : ''}`}>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Summarize the core support problem"
                  className="input-field"
                  disabled={isSubmitting}
                />
              </div>
              {errors.subject && (
                <p className="text-[11px] font-semibold text-rose-500 tracking-wide mt-0.5">
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Full Description <span className="text-rose-500">*</span>
              </label>
              <div className={`rounded-xl transition-all duration-200 ${focusedField === 'description' ? 'gradient-border ring-2 ring-indigo-500/30' : ''}`}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  placeholder="Provide comprehensive details of the customer issue..."
                  className="input-field resize-y"
                  disabled={isSubmitting}
                />
              </div>
              {errors.description && (
                <p className="text-[11px] font-semibold text-rose-500 tracking-wide mt-0.5">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/40">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-ghost text-xs md:text-sm font-semibold flex items-center"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <motion.button
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                type="submit"
                className="btn-primary text-xs md:text-sm font-semibold flex items-center gap-1.5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create Ticket</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  )
}
