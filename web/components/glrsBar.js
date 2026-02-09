/**
 * GLRS Bar Component
 * Visual Go-Live Readiness Score bar with color coding
 */

function renderGLRSBar(glrsData) {
    const container = document.getElementById('glrs-bar');
    
    if (!glrsData) {
        container.innerHTML = '<div class="no-data">No GLRS data available</div>';
        return;
    }

    const score = glrsData.total_score || 0;
    const statusClass = getGLRSStatusClass(score);
    const statusText = getGLRSStatusText(score);

    container.innerHTML = `
        <div class="glrs-container">
            <div class="glrs-header">
                <h2>Go-Live Readiness Score</h2>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="glrs-score-display">
                <div class="glrs-number ${statusClass}">${score.toFixed(0)}</div>
                <div class="glrs-max">/100</div>
            </div>

            <div class="glrs-bar-track">
                <div class="glrs-bar-fill ${statusClass}" 
                     style="width: ${score}%"></div>
                <div class="glrs-threshold" style="left: 70%" 
                     title="Caution threshold: 70"></div>
                <div class="glrs-threshold" style="left: 85%" 
                     title="Ready threshold: 85"></div>
            </div>

            <div class="glrs-subscores">
                <div class="subscore-item">
                    <span class="subscore-label">In-Sample:</span>
                    <span class="subscore-value">${(glrsData.in_sample_score || 0).toFixed(0)}/30</span>
                </div>
                <div class="subscore-item">
                    <span class="subscore-label">Out-of-Sample:</span>
                    <span class="subscore-value">${(glrsData.out_of_sample_score || 0).toFixed(0)}/25</span>
                </div>
                <div class="subscore-item">
                    <span class="subscore-label">Paper Trading:</span>
                    <span class="subscore-value">${(glrsData.paper_trade_score || 0).toFixed(0)}/30</span>
                </div>
                <div class="subscore-item">
                    <span class="subscore-label">Pilot:</span>
                    <span class="subscore-value">${(glrsData.pilot_score || 0).toFixed(0)}/15</span>
                </div>
            </div>
        </div>
    `;
}