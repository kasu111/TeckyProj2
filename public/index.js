// history.go(-1)
// import { format, formatDistance, formatRelative, subDays } from "date-fns";

// const moment = require("moment");
// const checkpass = document.getElementById("checkpass").addEventListener("click", () => {
//     let password = document.getElementById("exampleDropdownFormPassword2")
//     if (password.type === "password") {
//         password.type = "text";
//     } else {
//         password.type = "password";
//     }
// })
const newPost = document.querySelector("#newPost")
const addNewPost = document.getElementById("addPost")
addNewPost.addEventListener("click", () => {

  newPost.classList.remove("none")
})
const postPost = document.querySelector("#postform")
const postClose = document.getElementById("postClose")
postClose.addEventListener("click", () => {
  const newPost = document.querySelector("#newPost")

  postPost.reset();
  newPost.classList.add("none");
})

postPost.addEventListener("submit", async (event) => {
  event.preventDefault()
  // console.log(event);
  // const { data } = event.target
  const form = event.target;
  const formData = new FormData(form);
  // console.log(form);
  // formData.append("title", form.title.value);
  // formData.append("posttext", form.posttext.value)
  // console.log(formData);
  const res = await fetch("/addPost", {
    method: "POST",
    body: formData,
  });
  await res.json();
  postPost.reset();
  await loadpost()
})
loadpost()

async function loadpost() {
  let post = []
  const res = await fetch("/getPost", {
    method: "GET",

  })
  let json = await res.json();
  post = json.postData;
  const postLine = document.querySelector(".postLine")
  // const toptitle = document.querySelector(".titletext")


  if (json.result) {
    postLine.innerHTML = post.map(obj => {
      return `<div class="post" data-id="${obj.id}">
          <div class="postSet">
            <div class="postMenu">
              <div class="postName ${obj.meta}">${obj.name}</div>
              <div class="like">
                <i class="fa-regular fa-thumbs-up"></i>
                <div>${obj.count_like}</div>
              </div>
              <div>
              <div class="time">${obj.created_at}</div>
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
    }).join("")
    const comments = postLine.children
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i]
      const id = comment.getAttribute("data-id")


      comment.addEventListener("click", async () => {
        let rescomm = [];
        console.log("fysufguyegsufgysufgesuy")
        const res = await fetch(`/addPostCommemt/${id}`, {
          method: "GET",
        })
        const json = await res.json();

        const title = document.querySelector(".titletext")
        const commPlace = document.querySelector(".commentsWall")
        if (json.result) {
          title.innerText = json.allData.map(obj =>
            obj.title).join("");
          commPlace.innerHTML = json.allData.map((obj, index) =>
            `<div class="commentBox">
              <div class="bar">
                <div>
                  <div id="CommentID">#${index + 1}</div>
                  <div class="TKGusername ${obj.meta}">${obj.name}</div>
                  <div class="DOTDOTDOT">•</div>
                  <div class="PostedDate" currentitem="false">${obj.write_at}</div>

                  <i class="fa-solid fa-eye none"></i>

                  <i class="fa-solid fa-reply none"></i>
                </div>

                <div class="MultiFunction">
                  <i class="fa-solid fa-share-nodes flexEnd none"></i>

                  <i class="fa-solid fa-triangle-exclamation flexEnd none"></i>
                </div>
              </div>
              <div class="CommentContent">${obj.comm}</div>
              <div class="likeDislike">
                <div class="likeArea">
                  <div class="likePlace">
                    <div><i class="fa-regular fa-thumbs-up"></i> ${obj.count_like}</div>
                  </div>
                </div>
                <div class="quoteArea none">
                  <i class="fa-solid fa-comments"></i>0
                </div>
              </div>
            </div>`).join('')
        };



      })
    }




  }
}