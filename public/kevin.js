const chpass = document.querySelector("#clickReset")
const resetPass = document.getElementById("resetPass")
// const pAp = document.querySelector(".pAp")
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


next.addEventListener("click", async () => {
    const id = pageLine.getAttribute("data-page");
    const res = await fetch(`/addPostCommemt/${id}/${page}`, {
        method: "GET",
    });
    const json = await res.json();
    const numOfPage = json.numOfPage;

    if (page >= numOfPage) {
        page = numOfPage
        next.classList.add("hidden")
        return
    }
    page = page + 1
    await reload(id, page)
    if (page >= numOfPage - 1) {
        page = numOfPage - 1
        next.classList.add("hidden")
    }
    back.classList.remove("hidden")
})
//////////////////////////工程中//////////////////////////
changePage.addEventListener("click", async (obj) => {
    if (!obj.target.classList.contains("pAp")) return;
    const pages = obj.target.innerText - 1
    const id = pageLine.getAttribute("data-page");
    const res = await fetch(`/addPostCommemt/${id}/${pages}`, {
        method: "GET",
    });
    page = pages
    const json = await res.json();
    const numOfPage = json.numOfPage;
    next.classList.remove("hidden")
    back.classList.remove("hidden")
    if (pages <= 0) {
        page = 0
        back.classList.add("hidden")
        next.classList.remove("hidden")
    } else if (pages + 1 >= numOfPage) {
        next.classList.add("hidden")
        back.classList.remove("hidden")
    } else { }
    //    let paId =pAp.dataset.pa
    //     if (page == paId) {
    //         paId.classList.add("pagenumber")
    //     } else { paId.classList.remove("pagenumber") }
    console.log(page);
    await reload(id, pages)
})
//////////////////////////工程中//////////////////////////
back.addEventListener("click", async () => {
    const id = pageLine.getAttribute("data-page");
    const res = await fetch(`/addPostCommemt/${id}/${page}`, {
        method: "GET",
    });
    await res.json();
    next.classList.remove("hidden")
    page = page - 1;
    await reload(id, page)
    if (page <= 0) {
        page = 0
        back.classList.add("hidden")
        next.classList.remove("hidden")
        return
    }
})