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
    const res = await fetch("/addPost", {
        method: "GET",

    })
    let json = await res.json();
    post = json.postData;
    const postLine = document.querySelector(".postLine")
    console.log(post);


    if (json.result) {
    postLine.innerHTML = post.map(obj =>
        `<div class="post">
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
                ${obj.body}
              </h4>
            </div>
          </div>
        </div>`).join('')
    }

}