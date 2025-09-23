// Lưu dữ liệu revenue trong localStorage
let revenues = JSON.parse(localStorage.getItem('revenues')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month');
    const transactionList = document.getElementById('transactionList');
    const totalRevenueSpan = document.getElementById('totalRevenue');
    const recordCountSpan = document.getElementById('recordCount');
    const revenueForm = document.getElementById('revenueForm');
    const addRevenueBtn = document.querySelector('.btn-revenue');

    // Tạo modal cho form thêm/sửa
    const addRevenueModal = document.createElement('div');
    addRevenueModal.className = 'modal fade';
    addRevenueModal.id = 'addRevenueModal';
    addRevenueModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Thêm doanh thu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addRevenueForm">
                        <div class="form-group">
                            <label for="modalMonth">⌛</label>
                            <input type="text" class="form-control" id="modalMonth" readonly>
                        </div>
                        <div class="form-group">
                            <label for="modalAmount">💵</label>
                            <input type="number" class="form-control" id="modalAmount" placeholder="Nhập doanh thu" step="0.01">
                            <div id="amountError" class="error-message" style="display: none;"></div>
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Save</button>
                        <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(addRevenueModal);
    const modal = new bootstrap.Modal(addRevenueModal);

    // Tạo option cho các tháng trong 2025 (định dạng MM-YYYY)
    for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${monthStr}-2025`;
        option.text = `${monthStr}-2025`;
        monthSelect.appendChild(option);
    }
    monthSelect.value = '03-2025'; // Mặc định là tháng 3-2025

    // Hàm lọc và hiển thị dữ liệu theo tháng (MM-YYYY)
    function updateDisplay(month) {
        const filteredRevenues = revenues.filter(r => {
            const [rMonth] = r.date.split('-');
            return rMonth === month.split('-')[0]; 
        });
        const total = filteredRevenues.reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);
        totalRevenueSpan.textContent = `$${total.toFixed(2)}`;
        recordCountSpan.textContent = `Found ${filteredRevenues.length} records`;

        transactionList.innerHTML = '';
        if (filteredRevenues.length === 0) {
            const warning = document.createElement('div');
            warning.className = 'alert alert-warning';
            warning.innerHTML = "Bạn chưa cập nhật doanh thu cho tháng này. Hãy <a href='#' class='add-revenue-link'>thêm doanh thu</a> hoặc chọn tháng khác để quản lí nhé!😊";
            transactionList.appendChild(warning);
        } else {
            filteredRevenues.forEach((revenue, index) => {
                const [rMonth] = revenue.date.split('-');
                const item = document.createElement('div');
                item.className = 'transaction-item';
                item.innerHTML = `
                    <span class="icon">💵</span>
                    <span class="date">${rMonth}-2025</span>
                    <span class="category">Salary</span>
                    <span class="amount">${revenue.amount}</span>
                    <div class="actions">
                        <span class="icon edit" data-id="${index}">📝</span>
                        <span class="icon delete" data-id="${index}">🗑️</span>
                    </div>
                `;
                transactionList.appendChild(item);
            });
        }
    }

    // Khởi tạo hiển thị với dữ liệu mẫu (chỉnh sửa định dạng)
    if (revenues.length === 0) {
        revenues = [
            { date: '03', category: 'Salary', amount: '$60' },
            { date: '03', category: 'Salary', amount: '$120' }
        ];
        localStorage.setItem('revenues', JSON.stringify(revenues));
    }
    updateDisplay(monthSelect.value);

    // Xử lý thay đổi tháng
    monthSelect.addEventListener('change', () => {
        updateDisplay(monthSelect.value);
    });

    // Mở modal khi nhấn Add Revenue
    addRevenueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('modalMonth').value = monthSelect.value;
        document.getElementById('modalAmount').value = '';
        document.getElementById('amountError').style.display = 'none';
        modal.show();
    });

    // Xử lý submit form trong modal (thêm hoặc sửa)
    document.getElementById('addRevenueForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const month = document.getElementById('modalMonth').value;
        const amount = document.getElementById('modalAmount').value.trim();
        const amountError = document.getElementById('amountError');

        if (!amount || parseFloat(amount) <= 0) {
            amountError.textContent = 'Doanh thu phải lớn hơn 0!';
            amountError.style.display = 'block';
            return;
        }
        amountError.style.display = 'none';

        const newRevenue = {
            date: month.split('-')[0], // Chỉ lấy tháng
            category: 'Salary',
            amount: `$${parseFloat(amount).toFixed(2)}`
        };

        // Kiểm tra xem đang thêm mới hay sửa
        const editIndex = parseInt(document.getElementById('addRevenueForm').getAttribute('data-edit-index'));
        if (editIndex >= 0) {
            // Cập nhật bản ghi hiện tại
            revenues[editIndex] = newRevenue;
            document.getElementById('addRevenueForm').removeAttribute('data-edit-index');
        } else {
            // Thêm bản ghi mới
            revenues.push(newRevenue);
        }
        localStorage.setItem('revenues', JSON.stringify(revenues));
        modal.hide();
        updateDisplay(monthSelect.value);
    });

    // Xử lý sửa
    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const index = parseInt(e.target.getAttribute('data-id'));
            const revenue = revenues[index];
            document.getElementById('modalMonth').value = `${revenue.date}-2025`;
            document.getElementById('modalAmount').value = revenue.amount.replace('$', '');
            document.getElementById('amountError').style.display = 'none';
            document.getElementById('addRevenueForm').setAttribute('data-edit-index', index);
            modal.show();
        }

        // Xử lý xóa với thông báo thành công/thất bại
        if (e.target.classList.contains('delete')) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Bạn sẽ xóa doanh thu này chứ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    const index = parseInt(e.target.getAttribute('data-id'));
                    revenues.splice(index, 1);
                    localStorage.setItem('revenues', JSON.stringify(revenues));
                    updateDisplay(monthSelect.value);
                    Swal.fire({
                        title: 'Xóa thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Xóa thất bại!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });

    // Xử lý nhấp vào "add revenue" trong alert
    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-revenue-link')) {
            e.preventDefault();
            document.getElementById('modalMonth').value = monthSelect.value;
            document.getElementById('modalAmount').value = '';
            document.getElementById('amountError').style.display = 'none';
            modal.show();
        }
    });
});