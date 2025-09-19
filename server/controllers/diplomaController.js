import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

import Student from "../models/Student.js";
import Diploma from "../models/Diploma.js";

// Middleware multer - sin almacenamiento local, solo buffer en memoria
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

export const uploadMiddleware = upload.single("file");

// Subida de diploma
export const subirDiploma = async (req, res) => {
  try {
    const documento = req.params.documento;
    const file = req.file;

    if (!documento || !file) {
      return res.status(400).json({ message: "Faltan datos" });
    }
    const nombreArchivo = file.originalname;

    // Buscar o crear estudiante
    const estudiante = await Student.findOne({ document: documento });
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado, por favor créelo primero" });
    }

    // Subir archivo a Cloudinary (stream)
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "diplomas",
            resource_type: "raw", // importante para pdf y otros archivos no imágenes
            public_id: `${nombreArchivo}`,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    // Guardar información del diploma en DB
    const nuevoDiploma = new Diploma({
      studentId: estudiante._id,
      nameFile: nombreArchivo,
      url: result.secure_url,
      emissionDate: new Date(),
    });

    await nuevoDiploma.save();

    res.json({ message: "Diploma subido con éxito", diploma: nuevoDiploma });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
};

// Consultar diplomas por documento
export const obtenerDiplomas = async (req, res) => {
  try {
    const { document } = req.query; 

    const estudiante = await Student.findOne({ document });
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const diplomas = await Diploma.find({ studentId: estudiante._id });

    res.json({ diplomas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en servidor" });
  }
};
