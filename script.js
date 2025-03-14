const bodyElement = document.querySelector("body")
const darkModeToggle = document.querySelector(".checkbox");

//Toggle dark mode
darkModeToggle.addEventListener("change", (event)=>{
    if(event.target.checked){
        bodyElement.classList.add("darkmode")
    }else{
        bodyElement.classList.remove("darkmode")
    }
}
)