# 🚀 Quick Start — Autonomous Agent System

## What This Is

A **fully autonomous AI agent orchestration system** with 337 specialized agents that can complete any task end-to-end without human intervention.

## How It Works

```
YOU → Give a task → MASTER ORCHESTRATOR → Selects agents → Executes → Notifies you ✅
```

## Installation

```bash
cd integrated-agents

# Install Ruflo (the orchestration engine)
npx ruflo@latest init

# Or use the CLI runner (no install needed)
node run-task.js "YOUR TASK"
```

## Usage

### Method 1: CLI Runner (Simplest)

```bash
node run-task.js "Build a React dashboard with dark theme"
```

The orchestrator will:
1. ✅ Analyze the task
2. ✅ Select the right agents
3. ✅ Execute everything
4. ✅ Notify you when done

### Method 2: Claude Code Integration

```bash
# Copy orchestrator to Claude agents folder
cp ORCHESTRATOR.md .claude/agents/master-orchestrator.md

# Then in Claude Code chat:
"Activate Master Orchestrator and complete this task: Build a landing page"
```

### Method 3: Ruflo CLI

```bash
# Spawn the orchestrator agent
npx ruflo agent spawn master-orchestrator --task "YOUR TASK" --autonomous

# Or use swarm mode for complex tasks
npx ruflo swarm init --queen master-orchestrator --task "YOUR TASK"
```

## Example Tasks

### Web Development
```bash
node run-task.js "Build a SaaS landing page with pricing table"
node run-task.js "Create a React dashboard with charts and tables"
node run-task.js "Build a REST API with authentication"
```

### Marketing
```bash
node run-task.js "Create a 30-day TikTok content calendar"
node run-task.js "Write SEO-optimized blog posts about AI"
node run-task.js "Design a social media campaign for product launch"
```

### Security & DevOps
```bash
node run-task.js "Audit codebase for security vulnerabilities"
node run-task.js "Set up CI/CD pipeline with GitHub Actions"
node run-task.js "Optimize database queries and add indexes"
```

### Design
```bash
node run-task.js "Create a design system with components"
node run-task.js "Design a mobile app UI with Figma"
node run-task.js "Build a brand identity with logo and colors"
```

## What You Get

After the orchestrator completes your task:

```
✅ TASK COMPLETE!

📦 Deliverables:
   • All code files
   • Documentation
   • Tests (with 90%+ coverage)
   • Deployment instructions

🎯 Agents Used: 6-12 (automatically selected)
⏱️  Time: 5-15 minutes (depending on complexity)
📊 Quality: A+ (code review + tests + security scan)
```

## Available Agents (337 Total)

### Agency Agents (224)
- **Engineering**: Frontend, Backend, AI, DevOps, Security, Mobile, Database, SRE
- **Design**: UI, UX, Brand, Visual Storytelling
- **Marketing**: Growth, SEO, Content, Social Media, TikTok, LinkedIn
- **Sales**: Outbound, Deal Strategy, Sales Engineering
- **Product**: PM, Sprint Planning, Feedback Analysis
- **Testing**: API, Performance, Accessibility, Security
- **Finance**: Financial Analysis, FP&A, Investment Research
- **Specialized**: MCP Builder, Compliance, Blockchain Security
- **Game Dev**: Godot, Roblox, Unity, Unreal, Blender
- **Spatial**: visionOS, WebXR, XR Interface
- **Support**: Analytics, Legal, Infrastructure
- **Academic**: Anthropology, History, Psychology
- **Paid Media**: PPC, Programmatic, Paid Social
- **Project Management**: Studio Producer, Jira Steward

### Ruflo Agents (113)
- **Core**: Coder, Planner, Researcher, Reviewer, Tester
- **Swarm**: Adaptive, Hierarchical, Mesh coordinators
- **Hive Mind**: Queen, Scout, Worker, Memory Manager
- **GitHub**: PR Manager, Release Manager, Code Review Swarm
- **SPARC**: Specification, Architecture, Pseudocode, Refinement
- **Consensus**: Raft, Byzantine, Gossip, CRDT, Quorum
- **Goal**: Goal Planner, Code Goal Planner
- **Optimization**: Load Balancer, Performance Monitor
- **Neural**: SAFLA Neural, SONA Learning
- **V3**: Queen Coordinator, Security Architect, Memory Specialist

