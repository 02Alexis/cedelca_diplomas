import express from "express";
import { crearEstudiante } from "../controllers/studentController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/crear", authUser, crearEstudiante);

export default router;
