import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './ventana/Login'
import Home from './ventana/Home'
import { useState } from 'react'

function MainApp() {
  // Simulación de login para demo
  const [logueado, setLogueado] = useState(false)

  return logueado ? <Home /> : <Login onLogin={() => setLogueado(true)} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
