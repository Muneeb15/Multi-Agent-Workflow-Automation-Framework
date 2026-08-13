import { useState } from 'react'
import { Menu, Plus, Search } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PLATFORM_STATS } from '../data/agents'

const titles = {
  '/': 'Dashboard',
  '/agents': 'Browse Agents',
  '/plugins': 'Ruflo Plugins',
  '/chat': 'Chat with Agent',
}

export default function Header({ onMenuClick }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const title = location.pathname.startsWith('/agent/') ? 'Agent Details' : titles[location.pathname] || 'Integrated Agents'

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/agents?q=${encodeURIComponent(trimmed)}` : '/agents')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-900/80 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-[1540px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button type="button" aria-label="Open navigation" onClick={onMenuClick} className="btn-secondary h-10 w-10 p-0 lg:hidden">
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold sm:text-xl">{title}</h2>
          <p className="hidden text-xs text-white/45 sm:block">
            {PLATFORM_STATS.indexedAgents} indexed agents from {PLATFORM_STATS.totalAgents} available profiles
          </p>
        </div>

        <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 justify-end md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search agents"
              className="field w-full pl-10"
            />
          </div>
        </form>

        <button type="button" onClick={() => navigate('/chat')} className="btn-primary shrink-0">
          <Plus size={18} />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <div className="hidden items-center gap-4 border-l border-white/10 pl-4 text-sm text-white/55 xl:flex">
          <div>
            <span className="font-semibold text-white">{PLATFORM_STATS.totalAgents}</span> agents
          </div>
          <div>
            <span className="font-semibold text-white">{PLATFORM_STATS.plugins}</span> plugins
          </div>
        </div>
      </div>
    </header>
  )
}
