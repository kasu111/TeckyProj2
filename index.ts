import express, { response } from "express";
import expressSession, { MemoryStore } from "express-session";
import path from "path";
import fs from "fs";
import formidable from "formidable";
import { Client, Query } from "pg";
import dotenv from "dotenv";
import http from "http";
// import moment from "moment";
import { hashPassword } from "./hash";
import { checkPassword } from "./hash";
import session from "express-session";
import { Server as SocketIO } from "socket.io";
import { Socket } from "dgram";

let page: number = 0;
dotenv.config();
export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();
const app = express();
const server = new http.Server(app);
const io = new SocketIO(server);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
  })
);
declare module "express-session" {
  interface SessionData {
    user?: {
      id: Number;
      name: string;
      // password: string
    };
  }
}
io.on("connection", function (socket) {
  // console.log(socket);
});

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
      image: form_result.files.files.newFilename,
    });
  }
  return result;
}
//////////////////////////////////////////////////////
//輸入新post到database
app.post("/addpost", async (req: express.Request, res: express.Response) => {
  io.emit("getPosted", "getPosted");
  let formResult: any = await formidable_promise(req);
  let obj: any = transfer_formidable_into_obj(formResult);
  const user = req.session.user;
  const userid = user?.id;

  // if (obj.hasOwnProperty("image")) {
  // const newRecord: any = await client.query(
  //   `INSERT INTO posts (title,user_id) VALUES ($1,$2)`,
  //   [obj.title, userid]
  // );
  // await client.query(
  //   `INSERT INTO comments (body,user_id,posts.title) VALUES ($1,$2,(SELECT posts.title from posts))`,
  //   [obj.posttext, userid, obj.title]
  // );
  // } else {
  const newRecord: any = await client.query(
    `INSERT INTO posts (title,user_id) VALUES ($1,$2) RETURNING id`,
    [obj.title, userid]
  );
  await client.query(
    `INSERT INTO comments (body,user_id,post_id,is_first_comment) VALUES ($1,$2,$3,$4)`,
    [obj.posttext, userid, newRecord.rows[0].id, true]
  );
  // }
  res.status(200).json({
    success: true,
    result: true,
    message: "success",
  });
});
// function timetype(time: any) {
//   return moment(time, "YYMMDD,h:mm").fromNow();
// }
async function callpage(id: number) {
  const countPost = await client.query(
    `SELECT count(*) from comments where post_id=$1`,
    [id]
  );
  return Math.ceil(countPost.rows[0].count / 5);
}
/////////////////////////////////工程中////////////////////////////////////
// app.get(
//   "next/:id/:page",
//   async (req: express.Request, res: express.Response) => {
//     const id = Number(req.params.id);
//     const page = Number(req.params.page);
//     const next = await callpage(id);
//     await client.query(
//       `SELECT comments.id,sex,title,name,body,write_at FROM comments inner join posts on comments.post_id = posts.id inner join users on comments.user_id = users.id where posts.id=$1 order by write_at asc limit 5 OFFSET $2`,
//       [id]
//     );
//   }
// );
/////////////////////////////////工程中////////////////////////////////////
app.get(
  "/addPostCommemt/:id/:page",
  async (req: express.Request, res: express.Response) => {
    io.emit("getComment", "get new comment");
    const id = Number(req.params.id);

    const next = Number(req.params.page);
    const numOfPage = await callpage(id);

    if (next <= 0) {
      page = 0;
    } else if (next >= numOfPage) {
      page = numOfPage;
    } else {
      page = next;
    }
    // console.log(numOfPage);

    const comments = await client.query(
      `SELECT comments.photo,comments.id,sex,title,name,body,write_at FROM comments inner join posts on comments.post_id = posts.id inner join users on comments.user_id = users.id where posts.id=$1 order by write_at asc limit $2 OFFSET $3`,
      [id, 5, page * 5] //page
    );

    let allData = comments.rows;
    // allData = allData.map((obj) =>
    //   Object.assign(obj, { write_at: timetype(obj.write_at) })
    // );

    allData = await Promise.all(
      allData.map(async (obj) => {
        const postlikes = await client.query(
          "SELECT user_id FROM comment_like where comment_id = $1",
          [obj.id]
        );
        let like = postlikes.rows.length;
        return Object.assign(obj, { like: like });
      })
    );

    allData = allData.map((obj) =>
      obj.sex
        ? Object.assign(obj, { meta: "bluecolor" })
        : Object.assign(obj, { meta: "redcolor" })
    );

    res.status(200).json({
      result: true,
      message: "success",
      allData,
      numOfPage: Number(numOfPage),
    });
  }
);
//get title到左邊column
app.get("/getPost", async (req: express.Request, res: express.Response) => {
  const posttitle = await client.query(
    "SELECT users.name,users.sex,posts.id,posts.title,posts.created_at from(SELECT posts.id,posts.title,posts.created_at,posts.user_id FROM posts limit 10 )as posts inner join users on posts.user_id = users.id order by created_at desc"
  );

  // let asd = a123.rows;
  let postData = posttitle.rows;
  postData = await Promise.all(
    postData.map(async (obj) => {
      let likecount = await client.query(
        `select comment_like.user_id  from (select posts.id as postid,comments.id as comid from posts inner join comments on posts.id = comments.post_id where is_first_comment =true limit 10)as com inner join comment_like on comment_like.comment_id =com.comid where com.postid = $1`, // where com.postid IN ${sql_param}
        [obj.id]
      );
      let like = likecount.rows.length;
      return Object.assign(obj, { like: like });
    })
  );
  postData = postData.map((obj) =>
    obj.sex
      ? Object.assign(obj, { meta: "bluecolor" })
      : Object.assign(obj, { meta: "redcolor" })
  );

  res.status(200).json({
    result: true,
    message: "success",
    postData,
  });
});

