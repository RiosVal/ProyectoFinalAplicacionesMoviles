const Dish = require('../models/Dish');
const Country = require('../models/Country'); // Para verificar el país
const Site = require('../models/Site');       // Para verificar el sitio
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Crear un nuevo plato
// @route   POST /api/dishes
// @access  Private/Admin (solo administradores pueden añadir platos)
const createDish = asyncHandler(async (req, res) => {
    const { name, countryId, description, price, siteId, imageUrl } = req.body;

    // 1. Validar campos requeridos
    if (!name || !countryId || !description || price === undefined || !siteId || !imageUrl) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos requeridos: nombre, país, descripción, precio, sitio e URL de imagen.');
    }

    // 2. Verificar si el país existe
    const countryExists = await Country.findById(countryId);
    if (!countryExists) {
        res.status(404);
        throw new Error('El país especificado no existe.');
    }

    // 3. Verificar si el sitio existe
    const siteExists = await Site.findById(siteId);
    if (!siteExists) {
        res.status(404);
        throw new Error('El sitio especificado no existe.');
    }

    // 4. Opcional: Verificar si el plato ya existe para el mismo sitio
    // Esto dependerá de si un sitio puede tener el mismo plato con el mismo nombre
    // Por ahora, asumiremos que un plato con el mismo nombre puede existir en diferentes sitios.
    // Si quieres que el nombre del plato sea único por sitio:
    const dishExistsInSite = await Dish.findOne({ name, site: siteId });
    if (dishExistsInSite) {
        res.status(400);
        throw new Error('Ya existe un plato con este nombre en el sitio especificado.');
    }

    // 5. Crear el plato
    const dish = await Dish.create({
        name,
        country: countryId,
        description,
        price,
        site: siteId,
        imageUrl
    });

    if (dish) {
        // Popula para mostrar los nombres en la respuesta
        const populatedDish = await Dish.findById(dish._id)
            .populate('country', 'name')
            .populate('site', 'name');

        res.status(201).json(populatedDish);
    } else {
        res.status(400);
        throw new Error('Datos de plato inválidos.');
    }
});

// @desc    Obtener todos los platos
// @route   GET /api/dishes
// @access  Public
const getDishes = asyncHandler(async (req, res) => {
    // Permite filtrar por countryId o siteId
    const { countryId, siteId } = req.query;
    let query = {};

    if (countryId) {
        if (!mongoose.Types.ObjectId.isValid(countryId)) {
            res.status(400);
            throw new Error('ID de país inválido.');
        }
        query.country = countryId;
    }
    if (siteId) {
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            res.status(400);
            throw new Error('ID de sitio inválido.');
        }
        query.site = siteId;
    }

    // Popula para obtener los nombres de país y sitio en la respuesta
    const dishes = await Dish.find(query)
        .populate('country', 'name')
        .populate('site', 'name');

    res.status(200).json(dishes);
});

// @desc    Obtener un plato por ID
// @route   GET /api/dishes/:id
// @access  Public
const getDishById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de plato inválido.');
    }

    const dish = await Dish.findById(req.params.id)
        .populate('country', 'name')
        .populate('site', 'name');

    if (dish) {
        res.status(200).json(dish);
    } else {
        res.status(404);
        throw new Error('Plato no encontrado.');
    }
});

// @desc    Actualizar un plato
// @route   PUT /api/dishes/:id
// @access  Private/Admin
const updateDish = asyncHandler(async (req, res) => {
    const { name, countryId, description, price, siteId, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de plato inválido.');
    }

    const dish = await Dish.findById(req.params.id);

    if (dish) {
        // Verificar existencia y unicidad si se cambian las referencias (país, sitio)
        if (countryId && String(dish.country) !== countryId) {
            const newCountryExists = await Country.findById(countryId);
            if (!newCountryExists) {
                res.status(404);
                throw new Error('El nuevo país especificado no existe.');
            }
            dish.country = countryId;
        }

        if (siteId && String(dish.site) !== siteId) {
            const newSiteExists = await Site.findById(siteId);
            if (!newSiteExists) {
                res.status(404);
                throw new Error('El nuevo sitio especificado no existe.');
            }
            // Si el sitio cambia, verificar unicidad del nombre del plato en el nuevo sitio
            const existingDishInNewSite = await Dish.findOne({ name: name || dish.name, site: siteId });
            if (existingDishInNewSite && String(existingDishInNewSite._id) !== req.params.id) {
                res.status(400);
                throw new Error('Ya existe un plato con este nombre en el nuevo sitio.');
            }
            dish.site = siteId;
        } else if (name && name !== dish.name) { // Si solo cambia el nombre, verificar unicidad en el mismo sitio
            const existingDishWithName = await Dish.findOne({ name, site: dish.site });
            if (existingDishWithName && String(existingDishWithName._id) !== req.params.id) {
                res.status(400);
                throw new Error('Ya existe un plato con este nombre en el mismo sitio.');
            }
        }


        dish.name = name !== undefined ? name : dish.name;
        dish.description = description !== undefined ? description : dish.description;
        dish.price = price !== undefined ? price : dish.price;
        dish.imageUrl = imageUrl !== undefined ? imageUrl : dish.imageUrl;

        const updatedDish = await dish.save();

        // Popula para mostrar los nombres en la respuesta
        const populatedUpdatedDish = await Dish.findById(updatedDish._id)
            .populate('country', 'name')
            .populate('site', 'name');

        res.status(200).json(populatedUpdatedDish);
    } else {
        res.status(404);
        throw new Error('Plato no encontrado.');
    }
});

// @desc    Eliminar un plato
// @route   DELETE /api/dishes/:id
// @access  Private/Admin
const deleteDish = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de plato inválido.');
    }

    const dish = await Dish.findById(req.params.id);

    if (dish) {
        await Dish.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Plato eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('Plato no encontrado.');
    }
});

module.exports = {
    createDish,
    getDishes,
    getDishById,
    updateDish,
    deleteDish
};