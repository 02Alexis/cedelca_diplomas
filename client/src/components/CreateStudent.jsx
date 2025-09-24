import React, { useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-hot-toast";

export default function CreateStudent() {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        toast.error(data.message || "Error al crear estudiante");
      } else {
        toast.success("Estudiante creado exitosamente");
        setName("");
        setDocument("");
      }
    } catch (error) {
      toast.error("Error de conexión");
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
          className="w-full my-3 bg-primary hover:bg-primary-hover active:scale-95 transition py-2.5 rounded text-white"
        >
          {loading ? "Creando..." : "Crear Estudiante"}
        </button>
      </motion.form>
    </motion.div>
  );
}
