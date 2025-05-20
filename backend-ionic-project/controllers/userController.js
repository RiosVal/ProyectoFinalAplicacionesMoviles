const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// Nota: registerUser y authUser ya están en authController.js.
// Este controlador se enfocaría en la gestión de usuarios por un administrador,
// o quizás que un usuario pueda actualizar su propia información (excepto contraseña).

// @desc    Obtener todos los usuarios (solo Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Excluye la contraseña de los resultados
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
});

// @desc    Obtener un usuario por ID (solo Admin, o el mismo usuario)
// @route   GET /api/users/:id
// @access  Private/Admin (o el propio usuario)
const getUserById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de usuario inválido.');
    }

    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        // Permitir acceso si es Admin o si el usuario pide su propio perfil
        if (req.user.role === 'Administrador' || String(user._id) === String(req.user._id)) {
            res.status(200).json(user);
        } else {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para acceder a este perfil de usuario.');
        }
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado.');
    }
});

// @desc    Actualizar información de usuario (solo Admin o el propio usuario)
// @route   PUT /api/users/:id
// @access  Private/Admin (o el propio usuario)
const updateUser = asyncHandler(async (req, res) => {
    const { email, role } = req.body; // No permitimos cambiar la contraseña directamente aquí

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de usuario inválido.');
    }

    const user = await User.findById(req.params.id);

    if (user) {
        // Permitir actualizar si es Admin o si el usuario actualiza su propio perfil
        if (req.user.role === 'Administrador' || String(user._id) === String(req.user._id)) {
            user.email = email !== undefined ? email : user.email;

            // Solo el administrador puede cambiar el rol
            if (req.user.role === 'Administrador' && role !== undefined) {
                if (!['Administrador', 'Usuario Común'].includes(role)) {
                    res.status(400);
                    throw new Error('Rol de usuario inválido.');
                }
                user.role = role;
            } else if (role !== undefined && req.user.role !== 'Administrador') {
                res.status(403);
                throw new Error('No tienes permiso para cambiar el rol de usuario.');
            }

            const updatedUser = await user.save();

            res.status(200).json({
                _id: updatedUser._id,
                email: updatedUser.email,
                role: updatedUser.role
            });
        } else {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para actualizar este usuario.');
        }
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado.');
    }
});

// @desc    Eliminar un usuario (solo Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de usuario inválido.');
    }

    const user = await User.findById(req.params.id);

    if (user) {
        // TODO: Considerar dependencias (Visitas, FamousPersonTags).
        // Si el usuario tiene visitas o tags, ¿deberían eliminarse en cascada,
        // o la eliminación del usuario debería fallar si tiene dependencias?
        // Por simplicidad, aquí solo se elimina el usuario.
        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado.');
    }
});


module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};