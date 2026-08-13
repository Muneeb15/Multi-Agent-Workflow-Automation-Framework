import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AtSign,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Bell,
  FileCode2,
  Layers3,
  Loader2,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  ClipboardList,
  Search,
  Send,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { AGENTS, CATEGORY_BY_ID, PLATFORM_STATS } from '../data/agents'
import { createAutomaticAgentRun } from '../lib/agentOrchestrator'
import { createOfflineRunnerResult, runLocalTask } from '../lib/localTaskRunner'
import {
  createTaskCompletionNotice,
  getBrowserNotificationPermission,
  getStoredNotificationEmail,
  requestBrowserNotificationPermission,
  sendBrowserCompletionNotification,
  storeNotificationEmail,
} from '../lib/notificationService'

const starterPrompts = ['Make this automatic', 'Build the next feature', 'Test and improve']
const chatModes = [
  { id: 'auto', label: 'Auto', icon: Bot },
  { id: 'ask', label: 'Ask', icon: Sparkles },
  { id: 'edit', label: 'Build', icon: Code2 },
]

function attachWorkerResult(run, workerResult) {
  const workerCheck =
    workerResult.status === 'completed'
      ? 'Local agent runner wrote project files to disk.'
      : 'Local runner needs npm run dev:full before it can write files.'

  return {
    ...run,
    workerResult,
    acceptanceChecks: Array.from(new Set([...run.acceptanceChecks, workerCheck])),
  }
}

function appendWorkerOutput(text, workerResult) {
  if (workerResult.status !== 'completed') {
    return `${text}

Local code-writing worker:
- Status: offline
- ${workerResult.error}
- Start the full system with npm run dev:full`
  }

  return `${text}

Local code-writing worker:
- Status: completed
- Project: ${workerResult.projectName}
- Output folder: ${workerResult.relativeOutputDir}
- Files written: ${workerResult.files.map((file) => file.path).join(', ')}
- Run commands: ${workerResult.commands.join(' -> ')}`
}

