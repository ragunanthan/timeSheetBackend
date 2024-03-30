import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { UserResponseType } from "./types";
import {
  logInValidationSchema,
  signUpValidationSchema,
} from "./validationSchema";
import { getUser, saveUser } from "./authService";
import { config } from "../dbConnection";

const generateAccessToken = (payload: UserResponseType): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY as string, {
    expiresIn: "14m",
  });
};

const generateRefreshToken = (payload: UserResponseType): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY as string, {
    expiresIn: "30d",
  });
};

const signUp = async (req: Request, res: Response) => {
  try {
    const { error } = signUpValidationSchema(req.body);
    if (error)
      return res
        .status(400)
        .json({ isSuccess: false, message: error.details[0].message });

    const { success } = await getUser(req.body);
    if (success)
      return res
        .status(400)
        .json({ isSuccess: false, message: "User is already exist" });

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const { success: saved } = await saveUser(req.body, hashPassword);
    if (saved)
      return res.status(201).json({
        isSuccess: true,
        message: "Account created sucessfully",
      });
    else
      return res.status(500).json({
        isSuccess: false,
        message: "Somthing went wrong",
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { error } = logInValidationSchema(req.body);
    if (error)
      return res
        .status(400)
        .json({ isSuccess: false, message: error.details[0].message });

    const result = await getUser(req.body);
    if (!result.success)
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid User" });

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      result.data.Password
    );

    if (!verifiedPassword)
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid password" });
    const accessToken = generateAccessToken(result.data);
    const refreshToken = generateRefreshToken(result.data);
    res.status(200).json({
      isSuccess: true,
      message: "Logged in sucessfully",
      data: {
        accessToken,
        refreshToken,
        ...result.data,
        Password : undefined,
        password : undefined
      },
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

const logout = async (req: any, res: Response) => {
  try {
    return res
      .status(200)
      .json({ isSuccess: true, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal Server Error" });
  }
};

// const refreshToken = async (req: any, res: Response) => {
//   const { success, token } = await getToken(req.user);
//   if (!success)
//     return res
//       .status(500)
//       .json({ isSuccess: false, message: "Invalid refresh token" });
//   if (token.trim() !== req?.headers?.authorization?.split(" ")[1].trim())
//     return res
//       .status(500)
//       .json({
//         isSuccess: false,
//         message: "Same user is logged in other device, please login again.",
//       });
//   const accessToken = generateAccessToken(req.user);
//   res.status(200).json({
//     isSuccess: true,
//     accessToken,
//     message: "Access token created successfully",
//   });
// };

const getUserDetail = async (req: any, res: Response) => {
  let data = req.user;
  const result = await getUser(data);
  if (result.success)
    res.status(200).json({
      isSuccess: true,
      data:{ 
        ...result.data,
        Password : undefined,
        password : undefined
      }
     
    });
  else
    res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
};

interface ProcessEnv {
  ACCESS_TOKEN_PRIVATE_KEY: string;
}


const authMiddleware = (req: Request, res: Response, next: NextFunction)  => {
  const token: string | undefined = req?.headers?.authorization?.split(' ')[1] as string;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  } else
    try {
      const env = config as unknown as ProcessEnv;
     
      const decoded: JwtPayload | string = jwt.verify(
        token,
        env.ACCESS_TOKEN_PRIVATE_KEY
      );
      
      if (typeof decoded === "object") {
        (req as any).user = decoded as JwtPayload;
      } else {
        res.status(401).json({ error: "Invalid token" });
      }
      next();
    } catch (error) {
      console.log(error);
      
      res.status(401).json({ error: "Invalid token" });
    }
}

export {
  signUp,
  login,
  logout,
  // refreshToken,
  getUserDetail,
  authMiddleware
};
