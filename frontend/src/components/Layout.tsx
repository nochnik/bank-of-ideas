import { MiniNavbar } from '@/components/ui/mini-navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <MiniNavbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-6 pt-24 w-full">
        {children}
      </main>
      
      <footer className="border-t border-hl/40 bg-transparent mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`} 
              alt="KMG" 
              className="h-6 opacity-60 dark:invert"
            />
            <div className="flex items-center gap-2 text-caption text-ink-subtle">
              <span className="w-1 h-1 rounded-full bg-hl"></span>
              <span>DMAIC Platform</span>
              <span className="w-1 h-1 rounded-full bg-hl"></span>
              <span>КазМунайГаз · 2026</span>
            </div>
          </div>
          <div className="text-caption text-ink-tertiary">
            Внутренний проект · Все права защищены
          </div>
        </div>
      </footer>
    </div>
  )
}
