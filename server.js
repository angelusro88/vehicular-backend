const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// ================== RUTA DE LOGIN ================== //
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Intento de login:', { email, password });
  
  // Credenciales hardcodeadas para prueba
  if (email === 'admin@uni.edu' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login exitoso',
      token: 'token_simulado_para_pruebas',
      user: {
        id: 1,
        name: 'Administrador',
        email: 'admin@uni.edu',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciales incorrectas'
    });
  }
});

// ================== RUTAS DE VEHÍCULOS ================== //
// Almacenamiento en memoria (simula base de datos)
let vehicles = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', placa: 'ABC123', año: 2020, color: 'Rojo' },
  { id: 2, marca: 'Honda', modelo: 'Civic', placa: 'XYZ789', año: 2021, color: 'Azul' }
];

// Ruta para obtener todos los vehículos
app.get('/api/vehicles', (req, res) => {
  console.log('✅ Obteniendo lista de vehículos');
  res.json(vehicles);
});

// Ruta para crear un nuevo vehículo
app.post('/api/vehicles', (req, res) => {
  const { marca, modelo, placa, año, color } = req.body;
  
  console.log('Intentando crear vehículo:', { marca, modelo, placa, año, color });

  // Validaciones básicas
  if (!marca || !modelo || !placa || !año) {
    return res.status(400).json({ 
      success: false, 
      message: 'Faltan campos obligatorios: marca, modelo, placa, año' 
    });
  }

  // Verificar si la placa ya existe
  const placaExists = vehicles.some(vehicle => vehicle.placa === placa);
  if (placaExists) {
    return res.status(400).json({
      success: false,
      message: 'La placa ya está registrada'
    });
  }

  // Crear nuevo vehículo
  const newVehicle = {
    id: Date.now(), // ID único
    marca: marca.trim(),
    modelo: modelo.trim(), 
    placa: placa.trim().toUpperCase(),
    año: parseInt(año),
    color: color ? color.trim() : '',
    fecha_creacion: new Date().toISOString()
  };

  // Agregar a la "base de datos"
  vehicles.push(newVehicle);

  console.log('✅ Vehículo creado exitosamente:', newVehicle);
  
  res.json({ 
    success: true, 
    message: 'Vehículo registrado exitosamente',
    vehicle: newVehicle 
  });
});

// Ruta para eliminar un vehículo
app.delete('/api/vehicles/:id', (req, res) => {
  const vehicleId = parseInt(req.params.id);
  
  console.log('Intentando eliminar vehículo ID:', vehicleId);

  // Buscar el índice del vehículo
  const vehicleIndex = vehicles.findIndex(vehicle => vehicle.id === vehicleId);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Vehículo no encontrado'
    });
  }

  // Eliminar el vehículo
  const deletedVehicle = vehicles.splice(vehicleIndex, 1)[0];
  
  console.log('🗑️ Vehículo eliminado:', deletedVehicle);
  
  res.json({ 
    success: true, 
    message: `Vehículo ${deletedVehicle.placa} eliminado exitosamente`,
    vehicle: deletedVehicle
  });
});

// ================== RUTA DE PRUEBA ================== //
app.get('/api/test', (req, res) => {
  console.log('✅ Ruta /api/test fue accedida');
  res.json({ message: '¡Backend funcionando correctamente! 🚀' });
});

// ================== MANEJO DE ERRORES ================== //
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta para manejar paths no encontrados
app.use('*', (req, res) => {
  console.log('⚠️  Ruta no encontrada:', req.originalUrl);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ================== INICIAR SERVIDOR ================== //
app.listen(PORT, () => {
  console.log(`✅ Servidor Node.js ejecutándose en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/vehicles`);
  console.log(`   POST   http://localhost:${PORT}/api/vehicles`);
  console.log(`   DELETE http://localhost:${PORT}/api/vehicles/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/test`);
}).on('error', (err) => {
  console.error('❌ Error al iniciar servidor:', err.message);
});