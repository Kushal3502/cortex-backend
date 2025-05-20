import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/projects.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware as any);

router
  .route("/")
  .get(getProjects as any)
  .post(createProject as any);

router
  .route("/:projectId")
  .get(getProjectById as any)
  .patch(updateProject as any)
  .delete(deleteProject as any);

export default router;
