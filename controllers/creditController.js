const fs = require('fs').promises;
const path = require('path');
const Simulacion = require('../models/creditSimulations');
const Usuario = require('../models/registration'); // Importa el modelo de usuarios

// Leer archivo bancos.json de manera asincrónica
async function obtenerDatosBancos() {
    const data = await fs.readFile(path.join(__dirname, '../data/bancos.json'), 'utf8');
    return JSON.parse(data);
}

exports.simularCredito = async (req, res) => {
    const { tipoCredito, montoSolicitado, plazoMeses, usuarioId } = req.body;

    if (!tipoCredito || !montoSolicitado || !plazoMeses || !usuarioId) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        // Buscar datos del usuario en la base de datos
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Obtener datos de bancos desde bancos.json
        const bancosData = await obtenerDatosBancos();

        // Generar las opciones de crédito basadas en el archivo
        const opcionesCredito = bancosData.bancos.flatMap((banco) =>
            banco.productos_credito
                .filter((credito) => {
                    return (
                        credito.tipo_credito === tipoCredito &&
                        plazoMeses >= credito.plazo_minimo_meses &&
                        plazoMeses <= credito.plazo_maximo_meses
                    );
                })
                .map((credito) => {
                    const cuotaMensual = calcularCuotaMensual(montoSolicitado, credito.tasa_interes_nominal, plazoMeses);
                    const fechaCorte = calcularFechaCorte(new Date(), plazoMeses);

                    return {
                        nombreBanco: banco.nombre,
                        tipoCredito: credito.tipo_credito,
                        tasaInteresNominal: credito.tasa_interes_nominal,
                        tasaInteresEfectivaAnual: credito.tasa_interes_efectiva_anual,
                        plazoMeses,
                        montoCuota: cuotaMensual,
                        fechaCorte,
                        valorSeguro: credito.valor_seguro,
                    };
                })
        );

        // Crear una nueva simulación en la base de datos
        const nuevaSimulacion = new Simulacion({
            usuario: {
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                telefono: usuario.telefono,
                cedula: usuario.cedula,
                edad: usuario.edad,
                estadoCivil: usuario.estadoCivil,
                direccion: usuario.direccion,
            },
            opcionesCredito,
        });

        // Guardar la simulación en la base de datos
        await nuevaSimulacion.save();
        res.status(201).json(nuevaSimulacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al procesar la simulación." });
    }
};

// Función para calcular el valor de la cuota mensual
function calcularCuotaMensual(monto, tasaNominal, plazoMeses) {
    const tasaMensual = tasaNominal / 100 / 12; // Se ajusta la tasa a mensual
    return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
}

// Función para calcular la fecha de corte
function calcularFechaCorte(fechaInicio, plazoMeses) {
    const fechaCorte = new Date(fechaInicio);
    fechaCorte.setMonth(fechaCorte.getMonth() + plazoMeses);
    return fechaCorte;
}


// Función para obtener todas las simulaciones
exports.getSimulaciones = async (req, res) => {
    try {
      const { usuarioId } = req.query;
  
      const simulaciones = await Simulacion.find({
        'usuario._id': usuarioId,
      });
      res.status(200).json(simulaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las simulaciones.' });
    }
  };
  

// Función para obtener una simulación por ID
exports.getSimulacionById = async (req, res) => {
    try {
        const simulacion = await Simulacion.findById(req.params.id); // Buscar por ID en MongoDB
        if (!simulacion) return res.status(404).json({ message: 'Simulación no encontrada' });
        res.status(200).json(simulacion);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la simulación." });
    }
};

// Función para actualizar una simulación por ID
exports.updateSimulacion = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const simulacionActualizada = await Simulacion.findByIdAndUpdate(id, updates, { new: true }); // Actualiza y devuelve el nuevo objeto
        if (!simulacionActualizada) return res.status(404).json({ message: 'Simulación no encontrada' });

        res.status(200).json(simulacionActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la simulación." });
    }
};

// Función para eliminar una simulación por ID
exports.deleteSimulacion = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await Simulacion.findByIdAndDelete(id); // Eliminar por ID en MongoDB
        if (!resultado) return res.status(404).json({ message: 'Simulación no encontrada' });

        res.status(200).json({ message: 'Simulación eliminada' });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la simulación." });
    }
};
