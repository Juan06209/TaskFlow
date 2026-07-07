import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.userId!;
    const now = new Date();

    const [total, pendientes, en_progreso, completadas, vencidas, proximas_por_vencer] = await Promise.all([
      prisma.task.count({ where: { usuarioId: userId } }),
      prisma.task.count({ where: { usuarioId: userId, estado: 'pendiente' } }),
      prisma.task.count({ where: { usuarioId: userId, estado: 'en_progreso' } }),
      prisma.task.count({ where: { usuarioId: userId, estado: 'completada' } }),
      prisma.task.count({
        where: { usuarioId: userId, estado: { not: 'completada' }, fecha_limite: { lt: now } }
      }),
      prisma.task.findMany({
        where: { usuarioId: userId, estado: { not: 'completada' }, fecha_limite: { gte: now } },
        orderBy: { fecha_limite: 'asc' },
        take: 5
      })
    ]);

    const porcentaje_completadas = total === 0 ? 0 : Math.round((completadas / total) * 100);

    return res.json({ total, pendientes, en_progreso, completadas, vencidas, porcentaje_completadas, proximas_por_vencer });
  } catch (err) {
    next(err);
  }
});

export default router;
