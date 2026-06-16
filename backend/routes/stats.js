const express = require('express');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [
      totalResult,
      porEstado,
      porTipoNegocio,
      porTamanoEquipo,
      porEtapaCrecimiento,
      porRubro,
      porPuedeDecidir,
      porIngresos,
      porMes,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM leads_prereunion'),
      pool.query('SELECT estado, COUNT(*) as count FROM leads_prereunion GROUP BY estado ORDER BY count DESC'),
      pool.query('SELECT tipo_negocio, COUNT(*) as count FROM leads_prereunion GROUP BY tipo_negocio ORDER BY count DESC'),
      pool.query('SELECT tamano_equipo, COUNT(*) as count FROM leads_prereunion GROUP BY tamano_equipo ORDER BY count DESC'),
      pool.query('SELECT etapa_crecimiento, COUNT(*) as count FROM leads_prereunion GROUP BY etapa_crecimiento ORDER BY count DESC'),
      pool.query('SELECT rubro, COUNT(*) as count FROM leads_prereunion GROUP BY rubro ORDER BY count DESC LIMIT 8'),
      pool.query('SELECT puede_decidir, COUNT(*) as count FROM leads_prereunion GROUP BY puede_decidir'),
      pool.query('SELECT ingresos_mensuales, COUNT(*) as count FROM leads_prereunion WHERE ingresos_mensuales IS NOT NULL GROUP BY ingresos_mensuales ORDER BY count DESC'),
      pool.query(`SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon YYYY') as mes, COUNT(*) as count FROM leads_prereunion WHERE created_at >= NOW() - INTERVAL '6 months' GROUP BY DATE_TRUNC('month', created_at) ORDER BY DATE_TRUNC('month', created_at) ASC`),
    ]);

    res.json({
      success: true,
      stats: {
        total: parseInt(totalResult.rows[0].total),
        por_estado:            porEstado.rows,
        por_tipo_negocio:      porTipoNegocio.rows,
        por_tamano_equipo:     porTamanoEquipo.rows,
        por_etapa_crecimiento: porEtapaCrecimiento.rows,
        por_rubro:             porRubro.rows,
        por_puede_decidir:     porPuedeDecidir.rows,
        por_ingresos:          porIngresos.rows,
        por_mes:               porMes.rows,
      },
    });
  } catch (err) {
    console.error('[GET /api/stats]', err.message);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

module.exports = router;
