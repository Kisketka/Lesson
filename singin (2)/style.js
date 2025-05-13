let users = [
  { id: 'user1', balance: 0, coinsPerClick: 10, passiveIncomePerSecond: 1 }
];

const formData = {
  email: "",
  password: ""
};

// Пароль: показати/сховати
document.getElementById("toggle-password").addEventListener("click", function () {
  let passwordInput = document.getElementById("password");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    this.src = "https://e7.pngegg.com/pngimages/863/338/png-clipart-computer-icons-closed-eyes-game-photography-thumbnail.png";
  } else {
    passwordInput.type = "password";
    this.src = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS9i8aia9I-sADGG4u01bAoQIWvrA49niGIHDQcwrTV1i4_xvZZ";
  }
});

// Запис email/паролю
document.getElementById("email").addEventListener("input", function () {
  formData.email = this.value;
});
document.getElementById("password").addEventListener("input", function () {
  formData.password = this.value;
});

// Вивід введених даних
document.getElementById("submit-btn").addEventListener("click", function () {
  console.log("Введений email:", formData.email);
  console.log("Введений пароль:", formData.password);
});

// Клік та пасивний дохід
async function sendRequest(endpoint) {
  const userId = localStorage.getItem('userId');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  if (res.ok) {
    const data = await res.json();
    document.getElementById('balance').innerText = `Balance: ${data.balance}`;
  }
}

document.getElementById('clickBtn').addEventListener('click', () => {
  sendRequest('/click');
});

setInterval(() => {
  sendRequest('/passive-income');
}, 1000);

// ПОКУПКА АПГРЕЙДУ
document.querySelectorAll('.buy-upgrade-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const userId = localStorage.getItem('userId');
    const upgradeId = button.dataset.upgradeId;

    const res = await fetch('/buy-upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, upgradeId })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('balance').innerText = `Balance: ${data.balance}`;
      document.getElementById('coinsPerClick').innerText = `Coins per Click: ${data.coinsPerClick}`;
      document.getElementById('passiveIncomePerSecond').innerText = `Passive Income: ${data.passiveIncomePerSecond}`;
    } else {
      alert(data.message || "Upgrade failed");
    }
  });
});

