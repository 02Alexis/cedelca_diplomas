import React, { useEffect, useState } from "react";
import See from "../assets/See";

export default function StudentDiplomas() {
  const [document, setDocument] = useState("");
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Función para consultar diplomas por documento
  const fetchDiplomas = () => {
    if (!document) {
      setDiplomas([]);
      setError("Por favor ingresa un número de documento.");
      return;
    }
    setLoading(true);
    setError("");
    fetch(`http://localhost:4000/api/diplomas/listar?document=${document}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.diplomas && data.diplomas.length > 0) {
          setDiplomas(data.diplomas);
        } else {
          setError("No se encontraron diplomas para este documento.");
          setDiplomas([]);
        }
      })
      .catch(() => {
        setError("Error al cargar diplomas.");
        setDiplomas([]);
      })
      .finally(() => setLoading(false));
  };

  // Filtrado según búsqueda
  const filteredDiplomas = diplomas.filter((diploma) =>
    diploma.nameFile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">
        Consultar Diplomas por Estudiante
      </h2>

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
          className="w-full my-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded text-white"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Cargando diplomas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
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
                {filteredDiplomas.map((diploma) => (
                  <tr key={diploma._id} className="hover:bg-slate-50">
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
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
}
