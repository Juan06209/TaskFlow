// Reglas de validación del frontend, alineadas con el backend (zod).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateNombre(value: string): string | null {
  const v = value.trim()
  if (v.length < 2) return 'El nombre debe tener al menos 2 caracteres'
  if (v.length > 80) return 'El nombre es demasiado largo'
  return null
}

export function validateCorreo(value: string): string | null {
  const v = value.trim()
  if (!v) return 'El correo es obligatorio'
  if (!EMAIL_RE.test(v)) return 'Correo inválido'
  if (v.length > 120) return 'El correo es demasiado largo'
  return null
}

// Validación de contraseña para el registro (estricta)
export function validatePasswordStrict(value: string): string | null {
  if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (value.length > 72) return 'La contraseña es demasiado larga'
  if (!/[a-zA-Z]/.test(value)) return 'Debe incluir al menos una letra'
  if (!/[0-9]/.test(value)) return 'Debe incluir al menos un número'
  return null
}

// Validación de contraseña para el login (solo requerida)
export function validatePasswordRequired(value: string): string | null {
  if (!value) return 'La contraseña es obligatoria'
  return null
}

export type PasswordStrength = {
  score: number // 0..4
  label: string
  level: 'weak' | 'fair' | 'good' | 'strong'
}

export function passwordStrength(value: string): PasswordStrength {
  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 12) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/[0-9]/.test(value)) score++
  if (/[^a-zA-Z0-9]/.test(value)) score++

  score = Math.min(score, 4)

  const map: Record<number, PasswordStrength> = {
    0: { score: 0, label: 'Muy débil', level: 'weak' },
    1: { score: 1, label: 'Débil', level: 'weak' },
    2: { score: 2, label: 'Aceptable', level: 'fair' },
    3: { score: 3, label: 'Buena', level: 'good' },
    4: { score: 4, label: 'Fuerte', level: 'strong' }
  }
  return map[score]
}
