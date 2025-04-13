import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ResponseHandler from "../helpers/response.handler";

const prisma = new PrismaClient();

// CREATE TASK
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
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
  } = req.body;
  const response = new ResponseHandler(req, res);
  try {
    const newTask = await prisma.task.create({
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    response.fail({
      message: "Error creating task",
      code: 500,
      data: { message: errMessage },
    });
  }
};

// RETRIEVE
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  const response = new ResponseHandler(req, res);
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(projectId),
      },
    });

    const tasks = await prisma.task.findMany({
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    response.fail({
      message: "Error retrieving tasks",
      code: 500,
    });
  }
};

// UPDATE TASK
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;

  const response = new ResponseHandler(req, res);
  try {
    const updatedTask = await prisma.task.update({
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
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    response.fail({
      message: "Error updating task",
      code: 500,
      data: { message: errMessage },
    });
  }
};

// DELETE TASK
