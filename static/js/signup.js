document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    const errorMsg = document.getElementById("signup-error");

    form.addEventListener("submit", (e) => {
        const password1 = document.getElementById("password1").value.trim();
        const password2 = document.getElementById("password2").value.trim();

        if (password1 !== password2) {
            e.preventDefault();
            errorMsg.textContent = "Passwords do not match!";
        } else {
            errorMsg.textContent = "";
        }
    });
});