import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Spinner from "./Spinner";
import Upload from "../assets/Upload";

export default function ListEstudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/api/estudiantes/listar", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.estudiantes) {
          setStudents(data.estudiantes);
        } else {
          toast.error("No se pudo cargar estudiantes");
        }
      })
      .catch(() => {
        toast.error("Error al cargar estudiantes");
      })
      .finally(() => setLoading(false));
  }, []);

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

  const handleLoadDiploma = (studentId) => {
    navigate(`/diplomas?student=${studentId}`);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calcular estudiantes para página actual
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Número total de páginas
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);  

    // Manejar click para navegar a diplomas de estudiante
    const handleClickStudent = (studentId) => {
      navigate(`/list-estudiantes/diplomas-estudiante/${studentId}`);
    };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-8 max-w-5xl mx-auto"
    >
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-xl font-bold mb-2"
      >
        Consultar Diplomas por Estudiante
      </motion.h2>

      <input
        type="text"
        placeholder="Buscar estudiante por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border mb-4 mt-2 border-gray-500/30 outline-none rounded p-2"
      />


      {loading ? (
        <Spinner />
      ) : (
        <>
          <motion.table
            className="w-full text-left table-auto min-w-max"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  Nombre
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  Documento
                </th>
                <th className="p-4 border-b border-slate-300 bg-slate-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <motion.tr
                  key={student._id}
                  className="hover:bg-slate-50"
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={variants}
                  onClick={() => handleClickStudent(student._id)}
                >
                  <td className="p-4 border-b border-slate-200">
                    {student.name}
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    {student.document}
                  </td>
                  <td className="p-4 border-b border-slate-200">
                    <button
                      onClick={() => handleLoadDiploma(student._id)}
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded cursor-pointer"
                      title="Subir Diploma"
                    >
                      <Upload />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>

          {/* Paginación */}
          <div className="flex justify-center mt-4 space-x-2 select-none">
            {[...Array(totalPages).keys()].map((num) => {
              const page = num + 1;
              return (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "bg-slate-200 hover:bg-slate-300 cursor-pointer"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
