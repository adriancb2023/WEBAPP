import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Aurora from '../componentes/Aurora'
import '../App.css'

const supabaseUrl = 'https://qarctnyssctoosibzqik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmN0bnlzc2N0b29zaWJ6cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjgyNjAsImV4cCI6MjA2NjAwNDI2MH0.8ypxqQY8ONP2hJzYyeaN7L9GK07DGfSekqAU_4ARkOw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface LoginProps {
  onLogin?: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [modoOscuro, setModoOscuro] = useState(false)

  const bgColor = modoOscuro ? '#111' : 'linear-gradient(135deg, rgb(243, 246, 250) 0%, #213547 100%)'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('¡Login exitoso!')
      if (onLogin) onLogin()
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor, position: 'relative', zIndex: 1 }}>
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      <form
        onSubmit={handleLogin}
        style={{
          background: 'rgba(20, 20, 40, 0.55)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          borderRadius: 24,
          border: '1.5px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          minWidth: 0,
          maxWidth: 98 * 1 + 'vw',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ color: '#fff', textAlign: 'center', fontWeight: 700, letterSpacing: 1, fontSize: 22, margin: 0 }}>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 16, borderRadius: 12, border: 'none', fontSize: 17, background: 'rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontWeight: 500, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)', marginTop: 8, width: '100%', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 16, borderRadius: 12, border: 'none', fontSize: 17, background: 'rgba(255,255,255,0.12)', color: '#fff', outline: 'none', fontWeight: 500, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)', marginTop: 8, width: '100%', boxSizing: 'border-box' }}
        />
        <button type="submit" disabled={loading} style={{ padding: 16, borderRadius: 12, fontWeight: 'bold', fontSize: 18, background: 'linear-gradient(90deg, #3A29FF 0%, #FF94B4 100%)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px 0 rgba(58,41,255,0.15)', transition: 'background 0.2s', marginTop: 8, width: '100%' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {message && <div style={{ color: '#fff', textAlign: 'center', fontWeight: 500 }}>{message}</div>}
      </form>
    </div>
  )
}

export default Login
