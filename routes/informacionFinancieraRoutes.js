const express = require('express');
const router = express.Router();
const informacionFinancieraController = require('../controllers/informacionFinancieraController');

router.get('/', informacionFinancieraController.getInformacionFinanciera);
router.post('/', informacionFinancieraController.createInformacionFinanciera);
router.put('/:id/:usuario', informacionFinancieraController.somethingUpdate);
router.delete('/:id/:usuario', informacionFinancieraController.deleteInformacionFinanciera)

module.exports = router;
