const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({ // Agrega mongoose.Schema aquí para consistencia
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
        required: true,
        default: Date.now // Es buena práctica para que se establezca automáticamente si no se envía
    },
    method: {
        type: String,
        required: true,
        enum: ['QR_SCAN', 'PHOTO_UPLOAD'], // Define los valores permitidos para el método
        // Puedes agregar un default si uno es más común, ej. default: 'QR_SCAN'
    },
    photoUrl: {
        type: String,
        // photoUrl es requerido SOLO si el método es 'PHOTO_UPLOAD'
        required: function() {
            return this.method === 'PHOTO_UPLOAD';
        }
    },
    coordinates: {
        lat: { type: Number, required: false }, // Hago lat/lng opcionales si no siempre las vas a capturar
        lng: { type: Number, required: false }
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente para un mejor seguimiento
});

const Visit = mongoose.model('Visit', visitSchema);
module.exports = Visit;