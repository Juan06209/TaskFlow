import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validation/schemas';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// Límite estricto para endpoints sensibles: mitiga ataques de fuerza bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos, espera unos minutos antes de reintentar' }
});

function normalizePassword(req: Request, _res: Response, next: NextFunction) {
  if (req.body && req.body.contrasena !== undefined && req.body.contraseña === undefined) {
    req.body.contraseña = req.body.contrasena;
  }
  next();
}

router.post('/register', authLimiter, normalizePassword, validate(registerSchema), async (req, res, next) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const existing = await prisma.user.findUnique({ where: { correo } });
    if (existing) return res.status(409).json({ error: 'Correo ya registrado' });
    const hash = await bcrypt.hash(contraseña, 10);
    const user = await prisma.user.create({ data: { nombre, correo, contrasena: hash } });
    return res.status(201).json({ id: user.id, nombre: user.nombre, correo: user.correo, fecha_creacion: user.fecha_creacion });
  } catch (err) {
    next(err);
  }
});

router.post('/login', authLimiter, normalizePassword, validate(loginSchema), async (req, res, next) => {
  try {
    const { correo, contraseña } = req.body;
    const user = await prisma.user.findUnique({ where: { correo } });
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const ok = await bcrypt.compare(contraseña, user.contrasena);
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign({ sub: user.id, name: user.nombre }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo } });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  return res.status(204).send();
});

export default router;
