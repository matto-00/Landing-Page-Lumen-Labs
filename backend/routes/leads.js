const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

const REQUIRED_FIELDS = [
  'whatsapp',
  'tipo_negocio',
  'rubro',
  'tamano_equipo',
  'etapa_crecimiento',
  'caos_operativo',
  'intento_previo',
  'puede_decidir',
];

router.post('/', async (req, res) => {
  const body = req.body;

  for (const field of REQUIRED_FIELDS) {
    const val = body[field];
    if (val === undefined || val === null || val === '') {
      return res.status(400).json({ success: false, error: `Campo requerido faltante: ${field}` });
    }
  }

  if (!Array.isArray(body.caos_operativo)) {
    return res.status(400).json({ success: false, error: 'caos_operativo debe ser un array' });
  }
  if (body.caos_operativo.length < 1 || body.caos_operativo.length > 2) {
    return res.status(400).json({ success: false, error: 'caos_operativo debe tener 1 o 2 elementos' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO leads_prereunion
        (nombre, negocio, email,
         whatsapp, tipo_negocio, rubro, rubro_otro, tamano_equipo,
         etapa_crecimiento, ingresos_mensuales, caos_operativo,
         intento_previo, puede_decidir)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id`,
      [
        body.nombre        || null,
        body.negocio       || null,
        body.email         || null,
        body.whatsapp,
        body.tipo_negocio,
        body.rubro,
        body.rubro_otro    || null,
        body.tamano_equipo,
        body.etapa_crecimiento,
        body.ingresos_mensuales || null,
        JSON.stringify(body.caos_operativo),
        body.intento_previo,
        body.puede_decidir,
      ]
    );

    return res.status(201).json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error('[POST /api/leads]', err.message);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;
