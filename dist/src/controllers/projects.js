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
exports.getProjects = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const response_handler_1 = __importDefault(require("../helpers/response.handler"));
const prisma = new client_1.PrismaClient();
// CREATE PROJECT
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, startDate, endDate } = req.body;
    const response = new response_handler_1.default(req, res);
    try {
        const newProject = yield prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate,
            },
        });
        response.success({
            message: "Project created successfully",
            data: newProject,
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        response.fail({
            message: "Error creating project",
            data: { error: errMessage },
        });
    }
});
exports.createProject = createProject;
// RETRIEVE PROJECT
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = new response_handler_1.default(req, res);
    try {
        const projects = yield prisma.project.findMany();
        response.success({
            message: "Projects retrieved successfully",
            data: projects,
        });
    }
    catch (error) {
        const errMessage = error instanceof Error ? error.message : "Unknown error";
        response.fail({
            message: "Error retrieving projects",
            data: { error: errMessage },
        });
    }
});
exports.getProjects = getProjects;
// UPDATE PROJECT
// DELETE PROJECT
