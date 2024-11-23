const express = require('express');
const router = express.Router();
const registroController = require('../controllers/regUsers');

router.get('/', registroController.getRegistros);
router.get('/:id', registroController.getOneRegistro);
router.post('/', registroController.createRegistro);
router.put('/:id', registroController.updateRegistro);
router.delete('/:id', registroController.deleteRegistro);


module.exports = router;
