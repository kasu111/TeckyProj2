// history.go(-1)
// import { format, formatDistance, formatRelative, subDays } from "date-fns";

// const { json } = require("stream/consumers")

// const moment = require('moment')

// const moment = require('moment')
// const 
const part1 = document.querySelector(".part1")//未login
const part2 = document.querySelector(".part2")//未login
const part3 = document.querySelector(".part3")//login
const Showname = document.querySelector(".Showname")
const signin = document.querySelector('#signin')
const reply = document.querySelector("#replyComment")
const replyBox = document.querySelector("#replyBox")
const closeReplyBox = document.querySelector("#closeReplyBox")
const isreply = document.querySelector(".recomm")
const backdrop = document.querySelector("#replyBox")
const uploadFiles = document.querySelector("#uploadFiles")
const uploadFilesClick = document.querySelector("#uploadFilesClick")
let islogin = false;

function timetype(time) {
  return moment(time).fromNow();
}

uploadFilesClick.addEventListener("click", async event => {

  setTimeout(() => {
    backdrop.classList.remove("none")
  }, 500);
})

const closeBox = document.querySelector(".closeBtn")

closeBox.addEventListener("click", async event => {
  backdrop.classList.add("none")
})
const checkpass = document
  .getElementById("checkpass")
  .addEventListener("click", () => {
    let password = document.getElementById("exampleDropdownFormPassword2");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }); //
const newPost = document.querySelector("#newPost");
const addNewPost = document.getElementById("addPost");
addNewPost.addEventListener("click", () => {
  newPost.classList.remove("none");
});
const postPost = document.querySelector("#postform");
const postClose = document.getElementById("postClose");
postClose.addEventListener("click", () => {
  const newPost = document.querySelector("#newPost");

  postPost.reset();
  newPost.classList.add("none");
});

postPost.addEventListener("submit", async (event) => {
  event.preventDefault();
  // console.log(event);
  // const { data } = event.target
  const form = event.target;
  const formData = new FormData(form);
  // console.log(form);
  // formData.append("title", form.title.value);
  // formData.append("posttext", form.posttext.value)
  // console.log(formData);
  const res = await fetch("/addpost", {
    method: "POST",
    body: formData,
  });
  await res.json();
  postPost.reset();
  newPost.classList.add("none");
  await loadpost();
});
loadpost();

