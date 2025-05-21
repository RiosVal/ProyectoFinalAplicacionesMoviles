require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Country = require('./models/Country');
const City = require('./models/City');
const User = require('./models/User');
const FamousPerson = require('./models/FamousPerson');
const Site = require('./models/Site');
const Dish = require('./models/Dish');
const Visit = require('./models/Visit'); // Asegúrate de importar Visit y FamousPersonTag si los vas a limpiar
const FamousPersonTag = require('./models/FamousPersonTag');

connectDB();

const importData = async () => {
    try {
        // Limpiar datos existentes
        console.log('Limpiando datos existentes...');
        await Country.deleteMany();
        await City.deleteMany();
        await User.deleteMany();
        await FamousPerson.deleteMany();
        await Site.deleteMany();
        await Dish.deleteMany();
        await Visit.deleteMany(); // Asegúrate de limpiar también estas colecciones
        await FamousPersonTag.deleteMany();
        console.log('Datos existentes eliminados.');

        // --- PAÍSES ---
        console.log('Creando países...');
        const colombia = await Country.create({ name: 'Colombia', code: 'CO' });
        const usa = await Country.create({ name: 'Estados Unidos', code: 'US' });

        // --- CIUDADES COLOMBIA ---
        console.log('Creando ciudades de Colombia...');
        const bogota = await City.create({ name: 'Bogotá', country: colombia._id, coordinates: { lat: 4.7110, lng: -74.0721 } });
        const medellin = await City.create({ name: 'Medellín', country: colombia._id, coordinates: { lat: 6.2442, lng: -75.5812 } });
        const cali = await City.create({ name: 'Cali', country: colombia._id, coordinates: { lat: 3.4516, lng: -76.5320 } });
        const cartagena = await City.create({ name: 'Cartagena', country: colombia._id, coordinates: { lat: 10.3910, lng: -75.4794 } });
        const barranquilla = await City.create({ name: 'Barranquilla', country: colombia._id, coordinates: { lat: 10.9685, lng: -74.7813 } });
        const bucaramanga = await City.create({ name: 'Bucaramanga', country: colombia._id, coordinates: { lat: 7.1254, lng: -73.1198 } });
        const pereira = await City.create({ name: 'Pereira', country: colombia._id, coordinates: { lat: 4.8133, lng: -75.6961 } });
        const cucuta = await City.create({ name: 'Cúcuta', country: colombia._id, coordinates: { lat: 7.8939, lng: -72.5078 } });
        const manizales = await City.create({ name: 'Manizales', country: colombia._id, coordinates: { lat: 5.0689, lng: -75.5173 } });
        const santaMarta = await City.create({ name: 'Santa Marta', country: colombia._id, coordinates: { lat: 11.2330, lng: -74.1990 } });
        const pasto = await City.create({ name: 'Pasto', country: colombia._id, coordinates: { lat: 1.2057, lng: -77.2818 } });
        const tunja = await City.create({ name: 'Tunja', country: colombia._id, coordinates: { lat: 5.53528, lng: -73.36778 } });
        const zipaquira = await City.create({ name: 'Zipaquira', country: colombia._id, coordinates: { lat: 5.0247, lng: -74.0014 } });


        // --- CIUDADES ESTADOS UNIDOS ---
        console.log('Creando ciudades de Estados Unidos...');
        const newYork = await City.create({ name: 'New York', country: usa._id, coordinates: { lat: 40.7128, lng: -74.0060 } });
        const losAngeles = await City.create({ name: 'Los Ángeles', country: usa._id, coordinates: { lat: 34.0522, lng: -118.2437 } });
        const chicago = await City.create({ name: 'Chicago', country: usa._id, coordinates: { lat: 41.8781, lng: -87.6298 } });
        const houston = await City.create({ name: 'Houston', country: usa._id, coordinates: { lat: 29.7604, lng: -95.3698 } });
        const phoenix = await City.create({ name: 'Phoenix', country: usa._id, coordinates: { lat: 33.4484, lng: -112.0740 } });
        const philadelphia = await City.create({ name: 'Filadelfia', country: usa._id, coordinates: { lat: 39.9526, lng: -75.1652 } });
        const sanAntonio = await City.create({ name: 'San Antonio', country: usa._id, coordinates: { lat: 29.4241, lng: -98.4936 } });
        const sanDiego = await City.create({ name: 'San Diego', country: usa._id, coordinates: { lat: 32.7157, lng: -117.1611 } });
        const dallas = await City.create({ name: 'Dallas', country: usa._id, coordinates: { lat: 32.7767, lng: -96.7970 } });
        const sanJose = await City.create({ name: 'San José', country: usa._id, coordinates: { lat: 37.3382, lng: -121.8863 } });
        const concord = await City.create({ name: 'Concord', country: usa._id, coordinates: { lat: 37.9781, lng: -122.0311 } });
        const honolulu = await City.create({ name: 'Honolulu', country: usa._id, coordinates: { lat: 21.3047, lng: -157.8572 } });

        // --- USUARIOS ---
        console.log('Creando usuarios...');
        const adminUser = await User.create({ email: 'admin@example.com', password: 'password123', role: 'Administrador' });
        const commonUser = await User.create({ email: 'user@example.com', password: 'password123', role: 'Usuario Común' });


        // --- SITIOS (Colombia) ---
        console.log('Creando sitios de Colombia...');
        const monserrate = await Site.create({
            name: 'Monserrate',
            city: bogota._id,
            country: colombia._id,
            type: 'Iglesia/Montaña',
            description: 'Santuario y mirador icónico de Bogotá.',
            coordinates: { lat: 4.6062, lng: -74.0583 },
            imageUrl: 'https://example.com/monserrate.jpg',
            qrCode: 'qr-monserrate-123'
        });
        const castilloSanFelipe = await Site.create({
            name: 'Castillo de San Felipe',
            city: cartagena._id,
            country: colombia._id,
            type: 'Fortaleza',
            description: 'Impresionante fortaleza colonial en Cartagena.',
            coordinates: { lat: 10.4247, lng: -75.5452 },
            imageUrl: 'https://example.com/sanfelipe.jpg',
            qrCode: 'qr-sanfelipe-456'
        });
        // Sitios de ejemplo para platos colombianos
        const restauranteAjiacoAbuela = await Site.create({
            name: 'Restaurante Ajiaco de la Abuela',
            city: bogota._id,
            country: colombia._id,
            type: 'Restaurante',
            description: 'Especializado en Ajiaco Santafereño.',
            coordinates: { lat: 4.6000, lng: -74.0800 },
            imageUrl: 'https://example.com/restaurante-ajiaco.jpg',
            qrCode: 'qr-ajiaco-rest'
        });
        const restauranteElRancherito = await Site.create({
            name: 'Restaurante El Rancherito',
            city: medellin._id,
            country: colombia._id,
            type: 'Restaurante',
            description: 'Famoso por su Bandeja Paisa y comida tradicional antioqueña.',
            coordinates: { lat: 6.2500, lng: -75.5700 },
            imageUrl: 'https://example.com/elrancherito.jpg',
            qrCode: 'qr-rancherito-rest'
        });
        // Añadir 6 sitios más de Colombia para llegar a 10
        await Site.create({
            name: 'Parque Tayrona',
            city: santaMarta._id,
            country: colombia._id,
            type: 'Parque Nacional',
            description: 'Parque natural con hermosas playas y biodiversidad.',
            coordinates: { lat: 11.3400, lng: -73.9600 },
            imageUrl: 'https://example.com/tayrona.jpg',
            qrCode: 'qr-tayrona-park'
        });
        await Site.create({
            name: 'Museo del Oro',
            city: bogota._id,
            country: colombia._id,
            type: 'Museo',
            description: 'Contiene la mayor colección de orfebrería precolombina.',
            coordinates: { lat: 4.5976, lng: -74.0700 },
            imageUrl: 'https://example.com/museo-oro.jpg',
            qrCode: 'qr-museooro-bog'
        });
        await Site.create({
            name: 'El Peñón de Guatapé',
            city: medellin._id, // Relacionado con Medellín por cercanía y turismo
            country: colombia._id,
            type: 'Monumento Natural',
            description: 'Gran roca monolítica con vistas espectaculares.',
            coordinates: { lat: 6.2000, lng: -75.1667 },
            imageUrl: 'https://example.com/guatape.jpg',
            qrCode: 'qr-guatape-rock'
        });
        await Site.create({
            name: 'Puente de Boyacá',
            city: tunja._id,
            country: colombia._id,
            type: 'Sitio Histórico',
            description: 'Lugar donde se libró la Batalla de Boyacá.',
            coordinates: { lat: 5.4674, lng: -73.4000 },
            imageUrl: 'https://example.com/puenteboyaca.jpg',
            qrCode: 'qr-boyaca-bridge'
        });
        await Site.create({
            name: 'Plaza de Bolívar',
            city: bogota._id,
            country: colombia._id,
            type: 'Plaza/Histórico',
            description: 'Plaza principal de Bogotá, rodeada de edificios históricos.',
            coordinates: { lat: 4.5981, lng: -74.0758 },
            imageUrl: 'https://example.com/plaza-bolivar.jpg',
            qrCode: 'qr-plaza-bolivar'
        });
        await Site.create({
            name: 'Estadio Metropolitano Roberto Meléndez',
            city: barranquilla._id,
            country: colombia._id,
            type: 'Estadio',
            description: 'Principal estadio de fútbol de Barranquilla.',
            coordinates: { lat: 10.9230, lng: -74.8800 },
            imageUrl: 'https://example.com/estadio-barranquilla.jpg',
            qrCode: 'qr-metropolitano'
        });


        // --- SITIOS (Estados Unidos) ---
        console.log('Creando sitios de Estados Unidos...');
        const estatuaLibertad = await Site.create({
            name: 'Estatua de la Libertad',
            city: newYork._id,
            country: usa._id,
            type: 'Monumento',
            description: 'Símbolo icónico de la libertad y democracia en Nueva York.',
            coordinates: { lat: 40.6892, lng: -74.0445 },
            imageUrl: 'https://example.com/liberty.jpg',
            qrCode: 'qr-liberty-789'
        });
        const hollywoodWalkOfFame = await Site.create({
            name: 'Hollywood Walk of Fame',
            city: losAngeles._id,
            country: usa._id,
            type: 'Atracción Turística',
            description: 'Famoso paseo con estrellas en honor a celebridades del entretenimiento.',
            coordinates: { lat: 34.1010, lng: -118.3370 },
            imageUrl: 'https://example.com/hollywood-walk.jpg',
            qrCode: 'qr-hollywood-901'
        });
        // Sitios de ejemplo para platos estadounidenses
        const shakeShackTimesSquare = await Site.create({
            name: 'Shake Shack Times Square',
            city: newYork._id,
            country: usa._id,
            type: 'Restaurante',
            description: 'Famosa cadena de hamburguesas en Times Square.',
            coordinates: { lat: 40.7580, lng: -73.9855 },
            imageUrl: 'https://example.com/shakeshack.jpg',
            qrCode: 'qr-shakeshack-ts'
        });
        const joesPizza = await Site.create({
            name: 'Joe\'s Pizza',
            city: newYork._id,
            country: usa._id,
            type: 'Restaurante',
            description: 'Pizzería icónica de estilo neoyorquino.',
            coordinates: { lat: 40.7305, lng: -74.0021 },
            imageUrl: 'https://example.com/joespizza.jpg',
            qrCode: 'qr-joespizza-ny'
        });
        // Añadir 6 sitios más de Estados Unidos para llegar a 10
        await Site.create({
            name: 'Golden Gate Bridge',
            city: sanJose._id, // Asigna a San José por cercanía razonable para el seed
            country: usa._id,
            type: 'Puente/Icono',
            description: 'Famoso puente colgante en California.',
            coordinates: { lat: 37.8199, lng: -122.4783 },
            imageUrl: 'https://example.com/goldengate.jpg',
            qrCode: 'qr-goldengate'
        });
        await Site.create({
            name: 'Central Park',
            city: newYork._id,
            country: usa._id,
            type: 'Parque',
            description: 'Gran parque urbano en el corazón de Manhattan.',
            coordinates: { lat: 40.7829, lng: -73.9654 },
            imageUrl: 'https://example.com/centralpark.jpg',
            qrCode: 'qr-centralpark'
        });
        await Site.create({
            name: 'Lincoln Memorial',
            city: philadelphia._id, // Asigna a Filadelfia por ejemplo, aunque está en Washington D.C.
            country: usa._id,
            type: 'Monumento',
            description: 'Monumento dedicado a Abraham Lincoln.',
            coordinates: { lat: 38.8893, lng: -77.0506 },
            imageUrl: 'https://example.com/lincoln.jpg',
            qrCode: 'qr-lincolnmemorial'
        });
        await Site.create({
            name: 'Grand Canyon National Park',
            city: phoenix._id, // Ciudad cercana
            country: usa._id,
            type: 'Parque Nacional',
            description: 'Famoso cañón en Arizona.',
            coordinates: { lat: 36.1000, lng: -112.1000 },
            imageUrl: 'https://example.com/grandcanyon.jpg',
            qrCode: 'qr-grandcanyon'
        });
        await Site.create({
            name: 'Space Needle',
            city: sanDiego._id, // Ciudad cercana, o podrías añadir Seattle
            country: usa._id,
            type: 'Mirador/Torre',
            description: 'Torre icónica en Seattle.',
            coordinates: { lat: 47.6205, lng: -122.3493 },
            imageUrl: 'https://example.com/spaceneedle.jpg',
            qrCode: 'qr-spaceneedle'
        });
        await Site.create({
            name: 'White House',
            city: philadelphia._id, // Ciudad cercana para el ejemplo
            country: usa._id,
            type: 'Edificio Gubernamental',
            description: 'Residencia oficial y principal lugar de trabajo del Presidente de los Estados Unidos.',
            coordinates: { lat: 38.8977, lng: -77.0365 },
            imageUrl: 'https://example.com/whitehouse.jpg',
            qrCode: 'qr-whitehouse'
        });


        // --- PERSONAS FAMOSAS (Colombia) ---
        console.log('Creando personas famosas de Colombia...');
        await FamousPerson.create({
            name: 'Shakira',
            lastName: 'Mebarak',
            cityOfBirth: barranquilla._id,
            countryOfOrigin: colombia._id,
            category: 'Cantante',
            description: 'Famosa cantante y compositora colombiana, reconocida mundialmente.',
            imageUrl: 'https://example.com/shakira.jpg'
        });
        await FamousPerson.create({
            name: 'Juanes',
            lastName: 'Aristizábal',
            cityOfBirth: medellin._id,
            countryOfOrigin: colombia._id,
            category: 'Cantante',
            description: 'Cantante, compositor y músico colombiano, ganador de múltiples premios Grammy.',
            imageUrl: 'https://example.com/juanes.jpg'
        });
        await FamousPerson.create({
            name: 'Gabriel',
            lastName: 'García Márquez',
            cityOfBirth: santaMarta._id,
            countryOfOrigin: colombia._id,
            category: 'Escritor',
            description: 'Premio Nobel de Literatura, autor de "Cien años de soledad".',
            imageUrl: 'https://example.com/gabo.jpg'
        });
        await FamousPerson.create({
            name: 'Nairo',
            lastName: 'Quintana',
            cityOfBirth: tunja._id,
            countryOfOrigin: colombia._id,
            category: 'Deportista',
            description: 'Ciclista profesional colombiano, ganador del Giro de Italia y la Vuelta a España.',
            imageUrl: 'https://example.com/nairo.jpg'
        });
        await FamousPerson.create({
            name: 'James',
            lastName: 'Rodríguez',
            cityOfBirth: cucuta._id,
            countryOfOrigin: colombia._id,
            category: 'Deportista',
            description: 'Futbolista colombiano, conocido por su habilidad y visión de juego.',
            imageUrl: 'https://example.com/james.jpg'
        });
        await FamousPerson.create({
            name: 'Sofía',
            lastName: 'Vergara',
            cityOfBirth: barranquilla._id,
            countryOfOrigin: colombia._id,
            category: 'Actriz',
            description: 'Actriz y modelo colombiana, reconocida por su papel en Modern Family.',
            imageUrl: 'https://example.com/sofiavergara.jpg'
        });
        await FamousPerson.create({
            name: 'Carlos',
            lastName: 'Vives',
            cityOfBirth: santaMarta._id,
            countryOfOrigin: colombia._id,
            category: 'Cantante',
            description: 'Cantante, compositor y actor colombiano, pionero del vallenato-pop.',
            imageUrl: 'https://example.com/carlosvives.jpg'
        });
        await FamousPerson.create({
            name: 'Fernando',
            lastName: 'Botero',
            cityOfBirth: medellin._id,
            countryOfOrigin: colombia._id,
            category: 'Artista',
            description: 'Reconocido pintor y escultor colombiano, famoso por sus figuras voluminosas.',
            imageUrl: 'https://example.com/botero.jpg'
        });
        await FamousPerson.create({
            name: 'Egan',
            lastName: 'Bernal',
            cityOfBirth: zipaquira._id || bogota._id, // Si Zipaquira no es ciudad, usar Bogotá
            countryOfOrigin: colombia._id,
            category: 'Deportista',
            description: 'Ciclista colombiano, ganador del Tour de Francia y Giro de Italia.',
            imageUrl: 'https://example.com/egan.jpg'
        });
        await FamousPerson.create({
            name: 'Falcao',
            lastName: 'García',
            cityOfBirth: santaMarta._id,
            countryOfOrigin: colombia._id,
            category: 'Deportista',
            description: 'Futbolista colombiano, uno de los mejores delanteros de su generación.',
            imageUrl: 'https://example.com/falcao.jpg'
        });


        // --- PERSONAS FAMOSAS (Estados Unidos) ---
        console.log('Creando personas famosas de Estados Unidos...');
        await FamousPerson.create({
            name: 'Tom',
            lastName: 'Hanks',
            cityOfBirth: concord._id,
            countryOfOrigin: usa._id,
            category: 'Actor',
            description: 'Actor y productor estadounidense, ganador de dos premios Óscar.',
            imageUrl: 'https://example.com/tomhanks.jpg'
        });
        await FamousPerson.create({
            name: 'Beyoncé',
            lastName: 'Knowles-Carter',
            cityOfBirth: houston._id,
            countryOfOrigin: usa._id,
            category: 'Cantante',
            description: 'Cantante, compositora y empresaria estadounidense, una de las artistas más influyentes.',
            imageUrl: 'https://example.com/beyonce.jpg'
        });
        await FamousPerson.create({
            name: 'Michael',
            lastName: 'Jordan',
            cityOfBirth: newYork._id, // Born in Brooklyn
            countryOfOrigin: usa._id,
            category: 'Deportista',
            description: 'Considerado el mejor jugador de baloncesto de todos los tiempos.',
            imageUrl: 'https://example.com/mjordan.jpg'
        });
        await FamousPerson.create({
            name: 'Meryl',
            lastName: 'Streep',
            cityOfBirth: newYork._id, // Born in Summit, NJ, but NY is close for example
            countryOfOrigin: usa._id,
            category: 'Actriz',
            description: 'Actriz aclamada con el mayor número de nominaciones al Oscar.',
            imageUrl: 'https://example.com/merylstreep.jpg'
        });
        await FamousPerson.create({
            name: 'Barack',
            lastName: 'Obama',
            cityOfBirth: honolulu._id || losAngeles._id, // If Honolulu not seeded, use LA
            countryOfOrigin: usa._id,
            category: 'Político',
            description: '44º Presidente de los Estados Unidos.',
            imageUrl: 'https://example.com/obama.jpg'
        });
        await FamousPerson.create({
            name: 'Oprah',
            lastName: 'Winfrey',
            cityOfBirth: chicago._id, // Born in Mississippi, but Chicago is often associated
            countryOfOrigin: usa._id,
            category: 'Presentadora/Empresaria',
            description: 'Icono de los medios de comunicación y filántropa.',
            imageUrl: 'https://example.com/oprah.jpg'
        });
        await FamousPerson.create({
            name: 'LeBron',
            lastName: 'James',
            cityOfBirth: losAngeles._id, // Born in Akron, Ohio
            countryOfOrigin: usa._id,
            category: 'Deportista',
            description: 'Estrella de la NBA, considerado uno de los mejores de la historia.',
            imageUrl: 'https://example.com/lebron.jpg'
        });
        await FamousPerson.create({
            name: 'Steven',
            lastName: 'Spielberg',
            cityOfBirth: losAngeles._id, // Born in Cincinnati, Ohio
            countryOfOrigin: usa._id,
            category: 'Director de Cine',
            description: 'Director y productor de cine, pionero de la nueva era de Hollywood.',
            imageUrl: 'https://example.com/spielberg.jpg'
        });
        await FamousPerson.create({
            name: 'Taylor',
            lastName: 'Swift',
            cityOfBirth: newYork._id, // Born in West Reading, PA
            countryOfOrigin: usa._id,
            category: 'Cantante',
            description: 'Cantante y compositora de pop y country, una de las artistas más vendidas.',
            imageUrl: 'https://example.com/taylorswift.jpg'
        });
        await FamousPerson.create({
            name: 'Elon',
            lastName: 'Musk',
            cityOfBirth: losAngeles._id, // Born in South Africa, but often associated with US tech hubs
            countryOfOrigin: usa._id,
            category: 'Empresario',
            description: 'CEO de SpaceX y Tesla, figura clave en la tecnología y la innovación.',
            imageUrl: 'https://example.com/elonmusk.jpg'
        });

        // --- PLATOS/COMIDAS (Colombia) ---
        console.log('Creando platos de Colombia...');
        await Dish.create({
            name: 'Ajiaco Santafereño',
            country: colombia._id,
            description: 'Sopa espesa con tres tipos de papa, pollo, mazorca y guascas.',
            price: 15.00,
            site: restauranteAjiacoAbuela._id,
            imageUrl: 'https://example.com/ajiaco.jpg'
        });
        await Dish.create({
            name: 'Bandeja Paisa',
            country: colombia._id,
            description: 'Plato típico con frijoles, arroz, carne molida, chicharrón, huevo, arepa, etc.',
            price: 18.00,
            site: restauranteElRancherito._id,
            imageUrl: 'https://example.com/bandejapaisa.jpg'
        });
        // Añadir 8 platos más de Colombia
        await Dish.create({
            name: 'Arepas con huevo',
            country: colombia._id,
            description: 'Arepas fritas rellenas de huevo.',
            price: 5.00,
            site: barranquilla._id, // Se refiere a una ciudad, debes referenciar un sitio de comida si existe
            imageUrl: 'https://example.com/arepashuevo.jpg'
        });
        await Dish.create({
            name: 'Sancocho de Gallina',
            country: colombia._id,
            description: 'Sopa tradicional colombiana con gallina, papas, yuca y plátano.',
            price: 16.00,
            site: restauranteElRancherito._id,
            imageUrl: 'https://example.com/sancocho.jpg'
        });
        await Dish.create({
            name: 'Lechona Tolimense',
            country: colombia._id,
            description: 'Cerdo asado relleno de arroz, arvejas y especias.',
            price: 20.00,
            site: bogota._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/lechona.jpg'
        });
        await Dish.create({
            name: 'Ceviche de Camarón',
            country: colombia._id,
            description: 'Camarones marinados en limón, cebolla y cilantro.',
            price: 14.00,
            site: cartagena._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/ceviche.jpg'
        });
        await Dish.create({
            name: 'Empanadas Colombianas',
            country: colombia._id,
            description: 'Pequeñas empanadas de maíz rellenas de carne o papa.',
            price: 3.00,
            site: bogota._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/empanadas.jpg'
        });
        await Dish.create({
            name: 'Tamales Tolimenses',
            country: colombia._id,
            description: 'Masa de maíz rellena de carne, arroz y vegetales, envuelta en hoja de plátano.',
            price: 10.00,
            site: bogota._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/tamales.jpg'
        });
        await Dish.create({
            name: 'Posta Negra Cartagenera',
            country: colombia._id,
            description: 'Carne de res cocida lentamente en salsa dulce y oscura.',
            price: 22.00,
            site: cartagena._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/postanegra.jpg'
        });
        await Dish.create({
            name: 'Pescado Frito con Patacón',
            country: colombia._id,
            description: 'Pescado entero frito, servido con plátanos verdes fritos.',
            price: 17.00,
            site: santaMarta._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/pescadofrito.jpg'
        });


        // --- PLATOS/COMIDAS (Estados Unidos) ---
        console.log('Creando platos de Estados Unidos...');
        await Dish.create({
            name: 'Hamburguesa Americana',
            country: usa._id,
            description: 'Clásica hamburguesa con carne de res, queso, lechuga, tomate y salsa.',
            price: 12.50,
            site: shakeShackTimesSquare._id,
            imageUrl: 'https://example.com/hamburger.jpg'
        });
        await Dish.create({
            name: 'New York Style Pizza',
            country: usa._id,
            description: 'Rebanada grande de pizza con masa fina y crujiente.',
            price: 4.00,
            site: joesPizza._id,
            imageUrl: 'https://example.com/nypizza.jpg'
        });
        // Añadir 8 platos más de Estados Unidos
        await Dish.create({
            name: 'Hot Dog de Chicago',
            country: usa._id,
            description: 'Salchicha de res con mostaza, cebolla, pepinillos, tomate y más.',
            price: 7.00,
            site: chicago._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/hotdog.jpg'
        });
        await Dish.create({
            name: 'Costillas BBQ Texas Style',
            country: usa._id,
            description: 'Costillas de cerdo o res ahumadas lentamente con salsa BBQ.',
            price: 25.00,
            site: houston._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/bbqribs.jpg'
        });
        await Dish.create({
            name: 'Cheesesteak de Filadelfia',
            country: usa._id,
            description: 'Sándwich de carne de res en rodajas finas y queso derretido.',
            price: 11.00,
            site: philadelphia._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/cheesesteak.jpg'
        });
        await Dish.create({
            name: 'Tacos de Pescado de San Diego',
            country: usa._id,
            description: 'Tortillas de maíz con pescado frito o a la parrilla, repollo y salsa.',
            price: 9.50,
            site: sanDiego._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/fishtacos.jpg'
        });
        await Dish.create({
            name: 'Clam Chowder de Boston',
            country: usa._id,
            description: 'Sopa espesa y cremosa de almejas y papas.',
            price: 10.00,
            site: newYork._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/clamchowder.jpg'
        });
        await Dish.create({
            name: 'Fried Chicken del Sur',
            country: usa._id,
            description: 'Pollo frito crujiente y jugoso, un clásico del sur de EE. UU.',
            price: 14.00,
            site: dallas._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/friedchicken.jpg'
        });
        await Dish.create({
            name: 'Brownie de Chocolate',
            country: usa._id,
            description: 'Postre de chocolate denso y fudgy.',
            price: 6.00,
            site: newYork._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/brownie.jpg'
        });
        await Dish.create({
            name: 'Apple Pie',
            country: usa._id,
            description: 'Pastel de manzana tradicional estadounidense.',
            price: 8.00,
            site: newYork._id, // Asigna a un sitio de comida real
            imageUrl: 'https://example.com/applepie.jpg'
        });


        console.log('Datos importados con éxito!');
        process.exit();
    } catch (error) {
        console.error(`Error al importar datos: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        console.log('Destruyendo datos...');
        await Country.deleteMany();
        await City.deleteMany();
        await User.deleteMany();
        await FamousPerson.deleteMany();
        await Site.deleteMany();
        await Dish.deleteMany();
        await Visit.deleteMany();
        await FamousPersonTag.deleteMany();
        console.log('Datos destruidos!');
        process.exit();
    } catch (error) {
        console.error(`Error al destruir datos: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}