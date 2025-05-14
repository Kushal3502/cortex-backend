import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface UserPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: UserPayload) => {
  // @ts-ignore
  return jwt.sign(payload, config.accessTokenSecret, {
    expiresIn: config.accessTokenExpiry,
  });
};

export const generateRefreshToken = (payload: UserPayload) => {
  // @ts-ignore
  return jwt.sign(payload, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenExpiry,
  });
};
