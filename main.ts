import express from "express";
import { Request, Response } from "express";
// import expressSession from "express-session";

const app = express();

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
  
  