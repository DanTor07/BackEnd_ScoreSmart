const Registro = require('../models/registro');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// POST: Iniciar sesión
exports.inicio = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // Buscar el usuario por correo
        const usuario = await Registro.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token de autenticación
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
