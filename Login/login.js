let users = JSON.parse(localStorage.getItem('users')) || [];

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
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = '/Main/Overview/overview.html';
            }
        });
    });
});