import { AGENTS, CATEGORIES, CATEGORY_BY_ID, PLATFORM_STATS, RUFLO_PLUGINS } from '../data/agents'

const PROJECT_CONTEXT = 'React + Vite + Tailwind CSS AI Agent Platform frontend'

const TASK_SIGNALS = [
  {
    id: 'frontend',
    words: ['ui', 'frontend', 'react', 'tailwind', 'component', 'page', 'screen', 'layout', 'dashboard', 'browser', 'responsive', 'mobile'],
    agents: ['frontend-dev', 'ui-designer', 'design-system-architect', 'accessibility-auditor'],
    plugins: ['ruflo-browser', 'ruflo-promptlab', 'ruflo-evals'],
    output: 'production-ready UI plan with components, states, responsive behavior, and implementation steps',
  },
  {
    id: 'quality',
    words: ['test', 'bug', 'error', 'console', 'qa', 'verify', 'build', 'fix', 'broken', 'audit'],
    agents: ['qa-orchestrator', 'api-tester', 'ruflo-tester', 'ruflo-reviewer'],
    plugins: ['ruflo-testgen', 'ruflo-browser', 'ruflo-evals', 'ruflo-observability'],
    output: 'test checklist, bug-risk map, verification commands, and expected pass/fail signals',
  },
  {
    id: 'product',
    words: ['feature', 'product', 'roadmap', 'mvp', 'workflow', 'use', 'user', 'agent', 'automatic', 'perfect', 'launch'],
    agents: ['product-manager', 'user-story-analyst', 'delivery-manager', 'goal-decomposer'],
    plugins: ['ruflo-goals', 'ruflo-workflow', 'ruflo-consensus'],
    output: 'prioritized product plan with user stories, acceptance criteria, and delivery sequence',
  },
  {
    id: 'ai',
    words: ['ai', 'llm', 'prompt', 'agent', 'agents', 'automation', 'auto', 'orchestrate', 'chat', 'output'],
    agents: ['ai-engineer', 'prompt-optimizer', 'queen-coordinator', 'adaptive-coordinator', 'neural-memory-curator'],
    plugins: ['ruflo-swarm', 'ruflo-autopilot', 'ruflo-agentdb', 'ruflo-rag-memory', 'ruflo-neural'],
    output: 'automatic agent routing plan with selected agents, generated response structure, and next automation layer',
  },
  {
    id: 'security',
    words: ['security', 'privacy', 'auth', 'key', 'token', 'safe', 'policy', 'compliance', 'permission'],
    agents: ['security-engineer', 'data-privacy-advisor', 'ruflo-reviewer'],
    plugins: ['ruflo-security-audit', 'ruflo-secrets', 'ruflo-policy', 'ruflo-sandbox'],
    output: 'security/privacy checklist with risks, controls, and safe implementation guidance',
  },
  {
    id: 'docs',
    words: ['readme', 'docs', 'document', 'explain', 'write', 'guide', 'how to', 'instructions'],
    agents: ['technical-writer', 'knowledge-base-curator', 'product-manager'],
    plugins: ['ruflo-docs', 'ruflo-promptlab'],
    output: 'clear documentation, usage guide, and copy-ready explanation',
  },
  {
    id: 'notifications',
    words: ['notify', 'notification', 'email', 'popup', 'alert', 'complete', 'completed', 'done'],
    agents: ['delivery-manager', 'support-triage', 'customer-success-copilot', 'ruflo-planner'],
    plugins: ['ruflo-scheduler', 'ruflo-workflow', 'ruflo-observability', 'ruflo-telemetry'],
    output: 'task completion notification workflow with in-app popup, email payload, and delivery status',
  },
]

const DEFAULT_AGENT_IDS = ['queen-coordinator', 'product-manager', 'frontend-dev', 'ai-engineer', 'qa-orchestrator']
const DEFAULT_PLUGIN_IDS = ['ruflo-swarm', 'ruflo-workflow', 'ruflo-browser', 'ruflo-testgen', 'ruflo-evals']

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ')
}

function uniq(items) {
  return Array.from(new Set(items)).filter(Boolean)
}

function findById(collection, id) {
  return collection.find((item) => item.id === id)
}

function scoreSignals(task) {
  const normalized = normalize(task)
  return TASK_SIGNALS.map((signal) => {
    const score = signal.words.reduce((total, word) => {
      if (normalized.includes(word)) return total + 1
      return total
    }, 0)

    return { ...signal, score }
  }).sort((a, b) => b.score - a.score)
}

