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