function createProgressRun(run, progress) {
  const phaseCount = run.phases.length
  const activeIndex = progress >= 100 ? phaseCount : Math.max(0, Math.floor((progress / 100) * phaseCount))

  return {
    ...run,
    progress,
    status: progress >= 100 ? 'completed' : 'working',
    phases: run.phases.map((phase, index) => {
      if (progress >= 100 || index < activeIndex) return { ...phase, status: 'completed' }
      if (index === activeIndex) return { ...phase, status: 'working' }
      return { ...phase, status: 'pending' }
    }),
  }
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialAgent = AGENTS.find((agent) => agent.id === searchParams.get('agent')) || AGENTS[0]
  const [selectedAgent, setSelectedAgent] = useState(initialAgent)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isResponding, setIsResponding] = useState(false)
  const [copied, setCopied] = useState(false)
  const [systemOpen, setSystemOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notificationEmail, setNotificationEmail] = useState(() => getStoredNotificationEmail())
  const [browserPermission, setBrowserPermission] = useState(() => getBrowserNotificationPermission())
  const [activeMode, setActiveMode] = useState('auto')
  const [attachedFiles, setAttachedFiles] = useState([])
  const [agentRailOpen, setAgentRailOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const messagesEndRef = useRef(null)
  const composerRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleChange = (event) => setAgentRailOpen(event.matches)

    handleChange(mediaQuery)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const agentFromUrl = AGENTS.find((agent) => agent.id === searchParams.get('agent'))
    if (agentFromUrl && agentFromUrl.id !== selectedAgent.id) {
      setSelectedAgent(agentFromUrl)
      setMessages([])
      setSystemOpen(false)
    }
  }, [searchParams, selectedAgent.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [messages, isResponding, selectedAgent.id])

  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return

    composer.style.height = 'auto'
    composer.style.height = `${Math.min(composer.scrollHeight, 112)}px`
  }, [message])

  useEffect(() => {
    storeNotificationEmail(notificationEmail)
  }, [notificationEmail])

  const filteredAgents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return AGENTS.filter((agent) => {
      if (!normalizedSearch) return true
      return [agent.name, agent.category, agent.description, ...agent.tags].join(' ').toLowerCase().includes(normalizedSearch)
    })
  }, [search])

  const category = CATEGORY_BY_ID[selectedAgent.category]
  const systemPrompt = `You are ${selectedAgent.name}.

${selectedAgent.description}

Expertise: ${selectedAgent.tags.join(', ')}

Use case: ${selectedAgent.useCase}

Respond as a specialized ${category?.label || selectedAgent.category} agent. Be concise, practical, and explicit about assumptions.`
  const activeModeLabel = chatModes.find((mode) => mode.id === activeMode)?.label || 'Agent'
  const contextChips = [category?.label || selectedAgent.category, ...selectedAgent.tags.slice(0, 2), ...attachedFiles]

  const chooseAgent = (agent) => {
    setSelectedAgent(agent)
    setMessages([])
    setAttachedFiles([])
    setSystemOpen(false)
    setSearchParams({ agent: agent.id }, { replace: true })
  }

  const copySystemPrompt = async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt)
    } catch {
      // Clipboard can be unavailable in embedded preview contexts.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const requestBrowserNotifications = async () => {
    const permission = await requestBrowserNotificationPermission()
    setBrowserPermission(permission)
  }

  const dismissNotification = (noticeId) => {
    setNotifications((current) => current.filter((notice) => notice.id !== noticeId))
  }

  const completeTaskWithNotification = ({ task, agent, run }) => {
    const completedRun = createProgressRun(run, 100)
    const notice = createTaskCompletionNotice({
      task,
      agent,
      run: completedRun,
      email: notificationEmail,
    })

    setNotifications((current) => [notice, ...current].slice(0, 4))
    sendBrowserCompletionNotification(notice)
  }

  const sendCurrentMessage = () => {
    const trimmed = message.trim()
    if (!trimmed || isResponding) return

    const currentAgent = selectedAgent
    const currentAttachments = attachedFiles
    const run = createAutomaticAgentRun({
      task: trimmed,
      selectedAgent: currentAgent,
      mode: activeMode,
      attachments: currentAttachments,
    })
    const workerPromise = runLocalTask({
      task: trimmed,
      agent: {
        id: currentAgent.id,
        name: currentAgent.name,
        initials: currentAgent.initials,
        category: currentAgent.category,
        tags: currentAgent.tags,
      },
      mode: activeMode,
      attachments: currentAttachments,
      email: notificationEmail,
    }).catch(createOfflineRunnerResult)
    const agentMessageId = `agent-${Date.now()}`
    const userMessage = { id: `user-${Date.now()}`, role: 'user', content: trimmed }
    const workingMessage = {
      id: agentMessageId,
      role: 'agent',
      content: 'Starting autopilot run...',
      agents: run.agents,
      plugins: run.plugins,
      run: createProgressRun(run.run, 16),
      isRunning: true,
    }

    setMessages((current) => [...current, userMessage, workingMessage])
    setMessage('')
    setAttachedFiles([])
    setIsResponding(true)

    const progressUpdates = [
      { progress: 38, label: 'Planning product flow...' },
      { progress: 64, label: 'Writing project files with local runner...' },
      { progress: 86, label: 'Verifying output and preparing notification...' },
    ]

    progressUpdates.forEach((update, index) => {
      window.setTimeout(() => {
        setMessages((current) =>
          current.map((item) =>
            item.id === agentMessageId
              ? {
                  ...item,
                  content: update.label,
                  run: createProgressRun(run.run, update.progress),
                  isRunning: update.progress < 100,
                }
              : item,
          ),
        )

      }, 450 + index * 520)
    })

    window.setTimeout(async () => {
      const workerResult = await workerPromise
      const completedRun = attachWorkerResult(run.run, workerResult)
      const completedText = appendWorkerOutput(run.text, workerResult)

      setMessages((current) =>
        current.map((item) =>
          item.id === agentMessageId
            ? {
                ...item,
                content: completedText,
                run: createProgressRun(completedRun, 100),
                isRunning: false,
              }
            : item,
        ),
      )

      completeTaskWithNotification({ task: trimmed, agent: currentAgent, run: completedRun })
      setIsResponding(false)
    }, 450 + progressUpdates.length * 520)
  }

  const sendMessage = (event) => {
    event.preventDefault()
    sendCurrentMessage()
  }

  const clearConversation = () => {
    setMessages([])
    setMessage('')
    setAttachedFiles([])
    setIsResponding(false)
  }

  const insertContextMention = () => {
    setMessage((current) => `${current}${current.endsWith(' ') || current.length === 0 ? '' : ' '}@${selectedAgent.name} `)
    window.requestAnimationFrame(() => composerRef.current?.focus())
  }

  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files || []).map((file) => file.name)
    if (files.length > 0) {
      setAttachedFiles((current) => Array.from(new Set([...current, ...files])).slice(0, 4))
    }
    event.target.value = ''
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendCurrentMessage()
    }
  }

  return (
    <div
      className={`grid h-[calc(100vh-6.5rem)] min-h-[620px] gap-4 animate-fade-in ${
        agentRailOpen ? 'grid-rows-[210px_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)] lg:grid-rows-1' : 'grid-rows-[minmax(0,1fr)]'
      }`}
    >
      {notifications.length > 0 && (
        <div className="fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
          {notifications.slice(0, 3).map((notice) => (
            <div key={notice.id} className="glass border-emerald-400/25 bg-surface-800/95 p-3 shadow-glow animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-400/10 text-xs font-bold text-emerald-200">
                  {notice.agentInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Bell size={15} className="text-emerald-300" />
                    Task completed
                  </div>
                  <p className="mt-1 text-xs leading-5 text-white/60">{notice.message}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-white/45">
                    <Mail size={13} />
                    <span className="truncate">{notice.email ? `Email ready for ${notice.email}` : notice.emailStatus}</span>
                  </div>
                </div>
                <button
                  type="button"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                  onClick={() => dismissNotification(notice.id)}
                  className="rounded-md p-1 text-white/35 transition-all duration-200 hover:bg-white/10 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {agentRailOpen && (
        <aside className="glass flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-white/10 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={17} />
              <input
                type="search"
                placeholder="Search agents"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="field h-10 w-full pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {filteredAgents.map((agent) => {
              const active = selectedAgent.id === agent.id
              return (
                <button
                  type="button"
                  key={agent.id}
                  onClick={() => chooseAgent(agent)}
                  className={`mb-1 flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-all duration-200 ${
                    active ? 'border-brand-500/35 bg-brand-600/25 text-white' : 'border-transparent text-white/70 hover:border-white/10 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs font-semibold">
                    {agent.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{agent.name}</span>
                    <span className="block truncate text-xs text-white/45">{CATEGORY_BY_ID[agent.category]?.label || agent.category}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>
      )}

      <section className="glass flex min-h-0 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              title={agentRailOpen ? 'Hide agents' : 'Show agents'}
              aria-label={agentRailOpen ? 'Hide agents' : 'Show agents'}
              onClick={() => setAgentRailOpen((current) => !current)}
              className="btn-secondary h-9 w-9 shrink-0 p-0"
            >
              {agentRailOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brand-500/30 bg-brand-600/15 text-sm font-bold text-brand-200">
              {selectedAgent.initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">{selectedAgent.name}</h2>
              <p className="truncate text-xs text-white/45">
                {category?.label || selectedAgent.category} - {selectedAgent.tags.slice(0, 3).join(', ')}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              title="Clear chat"
              aria-label="Clear chat"
              onClick={clearConversation}
              disabled={messages.length === 0 && !message}
              className="btn-secondary h-9 w-9 p-0"
            >
              <Trash2 size={16} />
            </button>
            <button type="button" onClick={copySystemPrompt} className="btn-secondary shrink-0 px-3 py-2">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy prompt'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <button
              type="button"
              onClick={() => setSystemOpen((current) => !current)}
              className="flex w-full items-center gap-3 rounded-lg border border-brand-500/20 bg-brand-600/10 px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-brand-600/15"
            >
              {systemOpen ? <ChevronDown className="shrink-0 text-brand-200" size={16} /> : <ChevronRight className="shrink-0 text-brand-200" size={16} />}
              <Sparkles className="shrink-0 text-brand-200" size={16} />
              <span className="min-w-0 flex-1 truncate text-white/78">
                System prompt: {selectedAgent.name} - {selectedAgent.useCase}
              </span>
            </button>

            {systemOpen && (
              <pre className="max-h-56 overflow-auto rounded-lg border border-brand-500/20 bg-surface-950/70 p-4 text-xs leading-6 text-white/68 animate-slide-up">
                {systemPrompt}
              </pre>
            )}

            <div className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand-500/25 bg-brand-600/20 text-xs font-bold text-brand-200">
                {selectedAgent.initials}
              </div>
              <div className="max-w-3xl rounded-lg border border-white/10 bg-surface-700/70 px-4 py-3 text-sm leading-6 text-white/72">
                All-agent autopilot is ready. Choose any agent, give the task, and that agent leads the run while the {PLATFORM_STATS.totalAgents}-agent network helps behind it. When the task completes, you get an in-app popup and an email-ready completion payload.
              </div>
            </div>

            {messages.map((item) => (
              <div key={item.id} className={`flex gap-3 ${item.role === 'user' ? 'justify-end' : ''}`}>
                {item.role === 'agent' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand-500/25 bg-brand-600/20 text-xs font-bold text-brand-200">
                    {selectedAgent.initials}
                  </div>
                )}
                <div
                  className={`whitespace-pre-wrap rounded-lg border px-4 py-3 text-sm leading-6 ${
                    item.role === 'user'
                      ? 'max-w-3xl border-brand-500/25 bg-brand-600 text-white'
                      : `${item.run ? 'w-full max-w-5xl' : 'max-w-3xl'} border-white/10 bg-surface-700/70 text-white/72`
                  }`}
                >
                  {item.agents && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {item.agents.slice(0, 4).map((agent) => (
                        <span key={agent.id} className="rounded-md border border-brand-500/20 bg-brand-600/10 px-2 py-1 text-xs text-brand-200">
                          {agent.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {item.run ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                              <CheckCircle2 size={17} />
                              {item.run.title}
                            </div>
                            <p className="mt-1 text-xs text-white/55">Status: {item.run.status} - Progress {item.run.progress}%</p>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 sm:w-40">
                            <div className="h-full rounded-full bg-emerald-300" style={{ width: `${item.run.progress}%` }} />
                          </div>
                        </div>
                      </div>

                      {item.run.agentNetwork && (
                        <div className="rounded-lg border border-brand-500/20 bg-brand-600/10 p-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-sm font-semibold text-brand-100">
                                <Bot size={16} />
                                All-agent network
                              </div>
                              <p className="mt-2 max-w-3xl text-xs leading-5 text-white/60">{item.run.agentNetwork.summary}</p>
                            </div>
                            <span className="rounded-md border border-brand-400/20 bg-brand-500/15 px-2 py-1 text-xs text-brand-100">
                              {item.run.agentNetwork.routingMode}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                              { label: 'agents enabled', value: item.run.agentNetwork.totalPlatformAgents },
                              { label: 'detailed profiles', value: item.run.agentNetwork.indexedAgents },
                              { label: 'plugins', value: item.run.agentNetwork.plugins },
                              { label: 'categories', value: item.run.agentNetwork.categoryCount },
                            ].map((stat) => (
                              <div key={stat.label} className="rounded-md border border-white/10 bg-surface-950/45 p-2">
                                <div className="text-lg font-semibold text-white">{stat.value}</div>
                                <div className="text-xs text-white/45">{stat.label}</div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_0.85fr]">
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Coverage</div>
                              <div className="flex flex-wrap gap-1.5">
                                {item.run.agentNetwork.categoryCoverage.slice(0, 10).map((categoryItem) => (
                                  <span key={categoryItem.id} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/55">
                                    {categoryItem.label} {categoryItem.count}
                                  </span>
                                ))}
                                {item.run.agentNetwork.categoryCoverage.length > 10 && (
                                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/45">
                                    +{item.run.agentNetwork.categoryCoverage.length - 10} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Selected team</div>
                              <div className="flex flex-wrap gap-1.5">
                                {item.run.agentNetwork.selectedTeam.map((agent) => (
                                  <span key={agent.id} className="rounded-md border border-brand-500/20 bg-brand-600/15 px-2 py-1 text-xs text-brand-100">
                                    {agent.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                          <ClipboardList size={16} />
                          What it gives you
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          {item.run.deliverables.map((deliverable) => (
                            <div key={deliverable.title} className="rounded-lg border border-white/10 bg-white/5 p-3">
                              <div className="text-sm font-medium text-white">{deliverable.title}</div>
                              <div className="mt-1 text-xs leading-5 text-white/55">{deliverable.detail}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {item.run.generatedApp && (
                        <div className="rounded-lg border border-brand-500/20 bg-brand-600/10 p-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-brand-100">
                            <Layers3 size={16} />
                            Generated app package: {item.run.generatedApp.name}
                          </div>
                          <p className="mt-2 text-xs leading-5 text-white/60">{item.run.generatedApp.summary}</p>

                          <div className="mt-3 grid gap-3 lg:grid-cols-2">
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Features</div>
                              <div className="space-y-1.5">
                                {item.run.generatedApp.features.map((feature) => (
                                  <div key={feature} className="flex gap-2 text-xs leading-5 text-white/60">
                                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={13} />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Files</div>
                              <div className="space-y-1.5">
                                {item.run.generatedApp.fileStructure.map((file) => (
                                  <div key={file.path} className="rounded-md border border-white/10 bg-surface-950/50 p-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white">
                                      <FileCode2 className="text-brand-200" size={13} />
                                      {file.path}
                                    </div>
                                    <div className="mt-1 text-xs text-white/45">{file.purpose}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.run.workerResult && (
                        <div
                          className={`rounded-lg border p-3 ${
                            item.run.workerResult.status === 'completed'
                              ? 'border-emerald-400/20 bg-emerald-400/10'
                              : 'border-amber-400/20 bg-amber-400/10'
                          }`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Code2 size={16} />
                                {item.run.workerResult.status === 'completed' ? 'Project files written' : 'Local runner offline'}
                              </div>
                              <p className="mt-2 text-xs leading-5 text-white/60">
                                {item.run.workerResult.status === 'completed'
                                  ? `${item.run.workerResult.projectName} was generated on disk at ${item.run.workerResult.relativeOutputDir}.`
                                  : item.run.workerResult.error}
                              </p>
                            </div>
                            {item.run.workerResult.status === 'completed' && (
                              <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-100">
                                {item.run.workerResult.files.length} files
                              </span>
                            )}
                          </div>

                          <div className="mt-3 grid gap-3 xl:grid-cols-2">
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Generated files</div>
                              <div className="space-y-1.5">
                                {(item.run.workerResult.files.length > 0 ? item.run.workerResult.files : [{ path: 'No files written yet', purpose: 'Start npm run dev:full' }]).map((file) => (
                                  <div key={file.path} className="rounded-md border border-white/10 bg-surface-950/45 p-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white">
                                      <FileCode2 className="text-brand-200" size={13} />
                                      {file.path}
                                    </div>
                                    <div className="mt-1 text-xs text-white/45">{file.purpose}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/35">Run commands</div>
                              <div className="space-y-1.5">
                                {item.run.workerResult.commands.map((command) => (
                                  <code key={command} className="block rounded-md border border-white/10 bg-surface-950/60 px-2 py-1.5 text-xs text-white/60">
                                    {command}
                                  </code>
                                ))}
                              </div>
                              <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-2">
                                <div className="text-xs font-medium text-white">Runner log</div>
                                <div className="mt-1 space-y-1">
                                  {item.run.workerResult.log.map((line) => (
                                    <div key={line} className="text-xs leading-5 text-white/45">
                                      {line}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="mb-2 text-sm font-semibold text-white">Execution phases</div>
                        <div className="space-y-2">
                          {item.run.phases.map((phase, index) => (
                            <div key={phase.title} className="rounded-lg border border-white/10 bg-surface-950/50 p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-600/20 text-xs text-brand-200">{index + 1}</span>
                                  {phase.title}
                                </div>
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-xs ${
                                    phase.status === 'completed'
                                      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                                      : phase.status === 'working'
                                        ? 'border-brand-400/25 bg-brand-500/15 text-brand-100'
                                        : 'border-white/10 bg-white/5 text-white/40'
                                  }`}
                                >
                                  {phase.status}
                                </span>
                              </div>
                              <div className="mt-2 text-xs text-white/45">Owner: {phase.owner}</div>
                              <div className="mt-2 text-sm text-white/65">{phase.output}</div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {phase.actions.map((action) => (
                                  <span key={action} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/45">
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="text-sm font-semibold text-white">Acceptance checks</div>
                          <ul className="mt-2 space-y-1.5 text-xs leading-5 text-white/60">
                            {item.run.acceptanceChecks.map((check) => (
                              <li key={check} className="flex gap-2">
                                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={13} />
                                <span>{check}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg border border-brand-500/20 bg-brand-600/10 p-3">
                          <div className="text-sm font-semibold text-brand-100">Copy-ready execution command</div>
                          <p className="mt-2 text-xs leading-5 text-white/65">{item.run.copyReadyInstruction}</p>
                        </div>
                      </div>

                      {item.run.generatedApp && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <FileCode2 size={16} />
                            Files generated
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.run.generatedApp.fileStructure.map((file) => (
                              <span key={file.path} className="rounded-md border border-white/10 bg-surface-950/50 px-2 py-1 text-xs text-white/55">
                                {file.path}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <details className="rounded-lg border border-white/10 bg-surface-950/40 p-3">
                        <summary className="cursor-pointer text-sm font-medium text-white/75">Full generated output</summary>
                        <div className="mt-3 whitespace-pre-wrap text-xs leading-6 text-white/55">{item.content}</div>
                      </details>
                    </div>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            ))}

            {isResponding && (
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-brand-500/25 bg-brand-600/20 text-xs font-bold text-brand-200">
                  {selectedAgent.initials}
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-surface-700/70 px-4 py-3 text-sm text-white/55">
                  <Loader2 className="animate-spin text-brand-300" size={16} />
                  Thinking
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="shrink-0 border-t border-white/10 bg-surface-900/70 p-3 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl">
            <input ref={fileInputRef} type="file" multiple onChange={handleFileAttach} className="hidden" />
            <div className="rounded-xl border border-white/10 bg-surface-800/95 p-2 shadow-glow transition-all duration-200 focus-within:border-brand-500/45">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                <div className="flex rounded-lg border border-white/10 bg-surface-950/55 p-1">
                  {chatModes.map((mode) => {
                    const Icon = mode.icon
                    const active = activeMode === mode.id

                    return (
                      <button
                        type="button"
                        key={mode.id}
                        onClick={() => setActiveMode(mode.id)}
                        className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-200 ${
                          active ? 'bg-white/10 text-white shadow-sm' : 'text-white/45 hover:bg-white/[0.08] hover:text-white/75'
                        }`}
                      >
                        <Icon size={14} />
                        {mode.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-1.5">
                  {contextChips.map((chip) => (
                    <span key={chip} className="max-w-[150px] truncate rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/55">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {notificationOpen && (
                <div className="mb-2 rounded-lg border border-white/10 bg-surface-950/55 p-3 animate-slide-up">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Bell size={15} className="text-emerald-300" />
                        Completion notifications
                      </div>
                      <p className="mt-1 text-xs leading-5 text-white/50">
                        In-app popups fire automatically when any agent finishes. Email delivery is prepared here and needs a backend mail provider to send for real.
                      </p>
                    </div>
                    <button type="button" onClick={requestBrowserNotifications} className="btn-secondary h-8 shrink-0 px-2 text-xs">
                      {browserPermission === 'granted' ? 'Browser popups on' : browserPermission === 'denied' ? 'Popups blocked' : 'Enable popups'}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <label className="min-w-0">
                      <span className="mb-1 block text-xs font-medium text-white/55">Email for completed tasks</span>
                      <input
                        type="email"
                        value={notificationEmail}
                        onChange={(event) => setNotificationEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="field h-10 w-full"
                      />
                    </label>
                    <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs leading-5 text-white/55">
                      <div className="flex items-center gap-1.5 text-white/70">
                        <Mail size={13} />
                        {notificationEmail ? 'Email payload ready' : 'Email not set'}
                      </div>
                      <div className="mt-0.5 text-white/40">{notificationEmail ? 'Ready for /api/notifications/send' : 'In-app popup still works'}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-500/25 bg-brand-600/15 text-xs font-bold text-brand-200 sm:flex">
                  {selectedAgent.initials}
                </div>
                <div className="min-w-0 flex-1">
                  {messages.length === 0 && (
                    <div className="mb-1 flex flex-wrap gap-1.5">
                      {starterPrompts.map((prompt) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => setMessage(prompt + ': ')}
                          className="rounded-md px-2 py-1 text-xs text-white/38 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/75"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea
                    ref={composerRef}
                    rows={1}
                    placeholder={`Ask ${selectedAgent.name}...`}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    className="max-h-32 min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/35"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" title="Mention context" aria-label="Mention context" onClick={insertContextMention} className="btn-secondary h-9 w-9 p-0">
                    <AtSign size={16} />
                  </button>
                  <button type="button" title="Attach file" aria-label="Attach file" onClick={() => fileInputRef.current?.click()} className="btn-secondary h-9 w-9 p-0">
                    <Paperclip size={16} />
                  </button>
                  <button type="button" title="Task notifications" aria-label="Task notifications" onClick={() => setNotificationOpen((current) => !current)} className="btn-secondary h-9 w-9 p-0">
                    <Bell size={16} />
                  </button>
                  <button type="submit" disabled={!message.trim() || isResponding} className="btn-primary h-10 w-10 shrink-0 p-0" aria-label="Send message">
                    {isResponding ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-500/20 bg-brand-600/10 px-2 py-1 text-xs text-brand-200">
                  <Wand2 size={13} />
                  {selectedAgent.name}
                </span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/45">
                  {activeModeLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/45">
                  <Bell size={13} />
                  {notificationEmail ? 'Email ready' : 'In-app notify'}
                </span>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}
