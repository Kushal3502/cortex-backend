import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";
import { supabase } from "../lib/supabaseClient";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token)
      return res.status(404).json(new ApiResponse(404, "Token not found"));

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error)
      return res.status(404).json(new ApiResponse(404, "Unauthorized access."));

    (req as any).user = user;

    next();
  } catch (error) {
    console.log("Auth middleware error :: ", error);
    return res.status(500).json(new ApiResponse(500, "Auth middleware error"));
  }
};
