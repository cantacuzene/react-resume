import styles from "./styles/stylesheet.scss"


let changeInnerHtml = function(){
    let body = document.getElementsByTagName("body")[0];

    body.innerHTML ="Fuck you"
}


document.addEventListener("DOMContentLoaded",function(){
    changeInnerHtml()
});