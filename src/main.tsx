import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CompanionRemote } from './components/CompanionRemote.tsx'

// Check whether the visitor navigated to the companion remote URL
const isRemoteView = 
  window.location.pathname.startsWith('/remote') || 
  window.location.search.includes('view=remote') ||
  window.location.hash.startsWith('#remote');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRemoteView ? <CompanionRemote /> : <App />}
  </StrictMode>,
)
