const express = require('express');
const router = express.Router();
const registroController = require('../controllers/regUsers');

router.get('/', registroController.getRegistros);
router.post('/', registroController.createRegistro);
router.put('/:id', registroController.updateRegistro);
router.delete('/:id', registroController.deleteRegistro);
router.put('/:id/cambiar-contrasena', registroController.cambiarContrasena);


module.exports = router;