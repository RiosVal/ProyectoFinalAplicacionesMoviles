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

const { protect } = require('../middleware/auth');

// Rutas para crear y obtener todas las visitas
router.route('/')
    .post(protect, createVisit) // Para crear una nueva visita
    .get(protect, getVisits); // Para obtener todas las visitas (filtradas por usuario si no es admin)

// Rutas para operaciones por ID (obtener, actualizar, eliminar)
router.route('/:id')
    .get(protect, getVisitById) // Para obtener una visita específica por ID
    .put(protect, updateVisit)  // Para actualizar una visita específica por ID
    .delete(protect, deleteVisit); // Para eliminar una visita específica por ID

module.exports = router;