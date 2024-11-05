const Registro = require('../models/registro');
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
    try {
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


// registroController.js
exports.cambiarContrasena = async (req, res) => {
    const { id } = req.params;  // El ID del usuario se pasa en la URL
    const { contrasenaActual, contrasenaNueva } = req.body;  // Contraseña actual y nueva

    try {
        // Buscar el registro por el ID
        const usuario = await Registro.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña actual coincide con la almacenada
        const isMatch = await bcrypt.compare(contrasenaActual, usuario.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
        }

        // Validar la nueva contraseña (opcional)
        if (contrasenaNueva.length < 6) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Encriptar la nueva contraseña
        const contrasenaEncriptada = await bcrypt.hash(contrasenaNueva, 10);

        // Actualizar la contraseña
        usuario.contrasena = contrasenaEncriptada;

        // Guardar los cambios en la base de datos
        await usuario.save();
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
