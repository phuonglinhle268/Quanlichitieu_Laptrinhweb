let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let revenues = JSON.parse(localStorage.getItem('revenues')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('monthSelect');
    const categorySelect = document.getElementById('categorySelect');
    const expensesValue = document.getElementById('expensesValue');
    const balanceValue = document.getElementById('balanceValue');
    const revenuesValue = document.getElementById('revenuesValue');
    const monthlyLimit = document.getElementById('monthlyLimit');
    const remainingValue = document.getElementById('remainingValue');
    const editLimit = document.getElementById('editLimit');
    const transactionList = document.getElementById('transactionList');
    const recordCount = document.getElementById('recordCount');
    const budgetPieChart = document.getElementById('budgetPieChart').getContext('2d');
    const budgetBarChart = document.getElementById('budgetBarChart').getContext('2d');
    const categoriesChart = document.getElementById('categoriesChart').getContext('2d');
    const categoryList = document.getElementById('categoryList');
    const categoriesChartContainer = document.getElementById('categoriesChartContainer');
    const limitRemaining = document.querySelector('.limit-remaining');

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

    // Khởi tạo các biểu đồ
    let budgetPie = new Chart(budgetPieChart, {
        type: 'pie',
        data: { labels: ['Đã tiêu', 'Còn lại'], datasets: [{ data: [0, 0], backgroundColor: ['#ff6384', '#36a2eb'], borderColor: ['#fff'], borderWidth: 1 }] },
        options: { responsive: true, plugins: { legend: { position: 'right' }, title: { display: false } } }
    });

    let budgetBar = new Chart(budgetBarChart, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Amount ($)', data: [], backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'], borderColor: ['#fff'], borderWidth: 1 }] },
        options: { responsive: true, scales: { y: { beginAtZero: false, ticks: { callback: value => '$' + value } } }, plugins: { legend: { position: 'top' }, title: { display: false } } }
    });

    let categoriesPie = new Chart(categoriesChart, {
        type: 'pie',
        data: { labels: ['Home', 'Transportation', 'Entertainment', 'Food', 'Other'], datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'], borderColor: ['#fff'], borderWidth: 1 }] },
        options: { responsive: true, plugins: { legend: { position: 'right' }, title: { display: false } } }
    });

    // Hàm cập nhật dữ liệu
    function updateData(month, category) {
        let filteredExpenses = expenses.filter(e => {
            const [expMonth] = e.date.split('-');
            return month === 'allMonths' || expMonth === month.split('-')[0];
        });
        let filteredRevenues = revenues.filter(r => {
            const [revMonth] = r.date.split('-');
            return month === 'allMonths' || revMonth === month.split('-')[0];
        });

        if (category !== 'all' && category !== 'allMonths') {
            filteredExpenses = filteredExpenses.filter(e => e.category === category);
        }

        const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0);
        const totalRevenues = category !== 'all' && category !== 'allMonths' ? 0 : filteredRevenues.reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);
        const balance = totalRevenues - totalExpenses;

        expensesValue.textContent = `$${totalExpenses.toFixed(2)}`;
        revenuesValue.textContent = `$${totalRevenues.toFixed(2)}`;
        balanceValue.textContent = `$${balance.toFixed(2)}`;

        // Ẩn monthly limit và remaining khi chọn All Months hoặc category cụ thể
        if (month === 'allMonths' || (category !== 'all' && category !== 'allMonths')) {
            limitRemaining.style.display = 'none';
            budgetPie.data.labels = ['Home', 'Transportation', 'Entertainment', 'Food', 'Other'];
            const categoryTotals = {
                'home': filteredExpenses.filter(e => e.category === 'home').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'transportation': filteredExpenses.filter(e => e.category === 'transportation').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'entertainment': filteredExpenses.filter(e => e.category === 'entertainment').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'food': filteredExpenses.filter(e => e.category === 'food').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'other': filteredExpenses.filter(e => e.category === 'other').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0)
            };
            budgetPie.data.datasets[0].data = Object.values(categoryTotals);
            budgetPie.update();
        } else {
            limitRemaining.style.display = 'block';
            const limit = parseFloat(monthlyLimit.textContent.replace('$', '').replace(',', ''));
            const used = totalExpenses;
            const remaining = limit - used;
            remainingValue.textContent = `$${remaining.toLocaleString()}`;
            budgetPie.data.labels = ['Used', 'Remaining'];
            budgetPie.data.datasets[0].data = [used, remaining];
            budgetPie.update();
        }

        if (category === 'all' || category === 'allMonths') {
            categoriesChartContainer.style.display = 'block';
            const categoryTotals = {
                'home': filteredExpenses.filter(e => e.category === 'home').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'transportation': filteredExpenses.filter(e => e.category === 'transportation').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'entertainment': filteredExpenses.filter(e => e.category === 'entertainment').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'food': filteredExpenses.filter(e => e.category === 'food').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0),
                'other': filteredExpenses.filter(e => e.category === 'other').reduce((sum, e) => sum + parseFloat(e.amount.replace('$', '')), 0)
            };
            categoriesPie.data.datasets[0].data = Object.values(categoryTotals);
            categoriesPie.update();

            categoryList.innerHTML = '';
            Object.entries(categoryTotals).forEach(([cat, amount]) => {
                const icon = { 'home': '🏠', 'transportation': '🚗', 'entertainment': '🎮', 'food': '🍴', 'other': '✏️' }[cat];
                const item = document.createElement('div');
                item.className = 'category-item';
                item.innerHTML = `<span class="icon">${icon}</span><span>${cat}</span><span>$${amount.toFixed(2)}</span>`;
                categoryList.appendChild(item);
            });
        } else {
            categoriesChartContainer.style.display = 'none';
            categoryList.innerHTML = `<div class="category-item"><span class="icon">${{ 'home': '🏠', 'transportation': '🚗', 'entertainment': '🎮', 'food': '🍴', 'other': '✏️' }[category]}</span><span>${category}</span><span>$${totalExpenses.toFixed(2)}</span></div>`;
        }

        const barLabels = month === 'allMonths' ? ['Total'] : [month];
        budgetBar.data.labels = barLabels;
        budgetBar.data.datasets[0].data = [totalExpenses, balance, totalRevenues];
        budgetBar.update();

        const allTransactions = [...filteredExpenses.map(e => ({ ...e, type: 'expense' })), ...filteredRevenues.map(r => ({ ...r, type: 'revenue', description: r.category || 'Salary' }))];
        transactionList.innerHTML = '';
        if (allTransactions.length === 0) {
            transactionList.innerHTML = '<div class="alert alert-warning">No transactions found.</div>';
        } else {
            allTransactions.forEach((trans, index) => {
                const icon = trans.type === 'expense' ? { 'home': '🏠', 'transportation': '🚗', 'entertainment': '🎮', 'food': '🍴', 'other': '✏️' }[trans.category] || '💵' : '💰';
                const item = document.createElement('div');
                item.className = 'transaction-item';
                item.innerHTML = `
                    <span class="icon">${icon}</span>
                    <span class="description">${trans.name || trans.description}</span>
                    <span class="date">${trans.date}-2025</span>
                    <span class="amount">${trans.amount}</span>
                    <div class="actions">
                        <span class="icon delete" data-id="${index}" data-type="${trans.type}" data-index="${trans.type === 'expense' ? expenses.findIndex(e => e === trans) : revenues.findIndex(r => r === trans)}">🗑️</span>
                    </div>
                `;
                transactionList.appendChild(item);
            });
        }
        recordCount.textContent = `Found ${allTransactions.length} records`;
    }

    // Sự kiện thay đổi tháng hoặc category
    [monthSelect, categorySelect].forEach(el => el.addEventListener('change', () => updateData(monthSelect.value, categorySelect.value)));

    // Chỉnh sửa Monthly Limit
    editLimit.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Chi tiêu trong tháng',
            input: 'number',
            inputValue: parseFloat(monthlyLimit.textContent.replace('$', '').replace(',', '')),
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const newLimit = parseFloat(result.value) || 0;
                monthlyLimit.textContent = `$${newLimit}`;
                updateData(monthSelect.value, categorySelect.value);
            }
        });
    });

    // Xử lý xóa
    transactionList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const index = parseInt(e.target.getAttribute('data-id'));
            const type = e.target.getAttribute('data-type');
            const globalIndex = parseInt(e.target.getAttribute('data-index'));
            Swal.fire({
                title: 'Chắc chắn?',
                text: 'Bạn muốn xóa chứ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    if (type === 'expense') {
                        expenses.splice(globalIndex, 1);
                        localStorage.setItem('expenses', JSON.stringify(expenses));
                    } else {
                        revenues.splice(globalIndex, 1);
                        localStorage.setItem('revenues', JSON.stringify(revenues));
                    }
                    updateData(monthSelect.value, categorySelect.value);
                    Swal.fire('Deleted!', 'Xóa thành công!', 'success');
                }
            });
        }
    });

    // Khởi tạo
    updateData(monthSelect.value, categorySelect.value);
});