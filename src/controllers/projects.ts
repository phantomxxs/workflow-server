import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/response.handler";

const prisma = new PrismaClient();

// CREATE PROJECT
export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  const response = new ResponseHandler(req, res);
  try {
    const newProject = await prisma.project.create({
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    response.fail({
      message: "Error creating project",
      data: { error: errMessage },
    });
  }
};

// RETRIEVE PROJECT
export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response = new ResponseHandler(req, res);
  try {
    const projects = await prisma.project.findMany();
    response.success({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    response.fail({
      message: "Error retrieving projects",
      data: { error: errMessage },
    });
  }
};

// UPDATE PROJECT

// DELETE PROJECT
