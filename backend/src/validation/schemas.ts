import { z } from 'zod';

export const estadoEnum = z.enum(['pendiente', 'en_progreso', 'completada']);
export const prioridadEnum = z.enum(['alta', 'media', 'baja']);

const fechaLimite = z
  .string()
  .refine((v) => !isNaN(Date.parse(v)), { message: 'fecha_limite inválida' });

export const registerSchema = z.object({
  nombre: z.string().trim().min(2, 'el nombre debe tener al menos 2 caracteres').max(80, 'nombre demasiado largo'),
  correo: z.string().trim().email('correo inválido').max(120, 'correo demasiado largo'),
  contraseña: z
    .string()
    .min(8, 'la contraseña debe tener al menos 8 caracteres')
    .max(72, 'la contraseña es demasiado larga')
    .regex(/[a-zA-Z]/, 'la contraseña debe incluir al menos una letra')
    .regex(/[0-9]/, 'la contraseña debe incluir al menos un número')
});

export const loginSchema = z.object({
  correo: z.string().trim().email('correo inválido'),
  contraseña: z.string().min(1, 'contraseña requerida')
});

export const taskCreateSchema = z.object({
  titulo: z.string().trim().min(1, 'titulo requerido').max(120, 'el título no puede superar 120 caracteres'),
  descripcion: z.string().trim().max(500, 'la descripción no puede superar 500 caracteres').optional(),
  estado: estadoEnum.optional(),
  prioridad: prioridadEnum.optional(),
  fecha_limite: fechaLimite.optional().nullable()
});

export const taskUpdateSchema = z.object({
  titulo: z.string().trim().min(1, 'titulo no puede estar vacío').max(120, 'el título no puede superar 120 caracteres').optional(),
  descripcion: z.string().trim().max(500, 'la descripción no puede superar 500 caracteres').optional(),
  estado: estadoEnum.optional(),
  prioridad: prioridadEnum.optional(),
  fecha_limite: fechaLimite.optional().nullable()
});
