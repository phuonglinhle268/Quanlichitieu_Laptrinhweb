// Lưu dữ liệu expense trong localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('monthSelect');
    const transactionList = document.getElementById('transactionList');
    const totalExpenseSpan = document.querySelector('.total-expenses-card .total-amount span');
    const recordCountSpan = document.getElementById('recordCount');
    const addExpenseBtn = document.querySelector('.btn-expense');
    const categorySelect = document.getElementById('category');

    // Tạo modal cho form thêm/sửa
    const addExpenseModal = document.createElement('div');
    addExpenseModal.className = 'modal fade';
    addExpenseModal.id = 'addExpenseModal';
    addExpenseModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Thêm chi tiêu</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addExpenseForm">
                        <div class="form-group">
                            <label for="modalDate">⌛</label>
                            <input type="date" class="form-control" id="modalDate">
                            <div id="dateError" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="modalName">👤</label>
                            <input type="text" class="form-control" id="modalName" placeholder="Nhập tên">
                            <div id="nameError" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="modalCategory">🏪</label>
                            <select class="form-select" id="modalCategory">
                                <option value="home">Home</option>
                                <option value="transportation">Transportation</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="food">Food</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="modalAmount">💳</label>
                            <input type="number" class="form-control" id="modalAmount" placeholder="Nhập giá tiền" step="0.01">
                            <div id="amountError" class="error-message" style="display: none;"></div>
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Save</button>
                        <button type="button" class="btn btn-secondary mt-3" data-bs-dismiss="modal">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(addExpenseModal);
    const modal = new bootstrap.Modal(addExpenseModal);

    // Tạo option cho các tháng trong 2025 và All Months
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
    monthSelect.value = '03-2025'; // Mặc định là tháng 3-2025

    // Hàm lọc và hiển thị dữ liệu theo tháng và category
    function updateDisplay(month, category) {
        let filteredExpenses = expenses.filter(expense => {
            const [expMonth] = expense.date.split('-');
            const matchesMonth = month === 'allMonths' || expMonth === month.split('-')[0];
            const matchesCategory = category === 'category' || expense.category === category;
            return matchesMonth && matchesCategory;
        });
        const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0);
        totalExpenseSpan.textContent = `$${total.toFixed(2)}`;
        recordCountSpan.textContent = `Found ${filteredExpenses.length} records`;

        transactionList.innerHTML = '';
        if (filteredExpenses.length === 0) {
            const warning = document.createElement('div');
            warning.className = 'alert alert-warning';
            warning.innerHTML = "Chưa có chi tiêu cho mục này. Hãy thử <a href='#' class='add-expense-link'>thêm chi tiêu</a> hoặc chọn một mục khác nhé!😊 ";
            transactionList.appendChild(warning);
        } else {
            filteredExpenses.forEach((expense, index) => {
                const [expMonth, expDay] = expense.date.split('-');
                const icon = {
                    'home': '🏠',
                    'transportation': '🚗',
                    'entertainment': '🎮',
                    'food': '🍴',
                    'other': '✏️'
                }[expense.category] || '💵';
                const item = document.createElement('div');
                item.className = 'transaction-item';
                item.innerHTML = `
                    <span class="icon">${icon}</span>
                    <span class="date">${expMonth}-${expDay}-2025</span>
                    <span class="name">${expense.name}</span>
                    <span class="category">${expense.category}</span>
                    <span class="amount">${expense.amount}</span>
                    <div class="actions">
                        <span class="icon edit" data-id="${index}" data-global-id="${expenses.indexOf(expense)}">📝</span>
                        <span class="icon delete" data-id="${index}" data-global-id="${expenses.indexOf(expense)}">🗑️</span>
                    </div>
                `;
                transactionList.appendChild(item);
            });
        }
    }

    // Khởi tạo hiển thị với dữ liệu mẫu
    if (expenses.length === 0) {
        expenses = [
            { date: '03-01', name: 'Grocery', category: 'food', amount: '$1800' },
            { date: '03-01', name: 'Snack', category: 'food', amount: '$500' },
            { date: '04-02', name: 'Miscellaneous', category: 'other', amount: '$1800' },
            { date: '05-03', name: 'Test', category: 'other', amount: '$0' }
        ];
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
    updateDisplay(monthSelect.value, categorySelect.value);

    // Xử lý thay đổi tháng
    monthSelect.addEventListener('change', () => {
        updateDisplay(monthSelect.value, categorySelect.value);
    });

    // Xử lý thay đổi category
    categorySelect.addEventListener('change', () => {
        updateDisplay(monthSelect.value, categorySelect.value);
    });

    // Mở modal khi nhấn Add Expense
    addExpenseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const [month] = monthSelect.value.split('-');
        const firstDay = new Date(2025, month - 1, 1).toISOString().slice(0, 10);
        document.getElementById('modalDate').value = firstDay;
        document.getElementById('modalName').value = '';
        document.getElementById('modalCategory').value = 'home';
        document.getElementById('modalAmount').value = '';
        document.getElementById('dateError').style.display = 'none';
        document.getElementById('nameError').style.display = 'none';
        document.getElementById('amountError').style.display = 'none';
        document.getElementById('addExpenseForm').removeAttribute('data-edit-index');
        modal.show();
    });

    // Xử lý submit form trong modal (thêm hoặc sửa)
    document.getElementById('addExpenseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('modalDate').value;
        const name = document.getElementById('modalName').value.trim();
        const category = document.getElementById('modalCategory').value;
        const amount = document.getElementById('modalAmount').value.trim();
        const dateError = document.getElementById('dateError');
        const nameError = document.getElementById('nameError');
        const amountError = document.getElementById('amountError');
        const [selectedMonth] = monthSelect.value.split('-');
        const [inputYear, inputMonth, inputDay] = date.split('-');
        const currentDate = new Date();
        const inputDate = new Date(date);

        // Validate
        if (!date || (monthSelect.value !== 'allMonths' && inputMonth !== selectedMonth) || inputDate > currentDate) {
            dateError.textContent = 'Chỉ chọn ngày trong tháng đã chọn và không quá thời gian hiện tại!!!';
            dateError.style.display = 'block';
            return;
        }
        if (!name) {
            nameError.textContent = 'Tên không được để trống!';
            nameError.style.display = 'block';
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            amountError.textContent = 'Giá tiền phải lớn hơn 0!';
            amountError.style.display = 'block';
            return;
        }
        dateError.style.display = 'none';
        nameError.style.display = 'none';
        amountError.style.display = 'none';

        const newExpense = {
            date: `${inputMonth}-${inputDay}`,
            name: name,
            category: category,
            amount: `$${parseFloat(amount).toFixed(2)}`
        };

        // Kiểm tra xem đang thêm mới hay sửa
        const editIndex = parseInt(document.getElementById('addExpenseForm').getAttribute('data-edit-index'));
        if (editIndex >= 0) {
            expenses[editIndex] = newExpense;
            document.getElementById('addExpenseForm').removeAttribute('data-edit-index');
        } else {
            expenses.push(newExpense);
        }
        localStorage.setItem('expenses', JSON.stringify(expenses));
        modal.hide();
        updateDisplay(monthSelect.value, categorySelect.value);
    });

    // Xử lý sửa
    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            const [selectedMonth] = monthSelect.value.split('-');
            const filteredExpenses = expenses.filter(expense => {
                const [expMonth] = expense.date.split('-');
                return monthSelect.value === 'allMonths' || expMonth === selectedMonth;
            });
            const displayIndex = parseInt(e.target.getAttribute('data-id'));
            const globalIndex = parseInt(e.target.getAttribute('data-global-id')); // Sử dụng global-id trực tiếp
            const expense = expenses[globalIndex];
            if (expense) {
                const [expMonth, expDay] = expense.date.split('-');
                document.getElementById('modalDate').value = `2025-${expMonth}-${expDay}`;
                document.getElementById('modalName').value = expense.name;
                document.getElementById('modalCategory').value = expense.category;
                document.getElementById('modalAmount').value = expense.amount.replace('$', '');
                document.getElementById('dateError').style.display = 'none';
                document.getElementById('nameError').style.display = 'none';
                document.getElementById('amountError').style.display = 'none';
                document.getElementById('addExpenseForm').setAttribute('data-edit-index', globalIndex);
                modal.show();
            }
        }

        // Xử lý xóa với thông báo thành công/thất bại
        if (e.target.classList.contains('delete')) {
            const [selectedMonth] = monthSelect.value.split('-');
            const filteredExpenses = expenses.filter(expense => {
                const [expMonth] = expense.date.split('-');
                return monthSelect.value === 'allMonths' || expMonth === selectedMonth;
            });
            const displayIndex = parseInt(e.target.getAttribute('data-id'));
            const globalIndex = parseInt(e.target.getAttribute('data-global-id')); // Sử dụng global-id trực tiếp
            Swal.fire({
                title: 'Chắc chắn chứ?',
                text: 'Bạn sẽ xóa chi tiêu này chứ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    expenses.splice(globalIndex, 1);
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    updateDisplay(monthSelect.value, categorySelect.value);
                    Swal.fire({
                        title: 'Xóa thành công!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Đã từ chối xóa!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });

    // Xử lý nhấp vào "add expense" trong alert
    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-expense-link')) {
            e.preventDefault();
            const [month] = monthSelect.value.split('-');
            const firstDay = new Date(2025, month - 1, 1).toISOString().slice(0, 10);
            document.getElementById('modalDate').value = firstDay;
            document.getElementById('modalName').value = '';
            document.getElementById('modalCategory').value = 'home';
            document.getElementById('modalAmount').value = '';
            document.getElementById('dateError').style.display = 'none';
            document.getElementById('nameError').style.display = 'none';
            document.getElementById('amountError').style.display = 'none';
            document.getElementById('addExpenseForm').removeAttribute('data-edit-index');
            modal.show();
        }
    });
});