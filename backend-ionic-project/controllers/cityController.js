const City = require('../models/City');
const Country = require('../models/Country'); // Necesario para verificar que el country existe
const asyncHandler = require('express-async-handler'); // Para manejar errores asíncronos sin try/catch en cada función

// @desc    Crear una nueva ciudad
// @route   POST /api/cities
// @access  Private/Admin (solo administradores pueden añadir sitios/ciudades)
const createCity = asyncHandler(async (req, res) => {
    const { name, countryId, lat, lng } = req.body;

    // 1. Validar campos requeridos
    if (!name || !countryId) {
        res.status(400);
        throw new Error('Por favor, ingresa el nombre de la ciudad y el ID del país.');
    }

    // 2. Verificar si el país existe
    const countryExists = await Country.findById(countryId);
    if (!countryExists) {
        res.status(404);
        throw new Error('El país especificado no existe.');
    }

    // 3. Verificar si la ciudad ya existe en ese país (gracias al índice unique del modelo)
    const cityExists = await City.findOne({ name, country: countryId });
    if (cityExists) {
        res.status(400);
        throw new Error('Ya existe una ciudad con este nombre en el país especificado.');
    }

    // 4. Crear la ciudad
    const city = await City.create({
        name,
        country: countryId,
        coordinates: {
            lat: lat,
            lng: lng
        }
    });

    if (city) {
        res.status(201).json({
            _id: city._id,
            name: city.name,
            country: city.country,
            coordinates: city.coordinates
        });
    } else {
        res.status(400);
        throw new Error('Datos de ciudad inválidos.');
    }
});

// @desc    Obtener todas las ciudades
// @route   GET /api/cities
// @access  Public
const getCities = asyncHandler(async (req, res) => {
    // La consulta puede incluir el parámetro 'countryId' para filtrar por país
    const { countryId } = req.query; // req.query se usa para parámetros en la URL como ?countryId=...

    let query = {};
    if (countryId) {
        // Verificar si el countryId es un ObjectId válido para evitar errores de Mongoose
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            res.status(400);
            throw new Error('ID de país inválido.');
        }
        query.country = countryId;
    }

    // Usamos .populate('country') para obtener los detalles del país en lugar solo del ID
    const cities = await City.find(query).populate('country', 'name'); // Solo trae el nombre del país

    res.status(200).json(cities);
});

// @desc    Obtener una ciudad por ID
// @route   GET /api/cities/:id
// @access  Public
const getCityById = asyncHandler(async (req, res) => {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de ciudad inválido.');
    }

    const city = await City.findById(req.params.id).populate('country', 'name');

    if (city) {
        res.status(200).json(city);
    } else {
        res.status(404);
        throw new Error('Ciudad no encontrada.');
    }
});

// @desc    Actualizar una ciudad
// @route   PUT /api/cities/:id
// @access  Private/Admin
const updateCity = asyncHandler(async (req, res) => {
    const { name, countryId, lat, lng } = req.body;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de ciudad inválido.');
    }

    const city = await City.findById(req.params.id);

    if (city) {
        // Si se intenta cambiar el país, verificar que el nuevo país exista
        if (countryId && String(city.country) !== countryId) { // Convertir a string para comparar ObjectId
            const newCountryExists = await Country.findById(countryId);
            if (!newCountryExists) {
                res.status(404);
                throw new Error('El nuevo país especificado no existe.');
            }
            // Además, verificar si la nueva combinación nombre/país ya existe
            const existingCityInNewCountry = await City.findOne({ name: name || city.name, country: countryId });
            if (existingCityInNewCountry && String(existingCityInNewCountry._id) !== req.params.id) {
                res.status(400);
                throw new Error('Ya existe una ciudad con este nombre en el nuevo país.');
            }
            city.country = countryId;
        } else if (name && name !== city.name) { // Si solo cambia el nombre, verificar unicidad en el mismo país
            const existingCityWithName = await City.findOne({ name, country: city.country });
            if (existingCityWithName && String(existingCityWithName._id) !== req.params.id) {
                res.status(400);
                throw new Error('Ya existe una ciudad con este nombre en el mismo país.');
            }
        }


        city.name = name || city.name;
        city.coordinates.lat = lat !== undefined ? lat : city.coordinates.lat;
        city.coordinates.lng = lng !== undefined ? lng : city.coordinates.lng;

        const updatedCity = await city.save();

        res.status(200).json({
            _id: updatedCity._id,
            name: updatedCity.name,
            country: updatedCity.country,
            coordinates: updatedCity.coordinates
        });
    } else {
        res.status(404);
        throw new Error('Ciudad no encontrada.');
    }
});

// @desc    Eliminar una ciudad
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = asyncHandler(async (req, res) => {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de ciudad inválido.');
    }

    const city = await City.findById(req.params.id);

    if (city) {
        // TODO: Considerar si hay dependencias (ej. sitios, personas famosas en esta ciudad)
        // Antes de eliminar una ciudad, podrías querer:
        // 1. Eliminar o reasignar los sitios y personas famosas asociadas.
        // 2. O simplemente bloquear la eliminación si tiene dependencias para mantener la integridad.
        // Por simplicidad, aquí solo se elimina la ciudad.

        await City.deleteOne({ _id: req.params.id }); // Mongoose 6+ prefer deleteOne
        res.status(200).json({ message: 'Ciudad eliminada correctamente.' });
    } else {
        res.status(404);
        throw new Error('Ciudad no encontrada.');
    }
});

module.exports = {
    createCity,
    getCities,
    getCityById,
    updateCity,
    deleteCity
};