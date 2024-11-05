const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registro', required: true },
    fechaInicioSesion: { type: Date, default: Date.now },
    ip: { type: String },
    exito: { type: Boolean, required: true }
});

// Crear un índice para optimizar las búsquedas por usuarioId
loginLogSchema.index({ usuarioId: 1, fechaInicioSesion: -1 });

module.exports = mongoose.model('LoginLog', loginLogSchema);
