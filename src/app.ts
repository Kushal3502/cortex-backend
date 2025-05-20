import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

// routes
import projectRouter from "./routes/projects.routes";

app.use("/api/v1/project", projectRouter);

export default app;
