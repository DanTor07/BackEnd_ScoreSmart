const Registro = require('../models/registro');

// GET: Obtener todos los registros
exports.getRegistros = async (req, res) => {
    try {
        const registros = await Registro.find();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};