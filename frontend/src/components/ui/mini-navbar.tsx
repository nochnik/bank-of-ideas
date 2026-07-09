"use client";

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, SignOut } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import ThemeToggle from '@/components/ThemeToggle';

const AnimatedNavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link to={to} style={{
    fontSize: '15px', fontWeight: 500, textDecoration: 'none',
    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
    transition: 'color 0.2s', whiteSpace: 'nowrap',
  }}>
    {children}
  </Link>
);

export function MiniNavbar() {
  const { t, i18n } = useTranslation();
  const { role, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen]     = useState(false);
  const [shapeClass, setShapeClass] = useState('rounded-full');
  const [langOpen, setLangOpen] = useState(false);
  const [visible, setVisible]   = useState(true);

  const shapeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef     = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) {
        setVisible(true);
      } else if (y > lastScrollY.current + 6) {
        setVisible(false);
        setIsOpen(false);
      } else if (y < lastScrollY.current - 4) {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setVisible(true);
  }, [location.pathname]);

  useEffect(() => {
    if (shapeTimer.current) clearTimeout(shapeTimer.current);
    if (isOpen) {
      setShapeClass('rounded-2xl');
    } else {
      shapeTimer.current = setTimeout(() => setShapeClass('rounded-full'), 300);
    }
    return () => { if (shapeTimer.current) clearTimeout(shapeTimer.current); };
  }, [isOpen]);

  const active = (path: string) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const setLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    setLangOpen(false);
  };

  const currentLang = i18n.language === 'kz' ? 'KK' : 'RU';

  const navLinks = [
    role === 'PARTICIPANT' && { to: '/dashboard', label: t('nav.dashboard') },
    role === 'ADMIN'       && { to: '/admin',     label: t('nav.admin') },
  ].filter(Boolean) as { to: string; label: string }[];

  const homeLink = { to: '/', label: t('nav.home') };

  return (
    <header
      className={`fixed top-5 left-1/2 z-50 -translate-x-1/2
                  flex flex-col items-center px-10 py-3
                  border border-[#ffffff12] bg-[rgba(8,11,20,0.88)] backdrop-blur-xl
                  w-[calc(100%-2rem)] sm:w-auto ${shapeClass}`}
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
        transform: `translateX(-50%) translateY(${visible ? '0' : 'calc(-100% - 24px)'})`,
        transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
      }}
    >
      {/* Desktop row — все элементы в одну линию с равными отступами */}
      <div className="hidden sm:flex items-center gap-6">

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', opacity: 0.9, transition: 'opacity 0.2s', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
        >
          <img
            src={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`}
            alt="KMG"
            style={{
              height: '44px', width: 'auto',
              filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
        </Link>

        {/* Divider */}
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          <Link to={homeLink.to} state={{ skipHero: true }} style={{
            fontSize: '15px', fontWeight: 500, textDecoration: 'none',
            color: active(homeLink.to) ? '#fff' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.2s', whiteSpace: 'nowrap',
          }}>
            {homeLink.label}
          </Link>
          {navLinks.map(link => (
            <AnimatedNavLink key={link.to} to={link.to} active={active(link.to)}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

        {/* Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Language */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(v => !v)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              height: '42px', padding: '0 16px', borderRadius: '9999px',
              border: langOpen ? '1px solid rgba(91,141,238,0.35)' : '1px solid rgba(255,255,255,0.1)',
              fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em',
              color: langOpen ? '#5b8dee' : 'rgba(255,255,255,0.5)',
              background: langOpen ? 'rgba(91,141,238,0.1)' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                if (!langOpen) {
                  (e.currentTarget as HTMLElement).style.color = '#fff'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                }
              }}
              onMouseLeave={e => {
                if (!langOpen) {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              <Globe size={12} style={{ opacity: 0.6 }} />
              {currentLang}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'rgba(8,11,20,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '4px', minWidth: '64px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    zIndex: 100, backdropFilter: 'blur(16px)',
                  }}
                >
                  {(['ru', 'kz'] as const).map(lang => (
                    <button key={lang} onClick={() => setLang(lang)} style={{
                      display: 'block', width: '100%', padding: '7px 12px',
                      borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      textAlign: 'center', border: 'none', cursor: 'pointer',
                      background: i18n.language === lang ? 'rgba(91,141,238,0.15)' : 'transparent',
                      color: i18n.language === lang ? '#5b8dee' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.15s',
                    }}>
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {role ? (
            <button onClick={() => { logout(); navigate('/login'); }} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 18px', borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '14px', fontWeight: 500,
              color: 'rgba(255,255,255,0.5)', background: 'transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#f43f5e';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,63,94,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.07)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <SignOut size={14} />
              {t('nav.logout')}
            </button>
          ) : (
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '9px 22px', borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              fontSize: '15px', fontWeight: 500,
              color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Войти
            </Link>
          )}
        </div>
      </div>

      {/* Mobile row */}
      <div className="sm:hidden flex items-center justify-between w-full">
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}KazMunayGas_logo.svg`}
            alt="KMG"
            style={{
              height: '28px', width: 'auto',
              filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          />
        </Link>
        <button className="flex items-center justify-center w-8 h-8 focus:outline-none"
          onClick={() => setIsOpen(v => !v)}
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          {isOpen
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`sm:hidden flex flex-col items-center w-full overflow-hidden transition-all duration-300
                       ${isOpen ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center gap-3 w-full pb-2">
          {[homeLink, ...navLinks].map(link => (
            <Link key={link.to} to={link.to} state={link.to === '/' ? { skipHero: true } : undefined} style={{
              fontSize: '14px', fontWeight: 500, width: '100%', textAlign: 'center',
              color: active(link.to) ? '#fff' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none', padding: '6px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-3 w-full mt-3">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {(['ru', 'kz'] as const).map(lang => (
              <button key={lang} onClick={() => setLang(lang)} style={{
                padding: '5px 12px', borderRadius: '9999px',
                border: i18n.language === lang ? '1px solid rgba(91,141,238,0.4)' : '1px solid rgba(255,255,255,0.08)',
                fontSize: '11px', fontWeight: 700,
                color: i18n.language === lang ? '#5b8dee' : 'rgba(255,255,255,0.4)',
                background: 'transparent', cursor: 'pointer',
              }}>
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          {role ? (
            <button onClick={() => { logout(); navigate('/login'); }} style={{
              width: '100%', padding: '8px', borderRadius: '9999px',
              border: '1px solid rgba(244,63,94,0.3)',
              fontSize: '13px', fontWeight: 600, color: '#f43f5e',
              background: 'rgba(244,63,94,0.07)', cursor: 'pointer',
            }}>
              {t('nav.logout')}
            </button>
          ) : (
            <Link to="/login" style={{
              width: '100%', padding: '8px', borderRadius: '9999px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              fontSize: '13px', fontWeight: 600, color: '#fff', textDecoration: 'none',
            }}>
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
