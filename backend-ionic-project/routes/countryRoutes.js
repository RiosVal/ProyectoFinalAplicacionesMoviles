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

// Rutas Públicas
router.get('/', getCountries);
router.get('/:id', getCountryById);

// Rutas Privadas (Admin solamente)
router.post('/', protect, admin, createCountry);
router.put('/:id', protect, admin, updateCountry);
router.delete('/:id', protect, admin, deleteCountry);

module.exports = router;