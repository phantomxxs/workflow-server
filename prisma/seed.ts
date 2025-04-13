import { PrismaClient, Team, Project } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData(): Promise<void> {
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
    const model = prisma[modelName as keyof typeof prisma] as any;
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function seedData(
  orderedFileNames: string[],
  dataDirectory: string
): Promise<void> {
  for (const fileName of orderedFileNames) {
    if (fileName === "projectTeam.json") continue; // Skip projectTeam to handle dynamically

    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model = prisma[modelName as keyof typeof prisma] as any;

    try {
      // Remove `id` fields if they exist to let Prisma auto-increment
      const cleanedData = jsonData.map((data: any) => {
        const { id, ...rest } = data;
        return rest;
      });

      await model.createMany({ data: cleanedData });
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

async function seedProjectTeams(): Promise<void> {
  const teams: Team[] = await prisma.team.findMany();
  const projects: Project[] = await prisma.project.findMany();

  const projectTeams = projects.flatMap((project) =>
    teams.map((team) => ({
      teamId: team.id,
      projectId: project.id,
    }))
  );

  try {
    await prisma.projectTeam.createMany({ data: projectTeams });
    console.log("Seeded projectTeam dynamically.");
  } catch (error) {
    console.error("Error seeding projectTeam:", error);
  }
}

async function main(): Promise<void> {
  const dataDirectory = path.join(__dirname, "seedData");

  // Define the correct seeding order
  const orderedFileNames = [
    "team.json",
    "project.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
  ];

  await deleteAllData();
  await seedData(orderedFileNames, dataDirectory); // Seed data in correct order
  await seedProjectTeams();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());