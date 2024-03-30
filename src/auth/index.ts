import express, { Router, Request, Response } from "express";
import {
  getUserDetail,
  login,
  logout,
  // refreshToken,
  signUp,
  authMiddleware
} from "./controller";


class AuthLib {
  private initialized: boolean;
  private router: Router;
  public authMiddleware = authMiddleware;

  constructor() {
    this.initialized = false;
    this.router = express.Router();
  }

  initialize() {
    if (this.initialized) {
      console.warn("AuthLib is already initialized.");
      return;
    }

    // Initialize routes
    this.initRoutes();
    this.initialized = true;
  }

  initRoutes() {
    // Routes handlers
    this.router.get("/authLibCheck", (req: Request, res: Response) => {
      res.json("Connect to auth check");
    });
    this.router.post("/login", login);
    this.router.post("/signup", signUp);
    // this.router.post("/refresh-token", refreshToken);
    this.router.get("/getUser", authMiddleware, getUserDetail);
    this.router.get("/logout",  logout);
  }

  getRoutes(): Router {
    return this.router;
  }
}

export default new AuthLib();
