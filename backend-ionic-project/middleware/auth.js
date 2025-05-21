const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Error en la verificación del token:', error.message);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se encontró token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `El usuario con rol ${req.user.role} no está autorizado para acceder a esta ruta` });
        }
        next();
    };
};

// Define el middleware 'admin' utilizando la función 'authorize'
const admin = authorize('Admin');

module.exports = { protect, authorize, admin };