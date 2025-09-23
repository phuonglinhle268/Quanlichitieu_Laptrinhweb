let users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const emailExistsAlert = document.getElementById('emailExistsAlert');
    const closeBtn = document.querySelector('.alert-warning .close');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    closeBtn.addEventListener('click', () => {
        emailExistsAlert.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        emailExistsAlert.style.display = 'none';
        nameError.style.display = 'none';
        emailError.style.display = 'none';
        passwordError.style.display = 'none';
        confirmPasswordError.style.display = 'none';

        let isValid = true;

        if (!name) {
            nameError.textContent = 'Tên không được để trống!';
            nameError.style.display = 'block';
            isValid = false;
        }

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

        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Nhập mật khẩu xác nhận!';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Mật khẩu không trùng nhau';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        }

        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            emailExistsAlert.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            Swal.fire({
                title: 'Đăng ký thành công!',
                text: 'Chuyển đến trang login.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '../Login/login.html';
                }
            });
        }
    });
});