import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "motion/react"
import See from "../assets/See";
import Spinner from "./Spinner";

export default function StudentDiplomas() {
  const [document, setDocument] = useState("");
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
      },
    }),
  };

  // Función para consultar diplomas por documento
  const fetchDiplomas = () => {
    if (!document) {
      setDiplomas([]);
      toast.error("Por favor ingresa un número de Estudiante.");
      return;
    }
    setLoading(true);
    fetch(`http://localhost:4000/api/diplomas/listar?document=${document}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.diplomas && data.diplomas.length > 0) {
          setDiplomas(data.diplomas);
        } else {
          toast.error("No se encontraron diplomas para este Estudiante.");
          setDiplomas([]);
        }
      })
      .catch(() => {
        toast.error("Error al cargar diplomas.");
        setDiplomas([]);
      })
      .finally(() => setLoading(false));
  };

  // Filtrado según búsqueda
  const filteredDiplomas = diplomas.filter((diploma) =>
    diploma.nameFile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
    initial={{y: 30, opacity: 0}}
    whileInView={{y: 0, opacity: 1}}
    transition={{duration: 0.6}}
    viewport={{once: true}}>
      <motion.h2
      initial={{y: 20, opacity: 0}}
      whileInView={{y: 0, opacity: 1}}
      transition={{duration: 0.5}}
      viewport={{once: true}}
      className="text-xl font-bold mb-2">
        Consultar Diplomas por Estudiante
      </motion.h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Ingrese número de documento"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
        />
        <button
          onClick={fetchDiplomas}
          className="w-full my-3 bg-primary hover:bg-primary-hover active:scale-95 transition py-2.5 rounded text-white"
        >
          Buscar
        </button>
      </div>

      {loading && <Spinner />}

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <motion.table
          className="w-full text-left table-auto min-w-max"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                Diploma
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                Fecha de Emisión
              </th>
              <th className="p-4 border-b border-slate-300 bg-slate-50">
                Acciones
              </th>
            </tr>
          </thead>
          {!loading && diplomas.length > 0 && (
            <>
              <tbody>
                {filteredDiplomas.map((diploma, index) => (
                  <motion.tr
                  key={diploma._id}
                  className="hover:bg-slate-50"
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={variants}
                    >
                    <td className="p-4 border-b border-slate-200">
                      <p>
                        {diploma.nameFile}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <p>
                        Emitido el:{" "}
                        {new Date(diploma.emissionDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4 border-b border-slate-200">
                      <a
                        href={diploma.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <See />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </>
          )}
        </motion.table>
      </div>
    </motion.div>
  );
}
