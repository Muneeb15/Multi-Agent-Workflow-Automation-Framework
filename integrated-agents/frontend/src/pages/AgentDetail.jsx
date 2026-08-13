import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Copy, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import { AGENTS, CATEGORY_BY_ID } from '../data/agents'

export default function AgentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const agent = AGENTS.find((item) => item.id === id)

  const relatedAgents = useMemo(() => {
    if (!agent) return []
    return AGENTS.filter((item) => item.category === agent.category && item.id !== agent.id).slice(0, 4)
  }, [agent])

  if (!agent) {
    return (
      <section className="glass mx-auto max-w-2xl p-8 text-center animate-slide-up">
        <h2 className="text-2xl font-semibold">Agent not found</h2>
        <p className="mt-2 text-white/55">The requested profile is not in the indexed library.</p>
        <button type="button" onClick={() => navigate('/agents')} className="btn-primary mt-6">
          Browse agents
        </button>
      </section>
    )
  }

  const category = CATEGORY_BY_ID[agent.category]
  const activationPrompt = `Act as ${agent.name}.

Specialty: ${agent.description}

Use case: ${agent.useCase}

Primary expertise: ${agent.tags.join(', ')}

Work in the style of a focused ${category?.label || agent.category} agent. Ask for missing context when needed, produce concrete next steps, and call out assumptions.`

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activationPrompt)
    } catch {
      // Some embedded browsers deny clipboard access; keep the UI non-disruptive.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/agents" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white">
        <ArrowLeft size={18} />
        Back to agents
      </Link>

      <section className="glass p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-brand-500/30 bg-brand-600/15 text-xl font-bold tracking-wide text-brand-200">
            {agent.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-brand-500/25 bg-brand-600/15 px-3 py-1 text-sm text-brand-200">{category?.label || agent.category}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/55">{agent.source}</span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">{agent.maturity}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{agent.name}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">{agent.description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={`/chat?agent=${agent.id}`} className="btn-primary">
                <MessageSquare size={18} />
                Launch chat
              </Link>
              <button type="button" onClick={copyPrompt} className="btn-secondary">
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied prompt' : 'Copy prompt'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="text-brand-300" size={18} />
            <h2 className="text-lg font-semibold">Best Use Case</h2>
          </div>
          <p className="mt-4 leading-7 text-white/68">{agent.useCase}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-300" size={18} />
            <h2 className="text-lg font-semibold">Operating Profile</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">Maturity</dt>
              <dd className="font-medium text-white">{agent.maturity}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">Response style</dt>
              <dd className="font-medium text-white">{agent.responseTime}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-white/50">Source</dt>
              <dd className="font-medium text-white">{agent.source}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-lg font-semibold">Tags</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-brand-500/20 bg-brand-500/10 px-3 py-1.5 text-sm text-brand-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold">Activation Prompt</h2>
          <pre className="mt-4 max-h-72 overflow-auto rounded-lg border border-white/10 bg-surface-950/70 p-4 text-xs leading-6 text-white/70">
            {activationPrompt}
          </pre>
        </div>
      </section>

      {relatedAgents.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Related Agents</h2>
            <p className="mt-1 text-sm text-white/45">More profiles in {category?.label || agent.category}.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedAgents.map((item) => (
              <AgentCard key={item.id} agent={item} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
