// routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCity,
    getCities,
    getCityById,
    updateCity,
    deleteCity
} = require('../controllers/cityController');

const { protect, admin } = require('../middleware/auth'); // Importa los middlewares de autenticación y autorización

// Rutas Públicas
router.get('/', getCities);         // GET /api/cities (puede tener query param countryId)
router.get('/:id', getCityById);    // GET /api/cities/:id

// Rutas Privadas (Admin solamente)
// Primero pasa por 'protect' para verificar el token JWT,
// luego por 'admin' para verificar el rol del usuario.
router.post('/', protect, admin, createCity);
router.put('/:id', protect, admin, updateCity);
router.delete('/:id', protect, admin, deleteCity);


module.exports = router;