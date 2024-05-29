

let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let title = document.getElementById("title");
let confirmPasswordField = document.getElementById('confirmPasswordField');


signinBtn.onclick = function (){
    nameField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
    confirmPasswordField.style.maxHeight= "0";
}
signupBtn.onclick = function (){
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
    confirmPasswordField.style.maxHeight = "60px";
}


