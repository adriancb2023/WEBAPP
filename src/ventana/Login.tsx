import { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'
import React from 'react'
import Register from './Register'

interface LoginProps {
  onLogin?: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState(() => localStorage.getItem('recordarEmail') || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [modoOscuro] = useState(true)
  const [recordar, setRecordar] = useState(() => localStorage.getItem('recordarSesion') === 'true')
  const [mostrarRegistro, setMostrarRegistro] = useState(false)

  const bgColor = 'linear-gradient(135deg, #181824 0%, #23243a 100%)'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (recordar) {
      localStorage.setItem('recordarEmail', email)
      localStorage.setItem('recordarSesion', 'true')
    } else {
      localStorage.removeItem('recordarEmail')
      localStorage.removeItem('recordarSesion')
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('Error: ' + error.message)
      setLoading(false)
      return
    }
    const { user } = data
    if (user) {
      setMessage('¡Login exitoso!')
      if (onLogin) onLogin()
    } else {
      setMessage('No se pudo obtener el usuario.')
    }
    setLoading(false)
  }

  if (mostrarRegistro) {
    return <Register onRegister={() => setMostrarRegistro(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor, position: 'relative', zIndex: 1, fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      <style>{`
        .login-card {
          width: 100%;
          max-width: 380px;
          background: rgba(30,32,48,0.92);
          border-radius: 28px;
          box-shadow: 0 0 24px 0 #3A29FF, 0 0 48px 0 #FF94B4;
          padding: 38px 20px 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin: 0 auto;
          backdrop-filter: blur(18px) saturate(1.2);
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          position: relative;
          animation: cardIn 0.7s cubic-bezier(.77,0,.18,1) 1;
        }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 600px) {
          .login-card {
            max-width: 99vw;
            padding: 18px 2vw 18px 2vw;
            border-radius: 0;
            min-height: 100vh;
            box-shadow: none;
            border: none;
          }
        }
        .campo-flotante {
          position: relative;
          width: 100%;
        }
        .campo-flotante label {
          position: absolute;
          left: 20px;
          top: 20px;
          color: #b6b6d6;
          font-size: 17px;
          font-weight: 500;
          pointer-events: none;
          opacity: 1;
          transition: all 0.18s;
          text-shadow: 0 2px 8px rgba(30,32,48,0.10);
        }
        .campo-flotante input:focus + label,
        .campo-flotante input:not(:placeholder-shown) + label {
          opacity: 0;
          transform: translateY(-8px) scale(0.95);
        }
        .campo-flotante input {
          padding: 20px 20px 20px 20px;
          border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.10);
          font-size: 18px;
          background: rgba(40,42,60,0.85);
          color: #fff;
          outline: none;
          font-weight: 500;
          box-shadow: 0 2px 12px 0 rgba(30,32,48,0.10);
          margin-top: 10px;
          width: 100%;
          box-sizing: border-box;
          transition: border 0.18s, background 0.18s, box-shadow 0.18s;
          backdrop-filter: blur(2px);
        }
        .campo-flotante input:focus {
          border: 1.5px solid #FF94B4;
          background: #23243a;
          box-shadow: 0 2px 16px 0 rgba(255,148,180,0.13);
        }
        .login-btn {
          padding: 20px;
          border-radius: 16px;
          font-weight: bold;
          font-size: 19px;
          background: linear-gradient(90deg, #3A29FF 0%, #FF94B4 100%);
          color: #fff;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 16px 0 rgba(58,41,255,0.18);
          transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
          margin-top: 8px;
          width: 100%;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }
        .login-btn:active {
          transform: scale(0.97);
          box-shadow: 0 1px 6px 0 rgba(58,41,255,0.10);
        }
        .login-btn::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.12);
          border-radius: 100%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
          z-index: 0;
        }
        .login-btn:active::after {
          width: 180%;
          height: 400%;
        }
        .alt-btn {
          background: none;
          color: #b6b6d6;
          border: none;
          font-size: 16px;
          text-decoration: underline;
          cursor: pointer;
          margin-top: 0;
          padding: 0;
          opacity: 0.85;
          transition: opacity 0.18s;
        }
        .alt-btn:hover {
          opacity: 1;
        }
        .login-message {
          color: #fff;
          background: linear-gradient(90deg, #FF3232 0%, #FF94B4 100%);
          border-radius: 10px;
          padding: 10px 0;
          text-align: center;
          font-weight: 500;
          font-size: 15px;
          box-shadow: 0 2px 8px 0 rgba(255,50,50,0.10);
          margin-top: 8px;
        }
        .login-checkbox {
          color: #b6b6d6;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 0;
          opacity: 0.85;
        }
        .login-checkbox input {
          accent-color: #FF94B4;
          width: 18px;
          height: 18px;
        }
      `}</style>
      <form className="login-card" onSubmit={handleLogin}>
        <div className="campo-flotante">
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
          <label>Correo electrónico</label>
        </div>
        <div className="campo-flotante">
          <input
            type="password"
            placeholder=" "
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <label>Contraseña</label>
        </div>
        <label className="login-checkbox">
          <input
            type="checkbox"
            checked={recordar}
            onChange={e => setRecordar(e.target.checked)}
          />
          Recordar sesión
        </label>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <button
          type="button"
          className="alt-btn"
          onClick={() => setMostrarRegistro(true)}
        >
          ¿No tienes cuenta? Regístrate
        </button>
        {message && <div className="login-message">{message}</div>}
      </form>
    </div>
  )
}

export default Login
