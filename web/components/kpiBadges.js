/**
 * KPI Badges Component
 * Displays quick KPI metrics with color-coded status
 */

function renderKPIBadges(kpiData) {
    const container = document.getElementById('kpi-badges');
    
    if (!kpiData) {
        container.innerHTML = '<div class="no-data">No KPI data available</div>'; 
        return;
    }

    container.innerHTML = `
        <div class="kpi-badges-container">
            ${renderKPIBadge('Expectancy', kpiData.expectancy.toFixed(2), kpiData.expectancy > 0, '$')}
            ${renderKPIBadge('Payoff', kpiData.payoff_ratio.toFixed(2), kpiData.payoff_ratio >= 1.3, '')}
            ${renderKPIBadge('Win Rate', (kpiData.win_rate * 100).toFixed(1), kpiData.win_rate >= 0.45, '%')}
            ${renderKPIBadge('Drawdown', (kpiData.max_drawdown * 100).toFixed(1), kpiData.max_drawdown <= 0.35, '%')}
            ${renderKPIBadge('MAR', kpiData.mar_ratio.toFixed(2), kpiData.mar_ratio >= 0.30, '')}
            ${renderKPIBadge('Trades', kpiData.total_trades, kpiData.total_trades >= 150, '')}
        </div>
    `;
}

function renderKPIBadge(label, value, passing, suffix) {
    const statusClass = passing ? 'badge-pass' : 'badge-fail';
    const icon = passing ? '✓' : '⚠';
    
    return `
        <div class="kpi-badge ${statusClass}">
            <div class="badge-icon">${icon}</div>
            <div class="badge-content">
                <div class="badge-label">${label}</div>
                <div class="badge-value">${value}${suffix}</div>
            </div>
        </div>
    `;
}