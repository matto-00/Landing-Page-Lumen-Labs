CREATE TABLE IF NOT EXISTS leads_prereunion (
  id                  SERIAL PRIMARY KEY,
  whatsapp            TEXT        NOT NULL,
  tipo_negocio        TEXT        NOT NULL,
  rubro               TEXT        NOT NULL,
  rubro_otro          TEXT,
  tamano_equipo       TEXT        NOT NULL,
  etapa_crecimiento   TEXT        NOT NULL,
  ingresos_mensuales  TEXT,
  caos_operativo      JSONB       NOT NULL,
  intento_previo      TEXT        NOT NULL,
  puede_decidir       TEXT        NOT NULL,
  created_at          TIMESTAMP   NOT NULL DEFAULT NOW()
);
