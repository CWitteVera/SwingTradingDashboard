/**
 * Run List Component
 * Displays recent simulation runs with GLRS scores and status
 */

function renderRunList(runs) {
    const container = document.getElementById('run-list');
    
    if (!runs || runs.length === 0) {
        container.innerHTML = '<div class="no-data">No runs available</div>';
        return;
    }

    container.innerHTML = runs.map(run => {
        const glrs = run.glrs || 0;
        const statusClass = getGLRSStatusClass(glrs);
        const statusText = getGLRSStatusText(glrs);
        const date = new Date(run.timestamp).toLocaleDateString();

        return `
            <div class="run-item ${run.run_id === state.currentRunId ? 'active' : ''}" 
                 data-run-id="${run.run_id}" 
                 onclick="selectRun('${run.run_id}')">
                <div class="run-header">
                    <span class="run-id">${run.run_id}</span>
                    <span class="run-date">${date}</span>
                </div>
                <div class="run-details">
                    <div class="glrs-mini">
                        <span class="glrs-label">GLRS:</span>
                        <span class="glrs-value ${statusClass}">${glrs.toFixed(0)}</span>
                    </div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="run-stats">
                    <span>Trades: ${run.total_trades || 0}</span>
                    <span>Win Rate: ${((run.win_rate || 0) * 100).toFixed(1)}%</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateRunListSelection(runId) {
    document.querySelectorAll('.run-item').forEach(item => {
        item.classList.toggle('active', item.dataset.runId === runId);
    });
}

function getGLRSStatusClass(glrs) {
    if (glrs >= 85) return 'status-ready';
    if (glrs >= 70) return 'status-caution';
    return 'status-blocked';
}

function getGLRSStatusText(glrs) {
    if (glrs >= 85) return 'READY';
    if (glrs >= 70) return 'CAUTION';
    return 'BLOCKED';
}