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

    const bcrypt = require('bcrypt');

    // Contraseña ingresada
    const contrasenaIngresada = "123"; // Cambia esto a lo que estás ingresando
    
    // Hash almacenado desde la base de datos
    const hashAlmacenado = "$2b$10$RRCgjLdn/osPmyMTcZIuH./XHkaqxRDkHdFaCukLXP2eI8QT8c.oy"; // Reemplaza esto con el hash real
    
    // Comparar
    const isMatch = await bcrypt.compare(contrasenaIngresada, hashAlmacenado);
    console.log('¿Contraseñas coinciden?', isMatch); // Esto debería ser true si todo está correcto
    

};
