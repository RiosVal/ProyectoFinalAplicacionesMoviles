// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const {
    createDish,
    getDishes,
    getDishById,
    updateDish,
    deleteDish
} = require('../controllers/dishController');

const { protect, admin } = require('../middleware/auth');

// Rutas Públicas
router.get('/', getDishes);
router.get('/:id', getDishById);

// Rutas Privadas (Admin solamente)
router.post('/', protect, admin, createDish);
router.put('/:id', protect, admin, updateDish);
router.delete('/:id', protect, admin, deleteDish);

module.exports = router;