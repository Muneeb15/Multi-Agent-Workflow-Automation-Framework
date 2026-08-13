import { Link } from 'react-router-dom'
import { ArrowRight, Gauge, ShieldCheck } from 'lucide-react'
import { CATEGORY_BY_ID } from '../data/agents'

const colorClasses = {
  indigo: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/25',
  violet: 'bg-violet-500/10 text-violet-200 border-violet-500/25',
  emerald: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25',
  cyan: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/25',
  pink: 'bg-pink-500/10 text-pink-200 border-pink-500/25',
  amber: 'bg-amber-500/10 text-amber-200 border-amber-500/25',
  blue: 'bg-blue-500/10 text-blue-200 border-blue-500/25',
  purple: 'bg-purple-500/10 text-purple-200 border-purple-500/25',
  rose: 'bg-rose-500/10 text-rose-200 border-rose-500/25',
  green: 'bg-green-500/10 text-green-200 border-green-500/25',
  sky: 'bg-sky-500/10 text-sky-200 border-sky-500/25',
  teal: 'bg-teal-500/10 text-teal-200 border-teal-500/25',
  orange: 'bg-orange-500/10 text-orange-200 border-orange-500/25',
}

export default function AgentCard({ agent, compact = false }) {
  const category = CATEGORY_BY_ID[agent.category]
  const tone = colorClasses[agent.color] || colorClasses.indigo

  return (
    <Link
      to={`/agent/${agent.id}`}
      className="card group flex h-full min-h-[262px] flex-col overflow-hidden hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:ring-offset-2 focus:ring-offset-surface-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border text-sm font-bold tracking-wide ${tone}`}>
          {agent.initials}
        </div>
        <div className="flex min-w-0 flex-wrap justify-end gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/55">
            {agent.source}
          </span>
          {category && (
            <span className={`rounded-full border px-2 py-0.5 text-xs ${colorClasses[category.color] || colorClasses.indigo}`}>
              {category.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex-1">
        <h3 className="line-clamp-2 text-lg font-semibold text-white">{agent.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">{agent.description}</p>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {agent.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/50">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          {agent.maturity}
        </span>
        <span className="flex items-center gap-1.5">
          <Gauge size={14} />
          {agent.responseTime}
        </span>
      </div>

      <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-brand-600/15 px-3 py-2 text-sm font-medium text-brand-200 transition-all duration-200 group-hover:bg-brand-600 group-hover:text-white">
        Use Agent
        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
