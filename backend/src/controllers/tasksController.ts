import { Request, Response } from 'express'
import * as service from '../services/tasksService'
import { asyncHandler } from '../utils/asyncHandler'

export const list = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const { busqueda, estado, prioridad, fecha_inicio, fecha_fin, ordenar, direccion, page, limit } = req.query as Record<string, string | undefined>
  const result = await service.listTasks(userId, { busqueda, estado, prioridad, fecha_inicio, fecha_fin, ordenar, direccion, page, limit })
  return res.json(result)
})

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const t = await service.getTaskById(userId, req.params.id)
  if (!t || t.usuarioId !== userId) return res.status(404).json({ error: 'Tarea no encontrada' })
  return res.json(t)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const created = await service.createTask(userId, req.body)
  return res.status(201).json(created)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const updated = await service.updateTask(userId, req.params.id, req.body)
  if (!updated) return res.status(404).json({ error: 'Tarea no encontrada o no autorizado' })
  return res.json(updated)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!
  const ok = await service.deleteTask(userId, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Tarea no encontrada o no autorizado' })
  return res.status(204).send()
})
