// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/auth');

// Rutas para administradores (obtener todos los usuarios)
router.get('/', protect, admin, getUsers); // Solo admin puede ver todos los usuarios

// Rutas para administradores o para que el propio usuario gestione su cuenta
router.get('/:id', protect, getUserById); // Admin puede ver cualquier usuario, un usuario puede ver su propio perfil
router.put('/:id', protect, updateUser); // Admin puede actualizar cualquier usuario, un usuario puede actualizar su propio perfil (no el rol)
router.delete('/:id', protect, admin, deleteUser); // Solo admin puede eliminar usuarios

module.exports = router;