import prisma from '../prisma'
import { Prisma } from '@prisma/client'

const ORDENABLES = ['titulo', 'fecha_limite', 'prioridad', 'estado', 'fecha_creacion'] as const
type Ordenable = typeof ORDENABLES[number]

export type TaskFilters = {
  busqueda?: string
  estado?: string
  prioridad?: string
  fecha_inicio?: string
  fecha_fin?: string
  ordenar?: string
  direccion?: string
  page?: string
  limit?: string
}

function parsePage(value: string | undefined) {
  const n = parseInt(value ?? '', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}

function parseLimit(value: string | undefined) {
  const n = parseInt(value ?? '', 10)
  if (!Number.isFinite(n) || n <= 0) return 10
  return Math.min(n, 100)
}

export async function listTasks(userId: string, filters: TaskFilters) {
  const page = parsePage(filters.page)
  const limit = parseLimit(filters.limit)

  const where: Prisma.TaskWhereInput = { usuarioId: userId }

  if (filters.estado) where.estado = filters.estado
  if (filters.prioridad) where.prioridad = filters.prioridad

  if (filters.busqueda) {
    where.OR = [
      { titulo: { contains: filters.busqueda, mode: 'insensitive' } },
      { descripcion: { contains: filters.busqueda, mode: 'insensitive' } }
    ]
  }

  if (filters.fecha_inicio || filters.fecha_fin) {
    where.fecha_limite = {}
    if (filters.fecha_inicio && !isNaN(Date.parse(filters.fecha_inicio))) {
      where.fecha_limite.gte = new Date(filters.fecha_inicio)
    }
    if (filters.fecha_fin && !isNaN(Date.parse(filters.fecha_fin))) {
      where.fecha_limite.lte = new Date(filters.fecha_fin)
    }
  }

  const ordenar: Ordenable = ORDENABLES.includes(filters.ordenar as Ordenable) ? (filters.ordenar as Ordenable) : 'fecha_creacion'
  const direccion = filters.direccion === 'asc' ? 'asc' : 'desc'

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [ordenar]: direccion },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.task.count({ where })
  ])

  return { items, total, page, limit }
}

export async function getTaskById(userId: string, id: string) {
  return prisma.task.findUnique({ where: { id } })
}

export async function createTask(userId: string, data: any) {
  return prisma.task.create({ data: {
    usuarioId: userId,
    titulo: data.titulo,
    descripcion: data.descripcion,
    estado: data.estado ?? 'pendiente',
    prioridad: data.prioridad ?? 'media',
    fecha_limite: data.fecha_limite ? new Date(data.fecha_limite) : null
  }})
}

export async function updateTask(userId: string, id: string, payload: any) {
  const t = await prisma.task.findUnique({ where: { id } })
  if (!t || t.usuarioId !== userId) return null
  return prisma.task.update({ where: { id }, data: {
    titulo: payload.titulo ?? t.titulo,
    descripcion: payload.descripcion ?? t.descripcion,
    estado: payload.estado ?? t.estado,
    prioridad: payload.prioridad ?? t.prioridad,
    fecha_limite: payload.fecha_limite ? new Date(payload.fecha_limite) : t.fecha_limite
  }})
}

export async function deleteTask(userId: string, id: string) {
  const t = await prisma.task.findUnique({ where: { id } })
  if (!t || t.usuarioId !== userId) return false
  await prisma.task.delete({ where: { id } })
  return true
}
