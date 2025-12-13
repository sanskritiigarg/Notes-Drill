import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#151414',
            color: '#f0f5f5',
            border: '1px solid rgba(15,130,140,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 8px 30px rgba(15,130,140,0.25)',
          },
          success: {
            iconTheme: {
              primary: '#78B9B5',
              secondary: '#151414',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#151414',
            },
          },
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>
);
