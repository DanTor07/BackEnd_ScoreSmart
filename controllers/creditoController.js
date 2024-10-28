const fs = require('fs');
const path = require('path');

// Leer archivo bancos.json
const bancosData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bancos.json'), 'utf8'));

// Controlador para la simulación de crédito
exports.simularCredito = (req, res) => {
    const { nombres, apellidos, correo, telefono, cedula, edad, estadoCivil, direccion, tipoCredito, montoSolicitado, plazoMeses } = req.body;

    // Filtrar opciones de crédito por tipo y plazo
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

    res.status(200).json({
        usuario: { nombres, apellidos, correo, telefono, cedula, edad, estadoCivil, direccion },
        opcionesCredito: opcionesCredito
    });
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
