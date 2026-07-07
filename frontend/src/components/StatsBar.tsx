import React, { useEffect, useRef, useState } from 'react'

// Cuenta animada hacia el valor objetivo (respeta prefers-reduced-motion)
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number>()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      fromRef.current = target
    }
  }, [target, duration])

  return value
}

function StatCard({ label, target, suffix = '', danger = false }: any) {
  const value = useCountUp(target)
  return (
    <div className={`stat-card ${danger ? 'stat-card-danger' : ''}`}>
      <span className="stat-value">{value}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function StatsBar({ stats }: any) {
  if (!stats) return null

  return (
    <div className="stats-grid">
      <StatCard label="Total" target={stats.total} />
      <StatCard label="Pendientes" target={stats.pendientes} />
      <StatCard label="En progreso" target={stats.en_progreso} />
      <StatCard label="Completadas" target={stats.completadas} />
      <StatCard label="Vencidas" target={stats.vencidas} danger={stats.vencidas > 0} />
      <StatCard label="Completado" target={stats.porcentaje_completadas} suffix="%" />
    </div>
  )
}
