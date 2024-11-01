const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicioController'); // Asegúrate de que este nombre coincide

router.post('/', inicioController.inicio);

module.exports = router;
