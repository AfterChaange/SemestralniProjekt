import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import User from './User.tsx'

const path = window.location.pathname

let Component
if (path === '/user') {
  Component = User
} else {
  Component = App
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Component />
  </StrictMode>,
)
