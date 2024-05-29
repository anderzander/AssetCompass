
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            event.preventDefault();
            alert("Bitte geben Sie sowohl Benutzernamen als auch Passwort ein.");
        }
    });
});
