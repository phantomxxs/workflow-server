"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const projects_1 = require("./routes/projects");
const tasks_1 = require("./routes/tasks");
// ROUTES IMPORTS
// CONFIGS
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use("/projects", projects_1.projectRoutes);
app.use("/tasks", tasks_1.tasksRouter);
// ROUTES
app.get("/", (req, res) => {
    res.send("Work flow server...");
});
// START SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is listening or port ${port}`);
});
