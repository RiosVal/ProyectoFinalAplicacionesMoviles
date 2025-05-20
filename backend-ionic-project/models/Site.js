const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    imageUrl: {
        type: String,
        required: true
    },
    qrCode: {
        type: String,
        required: true
    }
});

const Site = mongoose.model('Site', siteSchema);
module.exports = Site;