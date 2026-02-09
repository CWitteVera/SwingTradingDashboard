/**
 * API Client for MTF Swing Trading Dashboard
 * Handles all communication with the FastAPI backend
 */

const API_BASE = '/api';

class API {
    constructor() {
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    async fetch(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['X-API-Token'] = this.token;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Runs
    async getLatestRuns(limit = 20) {
        return this.fetch(`/runs/latest?limit=${limit}`);
    }

    // Run Details
    async getRunSymbols(runId) {
        return this.fetch(`/run/${runId}/symbols`);
    }

    async getRunKPIs(runId) {
        return this.fetch(`/run/${runId}/kpis`);
    }

    async getRunGLRS(runId) {
        return this.fetch(`/run/${runId}/glrs`);
    }

    async getRunScorecard(runId) {
        return this.fetch(`/run/${runId}/scorecard`);
    }

    // Chart Data
    async getDailyChart(runId, symbol) {
        return this.fetch(`/run/${runId}/symbol/${symbol}/daily`);
    }

    async getH1Chart(runId, symbol) {
        return this.fetch(`/run/${runId}/symbol/${symbol}/h1`);
    }

    async getRegimeData(runId) {
        return this.fetch(`/run/${runId}/regime`);
    }
}

// Export singleton instance
const api = new API();
