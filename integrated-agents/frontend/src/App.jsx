import { lazy, Suspense, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'
import Sidebar from './components/Sidebar'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const AgentBrowser = lazy(() => import('./pages/AgentBrowser'))
const AgentDetail = lazy(() => import('./pages/AgentDetail'))
const PluginsPage = lazy(() => import('./pages/PluginsPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))

function NotFound() {
  return (
    <section className="glass mx-auto max-w-2xl p-8 text-center animate-slide-up">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand-300">404</p>
      <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-white/60">The route is not part of this agent console.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to dashboard
        <ArrowRight size={16} />
      </Link>
    </section>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-900 text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto min-h-0 w-full max-w-[1540px] flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen label="Loading workspace" />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agents" element={<AgentBrowser />} />
                <Route path="/agent/:id" element={<AgentDetail />} />
                <Route path="/plugins" element={<PluginsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
