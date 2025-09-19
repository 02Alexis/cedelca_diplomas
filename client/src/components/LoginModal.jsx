import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // para aceptar cookies si usas JWT en cookie
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token); // Ajusta según lo que devuelva el backend
        onClose();
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <form className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Iniciar sesión</h2>
          <label className="block mb-2">Correo electrónico</label>
          <input
            type="email"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block mb-2">Contraseña</label>
          <input
            type="password"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-center gap-4 mt-5 w-full">
          <button
            type="submit"
            className="w-full my-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded text-white"
          >
            Entrar
          </button>
            <button
            onClick={onClose}
            className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition"
            >
            Cancelar
            </button>
        </div>
        </form>
      </div>
    </div>
  );
}
