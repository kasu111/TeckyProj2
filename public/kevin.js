const chpass = document.querySelector("#clickReset")
const resetPass = document.getElementById("resetPass")
chpass.addEventListener("click", () => {
    resetPass.classList.remove("none")
})

const resetClose = document.getElementById("resetClose")
resetClose.addEventListener("click", () => {
    postPost.reset();
    resetPass.classList.add("none");

})
// const newcomment = document.querySelector(".alitem")
// newcomment.addEventListener("click", () => {

// })