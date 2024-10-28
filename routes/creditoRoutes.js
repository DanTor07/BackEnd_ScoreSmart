const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/creditoController');

router.post('/simulacion', creditoController.simularCredito);

module.exports = router;
