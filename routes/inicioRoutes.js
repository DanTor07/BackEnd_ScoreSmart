const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/inicioController');
router.post('/', inicioController.inicio);

module.exports = router;
