"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTasks = exports.createTask = void 0;
const client_1 = require("@prisma/client");
const response_handler_1 = __importDefault(require("../helpers/response.handler"));
const prisma = new client_1.PrismaClient();
// CREATE TASK
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, startDate, endDate, status, priority, tags, points, projectId, authorUserId, assignedUserId, } = req.body;
    const response = new response_handler_1.default(req, res);
    try {
        const newTask = yield prisma.task.create({
            data: {
                title,
                description,
                startDate,
                endDate,
                status,
                priority,
                tags,
                points,
                projectId,
                authorUserId,
                assignedUserId,
            },
        });
        response.success({
            message: "Task created successfully",
            code: 201,
            data: newTask,
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        response.fail({
            message: "Error creating task",
            code: 500,
            data: { message: errMessage },
        });
    }
});
exports.createTask = createTask;
// RETRIEVE
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.query;
    const response = new response_handler_1.default(req, res);
    try {
        const project = yield prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
        });
        const tasks = yield prisma.task.findMany({
            where: {
                projectId: Number(projectId),
            },
            include: {
                author: true,
                assignees: true,
                comments: true,
                attachments: true,
            },
        });
        response.success({
            message: "Tasks retrieved successfully",
            data: { project, tasks },
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        response.fail({
            message: "Error retrieving tasks",
            code: 500,
        });
    }
});
exports.getTasks = getTasks;
// UPDATE TASK
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { status } = req.body;
    const response = new response_handler_1.default(req, res);
    try {
        const updatedTask = yield prisma.task.update({
            where: { id: Number(taskId) },
            data: {
                status,
            },
        });
        response.success({
            message: "Task updated successfully",
            code: 201,
            data: updatedTask,
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        response.fail({
            message: "Error updating task",
            code: 500,
            data: { message: errMessage },
        });
    }
});
exports.updateTaskStatus = updateTaskStatus;
// DELETE TASK
