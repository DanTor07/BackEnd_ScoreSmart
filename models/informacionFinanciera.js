const mongoose = require('mongoose');

const informacionFinancieraSchema = mongoose.Schema({
    ingresoNetoMensual: { type: Number, required: true, },
    ingresosAdicionales: { type: Number, required: true, },
    tipoContratoTrabajo: { type: String, required: true, },
    gastosFijosMensuales: { type: Number, required: true, },
    otrosGastos: { type: Number, required: true, },
    estadoLaboral: { type: String, required: true, },
    totalActivos: { type: Number, required: true, },
    totalPasivos: { type: Number, required: true, },
    capacidadAhorro: { type: String, required: true, },
    seguroDeVida: { type: Boolean, required: true },
    usuario: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Registro', required: true}]
});

module.exports = mongoose.model("informacionFinanciera", informacionFinancieraSchema);
