const FamousPersonTag = require('../models/FamousPersonTag');
const User = require('../models/User');           // Para verificar el usuario
const FamousPerson = require('../models/FamousPerson'); // Para verificar la persona famosa
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Crear un nuevo tag/comentario de persona famosa
// @route   POST /api/famouspersontags
// @access  Private (cualquier usuario autenticado puede crear un tag)
const createFamousPersonTag = asyncHandler(async (req, res) => {
    // req.user._id viene del middleware 'protect'
    const { famousPersonId, tag, timeStamp, photoUrl, lat, lng } = req.body;

    // 1. Validar campos requeridos
    if (!famousPersonId || !tag || !timeStamp || !photoUrl || lat === undefined || lng === undefined) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos requeridos: ID de persona famosa, tag, marca de tiempo, URL de foto y coordenadas.');
    }

    // 2. Verificar si la persona famosa existe
    const famousPersonExists = await FamousPerson.findById(famousPersonId);
    if (!famousPersonExists) {
        res.status(404);
        throw new new Error('La persona famosa especificada no existe.');
    }

    // 3. Verificar que el usuario exista (req.user._id es el ID del usuario autenticado)
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
        // Esto no debería pasar si el middleware `protect` funciona correctamente,
        // pero es una buena práctica de seguridad.
        res.status(404);
        throw new Error('El usuario autenticado no fue encontrado.');
    }

    // 4. Crear el tag de persona famosa
    const famousPersonTag = await FamousPersonTag.create({
        user: req.user._id, // Asigna el ID del usuario autenticado automáticamente
        FamousPerson: famousPersonId, // Renombrado a FamousPerson en el modelo para evitar conflicto de nombres con el modelo
        tag,
        timeStamp,
        photoUrl,
        coordinates: {
            lat,
            lng
        }
    });

    if (famousPersonTag) {
        // Popula para mostrar nombres de usuario y persona famosa en la respuesta
        const populatedTag = await FamousPersonTag.findById(famousPersonTag._id)
            .populate('user', 'email') // Solo el email del usuario
            .populate('FamousPerson', 'name lastName'); // Nombre y apellido de la persona famosa

        res.status(201).json(populatedTag);
    } else {
        res.status(400);
        throw new Error('Datos de tag de persona famosa inválidos.');
    }
});

// @desc    Obtener todos los tags de personas famosas (filtrable por usuario o persona famosa)
// @route   GET /api/famouspersontags
// @access  Public (cualquiera puede ver los tags)
const getFamousPersonTags = asyncHandler(async (req, res) => {
    const { userId, famousPersonId } = req.query; // Filtro por ID de usuario o ID de persona famosa
    let query = {};

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400);
            throw new Error('ID de usuario inválido.');
        }
        query.user = userId;
    }
    if (famousPersonId) {
        if (!mongoose.Types.ObjectId.isValid(famousPersonId)) {
            res.status(400);
            throw new Error('ID de persona famosa inválido.');
        }
        query.FamousPerson = famousPersonId;
    }

    const famousPersonTags = await FamousPersonTag.find(query)
        .populate('user', 'email')
        .populate('FamousPerson', 'name lastName');

    res.status(200).json(famousPersonTags);
});

// @desc    Obtener un tag de persona famosa por ID
// @route   GET /api/famouspersontags/:id
// @access  Public
const getFamousPersonTagById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de tag de persona famosa inválido.');
    }

    const famousPersonTag = await FamousPersonTag.findById(req.params.id)
        .populate('user', 'email')
        .populate('FamousPerson', 'name lastName');

    if (famousPersonTag) {
        res.status(200).json(famousPersonTag);
    } else {
        res.status(404);
        throw new Error('Tag de persona famosa no encontrado.');
    }
});

// @desc    Actualizar un tag de persona famosa
// @route   PUT /api/famouspersontags/:id
// @access  Private (solo el usuario que lo creó o un Admin puede actualizarlo)
const updateFamousPersonTag = asyncHandler(async (req, res) => {
    const { tag, timeStamp, photoUrl, lat, lng } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de tag de persona famosa inválido.');
    }

    const famousPersonTag = await FamousPersonTag.findById(req.params.id);

    if (famousPersonTag) {
        // Solo el usuario que creó el tag o un administrador puede actualizarlo
        if (String(famousPersonTag.user) !== String(req.user._id) && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para actualizar este tag.');
        }

        famousPersonTag.tag = tag !== undefined ? tag : famousPersonTag.tag;
        famousPersonTag.timeStamp = timeStamp !== undefined ? timeStamp : famousPersonTag.timeStamp;
        famousPersonTag.photoUrl = photoUrl !== undefined ? photoUrl : famousPersonTag.photoUrl;
        famousPersonTag.coordinates.lat = lat !== undefined ? lat : famousPersonTag.coordinates.lat;
        famousPersonTag.coordinates.lng = lng !== undefined ? lng : famousPersonTag.coordinates.lng;

        const updatedFamousPersonTag = await famousPersonTag.save();

        const populatedUpdatedTag = await FamousPersonTag.findById(updatedFamousPersonTag._id)
            .populate('user', 'email')
            .populate('FamousPerson', 'name lastName');

        res.status(200).json(populatedUpdatedTag);
    } else {
        res.status(404);
        throw new Error('Tag de persona famosa no encontrado.');
    }
});

// @desc    Eliminar un tag de persona famosa
// @route   DELETE /api/famouspersontags/:id
// @access  Private (solo el usuario que lo creó o un Admin puede eliminarlo)
const deleteFamousPersonTag = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de tag de persona famosa inválido.');
    }

    const famousPersonTag = await FamousPersonTag.findById(req.params.id);

    if (famousPersonTag) {
        // Solo el usuario que creó el tag o un administrador puede eliminarlo
        if (String(famousPersonTag.user) !== String(req.user._id) && req.user.role !== 'Administrador') {
            res.status(403); // Forbidden
            throw new Error('No tienes permiso para eliminar este tag.');
        }

        await FamousPersonTag.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Tag de persona famosa eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('Tag de persona famosa no encontrado.');
    }
});

module.exports = {
    createFamousPersonTag,
    getFamousPersonTags,
    getFamousPersonTagById,
    updateFamousPersonTag,
    deleteFamousPersonTag
};