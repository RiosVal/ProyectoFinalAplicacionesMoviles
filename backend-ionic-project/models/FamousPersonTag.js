const mongoose = require('mongoose');

const famousPersonTagSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    FamousPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamousPerson',
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
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

const FamousPersonTag = mongoose.model('FamousPersonTag', famousPersonTagSchema);
module.exports = FamousPersonTag;