import { Link, NavLink, useLocation } from 'react-router-dom'
import { Bot, Home, MessageSquare, Puzzle, Sparkles, Users, X } from 'lucide-react'
import { CATEGORIES, PLATFORM_STATS } from '../data/agents'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/agents', label: 'Browse Agents', icon: Users },
  { to: '/plugins', label: 'Ruflo Plugins', icon: Puzzle },
  { to: '/chat', label: 'Chat with Agent', icon: MessageSquare },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const linkClass = ({ isActive }) => {
    if (isActive) return 'sidebar-link-active'
    return 'sidebar-link'
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-surface-800/90 shadow-2xl backdrop-blur-xl transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <Link to="/" onClick={onClose} className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-500/30 bg-brand-600/20">
              <Bot className="text-brand-300" size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold">Integrated Agents</h1>
              <p className="text-xs text-white/50">{PLATFORM_STATS.totalAgents} AI agents</p>
            </div>
          </Link>
          <button type="button" aria-label="Close menu" onClick={onClose} className="btn-secondary h-9 w-9 p-0 lg:hidden">
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isAgentDetail = item.to === '/agents' && location.pathname.startsWith('/agent/')

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) => (isAgentDetail || isActive ? 'sidebar-link-active' : linkClass({ isActive }))}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <div className="px-3 pb-2 pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              <Sparkles size={14} />
              Categories
            </div>
          </div>

          <div className="space-y-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/agents?category=${category.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/55 transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
              >
                <span className="flex h-6 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-[10px] font-semibold text-white/70">
                  {category.initials}
                </span>
                <span className="min-w-0 truncate">{category.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="glass flex items-center justify-between p-3">
            <div>
              <p className="text-xs font-medium text-white/70">System status</p>
              <p className="text-sm font-semibold text-emerald-300">All systems active</p>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
