import { Router } from "express";
import { getProjects } from "../controllers/projects";

const router = Router();

router.get("/", getProjects);

export const projectRoutes = router;