function selectAgents(task, selectedAgent) {
  const signals = scoreSignals(task)
  const matchedSignals = signals.filter((signal) => signal.score > 0)
  const agentIds = uniq([
    selectedAgent?.id,
    ...matchedSignals.flatMap((signal) => signal.agents),
    ...DEFAULT_AGENT_IDS,
  ])

  return {
    signals: matchedSignals.length > 0 ? matchedSignals : signals.slice(0, 2),
    agents: agentIds.map((id) => findById(AGENTS, id)).filter(Boolean).slice(0, 6),
  }
}

function selectPlugins(signals) {
  const pluginIds = uniq([...signals.flatMap((signal) => signal.plugins), ...DEFAULT_PLUGIN_IDS])
  return pluginIds.map((id) => findById(RUFLO_PLUGINS, id)).filter(Boolean).slice(0, 6)
}

function buildAgentNetwork(agents, plugins, signals) {
  const categoryCoverage = CATEGORIES.map((category) => {
    const count = AGENTS.filter((agent) => agent.category === category.id).length

    return {
      id: category.id,
      label: category.label,
      source: category.source,
      initials: category.initials,
      count,
    }
  }).filter((category) => category.count > 0)

  const sourceCoverage = [
    { label: 'Agency agents', count: AGENTS.filter((agent) => agent.source === 'agency').length },
    { label: 'Ruflo agents', count: AGENTS.filter((agent) => agent.source === 'ruflo').length },
  ]

  return {
    enabled: true,
    routingMode: 'All-agent autopilot with focused execution team',
    totalPlatformAgents: PLATFORM_STATS.totalAgents,
    indexedAgents: PLATFORM_STATS.indexedAgents,
    agencyAgents: PLATFORM_STATS.agencyAgents,
    rufloAgents: PLATFORM_STATS.rufloAgents,
    plugins: PLATFORM_STATS.plugins,
    categoryCount: categoryCoverage.length,
    categoryCoverage,
    sourceCoverage,
    selectedTeam: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      category: CATEGORY_BY_ID[agent.category]?.label || agent.category,
    })),
    selectedPlugins: plugins.map((plugin) => ({
      id: plugin.id,
      name: plugin.name,
      category: plugin.category,
    })),
    matchedSignals: signals.map((signal) => signal.id),
    summary: `The full ${PLATFORM_STATS.totalAgents}-agent platform catalog is enabled. This run routes through ${PLATFORM_STATS.indexedAgents} detailed local profiles and all ${PLATFORM_STATS.plugins} Ruflo plugins, then selects the strongest execution team for the idea.`,
  }
}

function inferDeliverables(task, signals) {
  const outputs = uniq(signals.map((signal) => signal.output))
  const normalized = normalize(task)

  if (normalized.includes('code') || normalized.includes('build') || normalized.includes('implement')) {
    outputs.unshift('implementation-ready file/change plan')
  }
  if (normalized.includes('test') || normalized.includes('verify')) {
    outputs.unshift('verification checklist and browser/build test plan')
  }
  if (normalized.includes('design') || normalized.includes('ui')) {
    outputs.unshift('polished UI direction with exact components and states')
  }

  return uniq(outputs).slice(0, 5)
}

function buildSteps(task, agents, plugins) {
  const leadAgent = agents[0]
  const reviewer = agents.find((agent) => agent.id.includes('reviewer') || agent.category === 'testing') || agents[agents.length - 1]
  const browserPlugin = plugins.find((plugin) => plugin.id === 'ruflo-browser')

  return [
    `${leadAgent.name} reads the task and turns it into the first concrete deliverable for ${PROJECT_CONTEXT}.`,
    `${agents.slice(1, 4).map((agent) => agent.name).join(', ')} handle specialist passes so the answer is not one-dimensional.`,
    `${reviewer.name} checks the result for missing states, risks, and unclear next actions.`,
    browserPlugin ? `${browserPlugin.name} is the right plugin to visually verify pages, routes, and responsive behavior.` : 'Run a browser verification pass before considering the task done.',
  ]
}

function buildUsefulForProject(agents, plugins) {
  return [
    `Use ${agents[0].name} as the lead worker for the current task.`,
    `Use ${agents.slice(1, 4).map((agent) => agent.name).join(', ')} as supporting reviewers/specialists.`,
    `Use ${plugins.slice(0, 3).map((plugin) => plugin.name).join(', ')} when this becomes a real backend automation.`,
    'Use the all-agent network when the idea crosses engineering, product, design, QA, security, marketing, support, or Ruflo automation work.',
    'Use completion notifications so the user sees the finished result in-app and has an email handoff ready.',
    'For this frontend today, the app can auto-route and produce structured outputs locally; real AI execution needs a backend/API key later.',
  ]
}

