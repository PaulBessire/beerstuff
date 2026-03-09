# Brewhouse Planner

Production planning tool for a 59-recipe brewery with live NetSuite integration.

## Features

- **Schedule Optimizer** — Gantt chart matching brewery's Excel format (3 sub-rows per tank: fermenting, testing, packaging)
- **Material Orders** — Auto-calculated from schedule × recipes × lead times × inventory
- **Production Status** — Real-time equipment utilization and batch pipeline
- **Inventory Dashboard** — Stock vs. demand with visual bars
- **Demand Forecasts** — CSV import + manual entry + inline overrides
- **Recipe Library** — 59 beers (11 core, 6 contract, 42 seasonal)
- **NetSuite Live Inventory** — Real-time sync via MCP (raw materials, finished goods, BOMs)

## Equipment Modeled

- 14 fermenters (3×20BBL, 9×120BBL, 2×60BBL)
- 3 brite tanks (2×120BBL, 1×40BBL) + HOG
- Canning and kegging lines

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (Recommended — Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Vite and deploys — no config needed
4. Every push to main auto-deploys

## Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) and create a new project from the repo
3. Railway detects the Vite project automatically
4. Set the start command to: `npm run start`
5. Railway assigns a public URL

## NetSuite Integration

The NetSuite tab connects via the Anthropic API with MCP server:
- MCP URL: `https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools`
- Queries: SuiteQL for inventory parts, assemblies, and BOM components
- Pre-loaded data included as fallback (pulled 3/9/2026)

### For production deployment with live NetSuite sync:
The API calls currently go through Anthropic's API (which handles MCP auth). For a production setup, you'd want a small backend proxy to avoid exposing API keys client-side. Options:
- Vercel Edge Functions / API Routes
- Railway Node.js service
- Cloudflare Workers

## Tech Stack

- React 18 + Vite
- No external UI libraries (pure CSS-in-JS)
- Anthropic API + NetSuite MCP for live data
