const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Usualmente en el formato "Bearer TOKEN"

    // Si no hay token, devolver error de autenticación
    if (!token) return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });

    // Verificar y decodificar el token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token no válido' });

        // Guardar el usuario en la solicitud para futuras referencias y continuar
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