function buildExecutionPhases(task, agents, plugins, deliverables) {
  const lead = agents[0]
  const builder = agents.find((agent) => agent.id === 'frontend-dev' || agent.id === 'ruflo-coder') || agents[1] || lead
  const product = agents.find((agent) => agent.category === 'product' || agent.id === 'product-manager') || agents[2] || lead
  const qa = agents.find((agent) => agent.category === 'testing' || agent.id === 'ruflo-tester') || agents[agents.length - 1]
  const browser = plugins.find((plugin) => plugin.id === 'ruflo-browser') || plugins[0]

  return [
    {
      title: 'Understand idea',
      owner: lead.name,
      status: 'completed',
      output: `Converted the idea into a task for ${PROJECT_CONTEXT}.`,
      actions: ['Identify intent', 'Detect best categories', 'Select lead agent'],
    },
    {
      title: 'Plan product flow',
      owner: product.name,
      status: 'completed',
      output: 'Created the feature direction, user journey, and acceptance criteria.',
      actions: ['Define workflow', 'Choose output format', 'Set success checks'],
    },
    {
      title: 'Build solution',
      owner: builder.name,
      status: 'completed',
      output: `Prepared the implementation direction for: ${deliverables.slice(0, 2).join(', ')}.`,
      actions: ['Map components', 'Plan state', 'Prepare UI behavior'],
    },
    {
      title: 'Verify quality',
      owner: qa.name,
      status: 'completed',
      output: `${browser.name} should verify routes, layout, console errors, and responsive behavior.`,
      actions: ['Run build', 'Check browser', 'Review edge states'],
    },
  ]
}

function buildAcceptanceChecks(signals) {
  const checks = [
    'User can type one idea and receive an automatic agent team.',
    'The full platform network stays enabled while the task gets a focused execution team.',
    'Completed tasks create an in-app notification and an email-ready payload.',
    'Output includes selected agents, useful plugins, execution phases, and next actions.',
    'Composer stays visible without scrolling.',
    'Result explains what is useful for this project.',
  ]

  if (signals.some((signal) => signal.id === 'frontend')) {
    checks.push('UI has responsive desktop and mobile states.')
  }
  if (signals.some((signal) => signal.id === 'quality')) {
    checks.push('Build/test verification steps are included.')
  }
  if (signals.some((signal) => signal.id === 'security')) {
    checks.push('Security and privacy risks are called out before implementation.')
  }

  return checks
}

function isAppBuildRequest(task) {
  const normalized = normalize(task)
  const buildWords = ['make', 'build', 'create', 'generate', 'develop', 'complete']
  const appWords = ['app', 'application', 'website', 'dashboard', 'platform', 'tool', 'system', 'project']

  return buildWords.some((word) => normalized.includes(word)) && appWords.some((word) => normalized.includes(word))
}

function inferAppName(task) {
  const normalized = task.trim()
  if (!normalized) return 'Generated Agent App'
  if (normalize(normalized).includes('agent')) return 'Autonomous Agent Platform'
  if (normalize(normalized).includes('dashboard')) return 'AI Operations Dashboard'
  if (normalize(normalized).includes('shop')) return 'Commerce Assistant App'
  if (normalize(normalized).includes('chat')) return 'AI Chat Workspace'
  return 'Generated Product App'
}

function buildGeneratedApp(task, agents, plugins) {
  const name = inferAppName(task)

  return {
    name,
    summary: `A complete React + Vite + Tailwind app generated from the idea: "${task}".`,
    type: 'Frontend app package',
    features: [
      `All-agent routing across the ${PLATFORM_STATS.totalAgents}-agent platform catalog`,
      'Idea intake with automatic agent routing',
      'Cursor-style AI command composer',
      'Task completion notifications with in-app popup and email handoff',
      'Agent/team selection and plugin recommendation',
      'Autopilot project run with progress, phases, owners, and acceptance checks',
      'Responsive desktop and mobile workspace',
      'Build verification and browser-ready output',
    ],
    screens: [
      'Dashboard for status, stats, and quick launch',
      'Agent Browser for search and filtering',
      'Agent Detail for specialist profiles',
      'Plugins page for Ruflo capabilities',
      'Autopilot Chat for idea-to-app execution',
    ],
    fileStructure: [
      { path: 'src/App.jsx', purpose: 'Routes and app shell' },
      { path: 'src/pages/ChatPage.jsx', purpose: 'Autopilot chat and app-building workflow' },
      { path: 'src/lib/agentOrchestrator.js', purpose: 'Local agent selection, plugin selection, and generated app package logic' },
      { path: 'src/data/agents.js', purpose: 'Agent, category, and plugin catalog' },
      { path: 'src/index.css', purpose: 'Dark Cursor-style visual system' },
    ],
    implementationPackage: [
      `${agents[0].name} leads the app build from idea to project run.`,
      `${agents.slice(1, 4).map((agent) => agent.name).join(', ')} cover product, UI, automation, and QA gaps.`,
      `${plugins.slice(0, 4).map((plugin) => plugin.name).join(', ')} define the future real automation layer.`,
    ],
    runCommands: ['npm install', 'npm run dev', 'npm run build'],
    verification: [
      'Every main route loads without console errors.',
      'Chat composer stays visible while work output scrolls independently.',
      'Typing an app idea returns a completed app package.',
      'Production build succeeds.',
    ],
  }
}

