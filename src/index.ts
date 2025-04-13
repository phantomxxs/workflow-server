import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { projectRoutes } from "./routes/projects";
import { tasksRouter } from "./routes/tasks";

// ROUTES IMPORTS

// CONFIGS
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/projects", projectRoutes);
app.use("/tasks", tasksRouter);

// ROUTES
app.get("/", (req, res) => {
  res.send("Work flow server...");
});

// START SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening or port ${port}`);
});
