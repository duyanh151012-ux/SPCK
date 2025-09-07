const register = (event) => {
  event.preventDefault();
  let email = document.getElementById("signup-email").value.trim();
  let pass = document.getElementById("signup-password").value.trim();
  let confirmPass = document.getElementById("confirm-password").value.trim();

  const lowerCaseLetter = /[a-z]/g;
  const upperCaseLetter = /[A-Z]/g;
  const num = /[0-9]/g;

  if (!email || !pass || !confirmPass) {
    alert("Vui lòng nhập đầy đủ các trường dữ liệu!");
    return;
  }
  if (pass !== confirmPass) {
    alert("Mật khẩu chưa khớp");
    return;
  }
  if (pass.length < 8) {
    alert("Mật khẩu quá ngắn");
    return;
  }
  if (!pass.match(lowerCaseLetter)) {
    alert("Mật khẩu phải có ít nhất 1 chữ thường");
    return;
  }
  if (!pass.match(upperCaseLetter)) {
    alert("Mật khẩu phải có ít nhất 1 chữ hoa");
    return;
  }
  if (!pass.match(num)) {
    alert("Mật khẩu phải có ít nhất 1 chữ số");
    return;
  }

  let user = {
    email: email,
    pass: pass,
  };

  let users = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {};

  if (users[email]) {
    alert("Email đã được sử dụng");
  } else {
    users[email] = user;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công!");
    // Chuyển về form đăng nhập
    document.getElementById("register-box").classList.add("hidden");
    document.querySelector(".login-box").classList.remove("hidden");
  }
};

const login = (event) => {
  event.preventDefault();
  let email = document.getElementById("login-email").value.trim();
  let password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập email và mật khẩu");
    return;
  }

  let users = localStorage.getItem("users")
    ? JSON.parse(localStorage.getItem("users"))
    : {};

  let storedUser = users[email];

  if (storedUser && storedUser.pass === password) {
    alert("Đăng nhập thành công!");
    localStorage.setItem("loggedInUserEmail", email);
    // Xóa cờ tài khoản khách nếu có
    localStorage.removeItem("isGuestUser");
    window.location.href = "index.html";
  } else {
    alert("Email hoặc mật khẩu không đúng.");
  }
};

// Gắn sự kiện cho form đăng ký
document.getElementById("signup-form").addEventListener("submit", register);

// Gắn sự kiện cho form đăng nhập
document.getElementById("login-form").addEventListener("submit", login);

// Xử lý nút "Sử dụng với tài khoản khách"
document.getElementById('guest-login-btn').addEventListener('click', () => {
    // Đặt cờ để nhận diện tài khoản khách
    localStorage.setItem('isGuestUser', 'true');
    // Xóa mọi trạng thái đăng nhập cũ
    localStorage.removeItem('loggedInUserEmail');
    window.location.href = 'index.html';
});