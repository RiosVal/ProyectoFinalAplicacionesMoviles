// routes/visitRoutes.js
const express = require('express');
const router = express.Router();
const {
    createVisit,
    getVisits,
    getVisitById,
    updateVisit,
    deleteVisit
} = require('../controllers/visitController');

const { protect, admin } = require('../middleware/auth');

// Rutas Públicas (cualquiera puede ver las visitas)
router.get('/', getVisits);
router.get('/:id', getVisitById);

// Rutas Privadas (solo usuarios autenticados para crear)
router.post('/', protect, createVisit);

// Rutas Privadas (solo el creador de la visita o un Admin para actualizar/eliminar)
router.put('/:id', protect, updateVisit);
router.delete('/:id', protect, deleteVisit);

module.exports = router;