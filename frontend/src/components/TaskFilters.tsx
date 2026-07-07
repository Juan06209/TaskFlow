import React from 'react'

export default function TaskFilters({ filters, onChange }: any) {
  const update = (key: string, value: string) => onChange({ ...filters, [key]: value })

  return (
    <div className="filters-bar">
      <input
        className="filters-search"
        placeholder="Buscar por título o descripción…"
        value={filters.busqueda || ''}
        onChange={e => update('busqueda', e.target.value)}
      />
      <select value={filters.estado || ''} onChange={e => update('estado', e.target.value)}>
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="en_progreso">En progreso</option>
        <option value="completada">Completada</option>
      </select>
      <select value={filters.prioridad || ''} onChange={e => update('prioridad', e.target.value)}>
        <option value="">Toda prioridad</option>
        <option value="alta">Alta</option>
        <option value="media">Media</option>
        <option value="baja">Baja</option>
      </select>
      <select value={filters.ordenar || 'fecha_creacion'} onChange={e => update('ordenar', e.target.value)}>
        <option value="fecha_creacion">Más recientes</option>
        <option value="fecha_limite">Fecha límite</option>
        <option value="prioridad">Prioridad</option>
        <option value="titulo">Título</option>
      </select>
    </div>
  )
}
