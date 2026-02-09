/**
 * Success Scorecard Component
 * Displays phase gates, KPI summary, and blockers list
 */

function renderScorecard(scorecardData) {
    const container = document.getElementById('scorecard');
    
    if (!scorecardData) {
        container.innerHTML = '<div class="no-data">No scorecard data available</div>'; 
        return;
    }

    const { glrs, phase_gates, kpis, blockers } = scorecardData;
    
    container.innerHTML = `
        <div class="scorecard-container">
            <h2>Success Scorecard</h2>
            
            <!-- Phase Gates -->
            <div class="phase-gates-section">
                <h3>Phase Gates</h3>
                <div class="phase-gates">
                    ${renderPhaseGate('In-Sample', phase_gates.in_sample)}
                    ${renderPhaseGate('Out-of-Sample', phase_gates.out_of_sample)}
                    ${renderPhaseGate('Paper Trading', phase_gates.paper_trading)}
                    ${renderPhaseGate('Pilot', phase_gates.pilot)}
                </div>
            </div>

            <!-- KPI Summary -->
            <div class="kpi-summary-section">
                <h3>KPI Summary</h3>
                <div class="kpi-grid">
                    ${renderKPISummaryItem('Expectancy', kpis.expectancy, kpis.expectancy > 0)}
                    ${renderKPISummaryItem('Payoff Ratio', kpis.payoff_ratio, kpis.payoff_ratio >= 1.3)}
                    ${renderKPISummaryItem('Win Rate', {(kpis.win_rate * 100).toFixed(1)}%, kpis.win_rate >= 0.45)}
                    ${renderKPISummaryItem('Max Drawdown', {(kpis.max_drawdown * 100).toFixed(1)}%, kpis.max_drawdown <= 0.35)}
                    ${renderKPISummaryItem('MAR Ratio', kpis.mar_ratio.toFixed(2), kpis.mar_ratio >= 0.30)}
                    ${renderKPISummaryItem('Total Trades', kpis.total_trades, kpis.total_trades >= 150)}
                </div>
            </div>

            <!-- Blockers -->
            ${blockers && blockers.length > 0 ? `
                <div class="blockers-section">
                    <h3>⚠️ Blockers (${blockers.length})</h3>
                    <ul class="blockers-list">
                        ${blockers.map(b => `<li class="blocker-item">${b}</li>`).join('')}
                    </ul>
                </div>
            ` : '<div class="blockers-section"><h3>✅ No Blockers</h3></div>'}
        </div>
    `;
}

function renderPhaseGate(name, gate) {
    const passed = gate.passed;
    const statusClass = passed ? 'gate-passed' : 'gate-failed';
    const icon = passed ? '✓' : '✗';
    
    return `
        <div class="phase-gate ${statusClass}">
            <div class="gate-header">
                <span class="gate-icon">${icon}</span>
                <span class="gate-name">${name}</span>
            </div>
            <div class="gate-score">${gate.score.toFixed(0)}/${gate.max_score}</div>
            <div class="gate-requirements">
                ${gate.requirements.map(req => `
                    <div class="requirement ${req.met ? 'req-met' : 'req-unmet'}">
                        ${req.met ? '✓' : '✗'} ${req.description}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderKPISummaryItem(label, value, passing) {
    const statusClass = passing ? 'kpi-pass' : 'kpi-fail';
    return `
        <div class="kpi-summary-item ${statusClass}">
            <div class="kpi-label">${label}</div>
            <div class="kpi-value">${value}</div>
        </div>
    `;
}