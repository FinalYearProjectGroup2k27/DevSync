import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import connect from "./db/db.js";
import authRoutes from "./routes/authRoutes.js";

connect();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;