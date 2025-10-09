let users = JSON.parse(localStorage.getItem('users')) || [];

// Tài khoản admin mặc định
if (!users.some(u => u.email === "admin@gmail.com")) {
    users.push({
        name: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toLocaleString()
    });
    localStorage.setItem('users', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        emailError.style.display = 'none';
        passwordError.style.display = 'none';

        let isValid = true;

        if (!email) {
            emailError.textContent = 'Email không được để trống!';
            emailError.style.display = 'block';
            isValid = false;
        }
        if (!password) {
            passwordError.textContent = 'Mật khẩu không được để trống!';
            passwordError.style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        const user = users.find(u => u.email === email);
        if (!user) {
            emailError.textContent = 'Email chưa được đăng ký!';
            emailError.style.display = 'block';
            return;
        }

        if (user.password !== password) {
            passwordError.textContent = 'Mật khẩu không chính xác!';
            passwordError.style.display = 'block';
            return;
        }

      Swal.fire({
    title: 'Đăng nhập thành công!',
    icon: 'success',
    confirmButtonText: 'OK',
    customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-button'
    }
}).then((result) => {
    if (result.isConfirmed) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Khởi tạo dữ liệu nếu chưa có
        if (!localStorage.getItem(`expenses_${email}`)) {
            localStorage.setItem(`expenses_${email}`, JSON.stringify([]));
        }
        if (!localStorage.getItem(`revenues_${email}`)) {
            localStorage.setItem(`revenues_${email}`, JSON.stringify([]));
        }

        // Phân quyền
        if (user.role === "admin") {
            window.location.href = "../Admin/admin.html";
        } else {
            window.location.href = "../Main/Overview/overview.html";
        }
    }
});
    });
});