// routes/siteRoutes.js
const express = require('express');
const router = express.Router();
const {
    createSite,
    getSites,
    getSiteById,
    updateSite,
    deleteSite
} = require('../controllers/siteController');

const { protect, admin } = require('../middleware/auth');

// Rutas Públicas
router.get('/', getSites);
router.get('/:id', getSiteById);

// Rutas Privadas (Admin solamente, según tu requisito "Para un usuario Administrador, este sería el único que puede a través de la APP, adicionar nuevos sitios.")
router.post('/', protect, admin, createSite);
router.put('/:id', protect, admin, updateSite);
router.delete('/:id', protect, admin, deleteSite);

module.exports = router;