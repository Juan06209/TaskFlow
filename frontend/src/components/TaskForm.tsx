import React, { useState } from 'react'

export default function TaskForm({ initial, onSubmit, onCancel }: any) {
  const [titulo, setTitulo] = useState(initial?.titulo || '')
  const [descripcion, setDescripcion] = useState(initial?.descripcion || '')
  const [estado, setEstado] = useState(initial?.estado || 'pendiente')
  const [prioridad, setPrioridad] = useState(initial?.prioridad || 'media')
  const [fecha_limite, setFechaLimite] = useState(initial?.fecha_limite ? initial.fecha_limite.slice(0, 10) : '')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ titulo, descripcion, estado, prioridad, fecha_limite: fecha_limite || undefined })
      if (!initial) {
        setTitulo('')
        setDescripcion('')
        setEstado('pendiente')
        setPrioridad('media')
        setFechaLimite('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h3 className="card-title">{initial ? 'Editar tarea' : 'Nueva tarea'}</h3>

      <div className="field">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="¿Qué hay que hacer?"
          maxLength={120}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Detalles opcionales…"
          maxLength={500}
        />
        <span className={`char-counter ${descripcion.length >= 450 ? 'char-counter-warn' : ''}`}>
          {descripcion.length}/500
        </span>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="estado">Estado</label>
          <select id="estado" value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="prioridad">Prioridad</label>
          <select id="prioridad" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="fecha_limite">Fecha límite</label>
        <input id="fecha_limite" type="date" value={fecha_limite} onChange={e => setFechaLimite(e.target.value)} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
        {initial && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
