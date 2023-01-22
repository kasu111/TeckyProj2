import express , {Request,Response} from "express";
import expressSession, { MemoryStore } from "express-session";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import { Client } from "pg";
import dotenv from "dotenv";
import http from "http";
import { hashPassword } from "./hash";
import { checkPassword } from "./hash";
dotenv.config();
export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      // password: string
    };
  }
}

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
//post new title到左邊column
app.get("/addPost", async (req: express.Request, res: express.Response) => {
  //const posttitle = await client.query("SELECT id,content FROM posts");
});
let o = path.join(__dirname, "public");

app.use(express.static(o));
/////////////////////////////////////////Carlos part/////////////////

//get user ID and name
app.get("/user", async (req: Request, res:Response)=>{
  res.json(req.session.user?req.session.user : {id:null});
})

//login && checkpassword
app.post("/login", async (req: express.Request, res: express.Response)=>{
  const username = req.body.username;
  const password = req.body.password;

  // 1.Login Success
  // 2. Wrong User Name
  // 3. Wrong Password

  const users = await client.query(
      `select * from userss where name = '${username}'`);
    
      if(users.rows.length == 0){
        res.json({
          success: false,
          msg: "User doesn't exist!",
        }); 
        return;
      }


      const user = users.rows[0];
      const check: any = await checkPassword(password, user.password);
      if(!check){
        res.json({
          success: false,
          msg: "Wrong Password!",
        });
        return;
      }

      req.session.user = {id:user.id, name: user.name};
      // AJAX, Restful

      res.json({
        success: true,
        msg: "Login Success!",
      });
      // res.json(users.rows)
      
 });

 app.get("/logout",(req,res)=>{
  req.session.destroy((err)=>{
    res.redirect('/');
  });
 })

 //users sign up 
 app.post(
  "/signup",
  async (req: Request, res: Response) => {
    try {
      console.log(req.body.username);
      console.log(req.body.password);
      
      
      const username = req.body.username;
      const password = req.body.password;
      // const sex = req.body.sex;
      // const regDate = req.body.regDate;
      // const IsAdmin = req.body.IsAdmin;
      // const vip = req.body.vip;
      // const email = req.body.email;

      await client.query(
       
          `insert into userss (name,password) values($1,$2)`,
          [username,password])
     

      res.json({ 
        success: true,
        user:{
          username: username,
          password: password,
        }
      });
    } catch (ex) {
        console.log(ex);
        res.json({success:false});
    }
  })

server.listen(8000, () => {
  console.log("running port localhost:8000");
});
// function checkPassword(password: any, password1: any) {
//   throw new Error("Function not implemented.");
// }

