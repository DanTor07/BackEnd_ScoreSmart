const Registro = require('../models/registration');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const LoginLog = require('../models/loginlogs');

// POST: Iniciar sesión
exports.inicio = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await Registro.findOne({ correo });
        if (!usuario) {
            await registrarInicioSesion(null, false, req.ip);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log('Hash almacenado:', usuario.contrasena);
        console.log('Contraseña ingresada:', contrasena);

        // Compara la contraseña ingresada con el hash en la base de datos
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
        console.log('¿Contraseñas coinciden?', isMatch);

        if (!isMatch) {
            await registrarInicioSesion(usuario._id, false, req.ip);
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await registrarInicioSesion(usuario._id, true, req.ip);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para registrar cada intento de inicio de sesión
async function registrarInicioSesion(usuarioId, exito, ip) {
    const nuevoLog = new LoginLog({
        usuarioId,
        exito,
        ip
    });

    await nuevoLog.save();
}


// GET: Obtener todos los registros de inicio de sesión de un usuario específico
exports.getLoginLogs = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const logs = await LoginLog.find({ usuarioId }).sort({ fechaInicioSesion: -1 });
        if (logs.length === 0) {
            return res.status(404).json({ message: 'No se encontraron registros de inicio de sesión para este usuario' });
        }
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Eliminar un registro de inicio de sesión por su ID
exports.deleteLoginLog = async (req, res) => {
    const { id } = req.params;

    try {
        const log = await LoginLog.findByIdAndDelete(id);
        if (!log) {
            return res.status(404).json({ message: 'Registro de inicio de sesión no encontrado' });
        }
        res.status(200).json({ message: 'Registro de inicio de sesión eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

