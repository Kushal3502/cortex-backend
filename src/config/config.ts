import dotenv from "dotenv";

dotenv.config();

export const config = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};
