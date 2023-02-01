
const part1 = document.querySelector(".part1")//未login
const part2 = document.querySelector(".part2")//未login
const part3 = document.querySelector(".part3")//login
const Showname = document.querySelector(".Showname")
const signin = document.querySelector('#signin')
const reply = document.querySelector("#replyComment")
const replyBox = document.querySelector("#replyBox")
const closeReplyBox = document.querySelector("#closeReplyBox")
const isreply = document.querySelector(".recomm")
const uploadFiles = document.querySelector("#uploadFiles")
const uploadBtn = document.querySelector("#uploadBtn")
const newPost = document.querySelector("#newPost");
const backdrop = document.querySelector("#backdrop")
const logout = document.getElementById("logout")
const postPost = document.querySelector("#postform");
const postClose = document.getElementById("postClose");
const addNewPost = document.getElementById("addPost");
const closeBox = document.querySelector(".closeBtn")
const resetReply = document.getElementById('reply')
const forPage = document.querySelectorAll(".forPage")
const back = document.getElementById("back")
const next = document.getElementById("next")
const pageLine = document.querySelector(".nextPage")
const submitBTN = document.querySelector(".submitBTN")
const whatPage = document.querySelector(".whatPage")
const changePage = document.getElementById("changePage")
const muchPage1 = document.querySelector(".muchPage1")
const muchPage2 = document.querySelector(".muchPage2")
const showSamePass = document.querySelector(".showSamePass")


// const Pp = document.querySelectorAll(".Pp")
changePage.classList.add("hidden")
back.classList.add("hidden")
next.classList.add("hidden")
muchPage1.classList.add("hidden")
muchPage2.classList.add("hidden")
let page = 0;
const socket = io.connect()
let islogin = false;
let image;
socket.on("getComment", async (data) => {

})
socket.on("getPosted", async (data) => {
  await loadpost()
});
// checkLike(json)
socket.on("newcomm", async (data) => {
  const id = pageLine.getAttribute("data-page");
  await reload(id, page)
})
socket.on("liked", async (data) => {
  loadpost()
  const id = pageLine.getAttribute("data-page");
  await reload(id, page)
})


uploadBtn.addEventListener("click", async event => {

  setTimeout(() => {
    backdrop.classList.remove("none")
  }, 500);
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


addNewPost.addEventListener("click", () => {
  newPost.classList.remove("none");
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
  // await loadpost();
  window.location = "/"
});

async function loadpost() {

  let post = [];
  const res = await fetch("/getPost", {
    method: "GET",
  });
  let json = await res.json();
  post = json.postData;
  // console.log(post);
  const postLine = document.querySelector(".postLine");
  // const toptitle = document.querySelector(".titletext")
  const comments = postLine.children
  const time = post.created_at;

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
              <div class="flex1">
            </div>
              <div>
              <div class="time">${timetype(obj.created_at)}</div>
            </div>
            </div>
            <div>
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
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const id = comment.getAttribute("data-id");
      const res = await fetch(`/addPostCommemt/${id}/${page}`, {
        method: "GET",
      });
      const json = await res.json();
      const numOfPage = json.numOfPage;
      comment.addEventListener("click", async () => {
        page = 0
        resetReply.reset();
        replyBox.classList.add("none");
        if (numOfPage == 1) {
          next.classList.add("hidden")
          changePage.classList.add("hidden")
        } else {
          changePage.classList.remove("hidden")
          next.classList.remove("hidden")
          whatPage.innerHTML = ""
          for (let i = 0; i < numOfPage; i++) {
            const wtPage = document.createElement("div")
            wtPage.classList.add("flex", "Pp")
            if (i + 1 == numOfPage) {
              wtPage.innerHTML = `<div class="pAp">${i + 1}</div>`
            }
            else {
              wtPage.innerHTML = `<div class="pAp">${i + 1}</div> <div>,</div>`
            }

            whatPage.appendChild(wtPage)
          }
        }
        back.classList.add("hidden")

        await reload(id, page)
        // socket.on("newcomm", async (data) => {
        //   const id = pageLine.getAttribute("data-page");
        //   const res = await fetch(`/addPostCommemt/${id}/${page}`, {
        //     method: "GET",
        //   });
        //   const json = await res.json();
        //   const numOfPage = json.numOfPage;
        //   // await reload(id, page)
        // if (numOfPage > 1) {
        //   changePage.classList.remove("hidden")
        //   next.classList.remove("hidden")
        //   whatPage.innerHTML = ""
        //   for (let i = 0; i < numOfPage; i++) {
        //     const wtPage = document.createElement("div")
        //     wtPage.classList.add("flex", "Pp")
        //     if (i + 1 == numOfPage) {
        //       wtPage.innerHTML = `<div class="pAp">${i + 1}</div>`
        //     }
        //     else {
        //       wtPage.innerHTML = `<div class="pAp">${i + 1}</div> <div>,</div>`
        //     }

        //     whatPage.appendChild(wtPage)
        //   }
        // }
        // if (page + 1 >= numOfPage) {
        //   next.classList.add("hidden")
        //   back.classList.remove("hidden")
        // }
        // });
      })
    }


    resetReply.addEventListener("submit", async event => {
      const id2 = document.querySelector('.commentBox').getAttribute("data-post_id")
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      formData.append("files", image)
      const res2 = await fetch(`/reply/${id2}`, {
        method: "POST",
        body: formData
      });
      const result = await res2.json();//result = (success:true)
      if (result.success) {

        resetReply.reset();
        replyBox.classList.add("none")

      } else {
        document.querySelector("div#reply").innerHTML = result.msg;
      }
      const id = pageLine.getAttribute("data-page");
      const res = await fetch(`/addPostCommemt/${id}/${page}`, {
        method: "GET",
      });
      const json = await res.json();
      const numOfPage = json.numOfPage;
      // await reload(id, page)
      if (page <= 0) {
        page = 0
        back.classList.add("hidden")
        // next.classList.remove("hidden")
      }
      if (numOfPage > 1) {
        changePage.classList.remove("hidden")
        next.classList.remove("hidden")
        whatPage.innerHTML = ""
        for (let i = 0; i < numOfPage; i++) {
          const wtPage = document.createElement("div")
          wtPage.classList.add("flex", "Pp")
          if (i + 1 == numOfPage) {
            wtPage.innerHTML = `<div class="pAp">${i + 1}</div>`
          }
          else {
            wtPage.innerHTML = `<div class="pAp">${i + 1}</div> <div>,</div>`
          }

          whatPage.appendChild(wtPage)
        }
      }
      // if (page + 1 >= numOfPage) {
      //   next.classList.add("hidden")
      //   // back.classList.remove("hidden")
      // }
    });

  }
}

