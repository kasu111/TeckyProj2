const part1 = document.querySelector(".part1")//未login
const part2 = document.querySelector(".part2")//未login
const part3 = document.querySelector(".part3")//login
const Showname = document.querySelector(".Showname")
document.querySelector('#signin').addEventListener("submit", async event => {
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
        window.location = "/"
    } else {
        document.querySelector("div#user").innerHTML = result.msg;
    }
});

async function checkUserLogin() {
    const res = await fetch("/user");
    const sessionResult = await res.json();
    // const form = document.querySelector("#signin");
    // const userDiv = document.querySelector("div#user")
    if (sessionResult.id === null) {
        // userDiv.innerHTML = "";
        // form.classList.remove("none")
        part1.classList.remove("none")
        part2.classList.remove("none")
        part3.classList.add("none")
    } else {
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
    part1.classList.remove("none")
    part2.classList.remove("none")
    part3.classList.add("none")
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
        window.location = "/"
    } else {
        document.querySelector("div#user").innerHTML = result.msg;
    }
});



window.onload = async function () {
    await checkUserLogin();
}
