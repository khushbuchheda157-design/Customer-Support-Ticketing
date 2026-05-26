import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            color: '#111827',
            fontSize: '14px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
            style: { borderLeft: '3px solid #10b981' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
            style: { borderLeft: '3px solid #f43f5e' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
