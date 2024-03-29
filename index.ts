import express from "express";
import helmet from "helmet";
import authLib from "auth-lib-jwt";
import 'dotenv/config';

import { dbconnect } from "./src/dbConnection";
import authService from "./src/services/authService";


const {
  getUser,
  deleteExistingToken,
  getToken,
  saveRefreshToken,
  saveUser,
} = authService();

// Initialize authentication library
// authLib.initialize({
//   // Implement your own logic for these functions
//   getUser,
//   addToken: saveRefreshToken,
//   getToken,
//   saveUser,
//   deleteExistingToken,
// });

const app = express();
// BigInt.prototype.toJSON = function () {
//   return this.toString();
// };
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

// Routers
// app.use("/api/auth", authLib.getRoutes());
app.use("/" , (req, res) => res.send("Sucess"))

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`
🚀 Server ready at: ${port}`);

  try {
    dbconnect.connect();
    console.log("Connected");
    
  }
  catch(err){
    console.log("err", err);
    
  }
});
