-- Esquema inicial para PostgreSQL

CREATE TYPE task_state AS ENUM ('pendiente', 'en_progreso', 'completada');
CREATE TYPE task_priority AS ENUM ('alta', 'media', 'baja');

CREATE TABLE "users" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  contraseña TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  estado task_state NOT NULL DEFAULT 'pendiente',
  prioridad task_priority NOT NULL DEFAULT 'media',
  fecha_limite DATE,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_usuario_id ON tasks(usuario_id);
CREATE INDEX idx_tasks_estado ON tasks(estado);
CREATE INDEX idx_tasks_prioridad ON tasks(prioridad);
CREATE INDEX idx_tasks_fecha_limite ON tasks(fecha_limite);

-- Trigger sugerido para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

