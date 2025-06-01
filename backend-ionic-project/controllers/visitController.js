const Visit = require('../models/Visit');
const User = require('../models/User');   // Para verificar el usuario
const Site = require('../models/Site');   // Para verificar el sitio
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Crear una nueva visita a un sitio
// @route   POST /api/visits
// @access  Private (solo usuarios autenticados)
const createVisit = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Asume que req.user._id viene del middleware de autenticación
  const { siteId, method, photoUrl, coordinates } = req.body;

  // 1. Validar campos requeridos (básicos)
  if (!siteId || !method) {
    res.status(400);
    throw new Error('Por favor, proporciona el ID del sitio y el método de verificación.');
  }

  // 2. Verificar que el sitio exista
  const siteExists = await Site.findById(siteId);
  if (!siteExists) {
    res.status(404);
    throw new Error('El sitio especificado no existe.');
  }

  // 3. Crear la nueva visita
  // Mongoose manejará la validación condicional de photoUrl gracias al schema.
  const visit = await Visit.create({
    user: userId,
    site: siteId,
    method: method,
    photoUrl: photoUrl,
    coordinates: coordinates
  });

  if (visit) {
    res.status(201).json({
      message: 'Visita registrada con éxito',
      visit,
    });
  } else {
    res.status(400);
    throw new Error('Datos de visita inválidos.');
  }
});

// @desc    Obtener todas las visitas (opcionalmente filtradas por usuario)
// @route   GET /api/visits
// @access  Private (se puede hacer público si se quita el 'protect' de la ruta)
const getVisits = asyncHandler(async (req, res) => {
    // Si quieres que solo un admin vea todas las visitas, o un usuario vea las suyas.
    // Para simplificar, asumimos que un usuario autenticado puede ver sus visitas.
    // Si quieres que un admin vea TODAS las visitas, quita el filtro por user.
    let filter = {};
    if (req.user && req.user.role !== 'Administrador') { // Si no es admin, solo ve sus propias visitas
      filter = { user: req.user._id };
    }

    const visits = await Visit.find(filter)
                               .populate('site', 'name description imageUrl')
                               .populate('user', 'firstName email'); // También populamos el usuario para más detalles
    res.json(visits);
});

// @desc    Obtener una visita por su ID
// @route   GET /api/visits/:id
// @access  Private (solo el usuario dueño de la visita o un admin)
const getVisitById = asyncHandler(async (req, res) => {
    const visit = await Visit.findById(req.params.id)
                              .populate('site', 'name description imageUrl')
                              .populate('user', 'firstName email');

    if (visit) {
        // Asegurarse de que solo el dueño de la visita o un administrador pueda verla
        if (visit.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No estás autorizado para ver esta visita.');
        }
        res.json(visit);
    } else {
        res.status(404);
        throw new Error('Visita no encontrada.');
    }
});

// @desc    Actualizar una visita
// @route   PUT /api/visits/:id
// @access  Private (solo el usuario dueño de la visita o un admin)
const updateVisit = asyncHandler(async (req, res) => {
    const { method, photoUrl, coordinates } = req.body; // No permitimos cambiar user o site
    const visit = await Visit.findById(req.params.id);

    if (visit) {
        // Asegurarse de que solo el dueño de la visita o un administrador pueda actualizarla
        if (visit.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No estás autorizado para actualizar esta visita.');
        }

        // Actualizar campos (Mongoose validará si photoUrl es necesario para 'PHOTO_UPLOAD')
        visit.method = method || visit.method;
        visit.photoUrl = photoUrl; // Puede ser null si se cambia de PHOTO a QR
        visit.coordinates = coordinates || visit.coordinates;
        visit.timeStamp = new Date(); // Opcional: Actualizar el timeStamp a la hora de la actualización

        const updatedVisit = await visit.save();

        res.json({
            message: 'Visita actualizada con éxito',
            updatedVisit
        });
    } else {
        res.status(404);
        throw new Error('Visita no encontrada.');
    }
});

// @desc    Eliminar una visita
// @route   DELETE /api/visits/:id
// @access  Private (solo el usuario dueño de la visita o un admin)
const deleteVisit = asyncHandler(async (req, res) => {
    const visit = await Visit.findById(req.params.id);

    if (visit) {
        // Asegurarse de que solo el dueño de la visita o un administrador pueda eliminarla
        if (visit.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No estás autorizado para eliminar esta visita.');
        }

        await Visit.deleteOne({ _id: visit._id }); // Usar deleteOne para la eliminación
        res.json({ message: 'Visita eliminada con éxito' });
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