const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Usualmente en el formato "Bearer TOKEN"
}
