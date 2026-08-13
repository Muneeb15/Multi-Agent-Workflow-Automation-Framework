# Integrated Agents — Unified AI Agent Platform

This is a fully integrated project combining **agency-agents** and **Ruflo** (formerly Claude Flow) into a single folder. All agents from both projects work together here.

---

## What's Inside

| Component | Source | What it gives you |
|-----------|--------|-------------------|
| `agents/agency/` | agency-agents | 200+ specialist agent personalities (markdown) |
| `agents/ruflo/` | Ruflo | 100+ orchestration & swarm agents |
| `.claude/agents/` | Both (merged) | All agents ready for Claude Code — ruflo originals + all agency categories |
| `plugins/` | Ruflo | 32 native Claude Code plugins |
| `v3/` | Ruflo v3 | Next-gen swarm architecture |
| `ruflo/` | Ruflo | Web UI, Docker, MCP server source |
| `integrations/` | agency-agents | Cursor, Copilot, Windsurf, Aider, Gemini CLI configs |
| `agency-scripts/` | agency-agents | install.sh, convert.sh for multi-tool deployment |
| `bin/` | Ruflo | CLI entry points |
| `scripts/` | Ruflo | Audit, verification, smoke test scripts |

---

## Quick Start

### Option 1 — Claude Code (Full Ruflo + All Agents)

```bash
# Install Ruflo CLI with all agents
npx ruflo@latest init wizard

# All 300+ agents are already in .claude/agents/ — Claude Code picks them up automatically
```

### Option 2 — Claude Code Plugin (Lite)

```bash
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-swarm@ruflo
```

### Option 3 — Other AI Tools (Cursor, Copilot, Windsurf, Aider, Gemini CLI)

```bash
# Generate integration files for all supported tools
./agency-scripts/convert.sh

# Install interactively (auto-detects what you have)
./agency-scripts/install.sh

# Or target a specific tool
./agency-scripts/install.sh --tool cursor
./agency-scripts/install.sh --tool copilot
./agency-scripts/install.sh --tool windsurf
./agency-scripts/install.sh --tool aider
./agency-scripts/install.sh --tool gemini-cli
```

### Option 4 — MCP Server

```bash
claude mcp add ruflo -- npx ruflo@latest mcp start
```

---

## Agent Categories

### From agency-agents (specialist personalities)

| Category | Folder | Agents |
|----------|--------|--------|
| Engineering | `.claude/agents/agency-engineering/` | Frontend, Backend, AI, DevOps, Security, SRE, Mobile, Embedded, Smart Contracts, and more |
| Design | `.claude/agents/agency-design/` | UI, UX, Brand, Visual Storytelling, Inclusive Visuals |
| Marketing | `.claude/agents/agency-marketing/` | SEO, TikTok, LinkedIn, Growth, Content, YouTube, Reddit |
| Sales | `.claude/agents/agency-sales/` | Outbound, Discovery, Deal Strategy, Pipeline, Proposals |
| Finance | `.claude/agents/agency-finance/` | Financial Analysis, FP&A, Investment Research, Tax |
| Product | `.claude/agents/agency-product/` | Product Manager, Sprint, Feedback, Trends |
| Testing | `.claude/agents/agency-testing/` | API, Performance, Accessibility, Reality Checker |
| Specialized | `.claude/agents/agency-specialized/` | MCP Builder, Compliance, Blockchain Audit, Orchestrator |
| Game Dev | `.claude/agents/agency-game-development/` | Godot, Roblox, Blender, Unity, Unreal |
| Spatial | `.claude/agents/agency-spatial-computing/` | visionOS, WebXR, Metal, XR Interface |
| Support | `.claude/agents/agency-support/` | Analytics, Finance Tracker, Legal Compliance |
| Academic | `.claude/agents/agency-academic/` | Anthropologist, Historian, Psychologist, Geographer |
| Paid Media | `.claude/agents/agency-paid-media/` | PPC, Programmatic, Paid Social, Tracking |
| Project Mgmt | `.claude/agents/agency-project-management/` | Studio Producer, Shepherd, Jira Steward |