//////////////////////////////////
app.post(
  "/clickLike/:page",
  async (req: express.Request, res: express.Response) => {
    io.emit("liked", "have liked");
    // res.json({ updated: 1 });
    const showlike = await client.query(
      "SELECT comment_id,user_id FROM comment_like WHERE comment_id = $1 AND user_id = $2",
      [req.body.id, req.session.user?.id]
    );
    if (showlike.rowCount > 0) {
      await client.query(
        "DELETE FROM comment_like where user_id = $1 and comment_id =$2",
        [req.session.user?.id, req.body.id]
      );
      return res.status(200).json({
        result: true,
        message: "Del liked",
        liked: false,
      });
    }
    // Socket.on(`clickliked`, () => {});
    const likepost = await client.query(
      `INSERT INTO comment_like (user_id,comment_id) VALUES ($1,$2) RETURNING comment_id`,
      [req.session.user?.id, req.body.id]
    );
    res.status(200).json({
      result: true,
      message: "success",
      likepost,
      liked: true,
    });
  }
);

//check user login or not
app.get("/user", async (req: express.Request, res: express.Response) => {
  //if you want to insert admin hashed password into database use below script
  // const password = await hashPassword("1234")
  // res.json(password)
  res.json(req.session.user ? req.session.user : { id: null });
});

//check user and password
app.post("/login", async (req: express.Request, res: express.Response) => {
  const username = req.body.username;
  const password = req.body.password;

  // 1.Login Success
  // 2. Wrong User Name
  // 3. Wrong Password

  const users = await client.query(`select * from users where name = $1`, [
    username,
  ]);

  if (users.rows.length == 0) {
    res.json({
      success: false,
      msg: "User doesn't exist!",
    });
    return;
  }

  const user = users.rows[0];
  const check: any = await checkPassword(password, user.password);
  if (!check) {
    res.json({
      success: false,
      msg: "Wrong Password!",
    });
    return;
  }

  req.session.user = { id: user.id, name: user.name };
  // AJAX, Restful

  res.json({
    success: true,
    msg: "Login Success!",
  });
  // res.json(users.rows)
});

//logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

//users sign up
app.post("/signup", async (req: express.Request, res: express.Response) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    const sex = req.body.sex;

    const newRecord = await client.query(
      `insert into users (name,password,sex,status_admin,vip) values($1,$2,$3,$4,$5) RETURNING id`,
      [username, hashedPassword, sex, false, false]
    );

    req.session.user = { id: newRecord.rows[0].id, name: username };
    res.json({
      success: true,
      user: {
        username: username,
      },
    });
  } catch (error) {
    console.log("ex,", error);
    res.json({ success: false, msg: "Failed to sign up" });
  }
});

//reply a post (commentsssss)

//輸入新comment到database TESTING NOT CONFIrM
app.post("/reply/:id", async (req: express.Request, res: express.Response) => {
  io.emit("newcomm", "have new commet");
  let formResult: any = await formidable_promise(req);
  let obj: any = transfer_formidable_into_obj(formResult);

  const userid = req.session.user?.id;
  console.log(obj,'367')
  // const replyContent = req.body.replyContent;
  if (obj.hasOwnProperty("image")) {
    const newRecord: any = await client.query(
      `insert into comments (body,photo,user_id,post_id) values($1,$2,$3,$4) RETURNING id`,
      [obj.replyContent, obj.image, userid, req.params.id]
    );
    console.log(newRecord.rows[0].id,'374')
  } else {
    await client.query(
      `insert into comments (body,photo,user_id,post_id) values($1,$2,$3,$4)`,
      [obj.replyContent, "", userid, req.params.id]
    );


    res.status(200).json({
      success: true,
      result: true,
      message: "success",
    });
  }
});

app.get(
  "/checkLike/:id",
  async (req: express.Request, res: express.Response) => {
    const check = await client.query(
      "SELECT user_id FROM comment_like where user_id = $1 AND comment_id = $2",
      [req.session.user?.id, req.params.id]
    );
    if (check.rowCount > 0) {
      res.status(200).json({
        success: true,
        result: true,
        color: true,
      });
    } else {
      res.status(200).json({
        success: true,
        result: true,
        color: false,
      });
    }
  }
);

// app.post("/reply", async (req: express.Request, res: express.Response)=> {

//check user login -> or if doesn't log it reply button display none
//mark replying user id and name
//create new comments box
//show comments box content

// });

/////////////////////////////////////////////////////////////////////
// app.get(
//   "/showLike/:id",
//   async (req: express.Request, res: express.Response) => {
//     const id = req.params.id;

//     console.log("idididiididdddddidididdididdiidd", req.params);
//     if (id !== null) {
//       const postlikes = await client.query(
//         "SELECT user_id FROM post_likes where post_id = $1",
//         [id]
//       );
//       let likes = postlikes.rows.length;
//       const like = likes.toString();
//       res.status(200).json({
//         result: true,
//         message: "success",
//         postlike: like,
//       });
//     }
//   }
// );

let o = path.join(__dirname, "public");
let k = path.join(__dirname, "uploads");

app.use(express.static(o));
app.use(express.static(k));

server.listen(8000, () => {
  console.log("running port localhost:8000");
});
