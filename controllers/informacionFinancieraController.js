const informacionFinancieraSchema = require("../models/informacionFinanciera");
const registroSchema = require("../models/registro");

exports.getInformacionFinanciera = async (_, res) => {
  try {
    const informacionFinanciera = await informacionFinancieraSchema.find();
    res.status(200).json(informacionFinanciera);
  } catch (error) {
    res.status(422).json({
      error: "Error al obtener la informacion financiera del usuario",
    });
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
    usuario,
  } = req.body;

  if (
    (!ingresoNetoMensual,
    !ingresosAdicionales,
    !tipoContratoTrabajo,
    !gastosFijosMensuales,
    !otrosGastos,
    !estadoLaboral,
    !totalActivos,
    !totalPasivos,
    !capacidadAhorro,
    !seguroDeVida,
    !usuario)
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const newFinantialInformation = informacionFinancieraSchema(req.body);
  await newFinantialInformation
    .save()
    .then((data) => res.status(201).json(data))
    .catch((error) =>
      res
        .status(422)
        .json({ message: "Error en el procesamiento de datos", error: error }),
    );
};

exports.somethingUpdate = async (req, res) => {
  const { id, usuario } = req.params;
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
  } = req.body;

  if (
    (!ingresoNetoMensual,
    !ingresosAdicionales,
    !tipoContratoTrabajo,
    !gastosFijosMensuales,
    !otrosGastos,
    !estadoLaboral,
    !totalActivos,
    !totalPasivos,
    !capacidadAhorro,
    !seguroDeVida,
    !usuario)
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  await informacionFinancieraSchema
    .updateOne(
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
          capacidadAhorro,
          seguroDeVida,
        },
      },
    )
    .then((data) => res.status(200).json(data))
    .catch((error) =>
      res
        .status(422)
        .json({ message: "Error en el procesamiento de datos", error: error }),
    );
};

exports.deleteInformacionFinanciera = async (req, res) => {
  const { id, usuario } = req.params;
  if ((!id, !usuario)) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  const user = await registroSchema.findById(usuario);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const informacionFinanciera = await informacionFinancieraSchema.findOne({
    _id: id,
    usuario: usuario,
  });
  if (!informacionFinanciera) {
    return res
      .status(403)
      .json({ message: "la informacion financiera no pertenece al usuario" });
  }

  await informacionFinancieraSchema
    .deleteOne({ _id: id })
    .then(() =>
      res.status(200).json({ message: "Informacion financiera eliminada" }),
    )
    .catch((error) =>
      res
        .status(422)
        .json({ message: "Error en el procesamiento de datos", error: error }),
    );
};
