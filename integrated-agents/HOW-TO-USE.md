# 🎯 How to Use the Integrated Agents System

## What You Have

A **fully integrated AI agent platform** with:
- ✅ **337 specialized agents** (224 from agency-agents + 113 from Ruflo)
- ✅ **Master Orchestrator** that coordinates all agents autonomously
- ✅ **Professional React frontend** to browse and use agents
- ✅ **CLI tools** for automation
- ✅ **Complete integration** with Claude Code, Cursor, Copilot, and more

## 3 Ways to Use It

### 🚀 Method 1: Copy-Paste Prompt (Easiest)

1. Open `ACTIVATION-PROMPT.txt`
2. Copy the entire prompt
3. Paste into Claude Code, Cursor, or any AI tool
4. Add your task at the end
5. Press Enter

**Example:**
```
[Paste the activation prompt]

NOW ACTIVATE AUTONOMOUS MODE AND COMPLETE THIS TASK:
Build a React dashboard with dark theme and charts
```

The orchestrator will:
- Analyze your task
- Select the right agents
- Execute everything
- Notify you when done ✅

---

### 💻 Method 2: CLI Runner

```bash
cd integrated-agents
node run-task.js "YOUR TASK HERE"
```

**Examples:**
```bash
node run-task.js "Build a landing page"
node run-task.js "Fix security vulnerabilities"
node run-task.js "Create marketing content"
```

---

### 🎨 Method 3: Web UI (Visual Interface)

```bash
cd integrated-agents/frontend
npm install
npm run dev
```

Then open http://localhost:3000

**Features:**
- Browse all 337 agents
- Search and filter by category
- View agent details
- Chat interface to use agents
- View all 32 Ruflo plugins

---

## What Each Method Does

| Method | Best For | Setup Time | Autonomy |
|--------|----------|------------|----------|
| **Copy-Paste Prompt** | Quick tasks, one-off requests | 0 min | Full |
| **CLI Runner** | Automation, scripting, CI/CD | 0 min | Full |
| **Web UI** | Browsing agents, learning, visual interface | 2 min | Manual |

---

## Example Workflows

### 1. Build a Complete Web App

**Prompt:**
```
Build a SaaS landing page with:
- Hero section with CTA
- Features section with icons
- Pricing table (3 tiers)
- Testimonials carousel
- Contact form
- Dark theme
- Responsive design
- SEO optimized
```

**Agents Used:**
1. UI Designer → Design mockup
2. Frontend Developer → Implement React
3. SEO Specialist → Optimize meta tags
4. Ruflo Reviewer → Code review
5. Ruflo Tester → Generate tests
6. Performance Benchmarker → Optimize speed

**Output:**
- Complete React app
- All components
- Tests (90%+ coverage)
- Documentation
- Deployment instructions

---

### 2. Marketing Campaign

**Prompt:**
```
Create a 30-day TikTok marketing campaign for a fitness app:
- Research trending hashtags
- Write 30 video scripts
- Design thumbnail concepts
- Schedule posting times
- Set up analytics tracking
```

**Agents Used:**
1. TikTok Strategist → Trend research
2. Content Creator → Write scripts
3. Visual Storyteller → Design concepts
4. Growth Hacker → Viral strategy
5. Analytics Reporter → Set up tracking

**Output:**
- 30-day content calendar
- 30 video scripts
- Thumbnail designs
- Posting schedule
- Analytics dashboard

---

### 3. Security Audit

**Prompt:**
```
Audit my Node.js API for security vulnerabilities:
- Scan for CVEs
- Check authentication
- Review authorization
- Test for SQL injection
- Check for XSS
- Add security tests
```

**Agents Used:**
1. Security Engineer → Full audit
2. Backend Architect → Review architecture
3. Ruflo Coder → Fix vulnerabilities
4. Ruflo Tester → Add security tests
5. Technical Writer → Document fixes

**Output:**
- Security audit report
- All vulnerabilities fixed
- Security tests added
- Documentation updated

---

## File Structure

```
integrated-agents/
├── ORCHESTRATOR.md          ← Master orchestrator agent definition
├── ACTIVATION-PROMPT.txt    ← Copy-paste prompt for any AI tool
├── QUICK-START.md           ← Quick start guide
├── HOW-TO-USE.md           ← This file
├── run-task.js             ← CLI runner
├── agents/                 ← All 337 agents
│   ├── agency/            ← 224 agency agents
│   └── ruflo/             ← 113 ruflo agents
├── .claude/               ← Claude Code integration
│   └── agents/           ← Agents for Claude Code
├── frontend/             ← React web UI
│   ├── src/
│   ├── package.json
│   └── README.md
├── plugins/              ← 32 Ruflo plugins
├── scripts/              ← Utility scripts
└── docs/                 ← Documentation
```

