// test_user_model.js
const path = require('path');

// La ruta absoluta que me proporcionaste
const absolutePathToUser = 'C:/Users/Asus/Desktop/2025-1/Moviles/proyecto-final/backend-ionic-project/models/User.js';

// Intenta requerir el modelo
try {
    const User = require(absolutePathToUser);
    console.log('Modelo User cargado con éxito:', User.modelName);
} catch (error) {
    console.error('Error al cargar el modelo User:', error.message);
    console.error('Ruta intentada:', absolutePathToUser);
    console.error('Stack trace:', error.stack);
}

// También prueba con path.join por si acaso
const projectRoot = __dirname; // Esto sería C:\Users\Asus\Desktop\2025-1\Moviles\proyecto-final\backend-ionic-project\
const userModelPath = path.join(projectRoot, 'models', 'User.js');
console.log('Ruta construida con path.join:', userModelPath);

try {
    const UserWithJoin = require(userModelPath);
    console.log('Modelo User cargado con éxito (con path.join):', UserWithJoin.modelName);
} catch (error) {
    console.error('Error al cargar el modelo User (con path.join):', error.message);
    console.error('Ruta intentada (con path.join):', userModelPath);
    console.error('Stack trace (con path.join):', error.stack);
}