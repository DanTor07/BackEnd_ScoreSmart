const express = require('express');
const router = express.Router();
const TasasYPuntajeController = require('../controllers/scoreAndRatesRoutesController');

router.get('/score', TasasYPuntajeController.getScore);
router.get('/rates', TasasYPuntajeController.getRates);

module.exports = router;