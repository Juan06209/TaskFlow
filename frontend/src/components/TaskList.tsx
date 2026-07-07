import React from 'react'

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada'
}

const PRIORIDAD_LABEL: Record<string, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja'
}

function formatDate(value?: string) {
  if (!value) return null
  return new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function TaskList({ items, onDelete, onEdit }: any) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🗒️</div>
        <p>No hay tareas que coincidan con tu búsqueda.</p>
      </div>
    )
  }

  return (
    <div className="task-grid">
      {items.map((t: any) => {
        const overdue = t.fecha_limite && t.estado !== 'completada' && new Date(t.fecha_limite) < new Date()
        return (
          <div key={t.id} className={`task-card prio-${t.prioridad} estado-${t.estado}`}>
            <div className="task-card-header">
              <h4 className="task-title">{t.titulo}</h4>
              <div className="task-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit && onEdit(t)}>
                  Editar
                </button>
                <button
                  className="btn btn-danger-ghost btn-sm"
                  onClick={() => { if (onDelete && window.confirm('¿Eliminar esta tarea?')) onDelete(t.id) }}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {t.descripcion && <p className="task-description">{t.descripcion}</p>}

            <div className="task-meta">
              <span className={`badge badge-estado-${t.estado}`}>{ESTADO_LABEL[t.estado] || t.estado}</span>
              <span className={`badge badge-prioridad-${t.prioridad}`}>{PRIORIDAD_LABEL[t.prioridad] || t.prioridad}</span>
              {t.fecha_limite && (
                <span className={`task-due ${overdue ? 'overdue' : ''}`}>
                  {overdue ? 'Venció el ' : 'Vence el '}
                  {formatDate(t.fecha_limite)}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
