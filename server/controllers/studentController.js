import Student from "../models/Student.js";

export const crearEstudiante = async (req, res) => {
  try {
    const { name, document } = req.body;
    if (!name || !document) {
      return res.status(400).json({ message: "Nombre y documento son requeridos" });
    }

    let estudianteExistente = await Student.findOne({ document });
    if (estudianteExistente) {
      return res.status(409).json({ message: "Estudiante ya existe" });
    }

    const nuevoEstudiante = new Student({ name, document });
    await nuevoEstudiante.save();

    res.status(201).json({ message: "Estudiante creado", estudiante: nuevoEstudiante });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear estudiante" });
  }
};

// GET /api/estudiantes/listar
export const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Student.find({}, { name: 1, document: 1 });
    res.json({ estudiantes });
  } catch (error) {
    res.status(500).json({ message: "Error interno" });
  }
};
