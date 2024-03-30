import { JwtPayload } from "jsonwebtoken";

// Define an interface extending the default Headers interface
interface CustomHeaders extends Headers {
  authorization: string;
}

export type boolRes = { success: boolean };

export type userType =
  | {
      success: boolean;
      data: UserResponseType;
    }
  | { success: false };

export interface UserResponseType {
  User_ID: number;
  name: string;
  Email: string;
  Password: string;
}

export type TokenType =
  | {
      success: boolean;
      data?: TokenResponseType;
    }
  | { success: false };

export interface TokenResponseType {
  success: boolean;
  token?: string;
}
