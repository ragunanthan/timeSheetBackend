import express from "express";
import helmet from "helmet";
import cors from "cors";
import authLib from "./src/auth/index";
import timeSheet from "./src/Routes/timeSheet";


import { dbconnect } from "./src/dbConnection";
import { authMiddleware } from "./src/auth/controller";
;
// Initialize authentication library
authLib.initialize();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Routers
app.use("/api/auth", authLib.getRoutes());

app.use("/api/timesheet", authMiddleware, timeSheet);


const port: string | number = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`
🚀 Server ready at: ${port}`);

  try {
    const data = await dbconnect.connect();
    console.log(data, "Connected");
    
  }
  catch(err){
    console.log("err", err);
    
  }
});