### From Ruflo (orchestration & swarm agents)

| Category | Folder | Agents |
|----------|--------|--------|
| Core | `.claude/agents/core/` | Coder, Planner, Researcher, Reviewer, Tester |
| Swarm | `.claude/agents/swarm/` | Adaptive, Hierarchical, Mesh coordinators |
| Hive Mind | `.claude/agents/hive-mind/` | Queen, Scout, Worker, Memory Manager |
| GitHub | `.claude/agents/github/` | PR Manager, Release, Code Review Swarm, Issue Tracker |
| SPARC | `.claude/agents/sparc/` | Specification, Pseudocode, Architecture, Refinement |
| Consensus | `.claude/agents/consensus/` | Raft, Byzantine, Gossip, CRDT, Quorum |
| Goal | `.claude/agents/goal/` | Goal Planner, Code Goal Planner |
| Optimization | `.claude/agents/optimization/` | Load Balancer, Performance Monitor, Topology Optimizer |
| Neural | `.claude/agents/neural/` | SAFLA Neural agent |
| SONA | `.claude/agents/sona/` | Self-learning optimizer |
| Templates | `.claude/agents/templates/` | Swarm init, SPARC coder, Memory coordinator |
| V3 | `.claude/agents/v3/` | Queen Coordinator, Security Architect, Memory Specialist |

---

## How the Two Systems Work Together

```
You (Claude Code / CLI / Web UI)
        |
        v
  Ruflo Orchestration Layer
  (MCP Server, Router, 27 Hooks, Swarm)
        |
        v
  .claude/agents/ — ALL 300+ agents available
  ├── agency-engineering/    ← specialist personalities from agency-agents
  ├── agency-design/
  ├── agency-marketing/
  ├── agency-sales/
  ├── ... (all agency categories)
  ├── core/                  ← ruflo core agents
  ├── swarm/                 ← ruflo swarm coordinators
  ├── hive-mind/             ← ruflo hive mind
  ├── github/                ← ruflo github agents
  └── ... (all ruflo categories)
        |
        v
  Ruflo Memory & Learning
  (AgentDB, HNSW, SONA, ReasoningBank)
        |
        v
  LLM Providers
  (Claude, GPT, Gemini, Cohere, Ollama)
```

**Example workflow:**
- Ruflo's **Queen Coordinator** spawns a swarm
- Assigns the **Frontend Developer** (agency-agents) to build the UI
- Assigns the **Backend Architect** (agency-agents) to design the API
- Assigns the **Security Engineer** (agency-agents) to review both
- All agents share memory via AgentDB and learn from each run

---

## Ruflo Plugins (32 available)

```bash
/plugin install ruflo-core@ruflo        # Foundation
/plugin install ruflo-swarm@ruflo       # Multi-agent coordination
/plugin install ruflo-autopilot@ruflo   # Autonomous loop
/plugin install ruflo-agentdb@ruflo     # Vector memory
/plugin install ruflo-rag-memory@ruflo  # Smart retrieval
/plugin install ruflo-intelligence@ruflo # Self-learning
/plugin install ruflo-testgen@ruflo     # Auto test generation
/plugin install ruflo-security-audit@ruflo # CVE scanning
/plugin install ruflo-federation@ruflo  # Cross-machine agents
/plugin install ruflo-goals@ruflo       # Goal planning
/plugin install ruflo-docs@ruflo        # Auto documentation
/plugin install ruflo-sparc@ruflo       # 5-phase methodology
/plugin install ruflo-cost-tracker@ruflo # Token budget tracking
/plugin install ruflo-observability@ruflo # Logs, traces, metrics
```

---

## Web UI

- **Chat UI:** https://flo.ruv.io — multi-model chat with ~210 MCP tools
- **Goal Planner:** https://goal.ruv.io — plain-English goals → agent plans
- **Live Agents:** https://goal.ruv.io/agents — live agent dashboard

---

## License

Both projects are MIT licensed.
- agency-agents: [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)
- Ruflo: [ruvnet/ruflo](https://github.com/ruvnet/claude-flow)
