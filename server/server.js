import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import diplomaRouter from "./routes/diplomaRoute.js";
import studentRouter from "./routes/studentRoute.js";
import "dotenv/config";

// allow multiple origins
const allowedOrigins = ["http://localhost:5173"];
const app = express();
const port = process.env.PORT || 4000;

await connectDB();

// middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/diplomas", diplomaRouter);
app.use("/api/estudiantes", studentRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});