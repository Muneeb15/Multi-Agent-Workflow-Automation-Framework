import { Component } from 'react'
import { RefreshCcw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <section className="glass mx-auto max-w-2xl p-8 text-center animate-slide-up">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-300">Runtime error</p>
        <h1 className="mt-3 text-3xl font-bold">This workspace panel crashed.</h1>
        <p className="mt-3 text-white/60">Reset the view and try the action again.</p>
        <button type="button" onClick={this.handleReset} className="btn-primary mt-6">
          <RefreshCcw size={16} />
          Reset view
        </button>
      </section>
    )
  }
}
