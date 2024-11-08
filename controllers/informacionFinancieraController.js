const informacionFinancieraSchema = require('../models/informacionFinanciera');

exports.getInformacionFinanciera = async (_, res) => {
    try {
        const informacionFinanciera = await informacionFinancieraSchema.find();
        res.status(200).json(informacionFinanciera)
    } catch (error) {
        res.status(422).json({ error: "Error al obtener la informacion financiera del usuario"})
    }
};

exports.createInformacionFinanciera = async (req, res) => {
    const {
        ingresoNetoMensual,
        ingresosAdicionales,
        tipoContratoTrabajo,
        gastosFijosMensuales,
        otrosGastos,
        estadoLaboral,
        totalActivos,
        totalPasivos,
        capacidadAhorro,
        seguroDeVida
    } = req.body;

    if ( !ingresoNetoMensual, !ingresosAdicionales, !tipoContratoTrabajo, !gastosFijosMensuales, !otrosGastos, !estadoLaboral, !totalActivos, !totalPasivos, !capacidadAhorro, !seguroDeVida) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const newFinantialInformation = informacionFinancieraSchema(req.body);
    await newFinantialInformation
        .save()
        .then((data) => res.status(201).json(data))
        .catch((error) => res.status(422).json({ message: "Error en el procesamiento de datos", error: error }));
};

exports.updateInformacionFinanciera = async (req, res) => {
    const { id } = req.params;
    const {
        ingresoNetoMensual,
        ingresosAdicionales,
        tipoContratoTrabajo,
        gastosFijosMensuales,
        otrosGastos,
        estadoLaboral,
        totalActivos,
        totalPasivos,
        capacidadAhorro,
        seguroDeVida
    } = req.body;

    if ( !ingresoNetoMensual, !ingresosAdicionales, !tipoContratoTrabajo, !gastosFijosMensuales, !otrosGastos, !estadoLaboral, !totalActivos, !totalPasivos, !capacidadAhorro, !seguroDeVida) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    await informacionFinancieraSchema
        .updateOne( {_id: id}, {
            $set: {
                ingresoNetoMensual,
                ingresosAdicionales,
                tipoContratoTrabajo,
                gastosFijosMensuales,
                otrosGastos,
                estadoLaboral,
                totalActivos,
                totalPasivos,
                capacidadAhorro,
                seguroDeVida
            }
        })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(422).json({ message: "Error en el procesamiento de datos", error: error }));
}
