import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/admin/users', icon: Users, label: 'Участники' },
  { path: '/admin/review/all', icon: CheckSquare, label: 'Очередь проверки' },
]

export default function AdminLayout({ children, title, breadcrumbs }: { children: React.ReactNode, title?: string, breadcrumbs?: { label: string, path?: string }[] }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-s1 border-r border-hl">
      <div className="p-6">
        <Link to="/admin/dashboard" className="flex items-center justify-center py-2">
          <img 
            src={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`} 
            alt="KMG Logo" 
            className="h-16 w-auto object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || 
                          (item.path === '/admin/users' && location.pathname === '/admin')
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-accent/10 text-accent font-medium' 
                  : 'text-ink-tertiary hover:text-ink hover:bg-s2'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-hl">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-ink-tertiary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
        >
          <LogOut size={18} />
          {t('nav.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-40 lg:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-s1/80 backdrop-blur-md border-b border-hl sticky top-0 z-10 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-ink-subtle hover:text-ink rounded-lg hover:bg-s2 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs / Title */}
            <div className="flex items-center gap-2 text-sm">
              {breadcrumbs ? (
                breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <ChevronRight size={14} className="text-ink-tertiary" />}
                    {crumb.path ? (
                      <Link to={crumb.path} className="text-ink-subtle hover:text-ink transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-ink font-medium">{title}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
