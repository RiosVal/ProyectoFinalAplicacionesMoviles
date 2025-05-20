// routes/famousPersonTagRoutes.js
const express = require('express');
const router = express.Router();
const {
    createFamousPersonTag,
    getFamousPersonTags,
    getFamousPersonTagById,
    updateFamousPersonTag,
    deleteFamousPersonTag
} = require('../controllers/famousPersonTagController');

const { protect, admin } = require('../middleware/auth'); // 'admin' no es estrictamente necesario para PUT/DELETE, pero 'protect' sí

// Rutas Públicas (cualquiera puede ver los tags)
router.get('/', getFamousPersonTags);
router.get('/:id', getFamousPersonTagById);

// Rutas Privadas (solo usuarios autenticados para crear)
router.post('/', protect, createFamousPersonTag); // No se requiere 'admin' aquí

// Rutas Privadas (solo el creador del tag o un Admin para actualizar/eliminar)
router.put('/:id', protect, updateFamousPersonTag);
router.delete('/:id', protect, deleteFamousPersonTag); // Nota: 'admin' no está aquí, la lógica de permisos se maneja en el controlador

module.exports = router;