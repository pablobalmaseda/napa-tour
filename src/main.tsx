import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CompanionRemote } from './components/CompanionRemote.tsx'
import { AdminPage } from './components/AdminPage.tsx'

// Check whether the visitor navigated to the companion remote or admin URL
const isRemoteView = 
  window.location.pathname.startsWith('/remote') || 
  window.location.search.includes('view=remote') ||
  window.location.hash.startsWith('#remote');

const isAdminView =
  window.location.pathname.startsWith('/admin') ||
  window.location.search.includes('view=admin') ||
  window.location.hash.startsWith('#admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRemoteView ? <CompanionRemote /> : isAdminView ? <AdminPage /> : <App />}
  </StrictMode>,
)
