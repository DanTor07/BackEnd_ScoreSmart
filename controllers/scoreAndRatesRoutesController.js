const mongoose = require('mongoose');

const SimulacionSchema = new mongoose.Schema({
    usuario: {
        nombres: { type: String, required: true },
        apellidos: { type: String, required: true },
        correo: { type: String, required: true },
        telefono: { type: String, required: true },
        cedula: { type: String, required: true },
        edad: { type: Number, required: true },
        estadoCivil: { type: String, required: true },
        direccion: { type: String, required: true },
    },
    opcionesCredito: [{
        nombreBanco: { type: String, required: true },
        tipoCredito: { type: String, required: true },
        tasaInteresNominal: { type: Number, required: true },
        tasaInteresEfectivaAnual: { type: Number, required: true },
        plazoMeses: { type: Number, required: true },
        montoCuota: { type: Number, required: true },
        fechaCorte: { type: Date, required: true },
        valorSeguro: { type: Number, required: true },
    }]
});

module.exports = mongoose.model('simscreditos', SimulacionSchema);