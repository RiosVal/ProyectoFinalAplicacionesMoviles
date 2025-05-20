const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    }
});

citySchema.index({ name: 1, country: 1 }, { unique: true }); // Para asegurar que no haya ciudades repetidas en el mismo país

const City = mongoose.model('City', citySchema);
module.exports = City;