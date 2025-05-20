const Site = require('../models/Site');
const City = require('../models/City');     // Para verificar la ciudad
const Country = require('../models/Country'); // Para verificar el país
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Crear un nuevo sitio
// @route   POST /api/sites
// @access  Private/Admin (solo administradores pueden añadir sitios)
const createSite = asyncHandler(async (req, res) => {
    const { name, cityId, countryId, type, description, lat, lng, imageUrl, qrCode } = req.body;

    // 1. Validar campos requeridos
    if (!name || !cityId || !countryId || !type || !description || lat === undefined || lng === undefined || !imageUrl || !qrCode) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos requeridos: nombre, ciudad, país, tipo, descripción, coordenadas, URL de imagen y código QR.');
    }

    // 2. Verificar si la ciudad existe
    const cityExists = await City.findById(cityId);
    if (!cityExists) {
        res.status(404);
        throw new Error('La ciudad especificada no existe.');
    }

    // 3. Verificar si el país existe
    const countryExists = await Country.findById(countryId);
    if (!countryExists) {
        res.status(404);
        throw new Error('El país especificado no existe.');
    }

    // 4. Opcional: Verificar si el sitio ya existe (por nombre y ciudad/país)
    const siteExists = await Site.findOne({
        name,
        city: cityId,
        country: countryId
    });
    if (siteExists) {
        res.status(400);
        throw new Error('Ya existe un sitio con este nombre en la ciudad y país especificados.');
    }

    // 5. Crear el sitio
    const site = await Site.create({
        name,
        city: cityId,
        country: countryId,
        type,
        description,
        coordinates: {
            lat,
            lng
        },
        imageUrl,
        qrCode
    });

    if (site) {
        // Popula para mostrar los nombres de ciudad y país en la respuesta
        const populatedSite = await Site.findById(site._id)
            .populate('city', 'name')
            .populate('country', 'name');

        res.status(201).json(populatedSite);
    } else {
        res.status(400);
        throw new Error('Datos de sitio inválidos.');
    }
});

// @desc    Obtener todos los sitios
// @route   GET /api/sites
// @access  Public
const getSites = asyncHandler(async (req, res) => {
    // Permite filtrar por cityId, countryId o type
    const { cityId, countryId, type } = req.query;
    let query = {};

    if (cityId) {
        if (!mongoose.Types.ObjectId.isValid(cityId)) {
            res.status(400);
            throw new Error('ID de ciudad inválido.');
        }
        query.city = cityId;
    }
    if (countryId) {
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            res.status(400);
            throw new Error('ID de país inválido.');
        }
        query.country = countryId;
    }
    if (type) {
        query.type = { $regex: type, $options: 'i' }; // Búsqueda insensible a mayúsculas/minúsculas
    }

    // Popula para obtener los nombres de ciudad y país en la respuesta
    const sites = await Site.find(query)
        .populate('city', 'name')
        .populate('country', 'name');

    res.status(200).json(sites);
});

// @desc    Obtener un sitio por ID
// @route   GET /api/sites/:id
// @access  Public
const getSiteById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de sitio inválido.');
    }

    const site = await Site.findById(req.params.id)
        .populate('city', 'name')
        .populate('country', 'name');

    if (site) {
        res.status(200).json(site);
    } else {
        res.status(404);
        throw new Error('Sitio no encontrado.');
    }
});

// @desc    Actualizar un sitio
// @route   PUT /api/sites/:id
// @access  Private/Admin
const updateSite = asyncHandler(async (req, res) => {
    const { name, cityId, countryId, type, description, lat, lng, imageUrl, qrCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de sitio inválido.');
    }

    const site = await Site.findById(req.params.id);

    if (site) {
        // Verificar existencia de nuevas referencias (ciudad, país)
        if (cityId && String(site.city) !== cityId) {
            const newCityExists = await City.findById(cityId);
            if (!newCityExists) {
                res.status(404);
                throw new Error('La nueva ciudad especificada no existe.');
            }
            site.city = cityId;
        }

        if (countryId && String(site.country) !== countryId) {
            const newCountryExists = await Country.findById(countryId);
            if (!newCountryExists) {
                res.status(404);
                throw new Error('El nuevo país especificado no existe.');
            }
            site.country = countryId;
        }

        site.name = name !== undefined ? name : site.name;
        site.type = type !== undefined ? type : site.type;
        site.description = description !== undefined ? description : site.description;
        site.coordinates.lat = lat !== undefined ? lat : site.coordinates.lat;
        site.coordinates.lng = lng !== undefined ? lng : site.coordinates.lng;
        site.imageUrl = imageUrl !== undefined ? imageUrl : site.imageUrl;
        site.qrCode = qrCode !== undefined ? qrCode : site.qrCode;

        const updatedSite = await site.save();

        // Popula para mostrar los nombres de ciudad y país en la respuesta
        const populatedUpdatedSite = await Site.findById(updatedSite._id)
            .populate('city', 'name')
            .populate('country', 'name');

        res.status(200).json(populatedUpdatedSite);
    } else {
        res.status(404);
        throw new Error('Sitio no encontrado.');
    }
});

// @desc    Eliminar un sitio
// @route   DELETE /api/sites/:id
// @access  Private/Admin
const deleteSite = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de sitio inválido.');
    }

    const site = await Site.findById(req.params.id);

    if (site) {
        // TODO: Considerar dependencias (Platos, Visitas).
        // Si hay platos o visitas asociadas a este sitio, ¿deberían eliminarse en cascada,
        // o la eliminación del sitio debería fallar si tiene dependencias?
        // Por simplicidad, aquí solo se elimina el sitio.

        await Site.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Sitio eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('Sitio no encontrado.');
    }
});

module.exports = {
    createSite,
    getSites,
    getSiteById,
    updateSite,
    deleteSite
};