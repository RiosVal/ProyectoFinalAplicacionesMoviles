const mongoose = require('mongoose');

const visitSchema = ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        required: true
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    }
});

const Visit = mongoose.model('Visit', visitSchema);
module.exports = Visit;