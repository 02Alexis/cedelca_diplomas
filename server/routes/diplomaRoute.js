import express from "express";
import { subirDiploma, obtenerDiplomas, uploadMiddleware } from "../controllers/diplomaController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/subir/:studentId", authUser, uploadMiddleware, subirDiploma);
router.get("/listar", obtenerDiplomas);

export default router;
