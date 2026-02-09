/**
 * Chart Rendering Functions
 * Main rendering logic for Daily, H1, and Regime charts
 */

// Render Daily Chart
function renderDailyChart(dailyData) {
    // Clean up existing chart
    if (state.charts.daily) {
        state.charts.daily.remove();
    }

    // Create new chart
    state.charts.daily = createChart('daily-chart', {
        height: 400,
    });

    // Add candlestick series
    const candleSeries = createCandlestickSeries(state.charts.daily);
    candleSeries.setData(dailyData.bars);

    // Add EMA overlays
    if (dailyData.ema20 && dailyData.ema20.length > 0) {
        const ema20 = createLineSeries(state.charts.daily, {
            color: '#2962FF',
            lineWidth: 2,
            title: 'EMA 20',
        });
        ema20.setData(dailyData.ema20);
    }

    if (dailyData.ema50 && dailyData.ema50.length > 0) {
        const ema50 = createLineSeries(state.charts.daily, {
            color: '#FF6D00',
            lineWidth: 2,
            title: 'EMA 50',
        });
        ema50.setData(dailyData.ema50);
    }

    // Add ATR bands
    if (dailyData.atr_upper && dailyData.atr_upper.length > 0) {
        const atrUpper = createLineSeries(state.charts.daily, {
            color: 'rgba(239, 83, 80, 0.5)',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            title: 'ATR Upper',
        });
        atrUpper.setData(dailyData.atr_upper);
    }

    if (dailyData.atr_lower && dailyData.atr_lower.length > 0) {
        const atrLower = createLineSeries(state.charts.daily, {
            color: 'rgba(239, 83, 80, 0.5)',
            lineWidth: 1,
            lineStyle: LightweightCharts.LineStyle.Dashed,
            title: 'ATR Lower',
        });
        atrLower.setData(dailyData.atr_lower);
    }

    // Add markers for entries and exits
    if (dailyData.markers && dailyData.markers.length > 0) {
        const markers = dailyData.markers.map(m => ({
            time: m.time,
            position: m.position,
            color: m.color,
            shape: m.shape,
            text: m.text,
        }));
        candleSeries.setMarkers(markers);
    }

    // Fit content
    state.charts.daily.timeScale().fitContent();
}

// Render H1 Chart
function renderH1Chart(h1Data) {
    // Clean up existing chart
    if (state.charts.h1) {
        state.charts.h1.remove();
    }

    // Create new chart
    state.charts.h1 = createChart('h1-chart', {
        height: 350,
    });

    // Add candlestick series
    const candleSeries = createCandlestickSeries(state.charts.h1);
    candleSeries.setData(h1Data.bars);

    // Add RSI overlay if available
    if (h1Data.rsi && h1Data.rsi.length > 0) {
        const rsi = createLineSeries(state.charts.h1, {
            color: '#9C27B0',
            lineWidth: 2,
            title: 'RSI',
            priceScaleId: 'rsi',
        });
        
        // Configure RSI price scale
        state.charts.h1.priceScale('rsi').applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });
        
        rsi.setData(h1Data.rsi);
    }

    // Add RVOL overlay if available
    if (h1Data.rvol && h1Data.rvol.length > 0) {
        const rvol = createLineSeries(state.charts.h1, {
            color: '#00BCD4',
            lineWidth: 2,
            title: 'RVOL',
            priceScaleId: 'rvol',
        });
        
        // Configure RVOL price scale
        state.charts.h1.priceScale('rvol').applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });
        
        rvol.setData(h1Data.rvol);
    }

    // Add markers
    if (h1Data.markers && h1Data.markers.length > 0) {
        const markers = h1Data.markers.map(m => ({
            time: m.time,
            position: m.position,
            color: m.color,
            shape: m.shape,
            text: m.text,
        }));
        candleSeries.setMarkers(markers);
    }

    // Fit content
    state.charts.h1.timeScale().fitContent();
}

// Render Regime Chart
function renderRegimeChart(regimeData) {
    // Clean up existing chart
    if (state.charts.regime) {
        state.charts.regime.remove();
    }

    // Create new chart
    state.charts.regime = createChart('regime-chart', {
        height: 200,
    });

    // Add regime area series
    if (regimeData.regimes && regimeData.regimes.length > 0) {
        // Map regimes to colors: bull=green, bear=red, neutral=gray
        const regimeColors = {
            'bull': 'rgba(38, 166, 154, 0.3)',
            'bear': 'rgba(239, 83, 80, 0.3)',
            'neutral': 'rgba(158, 158, 158, 0.3)',
        };

        // Create histogram series for regime visualization
        const regimeSeries = createHistogramSeries(state.charts.regime, {
            priceFormat: {
                type: 'price',
                precision: 0,
            },
        });

        const regimeHistogram = regimeData.regimes.map(r => {
            const value = r.regime === 'bull' ? 1 : (r.regime === 'bear' ? -1 : 0);
            return {
                time: r.time,
                value: value,
                color: regimeColors[r.regime] || regimeColors['neutral'],
            };
        });

        regimeSeries.setData(regimeHistogram);
    }

    // Fit content
    state.charts.regime.timeScale().fitContent();
}