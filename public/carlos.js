document.querySelector('#signin').addEventListener("submit",async event=>{
    event.preventDefault();
    const form = event.target;
    const body = {
        username: form.username.value,
        password: form.password.value
    }
    const res = await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const result = await res.json();//result = (success:true)
    if (result.success){
        window.location = "/admin.html"
    }else{
        document.querySelector("div#user").innerHTML = result.msg;
    }
});

async function checkUserLogin(){
    const res = await fetch("/user");
    const sessionResult = await res.json();
    const form = document.querySelector("#signin");
    const userDiv = document.querySelector("div#user")
    if(sessionResult.id === null){
        userDiv.innerHTML = "";
        form.classList.remove("none")  
    }else{
        userDiv.innerHTML = `${sessionResult.name}
        <div><a href="/logout">登出</a></div>`;
        form.classList.add("none")
    }
}

window.onload = async function(){
    await checkUserLogin();
}
