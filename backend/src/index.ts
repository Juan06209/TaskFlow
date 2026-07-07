import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import dashboardRoutes from './routes/dashboard';

const app = express();

// Confía en el primer proxy (necesario para que el rate-limit lea la IP real detrás de Docker/nginx)
app.set('trust proxy', 1);

// Cabeceras de seguridad (XSS, clickjacking, sniffing, etc.)
app.use(helmet());

// CORS restringido a los orígenes permitidos (configurable por env)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite herramientas sin origin (curl, health checks) y los orígenes en la lista blanca
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origen no permitido por CORS'));
    }
  })
);

// Límite de tamaño de payload para mitigar abusos
app.use(express.json({ limit: '100kb' }));

// Límite general de peticiones por IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' }
});
app.use(generalLimiter);

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err && err.message === 'Origen no permitido por CORS') {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
