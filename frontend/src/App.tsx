import React, { useEffect, useState } from 'react'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  fetchTasks,
  fetchDashboard,
  createTask,
  updateTask,
  deleteTask,
  ApiError,
  TaskFilters as TaskFiltersType
} from './services/api'
import AuthForm from './components/AuthForm'
import StatsBar from './components/StatsBar'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'

const DEFAULT_FILTERS: TaskFiltersType = { busqueda: '', estado: '', prioridad: '', ordenar: 'fecha_creacion', direccion: 'desc' }

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('tf_token'))
  const [user, setUser] = useState<any>(() => {
    const raw = localStorage.getItem('tf_user')
    return raw ? JSON.parse(raw) : null
  })
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [tasks, setTasks] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [filters, setFilters] = useState<TaskFiltersType>(DEFAULT_FILTERS)
  const [editing, setEditing] = useState<any>(null)
  const [taskError, setTaskError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const endSession = (message?: string) => {
    localStorage.removeItem('tf_token')
    localStorage.removeItem('tf_user')
    setToken(null)
    setUser(null)
    setTasks([])
    setStats(null)
    setEditing(null)
    setNotice(message ?? null)
  }

  const withAuth = async (fn: () => Promise<any>) => {
    try {
      setTaskError(null)
      await fn()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        endSession('Tu sesión expiró, inicia sesión de nuevo')
      } else {
        setTaskError(err instanceof ApiError ? err.message : 'Error inesperado')
      }
    }
  }

  const loadTasks = async () => {
    const data = await fetchTasks(token!, filters)
    setTasks(data.items || [])
  }

  const loadStats = async () => {
    const data = await fetchDashboard(token!)
    setStats(data)
  }

  useEffect(() => {
    if (token) withAuth(loadStats)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    const timer = setTimeout(() => {
      withAuth(loadTasks).finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filters])

  const persistSession = (data: any) => {
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('tf_token', data.token)
    localStorage.setItem('tf_user', JSON.stringify(data.user))
  }

  const handleLogin = async ({ correo, contraseña }: any) => {
    try {
      const data = await apiLogin(correo, contraseña)
      setAuthError(null)
      setNotice(null)
      persistSession(data)
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : 'Error al iniciar sesión')
    }
  }

  const handleRegister = async ({ nombre, correo, contraseña }: any) => {
    try {
      await apiRegister(nombre, correo, contraseña)
      const data = await apiLogin(correo, contraseña)
      setAuthError(null)
      setNotice(null)
      persistSession(data)
    } catch (err) {
      setAuthError(err instanceof ApiError ? err.message : 'Error al crear la cuenta')
    }
  }

  const handleLogoutClick = async () => {
    if (token) {
      try {
        await apiLogout(token)
      } catch {
        /* ignore */
      }
    }
    endSession()
  }

  const handleCreate = (payload: any) => withAuth(async () => {
    await createTask(token!, payload)
    await Promise.all([loadTasks(), loadStats()])
  })

  const handleUpdate = (payload: any) => withAuth(async () => {
    await updateTask(token!, editing.id, payload)
    setEditing(null)
    await Promise.all([loadTasks(), loadStats()])
  })

  const handleDelete = (id: string) => withAuth(async () => {
    await deleteTask(token!, id)
    await Promise.all([loadTasks(), loadStats()])
  })

  if (!token) {
    return (
      <AuthForm
        mode={mode}
        onModeChange={(m: 'login' | 'register') => {
          setMode(m)
          setAuthError(null)
        }}
        onLogin={handleLogin}
        onRegister={handleRegister}
        notice={notice}
        error={authError}
      />
    )
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">✓</span>
          <span>TaskFlow</span>
        </div>
        <div className="navbar-actions">
          <span className="navbar-greeting">Hola, {user?.nombre?.split(' ')[0] || 'usuario'}</span>
          <button className="btn btn-ghost" onClick={handleLogoutClick}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container">
        <StatsBar stats={stats} />

        {taskError && (
          <div className="alert alert-error">
            {taskError}
            <button className="alert-close" onClick={() => setTaskError(null)}>
              ×
            </button>
          </div>
        )}

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <TaskForm
              key={editing?.id || 'new'}
              initial={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => setEditing(null)}
            />
          </aside>

          <section className="dashboard-main">
            <TaskFilters filters={filters} onChange={setFilters} />
            {loading ? <p className="loading-text">Cargando tareas…</p> : <TaskList items={tasks} onEdit={setEditing} onDelete={handleDelete} />}
          </section>
        </div>
      </main>
    </div>
  )
}
