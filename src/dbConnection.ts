import mysql from 'mysql2';
import dotenv from "dotenv";

export const config = dotenv.config().parsed;

interface ProcessEnv {
  MYSQL_HOST?: string;
  MYSQL_PORT?: number;
  MYSQL_ROOT_USER?: string;
  MYSQL_ROOT_PASSWORD?: string;
  MYSQL_DATABASE?: string;
  // Add other environment variables as needed
}

// Assert that process.env has the type of ProcessEnv
const env = config as ProcessEnv;

 export const dbConnection = mysql.createConnection({
  host: env.MYSQL_HOST,
  port : env.MYSQL_PORT,
  user: env.MYSQL_ROOT_USER,
  password: env.MYSQL_ROOT_PASSWORD,
  database: env.MYSQL_DATABASE
});

export const dbconnect = dbConnection.promise();
