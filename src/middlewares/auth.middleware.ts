import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { prisma } from "../lib/prisma";
import { UserPayload } from "../types/auth";
import ApiResponse from "../utils/apiResponse";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // retrieve token from headers or cookies
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // if token not found -> user is not authenticated
    if (!token)
      return res.status(404).json(new ApiResponse(404, "Unauthorized request"));

    // decode token
    const decodedToken = jwt.verify(
      token,
      config.accessTokenSecret
    ) as UserPayload;

    // find user from decoded info
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
        email: decodedToken.email,
      },
    });

    if (!user)
      return res.status(404).json(new ApiResponse(404, "Unauthorized request"));

    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error: any) {
    console.log("Auth middleware error :: ", error);
    res.status(500).json(new ApiResponse(500, "Auth middleware error"));
  }
};