async function loadpost() {
  let post = [];
  const res = await fetch("/getPost", {
    method: "GET",
  });
  let json = await res.json();
  post = json.postData;
  console.log(post);
  const postLine = document.querySelector(".postLine");
  // const toptitle = document.querySelector(".titletext")
  const comments = postLine.children
  const time = post.created_at;
  // console.log("asfgyuihasfgyisagf", time);
  // post = post.map((obj) => Object.assign(obj, {
  //   created_at: timetype(obj.created_at),
  // })
  // )
  if (json.result) {
    postLine.innerHTML = post
      .map((obj) => {
        return `<div class="post" data-id="${obj.id}">
          <div class="postSet">
            <div class="postMenu">
              <div class="postName ${obj.meta}">${obj.name}</div>
              <div class="like postLike_${post[0].id}">
                <i class="fa-regular fa-thumbs-up"></i>
                <div data-like="${obj.id}">${obj.like}</div>
              </div>
              <div>
              <div class="time">${timetype(obj.created_at)}</div>
            </div>
            </div>
            <div>
              <select name="titlePage" id="titlePage">
                <option value="">第一頁</option>
              </select>
            </div>
          </div>
          <div class="postTitle">
            <div class="Red"></div>
            <div class="mainTitle">
              <h4>
                ${obj.title}
              </h4>
            </div>
          </div>
        </div>`
      }).join("");
    // await checkLike(id)

    for (let i = 0; i < comments.length; i++) {
      // const comments = postLine.children
      const comment = comments[i];

      const id = comment.getAttribute("data-id");
      comment.addEventListener("click", async () => {
        const res = await fetch(`/addPostCommemt/${id}`, {
          method: "GET",
        });
        const json = await res.json();
        const title = document.querySelector(".titletext");
        const commPlace = document.querySelector(".commentsWall");

        if (json.result) {
          if (islogin) {
            isreply.classList.remove("none")
          }

          title.innerText = json.allData[0].title
          commPlace.innerHTML = await json.allData.map((obj, index) => {
            return `<div data-post_id=${id} class="commentBox">
              <div class="bar">
                <div>
                  <div id="CommentID">#${index + 1}</div>
                  <div class="TKGusername ${obj.meta}">${obj.name}</div>
                  <div class="DOTDOTDOT">•</div>
                  <div class="PostedDate" currentitem="false">${timetype(obj.write_at)}</div>

                  <i class="fa-solid fa-eye none"></i>

                  <i class="fa-solid fa-reply post-${json.allData[0].id}"></i>
                </div>

                <div class="MultiFunction">
                  <i class="fa-solid fa-share-nodes flexEnd none"></i>

                  <i class="fa-solid fa-triangle-exclamation flexEnd none"></i>
                </div>
              </div>
              <div class="CommentContent">${obj.body}</div>
              <div class="likeDislike">
                <div class="likeArea">
                  <div class="likePlace like_${obj.id}">
                    <div><i class="fa-regular fa-thumbs-up"></i>${obj.like}</div>
                  </div>
                </div>
                <div class="quoteArea none">
                  <i class="fa-solid fa-comments"></i>0
                </div>
              </div>
            </div>`}).join('');
          // async function checkLike(id) {
          //   const postColor = document.querySelector(`.postLike_${id}`)
          //   const color = document.querySelector(`.like_${obj.id}`)
          //   const res = await fetch(`/checkLike/${obj.id}`, {
          //     method: "GET",
          //   })
          //   const json = await res.json()

          //   if (json.color) {
          //     postColor.classList.add("isLiked")
          //     color.classList.add("isLiked")
          //   } else {
          //     postColor.classList.remove("isLiked")
          //     color.classList.remove("isLiked")
          //   }

          // }
          ///////////////////////////////////////改動了(25/6)
          // document.querySelector('.submitBTN').classList = ["submitBTN " + `post-${json.allData[0].id}`]
          // console.log(document.querySelector('.submitBTN').classList[1])
          await json.allData.map((obj) => {
            const clickLike = document.querySelector(`.like_${obj.id}`)
            // console.log("121823239872894782", obj.id);
            clickLike.addEventListener("click", async () => {
              let id = obj.id
              // console.log("121823239872894782", id);
              if (islogin) {
                const res = await fetch("/clickLike", {
                  headers: {
                    "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify({ id })
                })
                await res.json()
              }
            })



          })


        }
        // await checkLike(id)
      })

    }
    
    document.querySelector('#reply').addEventListener("submit", async event => {
      const id = document.querySelector('.commentBox').getAttribute("data-post_id")
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);


      const res = await fetch(`/reply/${id}`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();//result = (success:true)
      if (result.success) {
        backdrop.classList.add("none")
        window.location = "/"
      } else {
        document.querySelector("div#reply").innerHTML = result.msg;
      }
    });

  }
}
/////////////////////////////////////////////////////////////

// async function checkLike(id) {
//   const postColor = document.querySelector(`.postLike_${id}`)
//   const color = document.querySelector(`.like_${id}`)
//   const res = await fetch(`/checkLike/${id}`, {
//     method: "GET",
//   })
//   const json = await res.json()

//   if (json.color) {
//     postColor.classList.add("isLiked")
//     color.classList.add("isLiked")
//   } else {
//     postColor.classList.remove("isLiked")
//     color.classList.remove("isLiked")
//   }

// }

//////////////////////////CARLOS//////////////



signin.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.target;
  const body = {
    username: form.username.value,
    password: form.password.value
  }
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const result = await res.json();//result = (success:true)
  if (result.success) {
    islogin = true;

    window.location = "/"
  } else {
    islogin = false;
    document.querySelector("div#user").innerHTML = result.msg;
  }
});

async function checkUserLogin() {
  const res = await fetch("/user");
  const sessionResult = await res.json();
  // const form = document.querySelector("#signin");
  // const userDiv = document.querySelector("div#user")
  if (sessionResult.id === null) {
    islogin = false;
    isreply.classList.add("none")
    part1.classList.remove("none")
    part2.classList.remove("none")
    part3.classList.add("none")
  } else {
    islogin = true;
    part3.classList.remove("none")
    part1.classList.add("none")
    part2.classList.add("none")
    Showname.innerHTML = `<h3>${sessionResult.name}</h3>`
    // userDiv.innerHTML = `${sessionResult.name}
    // <div><a href="/logout">登出</a></div>`;
    // form.classList.add("none")
  }
}
const logout = document.getElementById("logout")
logout.addEventListener("click", async () => {
  const colorAll = document.querySelector(`.likePlace`)
  const postColor = document.querySelector(`.like`)
  islogin = false;
  part1.classList.remove("none")
  part2.classList.remove("none")
  part3.classList.add("none")
  isreply.classList.add("none")
  colorAll.classList.remove("isLiked")
  postColor.classList.remove("isLiked")
  await fetch("/logout", {
    method: "GET",
  })
})

//signup Fetching
document.querySelector('#signup').addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.target;
  const body = {
    username: form.username.value,
    password: form.password.value,
    sex: form.sex.value
  }
  const res = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const result = await res.json();//result = (success:true)
  if (result.success) {
    islogin = true;
    window.location = "/"
  } else {
    islogin = false;
    document.querySelector("div#user").innerHTML = result.msg;
  }
});

//reply box open /close



reply.addEventListener("click", async () => {
  // console.log("replyBox is clicked");
  replyBox.classList.remove("none")
})
closeReplyBox.addEventListener("click", async () => {
  // console.log("replyBox is closed");
  replyBox.classList.add("none")
})

window.onload = async function () {
  await checkUserLogin();
}