---

## Agent Categories

### Agency Agents (224)

| Category | Count | Examples |
|----------|-------|----------|
| Engineering | 29 | Frontend Dev, Backend Architect, AI Engineer, DevOps, Security |
| Design | 8 | UI Designer, UX Researcher, Brand Guardian |
| Marketing | 30 | Growth Hacker, SEO, Content Creator, TikTok, LinkedIn |
| Sales | 8 | Outbound Strategist, Deal Strategist, Sales Engineer |
| Product | 5 | Product Manager, Sprint Prioritizer |
| Testing | 8 | API Tester, Performance Benchmarker, Accessibility |
| Finance | 5 | Financial Analyst, FP&A, Investment Research |
| Specialized | 40+ | MCP Builder, Compliance, Blockchain Security |
| Game Dev | 10+ | Godot, Roblox, Unity, Unreal, Blender |
| Spatial | 5 | visionOS, WebXR, XR Interface |
| Support | 6 | Analytics, Legal, Infrastructure |
| Academic | 5 | Anthropologist, Historian, Psychologist |
| Paid Media | 7 | PPC, Programmatic, Paid Social |
| Project Mgmt | 6 | Studio Producer, Jira Steward |

### Ruflo Agents (113)

| Category | Count | Purpose |
|----------|-------|---------|
| Core | 5 | Basic dev tasks (Coder, Planner, Reviewer, Tester) |
| Swarm | 3 | Multi-agent coordination |
| Hive Mind | 5 | Collective intelligence |
| GitHub | 13 | Repository operations |
| SPARC | 4 | Architecture methodology |
| Consensus | 7 | Distributed coordination |
| Goal | 3 | Goal planning and breakdown |
| Optimization | 5 | Performance tuning |
| Neural | 1 | Neural learning |
| SONA | 1 | Self-optimization |
| V3 | 10 | Next-gen agents |
| Templates | 9 | Reusable workflows |
| Testing | 4 | Test automation |
| Others | 43 | Specialized tasks |

---

## Tips for Best Results

### ✅ Be Specific
**Bad:** "Build a website"
**Good:** "Build a React landing page with dark theme, pricing table, and contact form"

### ✅ Include Requirements
**Bad:** "Create marketing content"
**Good:** "Create 10 LinkedIn posts about AI, each 150 words, with hashtags and CTAs"

### ✅ Specify Quality Standards
**Bad:** "Build an API"
**Good:** "Build a REST API with authentication, rate limiting, error handling, tests, and documentation"

### ✅ Let It Run Autonomously
Don't interrupt the orchestrator. It will:
- Make all decisions
- Handle errors
- Retry if needed
- Notify you when done

---

## Troubleshooting

### "No agents found"
```bash
# Verify agents are in place
ls -la .claude/agents/
# Should show 337+ files
```

### "Orchestrator not responding"
```bash
# Check if ORCHESTRATOR.md exists
cat ORCHESTRATOR.md

# Copy to Claude agents folder
cp ORCHESTRATOR.md .claude/agents/master-orchestrator.md
```

### "Frontend won't start"
```bash
cd frontend
npm install
npm run dev
```

### "Task failed"
- Check the error message
- Retry with more specific requirements
- Use verbose mode: `node run-task.js "task" --verbose`

---

## Next Steps

1. **Try a simple task:**
   ```
   node run-task.js "Build a simple React counter app"
   ```

2. **Browse all agents:**
   ```
   cat agents-overview.md
   ```

3. **Launch the web UI:**
   ```
   cd frontend && npm install && npm run dev
   ```

4. **Read the orchestrator docs:**
   ```
   cat ORCHESTRATOR.md
   ```

5. **Try a complex task:**
   ```
   Copy ACTIVATION-PROMPT.txt → Paste into Claude Code → Add your task
   ```

---

## Support & Resources

- **Quick Start**: `QUICK-START.md`
- **Activation Prompt**: `ACTIVATION-PROMPT.txt`
- **Orchestrator Docs**: `ORCHESTRATOR.md`
- **Agent Overview**: `agents-overview.md`
- **Frontend README**: `frontend/README.md`
- **Ruflo Docs**: `docs/USERGUIDE.md`

---

**You're all set! Pick a method above and start using your 337 AI agents. 🚀**
