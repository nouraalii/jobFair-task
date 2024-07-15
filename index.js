document.addEventListener('DOMContentLoaded', () => {
    let customers = [];
    let transactions = [];
    let myChart; // Declare myChart variable outside to keep track of the chart instance

    const fetchData = async () => {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            customers = data.customers;
            transactions = data.transactions;

            displayTable(transactions);
            displayGraph(transactions);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const displayTable = (transactions) => {
        const tableBody = document.querySelector('#transactions tbody');
        tableBody.innerHTML = '';

        transactions.forEach(transaction => {
            const customer = customers.find(cust => cust.id === transaction.customer_id);
            const row = `<tr>
                            <td>${customer ? customer.name : 'Unknown'}</td>
                            <td>${transaction.date}</td>
                            <td>${transaction.amount}</td>
                        </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    };

    const displayGraph = (transactions) => {
        const ctx = document.getElementById('myChart').getContext('2d');

        // Prepare data for the chart
        const labels = transactions.map(transaction => transaction.date);
        const amounts = transactions.map(transaction => transaction.amount);

        // Check if myChart is initialized and destroy it if it exists
        if (myChart) {
            myChart.destroy();
        }

        // Create a new Chart instance
        myChart = new Chart(ctx, {
            type: 'line', // Choose the chart type (line, bar, pie, etc.)
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transaction Amounts',
                    data: amounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // Event listeners for filters
    document.getElementById('customerFilter').addEventListener('input', () => {
        const filterValue = document.getElementById('customerFilter').value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => {
            const customer = customers.find(cust => cust.id === transaction.customer_id);
            return customer.name.toLowerCase().includes(filterValue);
        });
        displayTable(filteredTransactions);
        displayGraph(filteredTransactions);
    });

    document.getElementById('amountFilter').addEventListener('input', () => {
        const filterValue = parseInt(document.getElementById('amountFilter').value);
        const filteredTransactions = transactions.filter(transaction => transaction.amount >= filterValue);
        displayTable(filteredTransactions);
        displayGraph(filteredTransactions);
    });

    // Initial data fetch and display
    fetchData();
});
