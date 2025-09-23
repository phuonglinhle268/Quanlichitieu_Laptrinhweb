document.addEventListener('DOMContentLoaded', () => {
    // Biểu đồ tròn Budget 
    const budgetPieCtx = document.getElementById('budgetPieChart').getContext('2d');
    new Chart(budgetPieCtx, {
        type: 'pie',
        data: {
            labels: ['Used', 'Remaining'],
            datasets: [{
                data: [3600, 96400], 
                backgroundColor: ['#ff6384', '#36a2eb'],
                borderColor: ['#fff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: false
                }
            }
        }
    });

    // Biểu đồ cột Budget (cho Expenses, Balance, Revenues)
    const budgetBarCtx = document.getElementById('budgetBarChart').getContext('2d');
    new Chart(budgetBarCtx, {
        type: 'bar',
        data: {
            labels: ['03/2025', '4/2025', '5/2025'],
            datasets: [{
                label: 'Amount ($)',
                data: [-3600, -3420, 180], // Giá trị âm cho Expenses và Balance, dương cho Revenues
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
                borderColor: ['#fff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: false
                }
            }
        }
    });

    // Biểu đồ Categories (pie chart)
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'pie',
        data: {
            labels: ['Home', 'Transportation', 'Entertainment', 'Food', 'Other'],
            datasets: [{
                data: [0, 0, 0, 3600, 0], // Giá trị mẫu
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
                borderColor: ['#fff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: false
                }
            }
        }
    });
});