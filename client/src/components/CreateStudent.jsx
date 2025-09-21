import React, { useState } from "react";
import { motion } from "motion/react";

export default function CreateStudent() {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:4000/api/estudiantes/crear", {
        method: "POST",
        credentials: "include", // Esta línea es clave para enviar cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, document }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error al crear estudiante");
        console.error("Error backend:", data);
      } else {
        console.log("Estudiante creado:", data);
        setName("");
        setDocument("");
      }
    } catch (error) {
      setErrorMsg("Error de conexión");
      console.error("Error fetch:", error);
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
    >
      <motion.form
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto p-4 bg-white rounded shadow"
        onSubmit={handleCreate}
      >
        <h2 className="text-xl font-bold mb-4">Crear Estudiante</h2>
        {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
        <label className="block mb-1">Nombre completo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
        />
        <label className="block mb-1">Número de documento</label>
        <input
          type="text"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          required
          className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full my-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded text-white"
        >
          {loading ? "Creando..." : "Crear Estudiante"}
        </button>
      </motion.form>
    </motion.div>
  );
}
