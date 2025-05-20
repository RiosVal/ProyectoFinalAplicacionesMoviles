const mongoose = require('mongoose');

const famousPersonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    cityOfBirth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    countryOfOrigin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },   
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    } 
});

const FamousPerson = mongoose.model('FamousPerson', famousPersonSchema);
module.exports = FamousPerson;