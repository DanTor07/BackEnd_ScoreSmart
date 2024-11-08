require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const creditoRoutes = require('./routes/creditoRoutes');
const registroRoutes = require('./routes/registroRoutes');
const inicioRoutes = require('./routes/inicioRoutes');
const informacionFinancieraRoutes = require('./routes/informacionFinancieraRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.log('Error de conexión:', error));

app.use('/api/creditos', creditoRoutes);
app.use('/api/registros', registroRoutes);
app.use('/api/inicio', inicioRoutes);
app.use('/api/informacion-financiera', informacionFinancieraRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
