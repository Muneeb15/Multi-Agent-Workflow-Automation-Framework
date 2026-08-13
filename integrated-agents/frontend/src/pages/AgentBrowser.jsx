import { useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AgentCard from '../components/AgentCard'
import { AGENTS, CATEGORIES, PLATFORM_STATS } from '../data/agents'

export default function AgentBrowser() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const sourceFilter = searchParams.get('source') || 'all'
  const categoryFilter = searchParams.get('category') || 'all'

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    setSearchParams({}, { replace: true })
  }

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return AGENTS.filter((agent) => {
      const searchable = [agent.name, agent.description, agent.useCase, agent.category, agent.source, ...agent.tags].join(' ').toLowerCase()
      const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery)
      const matchesSource = sourceFilter === 'all' || agent.source === sourceFilter
      const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter

      return matchesSearch && matchesSource && matchesCategory
    })
  }, [categoryFilter, query, sourceFilter])

  const activeFilters = [query, sourceFilter !== 'all' ? sourceFilter : '', categoryFilter !== 'all' ? categoryFilter : ''].filter(Boolean).length

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="glass p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
              <Search size={16} />
              Search library
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
              <input
                type="search"
                placeholder="Search by agent, tag, category, or use case"
                value={query}
                onChange={(event) => updateParam('q', event.target.value)}
                className="field w-full pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[520px]">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70">
                <SlidersHorizontal size={16} />
                Source
              </span>
              <select value={sourceFilter} onChange={(event) => updateParam('source', event.target.value)} className="field w-full">
                <option value="all">All Sources</option>
                <option value="agency">Agency Agents</option>
                <option value="ruflo">Ruflo Agents</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/70">Category</span>
              <select value={categoryFilter} onChange={(event) => updateParam('category', event.target.value)} className="field w-full">
                <option value="all">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <div>
            Showing <span className="font-semibold text-white">{filteredAgents.length}</span> indexed agents from{' '}
            <span className="font-semibold text-white">{PLATFORM_STATS.totalAgents}</span> available profiles
          </div>
          {activeFilters > 0 && (
            <button type="button" onClick={clearFilters} className="btn-secondary w-full sm:w-auto">
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      {filteredAgents.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </section>
      ) : (
        <section className="glass p-10 text-center animate-slide-up">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <Search className="text-white/40" size={24} />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No agents found</h3>
          <p className="mt-2 text-sm text-white/55">Try a different search, category, or source.</p>
          <button type="button" onClick={clearFilters} className="btn-primary mt-5">
            Reset browser
          </button>
        </section>
      )}
    </div>
  )
}
