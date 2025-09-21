import React, { useState } from "react";
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();


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
        navigate("/estudiantes");
      } else {
        toast.error(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      toast.error("Error de conexión");
    }
  };

  return (
    <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{once: true}}
    transition={{staggerChildren: 0.2}}
    className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <motion.form 
        initial={{y: 30, opacity: 0}}
        whileInView={{y: 0, opacity: 1}}
        transition={{duration: 0.5, delay: 0.4}}
        viewport={{once: true}}
        className="bg-white text-gray-500 max-w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Iniciar sesión</h2>

        <div className="mt-2">
          <label className="block mb-2">Correo electrónico</label>
          <input
            type="email"
            className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
          </div>
          <div className="mt-2">
            <label className="block mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full border mt-1 border-gray-500/30 outline-none rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-5 w-full">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Entrar
          </button>
        </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
