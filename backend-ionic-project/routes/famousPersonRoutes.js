// routes/famousPersonRoutes.js
const express = require('express');
const router = express.Router();
const {
    createFamousPerson,
    getFamousPeople,
    getFamousPersonById,
    updateFamousPerson,
    deleteFamousPerson
} = require('../controllers/famousPersonController');

const { protect, admin } = require('../middleware/auth');

// Rutas Públicas
router.get('/', getFamousPeople);
router.get('/:id', getFamousPersonById);

// Rutas Privadas (Admin solamente)
router.post('/', protect, admin, createFamousPerson);
router.put('/:id', protect, admin, updateFamousPerson);
router.delete('/:id', protect, admin, deleteFamousPerson);

module.exports = router;