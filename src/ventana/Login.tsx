import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Aurora from '../componentes/Aurora'
import '../App.css'

const supabaseUrl = 'https://qarctnyssctoosibzqik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmN0bnlzc2N0b29zaWJ6cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjgyNjAsImV4cCI6MjA2NjAwNDI2MH0.8ypxqQY8ONP2hJzYyeaN7L9GK07DGfSekqAU_4ARkOw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('¡Login exitoso!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      <form onSubmit={handleLogin} style={{
        background: 'rgba(20, 20, 40, 0.55)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        borderRadius: 24,
        border: '1.5px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        minWidth: 340,
        maxWidth: 360,
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{ color: '#fff', textAlign: 'center', fontWeight: 700, letterSpacing: 1 }}>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 14, borderRadius: 10, border: 'none', fontSize: 16, background: 'rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontWeight: 500, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 14, borderRadius: 10, border: 'none', fontSize: 16, background: 'rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontWeight: 500, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)' }}
        />
        <button type="submit" disabled={loading} style={{ padding: 14, borderRadius: 10, fontWeight: 'bold', fontSize: 17, background: 'linear-gradient(90deg, #3A29FF 0%, #FF94B4 100%)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(58,41,255,0.15)', transition: 'background 0.2s' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {message && <div style={{ color: '#fff', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
      </form>
    </div>
  )
}

export default App
