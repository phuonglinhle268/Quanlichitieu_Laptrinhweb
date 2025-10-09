let users = JSON.parse(localStorage.getItem("users")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  const emailExistsAlert = document.getElementById("emailExistsAlert");
  const closeBtn = document.querySelector(".alert-warning .close");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  // Ẩn cảnh báo trùng email khi bấm X
  closeBtn.addEventListener("click", () => {
    emailExistsAlert.style.display = "none";
  });

  // Sự kiện submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Lấy dữ liệu
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Reset thông báo lỗi
    [nameError, emailError, passwordError, confirmPasswordError].forEach(
      (el) => (el.style.display = "none")
    );
    emailExistsAlert.style.display = "none";

    let isValid = true;

    // Kiểm tra dữ liệu
    if (!name) {
      nameError.textContent = "Tên không được để trống!";
      nameError.style.display = "block";
      isValid = false;
    }

    if (!email) {
      emailError.textContent = "Email không được để trống!";
      emailError.style.display = "block";
      isValid = false;
    }

    if (!password) {
      passwordError.textContent = "Mật khẩu không được để trống!";
      passwordError.style.display = "block";
      isValid = false;
    }

    if (!confirmPassword) {
      confirmPasswordError.textContent = "Nhập mật khẩu xác nhận!";
      confirmPasswordError.style.display = "block";
      isValid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = "Mật khẩu không trùng nhau!";
      confirmPasswordError.style.display = "block";
      isValid = false;
    }

    // Kiểm tra email tồn tại
    if (users.some((user) => user.email === email)) {
      emailExistsAlert.style.display = "block";
      isValid = false;
    }

    // Nếu hợp lệ -> lưu user
    if (isValid) {
      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Khởi tạo dữ liệu mới cho user
      localStorage.setItem(`expenses_${email}`, JSON.stringify([]));
      localStorage.setItem(`revenues_${email}`, JSON.stringify([]));

     Swal.fire({
    title: "Đăng ký thành công!",
    text: "Chuyển đến trang đăng nhập.",
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-button'
    }
}).then((result) => {
    if (result.isConfirmed) {
        window.location.href = "../Login/login.html";
    }
});
    }
  });
});