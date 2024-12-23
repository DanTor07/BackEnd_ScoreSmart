const express = require('express');
const router = express.Router();
const inicioController = require('../controllers/loginController'); 

router.post('/', inicioController.inicio);
router.get('/logs/:usuarioId', inicioController.getLoginLogs);
router.delete('/logs/:id', inicioController.deleteLoginLog);


module.exports = router;
