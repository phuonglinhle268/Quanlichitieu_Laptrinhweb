document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('Vui lòng đăng nhập trước!');
        window.location.href = '../../Login/login.html';
        return;
    }

    let revenues = JSON.parse(localStorage.getItem(`revenues_${loggedInUser.email}`)) || [];

    const monthSelect = document.getElementById('month');
    const transactionList = document.getElementById('transactionList');
    const totalRevenueSpan = document.getElementById('totalRevenue');
    const recordCountSpan = document.getElementById('recordCount');
    const revenueForm = document.getElementById('revenueForm');
    const addRevenueBtn = document.querySelector('.btn-revenue');

    const addRevenueModal = document.createElement('div');
    addRevenueModal.className = 'modal fade';
    addRevenueModal.id = 'addRevenueModal';
    addRevenueModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Thêm doanh thu✨</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addRevenueForm">
                        <div class="form-group">
                            <label for="modalMonth">⌛</label>
                            <select class="form-select" id="modalMonth">
                                <option value="allMonths">All Months</option>
                                ${Array.from({ length: 12 }, (_, i) => {
                                    const monthStr = (i + 1).toString().padStart(2, '0');
                                    return `<option value="${monthStr}-2025">${monthStr}-2025</option>`;
                                }).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="modalDescription">👤</label>
                            <input type="text" class="form-control" id="modalDescription" placeholder="Nhập mô tả (ví dụ: Salary)">
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

    const allMonthsOption = document.createElement('option');
    allMonthsOption.value = 'allMonths';
    allMonthsOption.text = 'All Months';
    monthSelect.appendChild(allMonthsOption);
    for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = `${monthStr}-2025`;
        option.text = `${monthStr}-2025`;
        monthSelect.appendChild(option);
    }
    monthSelect.value = '03-2025';

    function updateDisplay(month) {
        let filteredRevenues = revenues.filter(r => {
            const [rMonth] = r.date.split('-');
            return month === 'allMonths' || rMonth === month.split('-')[0];
        });
        const total = filteredRevenues.reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);
        totalRevenueSpan.textContent = `$${total}`;
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
                    <span class="icon">💰</span>
                    <span class="date">${rMonth}-2025</span>
                    <span class="description">${revenue.description || 'Salary'}</span>
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

    // Không khởi tạo dữ liệu mẫu để tránh dữ liệu cũ
    updateDisplay(monthSelect.value);

    monthSelect.addEventListener('change', () => {
        updateDisplay(monthSelect.value);
    });

    addRevenueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('modalMonth').value = monthSelect.value;
        document.getElementById('modalDescription').value = '';
        document.getElementById('modalAmount').value = '';
        document.getElementById('amountError').style.display = 'none';
        modal.show();
    });

    document.getElementById('addRevenueForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const month = document.getElementById('modalMonth').value;
        const description = document.getElementById('modalDescription').value.trim();
        const amount = document.getElementById('modalAmount').value.trim();
        const amountError = document.getElementById('amountError');

        if (!amount || parseFloat(amount) <= 0) {
            amountError.textContent = 'Doanh thu phải lớn hơn 0!';
            amountError.style.display = 'block';
            return;
        }
        amountError.style.display = 'none';

        const newRevenue = {
            date: month === 'allMonths' ? '01' : month.split('-')[0],
            description: description || 'Salary',
            amount: `$${parseFloat(amount)}`
        };

        const editIndex = parseInt(document.getElementById('addRevenueForm').getAttribute('data-edit-index'));
        if (editIndex >= 0) {
            revenues[editIndex] = newRevenue;
            document.getElementById('addRevenueForm').removeAttribute('data-edit-index');
        } else {
            revenues.push(newRevenue);
        }
        localStorage.setItem(`revenues_${loggedInUser.email}`, JSON.stringify(revenues));
        modal.hide();
        updateDisplay(monthSelect.value);
    });

    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const index = parseInt(e.target.getAttribute('data-id'));
            const revenue = revenues[index];
            document.getElementById('modalMonth').value = `${revenue.date}-2025`;
            document.getElementById('modalDescription').value = revenue.description;
            document.getElementById('modalAmount').value = revenue.amount.replace('$', '');
            document.getElementById('amountError').style.display = 'none';
            document.getElementById('addRevenueForm').setAttribute('data-edit-index', index);
            modal.show();
        }

        if (e.target.classList.contains('delete')) {
            Swal.fire({
                title: 'Chắc chắn chứ?',
                text: 'Bạn sẽ xóa doanh thu này chứ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                customClass: {
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    confirmButton: 'swal-custom-button',
                    cancelButton: 'swal-custom-button'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const index = parseInt(e.target.getAttribute('data-id'));
                    revenues.splice(index, 1);
                    localStorage.setItem(`revenues_${loggedInUser.email}`, JSON.stringify(revenues));
                    updateDisplay(monthSelect.value);
                    Swal.fire({
                        title: 'Xóa thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            confirmButton: 'swal-custom-button'
                        }
                    });
                } else {
                    Swal.fire({
                        title: 'Đã từ chối xóa!',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'swal-custom-popup',
                            title: 'swal-custom-title',
                            confirmButton: 'swal-custom-button'
                        }
                    });
                }
            });
        }
    });

    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-revenue-link')) {
            e.preventDefault();
            document.getElementById('modalMonth').value = monthSelect.value;
            document.getElementById('modalDescription').value = '';
            document.getElementById('modalAmount').value = '';
            document.getElementById('amountError').style.display = 'none';
            modal.show();
        }
    });
});