import { Loader2 } from 'lucide-react'

export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="glass flex min-h-[320px] items-center justify-center p-8 animate-fade-in">
      <div className="flex items-center gap-3 text-sm text-white/60">
        <Loader2 className="animate-spin text-brand-300" size={18} />
        <span>{label}</span>
      </div>
    </div>
  )
}
