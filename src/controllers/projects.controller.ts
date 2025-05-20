import { Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";
import { prisma } from "../lib/prisma";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title) throw new Error("Title is required.");

    const ownerId: any = req.user?.id;

    const data = {
      title,
      description,
      ownerId,
    };

    if (!ownerId)
      return res.status(400).json(new ApiResponse(400, "Unauthorized request"));

    const project = await prisma.projects.create({
      data,
    });

    res.status(200).json(new ApiResponse(200, "New Project created", project));
  } catch (error: any) {
    console.log("Project create error :: ", error);
    res.status(500).json(new ApiResponse(500, "Project create error"));
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;

    const projects = await prisma.projects.findMany({
      where: {
        ownerId,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched successfully.", projects));
  } catch (error) {
    console.log("Project fetch error :: ", error);
    res.status(500).json(new ApiResponse(500, "Project fetch error"));
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const ownerId: any = req.user?.id;

    const { projectId } = req.params;

    const project = await prisma.projects.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, "Project fetched successfully", project));
  } catch (error) {
    console.log("Project fetch error :: ", error);
    res.status(500).json(new ApiResponse(500, "Project fetch error"));
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user?.id;
    const { projectId } = req.params;

    const { title, description } = req.body;

    if (!ownerId || !projectId) {
      return res.status(400).json(new ApiResponse(400, "Missing info"));
    }

    const data: { title?: string; description?: string } = {};

    if (title) data.title = title;
    if (description) data.description = description;

    if (Object.keys(data).length === 0) {
      return res.status(400).json(new ApiResponse(400, "No fields to update"));
    }

    const updatedProject = await prisma.projects.update({
      where: {
        id: projectId,
        ownerId,
      },
      data,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, "Project updated successfully", updatedProject)
      );
  } catch (error) {
    console.log("Project update error :: ", error);
    res.status(500).json(new ApiResponse(500, "Project update error"));
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const ownerId: any = req.user?.id;

    await prisma.projects.delete({
      where: {
        id: projectId,
        ownerId,
      },
    });

    res.status(200).json(new ApiResponse(200, "Project deleted successfully"));
  } catch (error) {
    console.log("Delete project error :: ", error);
    res.status(500).json(new ApiResponse(500, "Delete project error"));
  }
};
