// history.go(-1)


const checkpass = document.getElementById("checkpass").addEventListener("click", () => {
    let password = document.getElementById("exampleDropdownFormPassword2")
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
})
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
    const data = event.target
    const res = await fetch("/addPost", {
        method: "POST",
        body: data,
    });
    await res.json();
    postPost.reset();
})
