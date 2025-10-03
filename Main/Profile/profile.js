document.addEventListener("DOMContentLoaded", () => {
    // Lấy thông tin người dùng vừa đăng nhập từ localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Vui lòng đăng nhập trước!');
        window.location.href = '../Login/login.html';
        return;
    }

    // Hiển thị thông tin
    document.getElementById('userName').textContent = loggedInUser.name;
    document.getElementById('userEmail').textContent = loggedInUser.email;

    // Lưu trang trước đó khi vào profile
    const previousPage = localStorage.getItem('previousPage') || 'overview.html';
    localStorage.setItem('previousPage', document.referrer || previousPage);

    // Xử lý nút Quay lại
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        const prevPage = localStorage.getItem('previousPage');
        if (prevPage) {
            window.location.href = prevPage;
        } else {
            window.location.href = 'overview.html';
        }
    });

    // Xử lý chỉnh sửa
    const editProfileForm = document.getElementById('editProfileForm');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Reset thông báo lỗi
        nameError.style.display = 'none';
        emailError.style.display = 'none';

        // Validation
        let isValid = true;

        if (!editName.value.trim()) {
            nameError.textContent = 'Tên không được để trống!';
            nameError.style.display = 'block';
            isValid = false;
        }

        if (!editEmail.value.trim()) {
            emailError.textContent = 'Email không được để trống!';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.value)) {
            emailError.textContent = 'Email không hợp lệ!';
            emailError.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // Hiển thị xác nhận trước khi lưu
            Swal.fire({
                title: 'Xác nhận lưu thay đổi?',
                text: "Bạn có chắc muốn cập nhật thông tin này?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4a90e2',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Lưu',
                cancelButtonText: 'Hủy'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Cập nhật thông tin
                    loggedInUser.name = editName.value.trim();
                    loggedInUser.email = editEmail.value.trim();

                    // Lưu lại thông tin người dùng đã đăng nhập
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                    // Cập nhật danh sách users
                    let users = JSON.parse(localStorage.getItem('users')) || [];
                    const userIndex = users.findIndex(u => u.email === loggedInUser.email);
                    if (userIndex !== -1) {
                        users[userIndex] = loggedInUser;
                        localStorage.setItem('users', JSON.stringify(users));
                    }

                    // Cập nhật giao diện
                    document.getElementById('userName').textContent = loggedInUser.name;
                    document.getElementById('userEmail').textContent = loggedInUser.email;

                    // Hiển thị thông báo thành công
                    Swal.fire({
                        title: 'Lưu thành công!',
                        text: 'Thông tin của bạn đã được cập nhật.',
                        icon: 'success',
                        confirmButtonColor: '#4a90e2',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Đóng modal sau khi xác nhận
                        bootstrap.Modal.getInstance(document.getElementById('editProfileModal')).hide();
                    });
                }
            });
        }
    });

    // Tải thông tin vào form khi mở modal
    document.getElementById('editProfileBtn').addEventListener('click', () => {
        editName.value = loggedInUser.name;
        editEmail.value = loggedInUser.email;
        nameError.style.display = 'none';
        emailError.style.display = 'none';
    });
});