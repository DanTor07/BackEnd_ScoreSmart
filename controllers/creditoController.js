const fs = require('fs');
const path = require('path');

// Leer archivo bancos.json
const bancosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bancos.json'), 'utf8'));
const creditosSimulados = [];  // Arreglo temporal para almacenar simulaciones de crédito

// Controlador para la simulación de crédito (creación)
exports.simularCredito = (req, res) => {
    const { nombres, apellidos, correo, telefono, cedula, edad, estadoCivil, direccion, tipoCredito, montoSolicitado, plazoMeses } = req.body;

    const opcionesCredito = bancosData.bancos.map(banco => {
        const opciones = banco.productos_credito.filter(credito => {
            return (
                credito.tipo_credito === tipoCredito &&
                plazoMeses >= credito.plazo_minimo_meses &&
                plazoMeses <= credito.plazo_maximo_meses
            );
        }).map(credito => {
            const cuotaMensual = calcularCuotaMensual(montoSolicitado, credito.tasa_interes_nominal, plazoMeses);
            const fechaCorte = calcularFechaCorte(plazoMeses);

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

    const simulacion = {
        id: creditosSimulados.length + 1,
        usuario: { nombres, apellidos, correo, telefono, cedula, edad, estadoCivil, direccion },
        opcionesCredito: opcionesCredito
    };

    creditosSimulados.push(simulacion);
    res.status(201).json(simulacion);
};

// Función para obtener todas las simulaciones
exports.getSimulaciones = (req, res) => {
    res.status(200).json(creditosSimulados);
};

// Función para obtener una simulación por ID
exports.getSimulacionById = (req, res) => {
    const simulacion = creditosSimulados.find(sim => sim.id === parseInt(req.params.id));
    if (!simulacion) return res.status(404).json({ message: 'Simulación no encontrada' });
    res.status(200).json(simulacion);
};

// Función para actualizar una simulación por ID
exports.updateSimulacion = (req, res) => {
    const simulacionIndex = creditosSimulados.findIndex(sim => sim.id === parseInt(req.params.id));
    if (simulacionIndex === -1) return res.status(404).json({ message: 'Simulación no encontrada' });

    const updatedSimulacion = { ...creditosSimulados[simulacionIndex], ...req.body };
    creditosSimulados[simulacionIndex] = updatedSimulacion;
    res.status(200).json(updatedSimulacion);
};

// Función para eliminar una simulación por ID
exports.deleteSimulacion = (req, res) => {
    const simulacionIndex = creditosSimulados.findIndex(sim => sim.id === parseInt(req.params.id));
    if (simulacionIndex === -1) return res.status(404).json({ message: 'Simulación no encontrada' });

    creditosSimulados.splice(simulacionIndex, 1);
    res.status(200).json({ message: 'Simulación eliminada' });
};

// Función para calcular el valor de la cuota mensual
function calcularCuotaMensual(monto, tasaNominal, plazoMeses) {
    const tasaMensual = tasaNominal / 100;
    return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
}

// Función para calcular la fecha de corte
function calcularFechaCorte(plazoMeses) {
    const fechas = [];
    let fechaInicio = new Date();

    for (let i = 1; i <= plazoMeses; i++) {
        fechaInicio.setMonth(fechaInicio.getMonth() + 1);
        fechas.push(new Date(fechaInicio));
    }
    return fechas;
}
