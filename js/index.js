function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (!username || !password) {
        alert("Please enter username and password! ");
        return;
    }
    fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${btoa(`${username}:${password}`)}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                alert('incorrect username or password!')
                window.location.href = "index.html"
                return Promise.reject('Invalid credentials'); //This stops  .then()  from running when the credentials are invalid
            }
        })
        .then(data => {
            localStorage.setItem("jwt", data);
            window.location.href = "home.html"
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// this is just when user clicked enter it will try to loggin
document.addEventListener("DOMContentLoaded", function () {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    usernameField.addEventListener("keydown", handleEnterKey);
    passwordField.addEventListener("keydown", handleEnterKey);
    function handleEnterKey(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            login();
        }
    }
});
