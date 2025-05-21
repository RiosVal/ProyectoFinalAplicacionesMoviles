require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // Para servir archivos estáticos

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');
const cityRoutes = require('./routes/cityRoutes');
const famousPersonRoutes = require('./routes/famousPersonRoutes');
const siteRoutes = require('./routes/siteRoutes');
const dishRoutes = require('./routes/dishRoutes');
const visitRoutes = require('./routes/visitRoutes');
const famousPersonTagRoutes = require('./routes/famousPersonTagRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();

app.use(express.json()); // Body parser para JSON
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Servir archivos estáticos de la carpeta 'public' (para imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/famous-people', famousPersonRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/famous-person-tags', famousPersonTagRoutes);
app.use('/api/users', userRoutes);


// Ruta de bienvenida (opcional)
app.get('/', (req, res) => {
    res.send('API está corriendo...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});