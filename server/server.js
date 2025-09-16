import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// allow multiple origins
const allowedOrigins = ["http://localhost:5173"];
const app = express();
const port = process.env.PORT || 4000;

// middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});