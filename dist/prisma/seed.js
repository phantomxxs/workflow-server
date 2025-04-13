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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        // Include all models, including ProjectTeam, in the clearing process
        // Clear data in reverse dependency order
        const modelNames = [
            "Comment",
            "Attachment",
            "Task",
            "User",
            "ProjectTeam",
            "Project",
            "Team",
        ];
        for (const modelName of modelNames) {
            const model = prisma[modelName];
            try {
                yield model.deleteMany({});
                console.log(`Cleared data from ${modelName}`);
            }
            catch (error) {
                console.error(`Error clearing data from ${modelName}:`, error);
            }
        }
    });
}
function seedData(orderedFileNames, dataDirectory) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const fileName of orderedFileNames) {
            if (fileName === "projectTeam.json")
                continue; // Skip projectTeam to handle dynamically
            const filePath = path_1.default.join(dataDirectory, fileName);
            const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
            const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
            const model = prisma[modelName];
            try {
                // Remove `id` fields if they exist to let Prisma auto-increment
                const cleanedData = jsonData.map((data) => {
                    const { id } = data, rest = __rest(data, ["id"]);
                    return rest;
                });
                yield model.createMany({ data: cleanedData });
                console.log(`Seeded ${modelName} with data from ${fileName}`);
            }
            catch (error) {
                console.error(`Error seeding data for ${modelName}:`, error);
            }
        }
    });
}
function seedProjectTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        const teams = yield prisma.team.findMany();
        const projects = yield prisma.project.findMany();
        const projectTeams = projects.flatMap((project) => teams.map((team) => ({
            teamId: team.id,
            projectId: project.id,
        })));
        try {
            yield prisma.projectTeam.createMany({ data: projectTeams });
            console.log("Seeded projectTeam dynamically.");
        }
        catch (error) {
            console.error("Error seeding projectTeam:", error);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData");
        // Define the correct seeding order
        const orderedFileNames = [
            "team.json",
            "project.json",
            "user.json",
            "task.json",
            "attachment.json",
            "comment.json",
        ];
        yield deleteAllData();
        yield seedData(orderedFileNames, dataDirectory); // Seed data in correct order
        yield seedProjectTeams();
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
