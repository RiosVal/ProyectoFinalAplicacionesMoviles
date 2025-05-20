const FamousPerson = require('../models/FamousPerson');
const City = require('../models/City');     // Para verificar la ciudad de nacimiento
const Country = require('../models/Country'); // Para verificar el país de origen
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Para isValidObjectId

// @desc    Crear una nueva persona famosa
// @route   POST /api/famouspeople
// @access  Private/Admin (solo administradores pueden añadir personas famosas)
const createFamousPerson = asyncHandler(async (req, res) => {
    const { name, lastName, cityOfBirthId, countryOfOriginId, category, description, imageUrl } = req.body;

    // 1. Validar campos requeridos
    if (!name || !cityOfBirthId || !countryOfOriginId || !category || !description || !imageUrl) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos requeridos: nombre, ciudad de nacimiento, país de origen, categoría, descripción y URL de imagen.');
    }

    // 2. Verificar si la ciudad de nacimiento existe
    const cityExists = await City.findById(cityOfBirthId);
    if (!cityExists) {
        res.status(404);
        throw new Error('La ciudad de nacimiento especificada no existe.');
    }

    // 3. Verificar si el país de origen existe
    const countryExists = await Country.findById(countryOfOriginId);
    if (!countryExists) {
        res.status(404);
        throw new Error('El país de origen especificado no existe.');
    }

    // 4. Opcional: Verificar si la persona famosa ya existe (por nombre completo y ciudad/país)
    // Esto es para evitar duplicados si se considera que una persona con el mismo nombre en el mismo lugar de origen es un duplicado
    const famousPersonExists = await FamousPerson.findOne({
        name,
        lastName,
        cityOfBirth: cityOfBirthId,
        countryOfOrigin: countryOfOriginId
    });
    if (famousPersonExists) {
        res.status(400);
        throw new Error('Ya existe una persona famosa con este nombre y lugar de origen.');
    }

    // 5. Crear la persona famosa
    const famousPerson = await FamousPerson.create({
        name,
        lastName: lastName || null, // Guardar como null si no se proporciona
        cityOfBirth: cityOfBirthId,
        countryOfOrigin: countryOfOriginId,
        category,
        description,
        imageUrl
    });

    if (famousPerson) {
        // Popula para mostrar los nombres de ciudad y país en la respuesta
        const populatedPerson = await FamousPerson.findById(famousPerson._id)
            .populate('cityOfBirth', 'name')
            .populate('countryOfOrigin', 'name');

        res.status(201).json(populatedPerson);
    } else {
        res.status(400);
        throw new Error('Datos de persona famosa inválidos.');
    }
});

// @desc    Obtener todas las personas famosas
// @route   GET /api/famouspeople
// @access  Public
const getFamousPeople = asyncHandler(async (req, res) => {
    // Permite filtrar por category, cityId o countryId
    const { category, cityId, countryId } = req.query;
    let query = {};

    if (category) {
        query.category = { $regex: category, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    }
    if (cityId) {
        if (!mongoose.Types.ObjectId.isValid(cityId)) {
            res.status(400);
            throw new Error('ID de ciudad inválido.');
        }
        query.cityOfBirth = cityId;
    }
    if (countryId) {
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            res.status(400);
            throw new Error('ID de país inválido.');
        }
        query.countryOfOrigin = countryId;
    }

    // Popula para obtener los nombres de ciudad y país en la respuesta
    const famousPeople = await FamousPerson.find(query)
        .populate('cityOfBirth', 'name')
        .populate('countryOfOrigin', 'name');

    res.status(200).json(famousPeople);
});

// @desc    Obtener una persona famosa por ID
// @route   GET /api/famouspeople/:id
// @access  Public
const getFamousPersonById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de persona famosa inválido.');
    }

    const famousPerson = await FamousPerson.findById(req.params.id)
        .populate('cityOfBirth', 'name')
        .populate('countryOfOrigin', 'name');

    if (famousPerson) {
        res.status(200).json(famousPerson);
    } else {
        res.status(404);
        throw new Error('Persona famosa no encontrada.');
    }
});

// @desc    Actualizar una persona famosa
// @route   PUT /api/famouspeople/:id
// @access  Private/Admin
const updateFamousPerson = asyncHandler(async (req, res) => {
    const { name, lastName, cityOfBirthId, countryOfOriginId, category, description, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de persona famosa inválido.');
    }

    const famousPerson = await FamousPerson.findById(req.params.id);

    if (famousPerson) {
        // Verificar existencia de nuevas referencias (ciudad, país)
        if (cityOfBirthId && String(famousPerson.cityOfBirth) !== cityOfBirthId) {
            const newCityExists = await City.findById(cityOfBirthId);
            if (!newCityExists) {
                res.status(404);
                throw new Error('La nueva ciudad de nacimiento especificada no existe.');
            }
            famousPerson.cityOfBirth = cityOfBirthId;
        }

        if (countryOfOriginId && String(famousPerson.countryOfOrigin) !== countryOfOriginId) {
            const newCountryExists = await Country.findById(countryOfOriginId);
            if (!newCountryExists) {
                res.status(404);
                throw new Error('El nuevo país de origen especificado no existe.');
            }
            famousPerson.countryOfOrigin = countryOfOriginId;
        }

        famousPerson.name = name !== undefined ? name : famousPerson.name;
        famousPerson.lastName = lastName !== undefined ? lastName : famousPerson.lastName;
        famousPerson.category = category !== undefined ? category : famousPerson.category;
        famousPerson.description = description !== undefined ? description : famousPerson.description;
        famousPerson.imageUrl = imageUrl !== undefined ? imageUrl : famousPerson.imageUrl;

        const updatedFamousPerson = await famousPerson.save();

        // Popula para mostrar los nombres de ciudad y país en la respuesta
        const populatedUpdatedPerson = await FamousPerson.findById(updatedFamousPerson._id)
            .populate('cityOfBirth', 'name')
            .populate('countryOfOrigin', 'name');

        res.status(200).json(populatedUpdatedPerson);
    } else {
        res.status(404);
        throw new Error('Persona famosa no encontrada.');
    }
});

// @desc    Eliminar una persona famosa
// @route   DELETE /api/famouspeople/:id
// @access  Private/Admin
const deleteFamousPerson = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de persona famosa inválido.');
    }

    const famousPerson = await FamousPerson.findById(req.params.id);

    if (famousPerson) {
        // TODO: Considerar dependencias (FamousPersonTags).
        // Si hay tags asociados a esta persona famosa, ¿deberían eliminarse en cascada,
        // o la eliminación de la persona famosa debería fallar si tiene tags?
        // Por simplicidad, aquí solo se elimina la persona.

        await FamousPerson.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Persona famosa eliminada correctamente.' });
    } else {
        res.status(404);
        throw new Error('Persona famosa no encontrada.');
    }
});

module.exports = {
    createFamousPerson,
    getFamousPeople,
    getFamousPersonById,
    updateFamousPerson,
    deleteFamousPerson
};