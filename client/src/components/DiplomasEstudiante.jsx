import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Spinner from "./Spinner";
import Pdf from "../assets/Pdf";
import { motion } from "framer-motion";

export default function DiplomasEstudiante() {
  const { studentId } = useParams();

  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) {
      toast.error("No se especificó el estudiante.");
      return;
    }
    setLoading(true);
    fetch(`http://localhost:4000/api/estudiantes/por-estudiante/${studentId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.diplomas && data.diplomas.length > 0) {
          setDiplomas(data.diplomas);
        } else {
          toast.error("No se encontraron diplomas para este estudiante.");
          setDiplomas([]);
        }
      })
      .catch(() => {
        toast.error("Error al cargar diplomas.");
        setDiplomas([]);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-10 text-gray-800 dark:text-gray"
    >
      <motion.h2 
        initial={{y: 30, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        transition={{duration: 0.6}}
        viewport={{once: true}}
        className="text-2xl sm:text-4xl font-medium"
      >
        Diplomas del Estudiante
      </motion.h2>

      {loading ? (
        <Spinner />
      ) : diplomas.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {diplomas.map((diploma, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              key={diploma._id}
              className="flex max-sm:flex-col items-center gap-5 p-4 rounded-xl bg-white shadow-xl shadow-gray-100 dark:shadow-gray/5 hover:scale-103 transition-all duration-400"
            >
              <a
                href={diploma.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
                title="Ver Diploma"
              >
                <Pdf />
              </a>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{diploma.nameFile}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p>No hay diplomas cargados para este estudiante.</p>
      )}
    </motion.div>
  );
}
