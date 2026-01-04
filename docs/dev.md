---
description: Kill all dev ports (3000, 3001, 9999) and start fresh Netlify dev server (user)
allowed-tools: Bash(lsof:*), Bash(kill:*), Bash(xargs:*), Bash(netlify dev:*)
---

Start a fresh dev environment.

## Step 1: Kill all processes on dev ports

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:9999 | xargs kill -9 2>/dev/null || true
```

Ignore errors if no process is found.

## Step 2: Start Netlify dev server

```bash
netlify dev
```

Run in background with `run_in_background: true`.

## Result

- **http://localhost:3000** - Access app here
- Vite runs internally on 3001
- Functions run internally on 9999

Note: Local function timeout is 30 seconds (Netlify CLI limitation).
