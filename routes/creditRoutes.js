const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/creditController');

router.post('/', creditoController.simularCredito);
router.get('/', creditoController.getSimulaciones);
router.get('/:id', creditoController.getSimulacionById);
router.put('/:id', creditoController.updateSimulacion);
router.delete('/:id', creditoController.deleteSimulacion);

module.exports = router;