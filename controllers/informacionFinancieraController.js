const fs = require('fs').promises;
const path = require('path');
const informacionFinancieraSchema = require('../models/informacionFinanciera');

exports.getInformacionFinanciera = async (_, res) => {
    try {
        const informacionFinanciera = await informacionFinancieraSchema.find();
        res.status(200).json(informacionFinanciera)
    } catch (error) {
        res.status(422).json({ error: "Error al obtener la informacion financiera del usuario"})
    }
};
