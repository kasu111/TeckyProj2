// const part1 = document.querySelector(".part1")//未login
// const part2 = document.querySelector(".part2")//未login
// const part3 = document.querySelector(".part3")//login
// const Showname = document.querySelector(".Showname")
// const signin = document.querySelector('#signin')
// let islogin = false;


// signin.addEventListener("submit", async event => {
//     event.preventDefault();
//     const form = event.target;
//     const body = {
//         username: form.username.value,
//         password: form.password.value
//     }
//     const res = await fetch("/login", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(body)
//     });
//     const result = await res.json();//result = (success:true)
//     if (result.success) {
//         islogin = true;
//         window.location = "/"
//     } else {
//         islogin = false;
//         document.querySelector("div#user").innerHTML = result.msg;
//     }
// });

// async function checkUserLogin() {
//     const res = await fetch("/user");
//     const sessionResult = await res.json();
//     // const form = document.querySelector("#signin");
//     // const userDiv = document.querySelector("div#user")
//     if (sessionResult.id === null) {
//         islogin = false;
//         // userDiv.innerHTML = "";
//         // form.classList.remove("none")
//         part1.classList.remove("none")
//         part2.classList.remove("none")
//         part3.classList.add("none")
//     } else {
//         islogin = true;
//         part3.classList.remove("none")
//         part1.classList.add("none")
//         part2.classList.add("none")
//         Showname.innerHTML = `<h3>${sessionResult.name}</h3>`
//         // userDiv.innerHTML = `${sessionResult.name}
//         // <div><a href="/logout">登出</a></div>`;
//         // form.classList.add("none")
//     }
// }
// const logout = document.getElementById("logout")
// logout.addEventListener("click", async () => {
//     islogin = false;
//     part1.classList.remove("none")
//     part2.classList.remove("none")
//     part3.classList.add("none")
//     await fetch("/logout", {
//         method: "GET",
//     })
// })

// //signup Fetching
// document.querySelector('#signup').addEventListener("submit", async event => {
//     event.preventDefault();
//     const form = event.target;
//     const body = {
//         username: form.username.value,
//         password: form.password.value,
//         sex: form.sex.value
//     }
//     const res = await fetch("/signup", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(body)
//     });
//     const result = await res.json();//result = (success:true)
//     if (result.success) {
//         islogin = true;
//         window.location = "/"
//     } else {
//         islogin = false;
//         document.querySelector("div#user").innerHTML = result.msg;
//     }
// });

// //reply box open /close
// const reply = document.querySelector("#replyComment")
// const replyBox = document.querySelector("#replyBox")
// const closeReplyBox = document.querySelector("#closeReplyBox")

// reply.addEventListener("click", async () => {
//     // console.log("replyBox is clicked");
//     replyBox.classList.remove("none")
// })
// closeReplyBox.addEventListener("click", async () => {
//     // console.log("replyBox is closed");
//     replyBox.classList.add("none")
// })

////^^^ already in index.js

//new comments fetching TESTING NOT CONFIRM

function formToJson(formData) {
  let obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return JSON.stringify(obj);
}

const uploadedImg = document.querySelector("#uploadedImg");

const emojiBtn = document.querySelector(".emojiBtn");

const ReplyTextPlace1 = document.querySelector("#ReplyTextPlace1");


const gifBtn = document.querySelector(".gifBtn");

const gifBox = document.querySelector(".gifBox");

const emojis = document.querySelectorAll(".emojis");
for (let i = 0; i < emojis.length; i++) {
  const emoji = emojis[i];

  emoji.addEventListener("click", async (e) => {
    // console.log(emojis.innerHTML);
    // console.log(ReplyTextPlace1.value)
    console.log(emoji.innerHTML);
    ReplyTextPlace1.value += emoji.innerHTML;
  });
}

document.querySelector(".photoBTN").addEventListener("click", async (event) => {
  let cloneSrc = document.getElementById("blah").src;
  uploadedImg.src = cloneSrc;
  backdrop.classList.add("none");
});

const emojiBox = document.querySelector(".emojiBox");

emojiBtn.addEventListener("click", async (event) => {
  if (emojiBox.style.height === "300px") {
    emojiBox.style.height = "0";
  } 
  else if (gifBox.style.height > "0px") {
    gifBox.style.height = "0";
    emojiBox.style.height = "300px"
  } 
  else {
    emojiBox.style.height = "300px";
    
  }
});


gifBtn.addEventListener("click", async (event) => {
  if (gifBox.style.height > "0px") {
    gifBox.style.height = "0";
  } else if (emojiBox.style.height === "300px") {
    emojiBox.style.height = "0";
    gifBox.style.height = "300px";
  } else {
    gifBox.style.height = "300px";
  }
});


const gifs = document.querySelectorAll(".gifs");
for (let i = 0; i < gifs.length; i++) {
  const gif = gifs[i];

  gif.addEventListener("click", async (e) => {
  
    console.log(gif);
    ReplyTextPlace1.value += `<img src='${gif.src}' width='150'/> `
  });
}

const chairIcon = document.querySelector(".chairIcon")
const openAnimate = document.querySelector('.openAnimate')
const commentsWall = document.querySelector('.commentsWall')
const leg = document.querySelector(".leg")

let hideChair = function(){
  openAnimate.classList.add('none')
}

let newChair = function(){
  commentsWall.innerHTML = `<div><img src="chair.svg" class="chairIcon2"></img>`
  }
/* <span class="leg">🦵</span> </div> */

if(true){
  chairIcon.classList.add("spin2")
  setTimeout(hideChair, 1500);
  setTimeout(newChair,1400)
  
}








//2. after typing cant input emoji anymore
//1. too many emoji need queryselectorall

// const closeBox = document.querySelector(".closeBtn")

// closeBox.addEventListener("click", async event => {
//     backdrop.classList.add("none")
// })

// document.querySelector('#reply').addEventListener("submit", async event => {

//     event.preventDefault();
//     const form = event.target;
//     const formData = new FormData(form);

//     const res = await fetch(`/reply/${document.querySelector(".submitBTN").classList[1].substring(5)}`, {
//         method: "POST",
//         body: formData
//     });
//     const result = await res.json();//result = (success:true)
//     if (result.success) {
//         window.location = "/"
//     } else {
//         document.querySelector("div#reply").innerHTML = result.msg;
//     }
// });

// upload files interface create and close
// const backdrop = document.querySelector("#backdrop")
// const uploadFiles = document.querySelector("#uploadFiles")
// const uploadBtn = document.querySelector("#uploadBtn")

// uploadBtn.addEventListener("click", async event => {

//     setTimeout(() => {
//         backdrop.classList.remove("none")
//     }, 500);
// })

//upload file preview go to reply box

// window.onload = async function () {
//     await checkUserLogin();
// }
