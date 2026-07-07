# Especificación API - TaskFlow

## Autenticación
- POST /auth/register
  - Request: { "nombre", "correo", "contraseña" }
  - Responses: 201 (creado), 400, 409

- POST /auth/login
  - Request: { "correo", "contraseña" }
  - Responses: 200 (OK, token JWT), 400, 401

- POST /auth/logout
  - Header: Authorization: Bearer <token>
  - Responses: 204, 401

## Usuario
- GET /users/me
  - Header: Authorization
  - Response: 200 (datos del usuario), 401

## Tareas
- GET /tasks
  - Query params opcionales: búsqueda, estado, prioridad, fecha_inicio, fecha_fin, ordenar, dirección, page, limit
  - Header: Authorization
  - Response: 200 (lista paginada)

- GET /tasks/{id}
  - Header: Authorization
  - Response: 200 (tarea), 404

- POST /tasks
  - Header: Authorization
  - Body: { titulo, descripcion?, estado, prioridad, fecha_limite }
  - Validaciones: `titulo` obligatorio; `estado` y `prioridad` deben ser valores permitidos; `fecha_limite` fecha válida
  - Response: 201, 400

- PUT /tasks/{id}
  - Header: Authorization
  - Body: campos a actualizar
  - Reglas: solo propietario puede modificar
  - Response: 200, 400, 404, 403

- DELETE /tasks/{id}
  - Header: Authorization
  - Reglas: solo propietario puede eliminar
  - Response: 204, 404, 403

## Dashboard
- GET /dashboard
  - Header: Authorization
  - Response: 200
  - Payload: { total, pendientes, en_progreso, completadas, vencidas, porcentaje_completadas, proximas_por_vencer }

## Errores
- Errores devueltos en formato JSON: { "error": "mensaje" }
- No exponer detalles sensibles en mensajes de error.

## Seguridad
- Todos los endpoints (excepto register/login) requieren `Authorization: Bearer <token>`.
- Validar que los recursos pertenezcan al usuario autenticado.

## Notas de paginación
- Usar `page` y `limit` en `GET /tasks`. Devolver `total`, `page`, `limit`, `items`.

