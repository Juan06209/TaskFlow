import React, { useMemo, useState } from 'react'
import {
  validateNombre,
  validateCorreo,
  validatePasswordStrict,
  validatePasswordRequired,
  passwordStrength
} from '../utils/validation'

type Mode = 'login' | 'register'
type Field = 'nombre' | 'correo' | 'contraseña'

export default function AuthForm({ mode, onModeChange, onLogin, onRegister, notice, error }: any) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<Field, boolean>>({ nombre: false, correo: false, contraseña: false })

  const errors = useMemo(() => {
    const e: Partial<Record<Field, string | null>> = {}
    if (mode === 'register') e.nombre = validateNombre(nombre)
    e.correo = validateCorreo(correo)
    e.contraseña = mode === 'register' ? validatePasswordStrict(contraseña) : validatePasswordRequired(contraseña)
    return e
  }, [mode, nombre, correo, contraseña])

  const strength = useMemo(() => passwordStrength(contraseña), [contraseña])
  const isValid = Object.values(errors).every(err => !err)

  const markTouched = (field: Field) => setTouched(t => ({ ...t, [field]: true }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ nombre: true, correo: true, contraseña: true })
    if (!isValid) return
    setSubmitting(true)
    try {
      if (mode === 'login') await onLogin({ correo: correo.trim(), contraseña })
      else await onRegister({ nombre: nombre.trim(), correo: correo.trim(), contraseña })
    } finally {
      setSubmitting(false)
    }
  }

  const changeMode = (m: Mode) => {
    setContraseña('')
    setTouched({ nombre: false, correo: false, contraseña: false })
    onModeChange(m)
  }

  const showErr = (field: Field) => touched[field] && errors[field]

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />
      <div className="auth-card">
        <div className="auth-brand">
          <span className="navbar-logo">✓</span>
          <h1>TaskFlow</h1>
        </div>
        <p className="auth-subtitle">Organiza tus tareas, a tu manera.</p>

        <div className="tabs">
          <button type="button" className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => changeMode('login')}>
            Iniciar sesión
          </button>
          <button type="button" className={`tab ${mode === 'register' ? 'active' : ''}`} onClick={() => changeMode('register')}>
            Crear cuenta
          </button>
        </div>

        {notice && <div className="alert alert-info">{notice}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onBlur={() => markTouched('nombre')}
                className={showErr('nombre') ? 'input-error' : ''}
                placeholder="Tu nombre"
                autoComplete="name"
              />
              {showErr('nombre') && <span className="field-error">{errors.nombre}</span>}
            </div>
          )}

          <div className="field">
            <label htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              onBlur={() => markTouched('correo')}
              className={showErr('correo') ? 'input-error' : ''}
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            {showErr('correo') && <span className="field-error">{errors.correo}</span>}
          </div>

          <div className="field">
            <label htmlFor="contraseña">Contraseña</label>
            <div className="input-group">
              <input
                id="contraseña"
                type={showPassword ? 'text' : 'password'}
                value={contraseña}
                onChange={e => setContraseña(e.target.value)}
                onBlur={() => markTouched('contraseña')}
                className={showErr('contraseña') ? 'input-error' : ''}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="input-addon"
                onClick={() => setShowPassword(s => !s)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {showErr('contraseña') && <span className="field-error">{errors.contraseña}</span>}

            {mode === 'register' && contraseña.length > 0 && (
              <div className="strength">
                <div className="strength-bars">
                  {[0, 1, 2, 3].map(i => (
                    <span key={i} className={`strength-bar ${i < strength.score ? `strength-${strength.level}` : ''}`} />
                  ))}
                </div>
                <span className={`strength-label strength-text-${strength.level}`}>{strength.label}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Un momento…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
