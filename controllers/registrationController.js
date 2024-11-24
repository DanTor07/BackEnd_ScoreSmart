const Registro = require('../models/registration');
const bcrypt = require('bcrypt');

// GET: Obtener todos los registros
exports.getRegistros = async (req, res) => {
    try {
        const registros = await Registro.find();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
// GET: Obtener un registro por ID
exports.getRegistroById = async (req, res) => {
    try {
        const registro = await Registro.findById(req.params.id);
        if (!registro) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
=======
// GET: Obtener un solo registro
exports.getOneRegistro = async (req, res) => {
    const { id } = req.params
    try {
        const registro = await Registro.findById(id);
>>>>>>> fa9f944e520ab0f2ac05b68c1259de4b17557cf7
        res.status(200).json(registro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
<<<<<<< HEAD
};


=======
}
>>>>>>> fa9f944e520ab0f2ac05b68c1259de4b17557cf7
// POST: Crear un nuevo registro
exports.createRegistro = async (req, res) => {
    const registro = new Registro(req.body);
    try {
        const newRegistro = await registro.save();
        res.status(201).json(newRegistro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT: Actualizar información de un registro existente
exports.updateRegistro = async (req, res) => {
    const { contrasena } = req.body;  // La nueva contraseña (si es provista) en los datos de la solicitud

    try {
        // Si se envía una nueva contraseña, encriptarla antes de actualizar
        if (contrasena) {
            req.body.contrasena = await bcrypt.hash(contrasena, 10);
        }

        // Actualizar el registro en la base de datos
        const updatedRegistro = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedRegistro) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json(updatedRegistro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// DELETE: Eliminar un registro
exports.deleteRegistro = async (req, res) => {
    try {
        const deletedRegistro = await Registro.findByIdAndDelete(req.params.id);
        if (!deletedRegistro) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
