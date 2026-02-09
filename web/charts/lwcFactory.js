/**
 * Lightweight Charts Factory
 * Creates and configures TradingView Lightweight Charts instances
 */

function createChart(containerId, options = {}) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return null;
    }

    const defaultOptions = {
        width: container.clientWidth,
        height: container.clientHeight || 400,
        layout: {
            background: { color: '#ffffff' },
            textColor: '#333',
        },
        grid: {
            vertLines: { color: '#e0e0e0' },
            horzLines: { color: '#e0e0e0' },
        },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        rightPriceScale: {
            borderColor: '#cccccc',
        },
        timeScale: {
            borderColor: '#cccccc',
            timeVisible: true,
            secondsVisible: false,
        },
    };

    const chart = LightweightCharts.createChart(
        container,
        { ...defaultOptions, ...options }
    );

    // Handle window resize
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            chart.applyOptions({ width, height });
        }
    });
    resizeObserver.observe(container);

    return chart;
}

function createCandlestickSeries(chart, options = {}) {
    const defaultOptions = {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    };

    return chart.addCandlestickSeries({ ...defaultOptions, ...options });
}

function createLineSeries(chart, options = {}) {
    const defaultOptions = {
        color: '#2962FF',
        lineWidth: 2,
    };

    return chart.addLineSeries({ ...defaultOptions, ...options });
}

function createHistogramSeries(chart, options = {}) {
    const defaultOptions = {
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
    };

    return chart.addHistogramSeries({ ...defaultOptions, ...options });
}

function createAreaSeries(chart, options = {}) {
    const defaultOptions = {
        topColor: 'rgba(38, 166, 154, 0.4)',
        bottomColor: 'rgba(38, 166, 154, 0.0)',
        lineColor: 'rgba(38, 166, 154, 1)',
        lineWidth: 2,
    };

    return chart.addAreaSeries({ ...defaultOptions, ...options });
}