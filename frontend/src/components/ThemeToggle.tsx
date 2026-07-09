import { useState } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useThemeStore } from '@/store/themeStore'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  const [rotating, setRotating] = useState(false)

  const handleClick = () => {
    if (rotating) return
    setRotating(true)
    toggle()
    setTimeout(() => setRotating(false), 420)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '42px', height: '42px', borderRadius: '9999px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'transparent', cursor: 'pointer',
        color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s',
        outline: 'none', boxShadow: 'none', flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = '#fff'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      <motion.div
        animate={{ rotate: rotating ? 360 : 0 }}
        transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {theme === 'dark'
          ? <Sun size={16} weight="regular" />
          : <Moon size={16} weight="regular" />
        }
      </motion.div>
    </button>
  )
}
