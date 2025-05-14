import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import ApiResponse from "../utils/apiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateHash";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new Error("All fields are required.");

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    // if user found throw error
    if (user) {
      res
        .status(400)
        .json(new ApiResponse(400, "User already exists with this email"));
      return;
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // crete new user
    const data = {
      name,
      email,
      password: hashedPassword,
    };

    await prisma.user.create({
      data,
    });

    res.status(200).json(new ApiResponse(200, "User created successfully"));
  } catch (error: any) {
    console.log("Register user error :: ", error.response.message);
    res.status(500).json(new ApiResponse(500, "Register user error"));
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("All fields are required.");

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // user not registered
    if (!user) {
      res.status(400).json(new ApiResponse(400, "EmailId not registered."));
      return;
    }

    // check for password
    // @ts-ignore
    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(404).json(new ApiResponse(404, "Invalid credentials."));
      return;
    }

    // assign cookies
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // store refreshtoken to db
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(200, "Login successful", {
        user: { id: user.id, name: user.name, email: user.email },
      })
    );
  } catch (error: any) {
    console.log("Login user error :: ", error.response.message);
    res.status(500).json(new ApiResponse(500, "Login user error"));
  }
};

export const logoutUser = async (req: Request, res: Response) => {};

export const googleLogin = async (req: Request, res: Response) => {};

export const currentUser = async (req: Request, res: Response) => {};
