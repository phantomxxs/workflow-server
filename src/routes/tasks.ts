import { Router } from "express";
import { createTask, getTasks, updateTaskStatus } from "../controllers/tasks";

const router = Router();

router.post("/", createTask);

router.get("/", getTasks);

router.patch("/:taskId/status", updateTaskStatus);

export const tasksRouter = router;
