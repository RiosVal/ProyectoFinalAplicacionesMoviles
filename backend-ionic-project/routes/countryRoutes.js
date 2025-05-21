// routes/countryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCountry,
    getCountries,
    getCountryById,
    updateCountry,
    deleteCountry
} = require('../controllers/countryController');

const { protect, admin } = require('../middleware/auth');

// === AÑADE ESTOS CONSOLE.LOGS TEMPORALES ===
console.log('Type of protect:', typeof protect);
console.log('Type of admin:', typeof admin);
console.log('Type of createCountry:', typeof createCountry);
// ===========================================

// Rutas Públicas
router.get('/', getCountries);
router.get('/:id', getCountryById);

// Rutas Privadas (Admin solamente)
router.post('/', protect, admin, createCountry); // Línea 19
router.put('/:id', protect, admin, updateCountry);
router.delete('/:id', protect, admin, deleteCountry);

module.exports = router;