import express from "express";
import { Request, Response } from "express";
// import expressSession from "express-session";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

const app = express();
client.connect();

declare module "express-session" {
    interface SessionData {
      name?: string;
    }
  }
  
  app.use(express.static('public'))

  const PORT = 8080;
  
  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
  });
  
  