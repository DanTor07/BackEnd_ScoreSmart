const Registro = require('../models/registro');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const LoginLog = require('../models/loginlogs'); // Asegúrate de que la ruta sea correcta


// POST: Iniciar sesión
exports.inicio = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const usuario = await Registro.findOne({ correo });
        if (!usuario) {
            await registrarInicioSesion(null, false, req.ip);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log('Contraseña almacenada:', usuario.contrasena);
        console.log('Contraseña ingresada:', contrasena.trim()); 

        const isMatch = await bcrypt.compare(contrasena.trim(), usuario.contrasena);
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
async function registrarInicioSesion(usuarioId, exito, ip) {
    const nuevoLog = new LoginLog({
        usuarioId,
        exito,
        ip
    });

    await nuevoLog.save();
}