//////////////////////////CARLOS//////////////
document.querySelector("input#selectUploadFile").addEventListener("change", (event) => {
  document.getElementById('blah').src = window.URL.createObjectURL(event.target.files[0]);
  image = event.target.files[0];
})

//////////////////////////已完成//////////////////////////
function timetype(time) {
  return moment(time).fromNow();
}
postClose.addEventListener("click", () => {
  postPost.reset();
  newPost.classList.add("none");
});
closeBox.addEventListener("click", async event => {
  backdrop.classList.add("none")
})

reply.addEventListener("click", async () => {
  replyBox.classList.remove("none")
})
closeReplyBox.addEventListener("click", async () => {
  replyBox.classList.add("none")
})


document.querySelector('#signup').addEventListener("submit", async event => {
  event.preventDefault();

  const form = event.target;
  if (form.password.value !== form.password2.value) {
    showSamePass.innerHTML = "密碼對應不符，請重新輸入"
    form.password.value.innerText = ''
    form.password2.value.innerText = ''
    isTimeOut()
  } else {
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

  }
}
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
async function checkLike(json) {
  await json.allData.map(async (obj) => {
    const color = document.querySelector(`.like_${obj.id}`)
    const res = await fetch(`/checkLike/${obj.id}`, {
      method: "GET",
    })
    const json = await res.json()

    if (json.color && islogin) {
      color.classList.add("isLiked")
    } else if (!json.color) {
      color.classList.remove("isLiked")
    }
  })
}


const reload = async function (id, page) {
  pageLine.dataset.page = id;
  const res = await fetch(`/addPostCommemt/${id}/${page}`, {
    method: "GET",
  });
  const json = await res.json();
  const title = document.querySelector(".titletext");
  const commPlace = document.querySelector(".commentsWall");
  const numOfPage = json.numOfPage;
  if (json.result) {
    if (islogin) {
      isreply.classList.remove("none")
    }
    const replyTitle = document.querySelector(".closePage")

    replyTitle.innerText = `回覆 : ${json.allData[0].title}`

    title.innerText = json.allData[0].title
    commPlace.innerHTML = await json.allData.map((obj, index) => {
      return `<div data-post_id=${id} class="commentBox">
      <div class="bar">
        <div>
          <div id="CommentID">#${index + 1 + (page * 5)}</div>
          <div class="TKGusername ${obj.meta}">${obj.name}</div>
          <div class="DOTDOTDOT">•</div>
          <div class="PostedDate" currentitem="false">${timetype(obj.write_at)}</div>

          <i class="fa-solid fa-eye none"></i>

          <i class="none fa-solid fa-reply post-${json.allData[0].id}"></i>
        </div>

        <div class="MultiFunction">
          <i class="fa-solid fa-share-nodes flexEnd none"></i>

          <i class="fa-solid fa-triangle-exclamation flexEnd none"></i>
        </div>
      </div>
      <div class="CommentContent">${obj.body}${isPhoto(obj.photo)}</div>
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


    // checkLike(json)


    await json.allData.map((obj) => {

      const clickLike = document.querySelector(`.like_${obj.id}`)

      clickLike.addEventListener("click", async () => {
        let id = obj.id

        if (islogin) {
          const res = await fetch(`/clickLike/${page}`, {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ id })
          })
          // checkLike(json)
        }

      })
      // socket.on("liked", async (data) => {
      //   checkLike(json)
      // });
    })
    // socket.on("liked", async (data) => {
    //   checkLike(json)
    // });
    checkLike(json)
  }
  if (numOfPage > 1) {
    changePage.classList.remove("hidden")
    next.classList.remove("hidden")
    whatPage.innerHTML = ""
    for (let i = 0; i < numOfPage; i++) {
      const wtPage = document.createElement("div")
      wtPage.classList.add("flex", "Pp")
      if (i + 1 == numOfPage) {
        wtPage.innerHTML = `<div class="pAp">${i + 1}</div>`
      }
      else {
        wtPage.innerHTML = `<div class="pAp">${i + 1}</div> <div>,</div>`
      }

      whatPage.appendChild(wtPage)
    }
  }
  if (page + 1 >= numOfPage) {
    next.classList.add("hidden")
    // back.classList.remove("hidden")
  }
}

submitBTN.addEventListener("click", async event => {
  replyBox.classList.add("none");
})


window.onload = async function () {
  await checkUserLogin();
  await loadpost();
}

function isPhoto(obj) {
  if (obj) {
    return `<img src='http://localhost:8000/${obj}' width='150'/> `
  } else {
    return '<span></span>'
  }
}
// history.go(-1)



