const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: { // Ej: CO, US
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        length: 2
    }
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;