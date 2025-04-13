"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const projects_1 = require("../controllers/projects");
const router = (0, express_1.Router)();
router.post("/", projects_1.createProject);
router.get("/", projects_1.getProjects);
exports.projectRoutes = router;
