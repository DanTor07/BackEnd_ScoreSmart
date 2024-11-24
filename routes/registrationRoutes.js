const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registrationController');

router.get('/', registroController.getRegistros);
router.post('/', registroController.createRegistro);
router.put('/:id', registroController.updateRegistro);
router.delete('/:id', registroController.deleteRegistro);
router.get('/:id', registroController.getRegistroById);


module.exports = router;
