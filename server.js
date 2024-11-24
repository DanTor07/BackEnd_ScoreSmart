require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const creditRoutes = require('./routes/creditRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const loginRoutes = require('./routes/loginRoutes');
const financialInfoRoutes = require('./routes/financialInfoRoutes');
const scoreAndRatesRoutes = require('./routes/scoreAndRatesRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.log('Error de conexión:', error));

app.use('/api/creditos', creditRoutes);
app.use('/api/registros', registrationRoutes);
app.use('/api/inicio', loginRoutes);
app.use('/api/informacion-financiera', financialInfoRoutes);
app.use('/api/tasas-y-puntaje', scoreAndRatesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
