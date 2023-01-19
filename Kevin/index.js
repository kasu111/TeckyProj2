history.go(-1)


document.getElementById("checkpass").addEventListener("click", () => {
    let password = document.getElementById("exampleDropdownFormPassword2")
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
})

