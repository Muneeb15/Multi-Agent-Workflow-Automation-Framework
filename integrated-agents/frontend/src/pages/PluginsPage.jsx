import { useMemo, useState } from 'react'
import { Check, Copy, Puzzle, Search } from 'lucide-react'
import { RUFLO_PLUGINS } from '../data/agents'

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

export default function PluginsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [copiedId, setCopiedId] = useState('')

  const pluginCategories = useMemo(() => Array.from(new Set(RUFLO_PLUGINS.map((plugin) => plugin.category))).sort(), [])

  const filteredPlugins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return RUFLO_PLUGINS.filter((plugin) => {
      const matchesCategory = category === 'all' || plugin.category === category
      const matchesQuery = !normalizedQuery || [plugin.name, plugin.id, plugin.category, plugin.description].join(' ').toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const copyInstallCommand = async (plugin) => {
    try {
      await navigator.clipboard.writeText(`/plugin install ${plugin.id}@ruflo`)
    } catch {
      // Clipboard can be blocked in embedded browsers; the command remains visible.
    }
    setCopiedId(plugin.id)
    window.setTimeout(() => setCopiedId(''), 1400)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-600/15 px-3 py-1 text-xs font-medium text-brand-200">
              <Puzzle size={14} />
              {RUFLO_PLUGINS.length} plugin modules
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Ruflo Plugins</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
              Native Claude Code plugins for orchestration, memory, evaluation, GitHub workflows, browser testing, policy, telemetry, and optimization.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[520px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search plugins"
                className="field w-full pl-10"
              />
            </div>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="field w-full">
              <option value="all">All Categories</option>
              {pluginCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredPlugins.map((plugin) => {
          const command = `/plugin install ${plugin.id}@ruflo`
          const tone = colorClasses[plugin.color] || colorClasses.indigo

          return (
            <article key={plugin.id} className="card flex min-h-[288px] flex-col hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.08]">
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg border text-sm font-bold ${tone}`}>{plugin.initials}</div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50">{plugin.category}</span>
              </div>

              <div className="mt-4 flex-1">
                <h3 className="text-lg font-semibold">{plugin.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{plugin.description}</p>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-surface-950/70 p-3 font-mono text-xs text-brand-200">{command}</div>

              <button type="button" onClick={() => copyInstallCommand(plugin)} className="btn-secondary mt-3 w-full">
                {copiedId === plugin.id ? <Check size={16} /> : <Copy size={16} />}
                {copiedId === plugin.id ? 'Copied' : 'Copy install command'}
              </button>
            </article>
          )
        })}
      </section>

      {filteredPlugins.length === 0 && (
        <section className="glass p-10 text-center animate-slide-up">
          <Search className="mx-auto text-white/35" size={28} />
          <h2 className="mt-4 text-lg font-semibold">No plugins found</h2>
          <p className="mt-2 text-sm text-white/55">Try another category or search term.</p>
        </section>
      )}

      <section className="card">
        <h2 className="text-xl font-semibold">Installation</h2>
        <div className="mt-4 grid gap-3 text-sm text-white/70 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-surface-950/70 p-4 font-mono text-xs leading-6 text-brand-200">
            /plugin marketplace add ruvnet/ruflo
            <br />
            /plugin install ruflo-core@ruflo
          </div>
          <div className="rounded-lg border border-white/10 bg-surface-950/70 p-4 font-mono text-xs leading-6 text-brand-200">
            npx ruflo@latest plugins install @ruflo/plugin-name
          </div>
        </div>
      </section>
    </div>
  )
}
