const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request(path: string, options: RequestInit, token?: string) {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> | undefined) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (options.body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.error || 'Error en la solicitud')
  return data
}

export async function login(correo: string, contraseña: string) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ correo, contraseña }) })
}

export async function register(nombre: string, correo: string, contraseña: string) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ nombre, correo, contraseña }) })
}

export async function logout(token: string) {
  return request('/auth/logout', { method: 'POST' }, token)
}

export type TaskFilters = {
  busqueda?: string
  estado?: string
  prioridad?: string
  ordenar?: string
  direccion?: string
}

export async function fetchTasks(token: string, filters: TaskFilters = {}) {
  const query = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const qs = query.toString()
  return request(`/tasks${qs ? `?${qs}` : ''}`, { method: 'GET' }, token)
}

export async function fetchDashboard(token: string) {
  return request('/dashboard', { method: 'GET' }, token)
}

export async function createTask(token: string, payload: any) {
  return request('/tasks', { method: 'POST', body: JSON.stringify(payload) }, token)
}

export async function updateTask(token: string, id: string, payload: any) {
  return request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token)
}

export async function deleteTask(token: string, id: string) {
  return request(`/tasks/${id}`, { method: 'DELETE' }, token)
}
