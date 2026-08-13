import { ArrowUpRight } from 'lucide-react'

export default function StatCard({ icon: Icon, number, label, trend, caption }) {
  return (
    <div className="card hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white/[0.08]">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand-500/25 bg-brand-600/15">
          <Icon className="text-brand-300" size={22} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-300">
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-5">
        <div className="text-3xl font-bold tracking-tight">{number}</div>
        <div className="mt-1 text-sm text-white/60">{label}</div>
        {caption && <div className="mt-3 text-xs text-white/40">{caption}</div>}
      </div>
    </div>
  )
}
