# 🤖 Real Orchestrator — Actually Executes Tasks

This is the **REAL orchestrator** that actually calls AI APIs and executes your tasks using the 337 specialized agents.

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd integrated-agents
npm install
```

### 2. Setup (Interactive)
```bash
node setup.js
```

This will ask you:
- Which AI provider (Claude/OpenAI/Gemini)
- Your API key
- Output preferences

### 3. Run a Task
```bash
node orchestrator.js "Build a React dashboard with dark theme"
```

## 🔑 Manual Setup

If you prefer manual setup:

### 1. Copy environment file
```bash
cp .env.example .env
```

### 2. Edit .env and add your API key
```bash
# Choose ONE provider and add your key:

# For Claude (Recommended):
ANTHROPIC_API_KEY=sk-ant-xxxxx
DEFAULT_PROVIDER=claude

# For OpenAI:
OPENAI_API_KEY=sk-xxxxx
DEFAULT_PROVIDER=openai

# For Gemini:
GOOGLE_API_KEY=xxxxx
DEFAULT_PROVIDER=gemini
```

### 3. Install and run
```bash
npm install
node orchestrator.js "your task here"
```

## 📋 How It Works

### 1. Task Analysis
The orchestrator analyzes your task and determines:
- Complexity level
- Required agents (from 337 available)
- Execution phases
- Subtasks

### 2. Agent Selection
Based on the analysis, it selects the optimal agents:
- Engineering agents for code tasks
- Design agents for UI/UX tasks
- Marketing agents for content tasks
- etc.

### 3. Execution
Each selected agent:
- Receives the task context
- Executes their specialized role
- Produces real output (code, content, analysis, etc.)

### 4. Output
All results are saved to `./output/task-[timestamp]/`:
- `task.json` — Task metadata
- `COMPLETE-OUTPUT.md` — Combined output from all agents
- Individual agent outputs as separate .md files

## 🎯 Example Tasks

### Web Development
```bash
node orchestrator.js "Build a React dashboard with user authentication"
node orchestrator.js "Create a REST API with CRUD operations"
node orchestrator.js "Build a landing page with pricing table"
```

### Marketing
```bash
node orchestrator.js "Write a 30-day content calendar for TikTok"
node orchestrator.js "Create 10 SEO blog post outlines about AI"
node orchestrator.js "Design a social media campaign strategy"
```

### Security
```bash
node orchestrator.js "Audit this API for security vulnerabilities"
node orchestrator.js "Create a security checklist for web apps"
node orchestrator.js "Write secure authentication implementation guide"
```

### Design
```bash
node orchestrator.js "Create a design system with color palette and typography"
node orchestrator.js "Design a mobile app user flow"
node orchestrator.js "Build a brand identity guide"
```

## 📊 Output Structure

After running a task, you'll get:

```
output/
└── task-2026-06-01T11-30-00/
    ├── task.json                    ← Task metadata
    ├── COMPLETE-OUTPUT.md           ← All agent outputs combined
    ├── frontend-developer.md        ← Individual agent outputs
    ├── backend-architect.md
    ├── ruflo-reviewer.md
    └── ...
```

## ⚙️ Configuration

Edit `.env` to customize:

```bash
# Provider
DEFAULT_PROVIDER=claude          # claude, openai, or gemini

# Models
CLAUDE_MODEL=claude-sonnet-4-20250514
OPENAI_MODEL=gpt-4
GEMINI_MODEL=gemini-2.0-flash-exp

# Limits
MAX_AGENTS_PER_TASK=10          # Max agents per task
TASK_TIMEOUT=300000             # 5 minutes
MAX_RETRIES=2                   # Retry failed agents

# Output
OUTPUT_DIR=./output             # Where to save results
SAVE_LOGS=true                  # Save execution logs
VERBOSE=false                   # Show detailed output
```

## 🔧 Advanced Usage

### Use Specific Provider
```bash
DEFAULT_PROVIDER=openai node orchestrator.js "your task"
```

### Verbose Mode
```bash
VERBOSE=true node orchestrator.js "your task"
```

### Custom Output Directory
```bash
OUTPUT_DIR=./my-outputs node orchestrator.js "your task"
```

## 🆚 Difference from Demo

| Feature | Demo (`run-task.js`) | Real (`orchestrator.js`) |
|---------|---------------------|-------------------------|
| **Execution** | Fake/simulated | Real AI API calls |
| **Output** | Hardcoded text | Actual agent work |
| **Agents** | Not used | Actually uses 337 agents |
| **Results** | No files created | Saves to `./output/` |
| **API** | No API calls | Calls Claude/OpenAI/Gemini |
| **Cost** | Free | Uses API credits |

## 💰 API Costs

Approximate costs per task:
- **Claude Sonnet 4:** $0.10 - $0.50 per task
- **GPT-4:** $0.20 - $1.00 per task
- **Gemini 2.0 Flash:** $0.01 - $0.10 per task

Costs depend on:
- Task complexity
- Number of agents used
- Output length

## 🐛 Troubleshooting

### "No API keys configured"
```bash
# Make sure .env exists and has your API key:
cat .env

# Should show:
ANTHROPIC_API_KEY=sk-ant-xxxxx
# or
OPENAI_API_KEY=sk-xxxxx
# or
GOOGLE_API_KEY=xxxxx
```

### "AI API call failed"
- Check your API key is valid
- Check you have credits/quota
- Check your internet connection

### "Invalid response format"
- Try again (AI responses can vary)
- Try a different provider
- Simplify your task

### Dependencies not installing
```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Key Setup

### Get Claude API Key (Recommended)
1. Go to https://console.anthropic.com/
2. Sign up / Log in
3. Go to API Keys
4. Create new key
5. Copy and paste into `.env`

### Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up / Log in
3. Go to API Keys
4. Create new key
5. Copy and paste into `.env`

### Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Copy and paste into `.env`

## 🚀 Next Steps

1. **Run setup:** `node setup.js`
2. **Try a simple task:** `node orchestrator.js "Write a hello world program"`
3. **Try a complex task:** `node orchestrator.js "Build a full-stack app"`
4. **Check output:** `ls output/`
5. **Read results:** `cat output/task-*/COMPLETE-OUTPUT.md`

## 🎉 You Now Have a Real Working System!

This orchestrator:
- ✅ Actually calls AI APIs
- ✅ Uses the 337 specialized agents
- ✅ Produces real, usable output
- ✅ Saves results to files
- ✅ Handles errors and retries
- ✅ Works with Claude, OpenAI, or Gemini

**Start building real projects with AI agents!** 🚀
