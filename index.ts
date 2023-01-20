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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
  })
);

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });
const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 400 * 200 ** 2, // the default limit is 200MB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});
let formidable_promise = (req: express.Request) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if ({ err }.err !== null) {
        reject({ err });
      }
      if (
        JSON.stringify({ files }.files) !== "{}" &&
        JSON.stringify({ fields }.fields) !== "{}"
      ) {
        // formidable exist file && formidable exist fields
        resolve({ fields, files });
      } else if (JSON.stringify({ fields }.fields) !== "{}") {
        // formidable does not exist file but exist fields
        resolve({ fields });
      } else if (JSON.stringify({ files }.files) !== "{}") {
        // formidable does not exist fields but exist file
        resolve({ files });
      } else {
        resolve({ fields });
      }
    });
  });
};
type formResult = {
  fields?: any;
  files?: any;
};
function transfer_formidable_into_obj(form_result: formResult) {
  let result = {};

  if (form_result.hasOwnProperty("fields")) {
    result = Object.assign(result, form_result.fields);
  }
  if (form_result.hasOwnProperty("files")) {
    result = Object.assign(result, {
      image: form_result.files.image.newFilename,
    });
  }
  return result;
}
app.post("/addPost", async (req: express.Request, res: express.Response) => {
  // const content = req.body;
  // console.log(req);

  let formResult: any = await formidable_promise(req);
  // console.log(formResult);
  let obj: any = transfer_formidable_into_obj(formResult);

  if (obj.hasOwnProperty("image")) {
    await client.query(`INSERT INTO posts (body,count_like) VALUES ($1,$2)`, [
      obj.title,
      0,
    ]);
    await client.query(
      `INSERT INTO comments (body,count_like) VALUES ($1,$2)`,
      [obj.posttext, 0]
    );
  } else {
    await client.query(`INSERT INTO posts (body,count_like) VALUES ($1,$2)`, [
      obj.title,
      0,
    ]);
    await client.query(
      `INSERT INTO comments (body,count_like) VALUES ($1,$2)`,
      [obj.posttext, 0]
    );
  }
  res.status(200).json({
    success: true,
    result: true,
    message: "success",
  });
});
let o = path.join(__dirname, "public");

app.use(express.static(o));

// app.get("/addPost", async (req: express.Request, res: express.Response) => {
//   const poster = await client.query("SELECT name,body,created_at, FROM posts");
// });

server.listen(8000, () => {
  console.log("running port localhost:8000");
});
