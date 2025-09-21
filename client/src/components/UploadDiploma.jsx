import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import Select from "react-select";
import useStudentListStore from "../store/useStudentListStore";
import Spinner from "./Spinner";
import Upload from "../assets/Upload";

export default function UploadDiploma() {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const students = useStudentListStore((state) => state.students);
  const setStudents = useStudentListStore((state) => state.setStudents);

  const options = students.map((st) => ({
    value: st._id,
    label: `${st.name} (${st.document})`,
  }));

  // Cargar estudiantes al montar
  useEffect(() => {
    fetch("http://localhost:4000/api/estudiantes/listar", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.estudiantes) {
          setStudents(data.estudiantes);
        } else {
          setMessage("No se pudo cargar la lista de estudiantes");
        }
      })
      .catch(() => setMessage("Error cargando estudiantes"));
  }, [setStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudentId) {
      toast.error("Selecciona un estudiante");
      return;
    }
    if (!file) {
      toast.error("Selecciona un archivo PDF");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = `http://localhost:4000/api/diplomas/subir/${selectedStudentId}`;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        toast.error(data.message || "Error al subir diploma");
      } else {
        toast.success("Diploma subido exitosamente");
        setFile(null);
        setSelectedStudentId("");
      }
    } catch (error) {
      toast.error("Error en la conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      className="p-8 max-w-4xl mx-auto"
    >
      <motion.form
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-md p-4 bg-white rounded shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Subir Diploma a Estudiante</h2>
        <div className="max-w-md">
          <Select
            options={options}
            value={options.find(option => option.value === selectedStudentId) || null}
            onChange={(selectedOption) => setSelectedStudentId(selectedOption ? selectedOption.value : "")}
            placeholder="Seleccione un estudiante"
            isClearable
            className="text-dark-500 mb-2"
          />
        </div>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Haga clic para cargar</span> o
                arrastre y suelte
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        {file && (
          <p className="mt-2 text-gray-700">
            Archivo seleccionado: {file.name}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded disabled:opacity-50 mt-4"
        >
          {loading ? <Spinner /> : "Subir Diploma"}
        </button>
      </motion.form>
    </motion.div>
  );
}
