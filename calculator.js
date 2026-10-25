document.addEventListener('DOMContentLoaded', () => {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    function calculateBill() {
        const totalBill = parseFloat(document.getElementById('total-bill').value);
        const tipPercentage = parseFloat(document.getElementById('tip-percentage').value || '0');
        const numPeople = parseInt(document.getElementById('num-people').value, 10);

        if (isNaN(totalBill) || isNaN(tipPercentage) || isNaN(numPeople) || totalBill <= 0 || tipPercentage < 0 || numPeople <= 0) {
            resultsDiv.innerHTML = '<p style="color: #ff6b6b;">Please enter valid positive numbers for the bill and people.</p>';
            return;
        }

        const totalTip = totalBill * (tipPercentage / 100);
        const totalAmount = totalBill + totalTip;
        const amountPerPerson = totalAmount / numPeople;

        resultsDiv.innerHTML = `
            <p>Total Tip: £${totalTip.toFixed(2)}</p>
            <p>Total Amount (including tip): £${totalAmount.toFixed(2)}</p>
            <p>Each person should pay: <strong>£${amountPerPerson.toFixed(2)}</strong></p>
        `;
    }

    if (calculateButton) {
        calculateButton.addEventListener('click', calculateBill);
    }

    document.querySelectorAll('#calculator input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateBill();
            }
        });
    });
});
