const fs = require('fs');
const path = require('path');
const Simulacion = require('../models/creditSimulations');

// Leer archivo bancos.json
const bancosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bancos.json'), 'utf8'));

// Controlador para la simulación de crédito (creación)
exports.simularCredito = async (req, res) => {
    const { nombres, apellidos, correo, telefono, cedula, edad, estadoCivil, direccion, tipoCredito, montoSolicitado, plazoMeses } = req.body;

    // Validación de entrada
    if (!nombres || !apellidos || !correo || !telefono || !cedula || !edad || !estadoCivil || !direccion || !tipoCredito || !montoSolicitado || !plazoMeses) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }
    
    try {
        const opcionesCredito = bancosData.bancos.map(banco => {
            const opciones = banco.productos_credito.filter(credito => {
                return (
                    credito.tipo_credito === tipoCredito &&
                    plazoMeses >= credito.plazo_minimo_meses &&
                    plazoMeses <= credito.plazo_maximo_meses
                );
            }).map(credito => {
                const cuotaMensual = calcularCuotaMensual(montoSolicitado, credito.tasa_interes_nominal, plazoMeses);
                const fechaCorte = calcularFechaCorte(new Date(), plazoMeses);  // Aquí se usa la fecha actual

                return {
                    nombreBanco: banco.nombre,
                    tipoCredito: credito.tipo_credito,
                    tasaInteresNominal: credito.tasa_interes_nominal,
                    tasaInteresEfectivaAnual: credito.tasa_interes_efectiva_anual,
                    plazoMeses: plazoMeses,
                    montoCuota: cuotaMensual,
                    fechaCorte: fechaCorte,
                    valorSeguro: credito.valor_seguro
                };
            });

            return opciones;
        }).flat();

        const nuevaSimulacion = new Simulacion({
            usuario: {
                nombres,
                apellidos,
                correo,
                telefono,
                cedula,
                edad,
                estadoCivil,
                direccion,
            },
            opcionesCredito
        });

        await nuevaSimulacion.save(); // Guardar en MongoDB
        res.status(201).json(nuevaSimulacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al procesar la simulación." });
    }
};

// Función para obtener todas las simulaciones
exports.getSimulaciones = async (req, res) => {
    try {
        const simulaciones = await Simulacion.find(); // Obtener todas las simulaciones de MongoDB
        res.status(200).json(simulaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las simulaciones." });
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

// Función para calcular el valor de la cuota mensual
function calcularCuotaMensual(monto, tasaNominal, plazoMeses) {
    const tasaMensual = tasaNominal / 100 / 12;  // Se ajusta la tasa a mensual
    return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
}

// Función para calcular la fecha de corte
function calcularFechaCorte(fechaInicio, plazoMeses) {
    const fechaCorte = new Date(fechaInicio);
    fechaCorte.setMonth(fechaCorte.getMonth() + plazoMeses);
    return fechaCorte;
}
