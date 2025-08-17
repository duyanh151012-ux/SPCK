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
    alert("Đăng ký thành công");
  }
};

document
  .getElementById("signup-form")
  .addEventListener("submit", register);

// Đăng nhập
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
    alert("Đăng nhập thành công");
    window.location.href = "./home.html"; // Hoặc trang chính
  } else {
    alert("Email hoặc mật khẩu chưa đúng");
  }
};

document
  .getElementById("login-form")
  .addEventListener("submit", login);