function buildProjectDeliverables(task, deliverables) {
  return [
    {
      title: 'All-agent autopilot',
      detail: 'The full platform catalog stays enabled and the best specialists are routed into the current run automatically.',
    },
    {
      title: 'Automatic agent team',
      detail: 'The app chooses the best agents for the idea instead of making you browse manually.',
    },
    {
      title: 'Execution plan',
      detail: 'The output shows phases, owners, and what each agent contributes.',
    },
    {
      title: 'Useful plugins',
      detail: 'The output lists the Ruflo plugins that matter for building, testing, memory, and automation.',
    },
    {
      title: 'Completion notification',
      detail: 'When the task finishes, the app can show a popup and prepare an email-ready completion message.',
    },
    {
      title: 'Copy-ready command',
      detail: 'You get a clear instruction you can paste into Cursor, Codex, or a future backend worker.',
    },
    {
      title: 'Project-specific result',
      detail: deliverables[0] || `A practical result for: ${task}`,
    },
  ]
}

function formatAgent(agent, index) {
  const category = CATEGORY_BY_ID[agent.category]?.label || agent.category
  return `${index + 1}. ${agent.name} (${category}) - ${agent.useCase}`
}

function formatPlugin(plugin, index) {
  return `${index + 1}. ${plugin.name} - ${plugin.description}`
}

export function createAutomaticAgentRun({ task, selectedAgent, mode = 'agent', attachments = [] }) {
  const { signals, agents } = selectAgents(task, selectedAgent)
  const plugins = selectPlugins(signals)
  const agentNetwork = buildAgentNetwork(agents, plugins, signals)
  const deliverables = inferDeliverables(task, signals)
  const appBuild = isAppBuildRequest(task)
  const generatedApp = appBuild ? buildGeneratedApp(task, agents, plugins) : null
  const finalDeliverables = appBuild ? uniq(['complete generated app package', ...deliverables]) : deliverables
  const steps = buildSteps(task, agents, plugins)
  const useful = buildUsefulForProject(agents, plugins)
  const phases = buildExecutionPhases(task, agents, plugins, finalDeliverables)
  const acceptanceChecks = buildAcceptanceChecks(signals)
  const projectDeliverables = buildProjectDeliverables(task, finalDeliverables)
  const modeLabel = mode === 'edit' ? 'implementation/edit' : mode === 'ask' ? 'answer/explain' : 'automatic agent team'
  const attachmentText = attachments.length > 0 ? `\nAttached context: ${attachments.join(', ')}` : ''
  const copyReadyInstruction = `Start an autonomous run for this ${PROJECT_CONTEXT} task. Route across the ${agentNetwork.totalPlatformAgents}-agent platform catalog and all ${agentNetwork.plugins} Ruflo plugins, use ${agents.map((agent) => agent.name).join(' + ')} as the focused execution team, produce ${finalDeliverables.join(', ')}, then verify with ${plugins.slice(0, 3).map((plugin) => plugin.name).join(', ')}.`

  return {
    agents,
    plugins,
    run: {
      title: 'Autopilot project run',
      status: 'completed',
      progress: 100,
      mode: modeLabel,
      task,
      deliverables: projectDeliverables,
      phases,
      acceptanceChecks,
      useful,
      copyReadyInstruction,
      generatedApp,
      agentNetwork,
    },
    text: `Auto-run: ${modeLabel}

Task understood:
${task}${attachmentText}

All-agent network:
- ${agentNetwork.totalPlatformAgents} platform agents enabled
- ${agentNetwork.indexedAgents} detailed local agent profiles routed automatically
- ${agentNetwork.plugins} Ruflo plugins available for execution, QA, memory, browser checks, and automation
- ${agentNetwork.categoryCount} categories covered across agency and Ruflo sources

What this gives you:
${finalDeliverables.map((item) => `- ${item}`).join('\n')}

Agents selected automatically:
${agents.map(formatAgent).join('\n')}

Useful plugins for this project:
${plugins.map(formatPlugin).join('\n')}

How the system will work:
${steps.map((step) => `- ${step}`).join('\n')}

Best next output for this task:
- A finished task run that starts from the idea
- A clear implementation plan
- The exact agents involved
- The useful plugins
- A verification checklist
- A copy-ready instruction you can run in Cursor/Codex

Copy-ready instruction:
"${copyReadyInstruction}"

What is useful right now:
${useful.map((item) => `- ${item}`).join('\n')}`,
  }
}
