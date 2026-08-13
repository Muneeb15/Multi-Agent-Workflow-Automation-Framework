# Integrated Agents Frontend

Professional React, Vite, and Tailwind CSS dashboard for browsing, filtering, and launching AI agents from the `agency-agents` and `ruflo` sources.

## Install

```bash
cd integrated-agents/frontend
npm install
```

If PowerShell blocks `npm.ps1`, use `npm.cmd install`.

## Run The Dev Server

```bash
npm run dev
```

The Vite app runs at `http://127.0.0.1:3000/`.

## Run The Full Cursor-Style System

```bash
npm run dev:full
```

This starts both the Vite frontend and the local agent runner. The runner listens on `http://127.0.0.1:8787`, accepts `/api/tasks`, writes generated projects into `generated-projects/`, and returns files, logs, commands, and notification payloads back to the chat.

You can also run the worker separately:

```bash
npm run worker
```

## Build For Production

```bash
npm run build
```

The production bundle is emitted to `dist/`.

## Project Structure

```text
integrated-agents/frontend/
  index.html
  package.json
  server/
    agent-runner.cjs
    dev-full.cjs
  vite.config.js
  tailwind.config.js
  generated-projects/
  src/
    App.jsx
    main.jsx
    index.css
    components/
      AgentCard.jsx
      ErrorBoundary.jsx
      Header.jsx
      LoadingScreen.jsx
      Sidebar.jsx
      StatCard.jsx
    data/
      agents.js
    pages/
      AgentBrowser.jsx
      AgentDetail.jsx
      ChatPage.jsx
      Dashboard.jsx
      PluginsPage.jsx
```

## Pages

- `/` dashboard with platform stats, quick launch agents, categories, and Ruflo status.
- `/agents` searchable agent browser with source and category filters.
- `/agent/:id` detailed profile view with activation prompt and related agents.
- `/plugins` searchable catalog of all 32 Ruflo plugins.
- `/chat` Cursor-style agent workspace with all-agent routing, local code-writing runner output, in-app completion notifications, and email-ready completion payloads.
