import { Router } from "express";
import { createProject, getProjects } from "../controllers/projects";

const router = Router();

router.post("/", createProject );
router.get("/", getProjects);

export const projectRoutes = router;
