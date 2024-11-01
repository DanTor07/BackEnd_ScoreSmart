const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    edad: { type: Number, required: true },
    estadoCivil: { type: String, required: true },
    direccion: { type: String, required: true },
    contrasena: { type: String, required: true }
});

registroSchema.pre('save', async function (next) {
    if (!this.isModified('contrasena')) return next();
    const bcrypt = require('bcrypt');
    this.contrasena = await bcrypt.hash(this.contrasena, 10);
    next();
});

module.exports = mongoose.model('Registro', registroSchema);
