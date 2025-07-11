import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Aurora from '../componentes/Aurora'
import { useResponsive } from '../hooks/useResponsive'
import React from 'react'

const supabaseUrl = 'https://qarctnyssctoosibzqik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmN0bnlzc2N0b29zaWJ6cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjgyNjAsImV4cCI6MjA2NjAwNDI2MH0.8ypxqQY8ONP2hJzYyeaN7L9GK07DGfSekqAU_4ARkOw'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface LoginProps {
  onLogin?: () => void;
}

function Login({ onLogin }: LoginProps) {
  const { isMobile } = useResponsive();
  const [email, setEmail] = useState(() => localStorage.getItem('recordarEmail') || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [recordar, setRecordar] = useState(() => localStorage.getItem('recordarSesion') === 'true')
  const [showPassword, setShowPassword] = useState(false)

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
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('¡Login exitoso!')
      if (onLogin) onLogin()
    }
    setLoading(false)
  }

  const handleQuickLogin = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ 
      email: 'root@root.com', 
      password: 'root' 
    });
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('¡Login rápido exitoso!');
      if (onLogin) onLogin();
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      padding: isMobile ? 'var(--spacing-md)' : 'var(--spacing-xl)',
    }}>
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      
      <form
        onSubmit={handleLogin}
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--border-radius-large)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: isMobile ? 'var(--spacing-lg)' : 'var(--spacing-xl)',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: 'var(--spacing-sm)',
            background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            📋
          </div>
          <h1 style={{ 
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 'var(--spacing-xs)',
          }}>
            Bienvenido
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '16px',
            margin: 0,
          }}>
            Gestiona tus proyectos de forma inteligente
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius)',
                border: '2px solid var(--border-color)',
                fontSize: '16px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  paddingRight: '50px',
                  borderRadius: 'var(--border-radius)',
                  border: '2px solid var(--border-color)',
                  fontSize: '16px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={recordar}
              onChange={e => setRecordar(e.target.checked)}
              style={{ 
                accentColor: 'var(--primary-color)',
                width: '18px', 
                height: '18px',
                cursor: 'pointer',
              }}
            />
            Recordar sesión
          </label>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              fontSize: '16px',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-sm)' }}>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                Entrando...
              </div>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <div style={{ 
            textAlign: 'center', 
            margin: 'var(--spacing-md) 0',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}>
            o
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              border: '2px solid var(--primary-color)',
              background: 'transparent',
              color: 'var(--primary-color)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'var(--primary-color)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--primary-color)';
              }
            }}
          >
            🚀 Acceso rápido (Demo)
          </button>

          {message && (
            <div style={{ 
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius)',
              background: message.includes('Error') ? 'var(--error-color)' : 'var(--success-color)',
              color: 'white',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login