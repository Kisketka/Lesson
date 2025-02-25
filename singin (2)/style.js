const formData = {
    email: "",
    password: ""
};

// Перемикання видимості пароля
document.getElementById("toggle-password").addEventListener("click", function () {
    let passwordInput = document.getElementById("password");
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.src = "https://e7.pngegg.com/pngimages/863/338/png-clipart-computer-icons-closed-eyes-game-photography-thumbnail.png"; // Іконка закритого ока
    } else {
        passwordInput.type = "password";
        this.src = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS9i8aia9I-sADGG4u01bAoQIWvrA49niGIHDQcwrTV1i4_xvZZ"; // Іконка відкритого ока
    }
});

// Збереження введених значень
document.getElementById("email").addEventListener("input", function () {
    formData.email = this.value;
});
document.getElementById("password").addEventListener("input", function () {
    formData.password = this.value;
});

// Вивід значень у консоль
document.getElementById("submit-btn").addEventListener("click", function () {
    console.log("Введений email:", formData.email);
    console.log("Введений пароль:", formData.password);
});