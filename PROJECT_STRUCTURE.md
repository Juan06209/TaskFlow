# Estructura propuesta del repositorio - TaskFlow

/ (raíz)
- backend/
  - package.json
  - tsconfig.json
  - src/
    - index.ts (servidor)
    - app.ts (config de express)
    - routes/
    - controllers/
    - services/
    - models/ (ORM/queries)
    - middleware/
    - config/
- frontend/
  - package.json
  - tsconfig.json
  - src/
    - App.tsx
    - pages/
    - components/
    - hooks/
    - services/ (API client)
    - styles/
- infra/
  - Dockerfile.backend
  - Dockerfile.frontend
  - docker-compose.yml
- sql/
  - DATABASE_SCHEMA.sql
- docs/
  - API_SPEC.md
  - CRITERIOS_ACEPTACION.md
- .env.example
- README.md

Notas:
- Separar responsabilidades por capas en backend.
- Usar ORM ligero (knex/TypeORM/Prisma) según preferencia.
- Añadir scripts de npm para desarrollo, build y migraciones.

