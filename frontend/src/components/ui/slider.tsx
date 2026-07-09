import { cn } from '@/lib/utils'

interface SliderProps {
  min?: number
  max?: number
  step?: number
  value: number
  onChange: (value: number) => void
  className?: string
}

export function Slider({ min = 0, max = 100, step = 1, value, onChange, className }: SliderProps) {
  const pct = ((value - (min ?? 0)) / ((max ?? 100) - (min ?? 0))) * 100

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      <div className="relative w-full h-1.5 bg-hl rounded-pill overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-accent rounded-pill transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
      />
      <div
        className="absolute w-4 h-4 rounded-full bg-white border-2 border-accent shadow-md pointer-events-none transition-all duration-150"
        style={{ left: `calc(${pct}% - 8px)` }}
      />
    </div>
  )
}
