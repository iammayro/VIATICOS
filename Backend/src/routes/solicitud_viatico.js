const express = require('express');
const solicitud_viaticoCtl = require('../controllers/solicitud_viatico');

const router = express.Router();

router.post('/', solicitud_viaticoCtl.insert);
router.get('/', solicitud_viaticoCtl.selectAll);
router.get('/:id', solicitud_viaticoCtl.select);
router.put('/', solicitud_viaticoCtl.update);
router.delete('/', solicitud_viaticoCtl.delete);

// Rutas extras del controlador como archivos, etc.

module.exports = router;