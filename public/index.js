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

const ppp = postPost.addEventListener("submit", async (event) => {
    event.preventDefault()
    console.log(event);
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
    // await loadpost()
})
loadpost()
async function loadpost() {
    const res = await fetch("/addPost", {
        method: "GET",
    })
    let json = await res.json();
}