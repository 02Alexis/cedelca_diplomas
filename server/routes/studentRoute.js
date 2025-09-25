import express from "express";
import { crearEstudiante, listarDiplomasPorEstudiante, listarEstudiantes } from "../controllers/studentController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/crear", authUser, crearEstudiante);
router.get("/listar", authUser, listarEstudiantes);
router.get("/por-estudiante/:studentId", authUser, listarDiplomasPorEstudiante)

export default router;