## Orchestrator Features

### ✅ Fully Autonomous
- No human intervention needed
- Makes all decisions automatically
- Handles errors and retries

### ✅ Intelligent Agent Selection
- Analyzes task requirements
- Selects optimal agents from 337 available
- Coordinates multi-agent workflows

### ✅ Quality Assurance
- Automatic code review
- Test generation and execution
- Security scanning
- Performance optimization

### ✅ Progress Tracking
- Real-time status updates
- Phase-by-phase execution
- Error handling and recovery

### ✅ Comprehensive Delivery
- Complete source code
- Documentation
- Tests
- Deployment instructions

## Configuration

### Customize Agent Selection

Edit `ORCHESTRATOR.md` to change agent selection rules:

```markdown
**Selection Rules:**
- Use Ruflo Core for standard dev tasks
- Use Agency specialists for domain work
- Use Ruflo Swarm for multi-agent coordination
```

### Set Execution Preferences

```bash
# Fast mode (fewer agents, quicker)
node run-task.js "YOUR TASK" --mode fast

# Quality mode (more agents, thorough)
node run-task.js "YOUR TASK" --mode quality

# Autonomous mode (no confirmations)
node run-task.js "YOUR TASK" --autonomous
```

## Troubleshooting

### "Agent not found"
```bash
# Verify all agents are in place
ls -la .claude/agents/

# Should show 337 agent files
```

### "Ruflo not installed"
```bash
# Install Ruflo
npx ruflo@latest init

# Verify installation
npx ruflo --version
```

### "Task failed"
```bash
# Check logs
cat .claude/logs/orchestrator.log

# Retry with verbose mode
node run-task.js "YOUR TASK" --verbose
```

## Advanced Usage

### Chain Multiple Tasks

```bash
# Task 1: Build frontend
node run-task.js "Build React dashboard"

# Task 2: Build backend (uses output from task 1)
node run-task.js "Build API for the dashboard"

# Task 3: Deploy both
node run-task.js "Deploy frontend and backend to AWS"
```

### Use Specific Agents

```bash
# Force use of specific agents
node run-task.js "Build landing page" --agents "UI Designer,Frontend Developer,SEO Specialist"
```

### Save Workflow for Reuse

```bash
# Save the agent selection and workflow
node run-task.js "Build SaaS landing page" --save-workflow landing-page.json

# Reuse the workflow
node run-task.js "Build another landing page" --workflow landing-page.json
```

## Integration with Existing Tools

### VS Code
```json
// .vscode/tasks.json
{
  "label": "Run Orchestrator",
  "type": "shell",
  "command": "node run-task.js '${input:task}'"
}
```

### GitHub Actions
```yaml
# .github/workflows/orchestrator.yml
- name: Run Orchestrator
  run: node run-task.js "${{ github.event.inputs.task }}"
```

### Slack Bot
```javascript
// Post task to Slack, orchestrator executes, posts results back
slack.command('/agent', async ({ command, ack, say }) => {
  await ack()
  const result = await runOrchestrator(command.text)
  await say(`✅ Task complete! ${result}`)
})
```

## Next Steps

1. **Try it out**: `node run-task.js "Build a simple React app"`
2. **Browse agents**: `cat agents-overview.md`
3. **Read orchestrator docs**: `cat ORCHESTRATOR.md`
4. **Explore Ruflo**: `npx ruflo --help`
5. **Join community**: [Discord](https://discord.com/invite/dfxmpwkG2D)

## Support

- **Documentation**: `./docs/`
- **Examples**: `./agents/agency/examples/`
- **Issues**: [GitHub Issues](https://github.com/ruvnet/ruflo/issues)
- **Community**: [Discord](https://discord.com/invite/dfxmpwkG2D)

---

**You now have a fully autonomous AI agent system. Just give it a task and let it work. 🚀**
