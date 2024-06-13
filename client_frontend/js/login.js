let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let nameField = document.getElementById("nameField");
let title = document.getElementById("title");
let confirmPasswordField = document.getElementById('confirmPasswordField');

signupBtn.addEventListener('click', function () {
    if (title.innerHTML !== "Sign Up") {
        changeFormForSignUp();
    } else {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const loginData = {name, email, password};

        if (password !== confirmPassword && title.innerHTML === "Sign Up") {
            alert("Passwords don't match");
            return
        } else {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.value) {
                        alert("registered");
                    }
                })
        }
    }
})

signinBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (title.innerHTML !== "Sign In") {
        changeFormForSignIn();
    } else {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loginData = {email, password};
        fetch('login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData)
        })
            .then(async response => {
                if (response.ok) {
                    window.location.href = '/userPage.html'; //
                } else {
                    console.log(await response.text())
                }
            })
    }
});


function changeFormForSignIn() {
    nameField.style.maxHeight = "0";
    title.innerHTML = "Sign In";
    signupBtn.classList.add("disable");
    signinBtn.classList.remove("disable");
    confirmPasswordField.style.maxHeight = "0";
}

function changeFormForSignUp() {
    nameField.style.maxHeight = "60px";
    title.innerHTML = "Sign Up";
    signupBtn.classList.remove("disable");
    signinBtn.classList.add("disable");
    confirmPasswordField.style.maxHeight = "60px";
}
