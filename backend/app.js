import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from 'morgan'
import cors from "cors";
import connect from "./db/db.js";

connect();

const app=express();

app.use(morgan("dev"));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.send("Hello World");
});



export default app;
