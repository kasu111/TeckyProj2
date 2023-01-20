import express from "express";
import expressSession, { MemoryStore } from "express-session";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
import moment from "moment";
// import { format, formatDistance, formatRelative, subDays } from "date-fns";
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
//輸入新post到database
app.post("/addPost", async (req: express.Request, res: express.Response) => {
  let formResult: any = await formidable_promise(req);
  let obj: any = transfer_formidable_into_obj(formResult);
  if (obj.hasOwnProperty("image")) {
    const newRecord: any = await client.query(
      `INSERT INTO posts (body,count_like,user_id) VALUES ($1,$2,$3) RETURNING id`,
      [obj.title, 0, 1]
    );
    await client.query(
      `INSERT INTO comments (body,count_like,user_id,post_id) VALUES ($1,$2,$3,$4)`,
      [obj.posttext, 0, 1, newRecord.rows[0].id]
    );
  } else {
    const newRecord: any = await client.query(
      `INSERT INTO posts (body,count_like,user_id) VALUES ($1,$2,$3) RETURNING id`,
      [obj.title, 0, 1]
    );
    await client.query(
      `INSERT INTO comments (body,count_like,user_id,post_id) VALUES ($1,$2,$3,$4)`,
      [obj.posttext, 0, 1, newRecord.rows[0].id]
    );
  }
  res.status(200).json({
    success: true,
    result: true,
    message: "success",
  });
});
function timetype(time: any) {
  let settime = moment(time).format("YYMMDD,h:mm");
  settime = moment(settime, "YYMMDD,h:mm").fromNow();
  return settime;
}
//post new title到左邊column
app.get("/addPost", async (req: express.Request, res: express.Response) => {
  const posttitle = await client.query(
    "SELECT users.name,count_like,posts.body,users.sex,created_at FROM posts join users on posts.user_id = users.id"
  );

  let postData = posttitle.rows;
  postData = postData.map((obj) =>
    Object.assign(obj, {
      created_at: timetype(obj.created_at)
    })
  );

  postData = postData.map(obj=> obj.sex ? Object.assign(obj,{meta:'bluecolor'}) : Object.assign(obj,{meta:'redcolor'}))

  // console.log(postData);

  res.status(200).json({
    result: true,
    message: "success",
    postData,
  });
});
let o = path.join(__dirname, "public");

app.use(express.static(o));

server.listen(8000, () => {
  console.log("running port localhost:8000");
});
