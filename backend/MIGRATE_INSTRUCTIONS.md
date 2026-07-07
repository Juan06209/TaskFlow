# Instrucciones para configurar Prisma y migraciones

1. Instala las dependencias (en la carpeta `backend`):

```bash
npm install
```

2. Define la variable de entorno `DATABASE_URL` apuntando a tu base de datos PostgreSQL. Por ejemplo en `.env`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
```

3. Genera cliente Prisma y aplica migraciones:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Si no tienes PostgreSQL, puedes usar `docker-compose` para levantar uno y luego ejecutar las migraciones.
