import express from "express";
import helmet from "helmet";
import authLib from "./src/auth/index";

import { dbconnect } from "./src/dbConnection";
;
// Initialize authentication library
authLib.initialize();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Routers
app.use("/api/auth", authLib.getRoutes());

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
