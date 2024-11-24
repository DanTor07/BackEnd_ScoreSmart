const informacionFinancieraSchema = require('../models/financialInfo');
const registroSchema = require('../models/registration')

exports.getInformacionFinanciera = async (_, res) => {
    try {
        const informacionFinanciera = await informacionFinancieraSchema.find();
        res.status(200).json(informacionFinanciera)
    } catch (error) {
        res.status(422).json({ error: "Error al obtener la informacion financiera del usuario" })
    }
};

exports.getInformacionFinancieraPorUsuario = async (req, res) => {
    const { id } = req.params;  // Obtenemos el id del registro desde los parámetros de la URL

    try {
        // Buscar el registro por su id
        const informacionFinanciera = await informacionFinancieraSchema.findById(id);

        if (!informacionFinanciera) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        // Si el registro existe, lo retornamos con éxito
        res.status(200).json(informacionFinanciera);
    } catch (error) {
        // Si ocurre algún error, retornamos el error
        res.status(422).json({ message: "Error al obtener el registro.", error });
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
        seguroDeVida,
        usuario
    } = req.body;

    if (!ingresoNetoMensual, !ingresosAdicionales, !tipoContratoTrabajo, !gastosFijosMensuales, !otrosGastos, !estadoLaboral, !totalActivos, !totalPasivos, !capacidadAhorro, !seguroDeVida, !usuario) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const newFinantialInformation = informacionFinancieraSchema(req.body);
    await newFinantialInformation
        .save()
        .then((data) => res.status(201).json(data))
        .catch((error) => res.status(422).json({ message: "Error en el procesamiento de datos", error: error }));
};

exports.updateInformacionFinanciera = async (req, res) => {
    const { id } = req.params; // Solo se obtiene el id del registro
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
    } = req.body;

    // Validación de campos obligatorios
    if (
        !ingresoNetoMensual || !ingresosAdicionales || !tipoContratoTrabajo ||
        !gastosFijosMensuales || !otrosGastos || !estadoLaboral ||
        !totalActivos || !totalPasivos || !capacidadAhorro
    ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        // Actualización del registro por su id
        const result = await informacionFinancieraSchema.updateOne(
            { _id: id },
            {
                $set: {
                    ingresoNetoMensual,
                    ingresosAdicionales,
                    tipoContratoTrabajo,
                    gastosFijosMensuales,
                    otrosGastos,
                    estadoLaboral,
                    totalActivos,
                    totalPasivos,
                    capacidadAhorro
                },
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        res.status(200).json({ message: "Información financiera actualizada.", result });
    } catch (error) {
        res.status(422).json({ message: "Error en el procesamiento de datos.", error });
    }
};

exports.deleteInformacionFinanciera = async (req, res) => {
    const { id } = req.params; // Solo se obtiene el id del registro

    try {
        // Verificar si el registro existe
        const informacionFinanciera = await informacionFinancieraSchema.findById(id);

        if (!informacionFinanciera) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        // Eliminar el registro
        await informacionFinancieraSchema.deleteOne({ _id: id });
        res.status(200).json({ message: "Información financiera eliminada." });
    } catch (error) {
        res.status(422).json({ message: "Error en el procesamiento de datos.", error });
    }
};
