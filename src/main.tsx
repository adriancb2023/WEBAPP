import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './ventana/Login'
import Home from './ventana/Home'
import { useState, useEffect } from 'react'

function MainApp() {
  const [logueado, setLogueado] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar si hay sesión guardada
  useEffect(() => {
    const checkSession = () => {
      const recordarSesion = localStorage.getItem('recordarSesion') === 'true'
      const email = localStorage.getItem('recordarEmail')
      
      if (recordarSesion && email) {
        // Simular verificación de sesión
        setTimeout(() => {
          setLogueado(true)
          setLoading(false)
        }, 1000)
      } else {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}>
        <div style={{ fontSize: '48px' }}>📋</div>
        <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
      </div>
    )
  }

  return logueado ? <Home /> : <Login onLogin={() => setLogueado(true)} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)