const express = require('express');
const router = express.Router();
const inicioControllerController = require('../controllers/inicioController');


router.post('/', inicioController.inicio);

module.exports = router;
