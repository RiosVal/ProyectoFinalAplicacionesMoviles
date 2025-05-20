const Visit = require('../models/Visit');
const User = require('../models/User');   // Para verificar el usuario
const Site = require('../models/Site');   // Para verificar el sitio
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Registrar una nueva visita
// @route   POST /api/visits
// @access  Private (cualquier usuario autenticado puede registrar una visita)
const createVisit = asyncHandler(async (req, res) => {
    // req.user._id viene del middleware 'protect'
    const { siteId, timeStamp, method, photoUrl, lat, lng } = req.body;

    // 1. Validar campos requeridos
    if (!siteId || !timeStamp || !method || !photoUrl || lat === undefined || lng === undefined) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos requeridos: ID de sitio, marca de tiempo, método, URL de foto y coordenadas.');
    }

    // 2. Verificar si el sitio existe
    const siteExists = await Site.findById(siteId);
    if (!siteExists) {
        res.status(404);
        throw new Error('El sitio especificado no existe.');
    }

    // 3. Verificar que el usuario exista (req.user._id es el ID del usuario autenticado)
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
        res.status(404);
        throw new Error('El usuario autenticado no fue encontrado.');
    }

    // 4. Crear la visita
    const visit = await Visit.create({
        user: req.user._id, // Asigna el ID del usuario autenticado automáticamente
        site: siteId,
        timeStamp,
        method,
        photoUrl,
        coordinates: {
            lat,
            lng
        }
    });

    if (visit) {
        // Popula para mostrar los nombres de usuario y sitio en la respuesta
        const populatedVisit = await Visit.findById(visit._id)
            .populate('user', 'email')
            .populate('site', 'name');

        res.status(201).json(populatedVisit);
    } else {
        res.status(400);
        throw new Error('Datos de visita inválidos.');
    }
});

// @desc    Obtener todas las visitas (filtrable por usuario o sitio)
// @route   GET /api/visits
// @access  Public (cualquiera puede ver las visitas, aunque la lógica del frontend podría restringir)
const getVisits = asyncHandler(async (req, res) => {
    const { userId, siteId } = req.query; // Filtro por ID de usuario o ID de sitio
    let query = {};

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400);
            throw new Error('ID de usuario inválido.');
        }
        query.user = userId;
    }
    if (siteId) {
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            res.status(400);
            throw new Error('ID de sitio inválido.');
        }
        query.site = siteId;
    }

    const visits = await Visit.find(query)
        .populate('user', 'email')
        .populate('site', 'name');

    res.status(200).json(visits);
});

// @desc    Obtener una visita por ID
// @route   GET /api/visits/:id
// @access  Public
const getVisitById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visita inválido.');
    }

    const visit = await Visit.findById(req.params.id)
        .populate('user', 'email')
        .populate('site', 'name');

    if (visit) {
        res.status(200).json(visit);
    } else {
        res.status(404);
        throw new Error('Visita no encontrada.');
    }
});

// @desc    Actualizar una visita
// @route   PUT /api/visits/:id
// @access  Private (solo el usuario que la creó o un Admin puede actualizarla)
const updateVisit = asyncHandler(async (req, res) => {
    const { timeStamp, method, photoUrl, lat, lng } = req.body; // No permitimos cambiar user o site de una visita existente

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visita inválido.');
    }

    const visit = await Visit.findById(req.params.id);

    if (visit) {
        // Solo el usuario que creó la visita o un administrador puede actualizarla
        if (String(visit.user) !== String(req.user._id) && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para actualizar esta visita.');
        }

        visit.timeStamp = timeStamp !== undefined ? timeStamp : visit.timeStamp;
        visit.method = method !== undefined ? method : visit.method;
        visit.photoUrl = photoUrl !== undefined ? photoUrl : visit.photoUrl;
        visit.coordinates.lat = lat !== undefined ? lat : visit.coordinates.lat;
        visit.coordinates.lng = lng !== undefined ? lng : visit.coordinates.lng;

        const updatedVisit = await visit.save();

        const populatedUpdatedVisit = await Visit.findById(updatedVisit._id)
            .populate('user', 'email')
            .populate('site', 'name');

        res.status(200).json(populatedUpdatedVisit);
    } else {
        res.status(404);
        throw new Error('Visita no encontrada.');
    }
});

// @desc    Eliminar una visita
// @route   DELETE /api/visits/:id
// @access  Private (solo el usuario que la creó o un Admin puede eliminarla)
const deleteVisit = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visita inválido.');
    }

    const visit = await Visit.findById(req.params.id);

    if (visit) {
        // Solo el usuario que creó la visita o un administrador puede eliminarla
        if (String(visit.user) !== String(req.user._id) && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para eliminar esta visita.');
        }

        await Visit.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Visita eliminada correctamente.' });
    } else {
        res.status(404);
        throw new Error('Visita no encontrada.');
    }
});

module.exports = {
    createVisit,
    getVisits,
    getVisitById,
    updateVisit,
    deleteVisit
};