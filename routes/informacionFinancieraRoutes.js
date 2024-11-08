const express = require('express');
const router = express.Router();
const informacionFinancieraController = require('../controllers/informacionFinancieraController');

router.get('/', informacionFinancieraController.getInformacionFinanciera);
router.post('/', informacionFinancieraController.createInformacionFinanciera);
router.put('/:id', informacionFinancieraController.updateInformacionFinanciera);
router.delete('/:id', informacionFinancieraController.deleteInformacionFinanciera)

module.exports = router;
