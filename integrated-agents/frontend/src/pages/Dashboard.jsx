import { Link } from 'react-router-dom'
import { ArrowRight, Bot, MessageSquare, Puzzle, TrendingUp, Users, Zap } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import StatCard from '../components/StatCard'
import { AGENTS, CATEGORIES, PLATFORM_STATS, RUFLO_PLUGINS } from '../data/agents'

const quickLaunchIds = ['frontend-dev', 'ai-engineer', 'product-manager', 'support-triage', 'ruflo-coder', 'queen-coordinator']

export default function Dashboard() {
  const quickLaunchAgents = quickLaunchIds.map((id) => AGENTS.find((agent) => agent.id === id)).filter(Boolean)
  const activePlugins = RUFLO_PLUGINS.slice(0, 12)

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-600/15 px-3 py-1 text-xs font-medium text-brand-200">
              <Bot size={14} />
              Unified agency and Ruflo console
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Agent Command Center</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
              Browse, compare, and launch specialized agents for engineering, go-to-market, research, operations, and multi-agent Ruflo workflows.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/agents" className="btn-primary">
              Browse agents
              <ArrowRight size={16} />
            </Link>
            <Link to="/chat" className="btn-secondary">
              <MessageSquare size={16} />
              Open chat
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} number={PLATFORM_STATS.totalAgents} label="Total Agents" trend="12%" caption={`${PLATFORM_STATS.indexedAgents} curated profiles indexed in this UI`} />
        <StatCard icon={Zap} number={PLATFORM_STATS.agencyAgents} label="Agency Agents" caption="Specialists across delivery, research, GTM, and operations" />
        <StatCard icon={TrendingUp} number={PLATFORM_STATS.rufloAgents} label="Ruflo Agents" caption="Orchestration-ready agents for code and autonomous workflows" />
        <StatCard icon={Puzzle} number={PLATFORM_STATS.plugins} label="Ruflo Plugins" caption="Runtime, memory, evals, browser, GitHub, and governance modules" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Quick Launch</h2>
            <p className="mt-1 text-sm text-white/45">High-signal agents for common workstreams.</p>
          </div>
          <Link to="/agents" className="hidden text-sm font-medium text-brand-300 transition-colors hover:text-brand-200 sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLaunchAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Agent Categories</h2>
          <p className="mt-1 text-sm text-white/45">Jump directly into a filtered view.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {CATEGORIES.map((category) => {
            const count = AGENTS.filter((agent) => agent.category === category.id).length
            return (
              <Link
                key={category.id}
                to={`/agents?category=${category.id}`}
                className="card group min-h-[132px] hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.08]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white/70">
                    {category.initials}
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/45">
                    {category.source}
                  </span>
                </div>
                <div className="mt-4 font-semibold">{category.label}</div>
                <div className="mt-1 text-sm text-white/50">{count} indexed agents</div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Ruflo System Status</h2>
              <p className="mt-1 text-sm text-white/45">Core plugin services are available for orchestration workflows.</p>
            </div>
            <Link to="/plugins" className="text-sm font-medium text-brand-300 transition-colors hover:text-brand-200">
              Plugins
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePlugins.map((plugin) => (
              <div key={plugin.id} className="flex items-center gap-2 rounded-md border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span className="text-emerald-200">{plugin.name}</span>
              </div>
            ))}
            <div className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50">
              +{RUFLO_PLUGINS.length - activePlugins.length} more
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold">Coverage Mix</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Agency profiles', PLATFORM_STATS.agencyAgents, PLATFORM_STATS.totalAgents],
              ['Ruflo profiles', PLATFORM_STATS.rufloAgents, PLATFORM_STATS.totalAgents],
              ['Indexed in UI', PLATFORM_STATS.indexedAgents, PLATFORM_STATS.totalAgents],
            ].map(([label, value, total]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-white/65">{label}</span>
                  <span className="font-medium text-white">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, (value / total) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
