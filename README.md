# MTF Swing Trading Dashboard

A rules-only, multi-timeframe swing trading simulator with comprehensive paper-trade tracking and Go-Live Readiness scoring.

## Overview

This project implements a complete trading simulation system with:

- **Multi-Timeframe Analysis**: Weekly → Daily → 60-minute trend alignment
- **Single Position Management**: Phase 1 implementation (one position at a time)
- **T+1 Settlement Compliance**: Cash-account safe with Good Faith Violation prevention
- **No Same-Day Round Trips**: Swing-only strategy
- **Full Trade Journaling**: Complete ledger and KPI tracking
- **Interactive Web Dashboard**: TradingView charts with technical overlays

## Features

### Go-Live Readiness Score (GLRS)

The dashboard calculates a comprehensive 0-100 score across four phases:

1. **In-Sample (Backtest)** - 30 points
   - Trades ≥ 150
   - Expectancy > 0
   - Payoff ≥ 1.3
   - Max drawdown ≤ 35%
   - MAR ≥ 0.30
   - Positive expectancy in bull and bear regimes

2. **Out-of-Sample** - 25 points
   - Trades ≥ 75
   - Expectancy > 0
   - KPI degradation ≤ 30%
   - Max drawdown ≤ 40%

3. **Paper Trading** - 30 points
   - ≥ 8 weeks OR ≥ 30 trades
   - Expectancy ≥ 0
   - Slippage delta ≤ 30%
   - Zero settlement or same-day violations

4. **Pilot (Small Capital)** - 15 points
   - Trades ≥ 20
   - Expectancy ≥ 0
   - No kill-switch defects

### GLRS States

- **BLOCKED** (< 70): Critical issues must be resolved
- **CAUTION** (70-84): Approaching readiness, minor issues remain
- **READY** (≥ 85): All gates passed, ready for live trading

## Repository Structure

```
.
├── config/
│   └── config.yaml              # Configuration settings
├── reports/
│   ├── ledger/                  # Trade ledger files
│   ├── logs/                    # Simulation logs
│   └── summaries/               # Performance summaries
├── src/
│   └── mtf_swing/
│       ├── webapi/
│       │   ├── server.py        # FastAPI server
│       │   ├── adapters.py      # Data loading
│       │   ├── security.py      # API authentication
│       │   └── schemas.py       # Pydantic models
│       ├── journal/
│       │   ├── ledger.py        # Trade ledger
│       │   ├── trade_journal.py # Journal entries
│       │   └── kpi.py           # KPI calculations
│       └── readiness.py         # GLRS calculation
├── web/
│   ├── index.html               # Main dashboard
│   ├── main.js                  # Application logic
│   ├── styles.css               # Styling
│   ├── api.js                   # API client
│   ├── charts/
│   │   ├── lwcFactory.js        # Chart factory
│   │   ├── symbolPanel.js       # Symbol panel
│   │   ├── markers.js           # Entry/exit markers
│   │   ├── overlays.js          # Technical overlays
│   │   └── chartRender.js       # Rendering functions
│   └── components/
│       ├── runList.js           # Run list sidebar
│       ├── glrsBar.js           # GLRS score bar
│       ├── successScorecard.js  # Phase gates display
│       └── kpiBadges.js         # KPI badges
├── docker-compose.yml           # Docker orchestration
├── Dockerfile.api               # API container
├── Dockerfile.web               # Web container
├── nginx.conf                   # Nginx configuration
└── .env                         # Environment variables
```

## API Endpoints

### Runs
- `GET /api/runs/latest?limit=20` - Recent simulation runs with GLRS

### Run Details
- `GET /api/run/{run_id}/symbols` - Symbols traded during run
- `GET /api/run/{run_id}/kpis` - Key performance indicators
- `GET /api/run/{run_id}/glrs` - Go-Live Readiness Score
- `GET /api/run/{run_id}/scorecard` - Complete success scorecard

### Chart Data
- `GET /api/run/{run_id}/symbol/{symbol}/daily` - Daily OHLCV + EMA + ATR
- `GET /api/run/{run_id}/symbol/{symbol}/h1` - 60-minute bars + RSI + RVOL
- `GET /api/run/{run_id}/regime` - Weekly regime series

## Docker Deployment (Windows)

### Prerequisites

- Docker Desktop installed
- WSL2 enabled
- Windows Firewall configured to allow inbound TCP 8080 and 8008

### Deployment Steps

```powershell
# 1. Clone the repository
git clone https://github.com/CWitteVera/SwingTradingDashboard.git
cd SwingTradingDashboard

# 2. (Optional) Set API token
$env:API_TOKEN="your_secret_token_here"

# 3. Build containers
docker compose build

# 4. Start services
docker compose up -d

# 5. Verify services are running
docker compose ps
```

### Access Dashboard

- **From host PC**: http://localhost:8080
- **From LAN devices**: http://<Your-PC-IP>:8080

To find your PC's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

### Management Commands

```powershell
# Stop services
docker compose stop

# Start services
docker compose start

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Shut down and remove containers
docker compose down
```

## Configuration

Edit `config/config.yaml` to customize:

```yaml
web:
  host: "0.0.0.0"
  port: 8008
  require_token: false        # Set to true to enable API authentication
  api_token: "CHANGE_ME"      # Set a secure token

visuals:
  glrs:
    min_ready: 85              # Minimum score for READY state
    caution_min: 70            # Minimum score for CAUTION state

packaging:
  http_port: 8080              # External web port
```

## T+1 Settlement Compliance

This system implements full T+1 settlement compliance for U.S. cash accounts:

- **Settlement Period**: Trades settle on T+1 (trade date + one business day)
- **Cash Availability**: Only settled cash is available for new purchases
- **Good Faith Violations**: The system prevents buying with unsettled funds
- **No Same-Day Round Trips**: Swing-only strategy avoids intraday violations
- **PDT Rules**: Pattern Day Trader rules apply only to margin accounts (not used here)

## Chart Attribution

This dashboard uses **TradingView Lightweight Charts** under the Apache 2.0 license.

Required attribution (included in footer):
> Charts powered by TradingView Lightweight Charts  
> © TradingView — Apache-2.0  
> https://www.tradingview.com

## Troubleshooting

### Port Already in Use
Change the host ports in `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Change 8080 to 8081
```

### Blank Charts
Verify the API is reachable:
```
http://<PC-IP>:8080/api/runs/latest?limit=5
```

### Unauthorized Errors
- Disable token authentication: Set `require_token: false` in config
- Or provide the token in request headers: `X-API-Token: your_token`

### Firewall Issues
Allow inbound connections on TCP ports 8080 and 8008:
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Trading Dashboard Web" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Trading Dashboard API" -Direction Inbound -LocalPort 8008 -Protocol TCP -Action Allow
```

## License

This project is for personal trading simulation and research purposes.

TradingView Lightweight Charts is licensed under Apache 2.0.

---

**Built with**: FastAPI • TradingView Lightweight Charts • Docker • Nginx