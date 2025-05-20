const Country = require('../models/Country');
const asyncHandler = require('express-async-handler'); // Para manejar errores asíncronos sin try/catch

// @desc    Crear un nuevo país
// @route   POST /api/countries
// @access  Private/Admin (solo administradores pueden añadir países)
const createCountry = asyncHandler(async (req, res) => {
    const { name, code } = req.body;

    // 1. Validar campos requeridos
    if (!name || !code) {
        res.status(400);
        throw new Error('Por favor, ingresa el nombre y el código del país.');
    }

    // 2. Validar longitud del código (basado en schema, length: 2)
    if (code.length !== 2) {
        res.status(400);
        throw new Error('El código del país debe tener exactamente 2 caracteres.');
    }

    // 3. Verificar si el país ya existe por nombre o código (gracias a unique en el schema)
    const countryExists = await Country.findOne({ $or: [{ name: name }, { code: code.toUpperCase() }] });
    if (countryExists) {
        res.status(400);
        throw new Error('Ya existe un país con este nombre o código.');
    }

    // 4. Crear el país
    const country = await Country.create({
        name,
        code: code.toUpperCase() // Asegurarse de que el código se guarde en mayúsculas
    });

    if (country) {
        res.status(201).json({
            _id: country._id,
            name: country.name,
            code: country.code
        });
    } else {
        res.status(400);
        throw new Error('Datos de país inválidos.');
    }
});

// @desc    Obtener todos los países
// @route   GET /api/countries
// @access  Public
const getCountries = asyncHandler(async (req, res) => {
    const countries = await Country.find({});
    res.status(200).json(countries);
});

// @desc    Obtener un país por ID
// @route   GET /api/countries/:id
// @access  Public
const getCountryById = asyncHandler(async (req, res) => {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de país inválido.');
    }

    const country = await Country.findById(req.params.id);

    if (country) {
        res.status(200).json(country);
    } else {
        res.status(404);
        throw new Error('País no encontrado.');
    }
});

// @desc    Actualizar un país
// @route   PUT /api/countries/:id
// @access  Private/Admin
const updateCountry = asyncHandler(async (req, res) => {
    const { name, code } = req.body;

    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de país inválido.');
    }

    const country = await Country.findById(req.params.id);

    if (country) {
        // Verificar unicidad si el nombre o código cambian
        if (name && name !== country.name) {
            const nameExists = await Country.findOne({ name });
            if (nameExists && String(nameExists._id) !== req.params.id) {
                res.status(400);
                throw new Error('Ya existe un país con este nombre.');
            }
            country.name = name;
        }

        if (code) {
            const upperCode = code.toUpperCase();
            if (upperCode.length !== 2) {
                res.status(400);
                throw new Error('El código del país debe tener exactamente 2 caracteres.');
            }
            if (upperCode !== country.code) {
                const codeExists = await Country.findOne({ code: upperCode });
                if (codeExists && String(codeExists._id) !== req.params.id) {
                    res.status(400);
                    throw new Error('Ya existe un país con este código.');
                }
                country.code = upperCode;
            }
        }

        const updatedCountry = await country.save();

        res.status(200).json({
            _id: updatedCountry._id,
            name: updatedCountry.name,
            code: updatedCountry.code
        });
    } else {
        res.status(404);
        throw new Error('País no encontrado.');
    }
});

// @desc    Eliminar un país
// @route   DELETE /api/countries/:id
// @access  Private/Admin
const deleteCountry = asyncHandler(async (req, res) => {
    // Verificar si el ID es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de país inválido.');
    }

    const country = await Country.findById(req.params.id);

    if (country) {
        // TODO: MUY IMPORTANTE: Considerar dependencias (Ciudades, Platos, Personas Famosas)
        // Antes de eliminar un país, debes asegurarte de que no haya ciudades, platos o personas
        // famosas asociadas a él, o bien implementar una lógica para:
        // 1. Eliminar en cascada las dependencias (peligroso, pero a veces necesario).
        // 2. Reasignar las dependencias a otro país (complejo).
        // 3. Bloquear la eliminación si existen dependencias.
        // Aquí, por simplicidad, solo se elimina el país.
        await Country.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'País eliminado correctamente.' });
    } else {
        res.status(404);
        throw new Error('País no encontrado.');
    }
});

module.exports = {
    createCountry,
    getCountries,
    getCountryById,
    updateCountry,
    deleteCountry
};