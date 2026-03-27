document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('bc-form');
  const resultsSection = document.getElementById('bc-results');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculate();
  });

  // Also calculate on any input change for live updates
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculate);
  });

  function calculate() {
    const B = parseFloat(document.getElementById('bc-bonus').value) || 0;
    const W = parseFloat(document.getElementById('bc-wagering').value) || 0;
    const HE = parseFloat(document.getElementById('bc-house-edge').value) || 0;
    const CR = parseFloat(document.getElementById('bc-completion').value) || 0;

    if (B <= 0 || W <= 0 || HE <= 0 || CR <= 0) return;

    const totalWagering = B * W;
    const expectedLossIfCompleted = totalWagering * (HE / 100);
    const netCostPerBonus = (CR / 100) * (B - expectedLossIfCompleted);
    const breakevenHE = (1 / W) * 100;
    const isProfit = netCostPerBonus < 0;

    // Update result cards
    document.getElementById('res-total-wagering').textContent = '£' + totalWagering.toFixed(2);
    document.getElementById('res-expected-loss').textContent = '£' + expectedLossIfCompleted.toFixed(2);

    const costEl = document.getElementById('res-net-cost');
    if (isProfit) {
      costEl.textContent = '+£' + Math.abs(netCostPerBonus).toFixed(2);
      costEl.className = 'bc-result-value profit';
      document.getElementById('res-net-cost-label').textContent = 'Operator profit per bonus';
    } else {
      costEl.textContent = '£' + netCostPerBonus.toFixed(2);
      costEl.className = 'bc-result-value';
      document.getElementById('res-net-cost-label').textContent = 'Net cost per bonus issued';
    }

    document.getElementById('res-breakeven').textContent = breakevenHE.toFixed(2) + '%';

    // Interpretation
    const currentHEvsBreakeven = HE >= breakevenHE;
    const interpretation = document.getElementById('bc-interpretation');
    if (currentHEvsBreakeven) {
      interpretation.textContent = `At ${HE}% house edge, players on average lose more than the bonus during wagering. This offer is commercially sustainable — even completers are net-profitable for the operator. The real cost is acquiring those players and handling non-completers' partial wagering.`;
    } else {
      interpretation.textContent = `At ${HE}% house edge, this bonus costs the operator money for every player who completes wagering. To break even, you need a house edge of at least ${breakevenHE.toFixed(2)}% (or reduce the bonus, increase the wagering requirement, or target games with higher margins).`;
    }

    // Scenarios table
    const tbody = document.getElementById('bc-scenarios-tbody');
    tbody.innerHTML = '';
    [20, 40, 60, 80, 100].forEach(rate => {
      const cost = (rate / 100) * (B - expectedLossIfCompleted);
      const isCurrentRate = rate === Math.round(CR / 20) * 20;
      const tr = document.createElement('tr');
      if (rate === Math.round(CR / 10) * 10 || Math.abs(rate - CR) < 10) tr.className = 'highlight';
      const costStr = cost < 0 ? `<span style="color:#22c55e">+£${Math.abs(cost).toFixed(2)} profit</span>` : `£${cost.toFixed(2)}`;
      tr.innerHTML = `<td>${rate}%</td><td>£${(B * rate / 100).toFixed(2)}</td><td>${'£' + (totalWagering * HE / 100 * rate / 100).toFixed(2)}</td><td>${costStr}</td>`;
      tbody.appendChild(tr);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Auto-calculate on load with defaults
  calculate();
});
