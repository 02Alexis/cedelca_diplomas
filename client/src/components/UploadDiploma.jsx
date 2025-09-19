import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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
    <div className="p-8 max-w-4xl mx-auto">
      <form
        className="max-w-md p-4 bg-white rounded shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Subir Diploma a Estudiante</h2>
        <div className="max-w-md">
          <div className="mb-2 block">
            <label className="block mb-1">Selecciona estudiante</label>
          </div>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full border mb-2 border-gray-500/30 outline-none rounded p-2"
          >
            <option value="">-- Seleccione un estudiante --</option>
            {students.map((st) => (
              <option key={st._id} value={st._id}>
                {st.name} ({st.document})
              </option>
            ))}
          </select>
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
          <p className="mt-2 text-gray-700">Archivo seleccionado: {file.name}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded disabled:opacity-50 mt-4"
        >
          {loading ? <Spinner /> : "Subir Diploma"}
        </button>
      </form>
    </div>  
  );
}
