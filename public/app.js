
const observer = new IntersectionObserver ((entries)=>{
    entries.forEach((entry)=>{
        console.log(entry);
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }else{
            entry.target.classList.remove('show')
        }
    })
})

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((element) => observer.observe(element));



const leg = document.querySelector(".leg")
const chairIcon = document.querySelector(".chairIcon")

let isClick = false;

const redirectHtml = () => {
    window.location = '/';
}

leg.addEventListener("click", event=>{
    if(isClick){
        leg.classList.remove("kick")
    }else{
        leg.classList.add("kick")
        chairIcon.classList.add("spin")
        setTimeout(redirectHtml, 1000);
        
    }
    isClick = !isClick
})



