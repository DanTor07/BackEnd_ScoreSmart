require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usuarioRoutes = require('./routes/usuarioRoutes');
const creditoRoutes = require('./routes/creditoRoutes');
const registroRoutes = require('./routes/registroRoutes');
const inicioRoutes = require('./routes/inicioRoutes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Conexión a MongoDB sin opciones obsoletas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.log('Error de conexión:', error));

// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/creditos', creditoRoutes);
app.use('/api/registros', registroRoutes); 
app.use('/api/inicio', inicioRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
