const Registro = require('../models/registro');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// POST: Iniciar sesión
exports.inicio = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await Registro.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Obtener la información del usuario autenticado
exports.getUsuario = async (req, res) => {
    try {
        const usuario = await Registro.findById(req.user.id);  // req.user.id viene del token JWT decodificado
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Actualizar información del usuario autenticado
exports.updateUsuario = async (req, res) => {
    try {
        // Si se actualiza la contraseña, encriptarla
        if (req.body.contrasena) {
            req.body.contrasena = await bcrypt.hash(req.body.contrasena, 10);
        }

        const usuarioActualizado = await Registro.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE: Eliminar el usuario autenticado
exports.deleteUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await Registro.findByIdAndDelete(req.user.id);
        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
