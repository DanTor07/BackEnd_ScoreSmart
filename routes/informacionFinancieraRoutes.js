const express = require('express');
const router = express.Router();
const informacionFinancieraController = require('../controllers/informacionFinancieraController');

router.get('/', informacionFinancieraController.getInformacionFinanciera)

module.exports = router;
