import express from "express";
import expressSession, { MemoryStore } from "express-session";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
dotenv.config();
export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();
const app = express();
const server = new http.Server(app);
// const io = new SocketIO(server);

server.listen(4000, () => {
  console.log("running port localhost:4000");
});

app.post("/addPost", (req: express.Request, res: express.Response) => {
  const content = req.body;
});
