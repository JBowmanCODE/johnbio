function calculate() {
    const output = document.getElementById("output");
    const totalBillInput = document.getElementById("total_bill");
    const tipPercentageInput = document.getElementById("tip_percentage");
    const numPeopleInput = document.getElementById("num_people");

    if (!output || !totalBillInput || !tipPercentageInput || !numPeopleInput) {
        console.error('One or more required elements are missing');
        return;
    }

    const totalBill = parseFloat(totalBillInput.value);
    const tipPercentage = parseFloat(tipPercentageInput.value || '0');
    const numPeople = parseInt(numPeopleInput.value, 10);

    if (isNaN(totalBill) || totalBill < 0 || isNaN(tipPercentage) || tipPercentage < 0 || isNaN(numPeople) || numPeople < 1) {
        output.innerText = 'Please enter valid numbers (at least 1 person).';
        return;
    }

    const totalTip = (tipPercentage / 100) * totalBill;
    const totalAmount = totalBill + totalTip;
    const amountPerPerson = totalAmount / numPeople;

    output.innerText =
        `Total bill amount: £${totalBill.toFixed(2)}\n` +
        `Tip amount: £${totalTip.toFixed(2)}\n` +
        `Total amount to be paid: £${totalAmount.toFixed(2)}\n` +
        `Each person should pay: £${amountPerPerson.toFixed(2)}`;
}

function setupCalculator() {
    const calculateButton = document.getElementById('calculate-button');
    const inputFields = document.querySelectorAll('#calculator input');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculate);
    }
    inputFields.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', setupCalculator);
