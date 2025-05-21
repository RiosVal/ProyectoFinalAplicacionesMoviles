const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');

//@desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe con este correo electrónico' });
    }

    const user = await User.create({
        email,
        password,
        role: role || 'Usuario Común' // Por defecto Usuario Común si no se especifica
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
    }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
};

module.exports = { registerUser, authUser, getUserProfile };