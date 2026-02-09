/**
 * Main Application Logic
 * Coordinates all dashboard components
 */

// Global state
const state = {
    currentRunId: null,
    currentSymbol: null,
    runs: [],
    symbols: [],
    charts: {
        daily: null,
        h1: null,
        regime: null
    }
};

// Initialize dashboard
async function init() {
    try {
        // Load latest runs
        console.log('Loading latest runs...');
        state.runs = await api.getLatestRuns(20);
        
        if (state.runs.length === 0) {
            showError('No simulation runs found');
            return;
        }

        // Render run list
        renderRunList(state.runs);

        // Select first run by default
        await selectRun(state.runs[0].run_id);

    } catch (error) {
        console.error('Initialization error:', error);
        showError(`Failed to load dashboard: ${error.message}`);
    }
}

// Select a run
async function selectRun(runId) {
    try {
        state.currentRunId = runId;

        // Update active state in run list
        updateRunListSelection(runId);

        // Load run data in parallel
        const [glrs, symbols, kpis, scorecard] = await Promise.all([
            api.getRunGLRS(runId),
            api.getRunSymbols(runId),
            api.getRunKPIs(runId),
            api.getRunScorecard(runId)
        ]);

        state.symbols = symbols.symbols;

        // Update UI components
        renderGLRSBar(glrs);
        renderSymbolSelector(state.symbols);
        renderKPIBadges(kpis);
        renderScorecard(scorecard);

        // Select first symbol by default
        if (state.symbols.length > 0) {
            await selectSymbol(state.symbols[0]);
        }

    } catch (error) {
        console.error('Error selecting run:', error);
        showError(`Failed to load run: ${error.message}`);
    }
}

// Select a symbol
async function selectSymbol(symbol) {
    try {
        state.currentSymbol = symbol;

        // Update symbol selector
        document.getElementById('symbol-select').value = symbol;

        // Load chart data in parallel
        const [dailyData, h1Data, regimeData] = await Promise.all([
            api.getDailyChart(state.currentRunId, symbol),
            api.getH1Chart(state.currentRunId, symbol),
            api.getRegimeData(state.currentRunId)
        ]);

        // Render charts
        renderDailyChart(dailyData);
        renderH1Chart(h1Data);
        renderRegimeChart(regimeData);

    } catch (error) {
        console.error('Error selecting symbol:', error);
        showError(`Failed to load chart: ${error.message}`);
    }
}

// Render symbol selector dropdown
function renderSymbolSelector(symbols) {
    const select = document.getElementById('symbol-select');
    select.innerHTML = symbols.map(s => 
        `<option value="${s}">${s}</option>`
    ).join('');

    select.onchange = (e) => selectSymbol(e.target.value);
}

// Show error message
function showError(message) {
    const glrsBar = document.getElementById('glrs-bar');
    glrsBar.innerHTML = `
        <div style="color: #ef5350; font-weight: bold;">
            ⚠️ ${message}
        </div>
    `;
}

// Start the application
document.addEventListener('DOMContentLoaded', init);