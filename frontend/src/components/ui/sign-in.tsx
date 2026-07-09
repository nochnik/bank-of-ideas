import React, { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { SplineScene, type SplineSceneHandle } from '@/components/ui/splite'
import { Checkbox } from '@/components/ui/checkbox'

/* ─── Types ───────────────────────────────────────────────────── */
interface SignInPageProps {
  title?: string
  description?: string
  heroImageSrc?: string
  splineScene?: string
  onSignIn?: (e: React.FormEvent<HTMLFormElement>) => void
  onGoogleSignIn?: () => void
  onResetPassword?: () => void
  onCreateAccount?: () => void
  onBackHome?: () => void
  backHomeLabel?: string
  logoSrc?: string
  logoFilter?: string
  usernameLabel?: string
  usernamePlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  submitLabel?: string
  loading?: boolean
  error?: string
}

/* ─── BackButton ─────────────────────────────────────────────── */
function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  // Strip leading arrow chars to get clean label like "Главная"
  const text = label.replace(/^[←\s]+/, '')
  return (
    <button
      type="button" onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', padding: '4px 0',
        display: 'inline-flex', alignItems: 'center', gap: '2px',
        fontSize: '17px',
        fontWeight: 500,
        color: hovered ? '#0f1626' : 'rgba(15,22,38,0.55)',
        transition: 'color 200ms',
      }}
    >
      {/* Arrow slides out from overflow-hidden box */}
      <span style={{ overflow: 'hidden', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{
          display: 'inline-block',
          transform: hovered ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
          marginRight: hovered ? '4px' : '0px',
          width: hovered ? 'auto' : '0',
        }}>←</span>
      </span>
      {text}
    </button>
  )
}

/* ─── Field ───────────────────────────────────────────────────── */
function Field({
  id, label, name, type = 'text',
  placeholder, autoComplete, autoFocus, suffix,
  onFocus, onBlur, onClick,
}: {
  id: string; label: string; name: string; type?: string
  placeholder?: string; autoComplete?: string; autoFocus?: boolean
  suffix?: React.ReactNode
  onFocus?: () => void; onBlur?: () => void; onClick?: () => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} style={{
        fontSize: '11px', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: focused ? '#3b74e0' : 'rgba(15,22,38,0.42)',
        transition: 'color 200ms',
      }}>
        {label}
      </label>
      <div style={{
        position: 'relative', borderRadius: '999px',
        background: focused ? '#fff' : '#f5f7fc',
        border: `1.5px solid ${focused ? 'rgba(59,116,224,0.5)' : 'rgba(15,22,38,0.1)'}`,
        boxShadow: focused ? '0 0 0 3px rgba(59,116,224,0.08)' : 'none',
        transition: 'border-color 200ms, background 200ms, box-shadow 200ms',
      }}>
        <input
          id={id} name={name} type={type} placeholder={placeholder}
          autoComplete={autoComplete} autoFocus={autoFocus}
          onFocus={() => { setFocused(true); onFocus?.() }}
          onBlur={() => { setFocused(false); onBlur?.() }}
          onClick={() => onClick?.()}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            padding: suffix ? '14px 44px 14px 18px' : '14px 18px',
            fontSize: '15px', color: '#0f1626', fontFamily: 'inherit',
            borderRadius: '999px', boxSizing: 'border-box',
          }}
        />
        {suffix && (
          <span style={{
            position: 'absolute', right: '13px', top: '50%',
            transform: 'translateY(-50%)', display: 'flex', alignItems: 'center',
          }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────── */
export const SignInPage: React.FC<SignInPageProps> = ({
  title = 'Добро пожаловать',
  description = 'Войдите в аккаунт, чтобы продолжить работу на платформе',
  heroImageSrc, splineScene,
  onSignIn, onGoogleSignIn, onResetPassword, onCreateAccount, onBackHome,
  backHomeLabel = '← Главная',
  logoSrc, logoFilter: _logoFilter = 'brightness(0)',
  usernameLabel = 'Логин', usernamePlaceholder = 'Введите логин',
  passwordLabel = 'Пароль', passwordPlaceholder = '••••••••',
  submitLabel = 'Войти', loading = false, error,
}) => {
  const [showPw, setShowPw] = useState(false)
  const splineRef = useRef<SplineSceneHandle>(null)
  const [pwFocused, setPwFocused] = useState(false)
  const [loginFocused, setLoginFocused] = useState(false)
  const [typeText, setTypeText] = useState('')
  const [showType, setShowType] = useState(false)
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const usernameRef = useRef<string>('')
  const welcomeDone = useRef(false)

  const runTypewriter = (phrase: string, delay = 250) => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current)
    setTypeText('')
    setShowType(true)
    let i = 0
    const tick = () => {
      i++
      setTypeText(phrase.slice(0, i))
      if (i < phrase.length) typeTimerRef.current = setTimeout(tick, 75)
    }
    typeTimerRef.current = setTimeout(tick, delay)
  }

  const clearTypewriter = () => {
    if (typeTimerRef.current) clearTimeout(typeTimerRef.current)
    setTypeText('')
    setShowType(false)
  }

  // Welcome phrase on mount after robot settles
  useEffect(() => {
    const t = setTimeout(() => {
      splineRef.current?.triggerLookStraight()
      runTypewriter('Добро пожаловать!', 400)
      // Mark welcome done after phrase finishes typing (~400 + 16*75ms)
      setTimeout(() => { welcomeDone.current = true }, 400 + 'Добро пожаловать!'.length * 75 + 300)
    }, 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (pwFocused) {
      runTypewriter('Не смотрю...')
    } else if (loginFocused) {
      runTypewriter('Слушаю вас!')
    }
    return () => { if (typeTimerRef.current) clearTimeout(typeTimerRef.current) }
  }, [pwFocused, loginFocused])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget)
    usernameRef.current = fd.get('username') as string
    splineRef.current?.triggerLookStraight()
    runTypewriter(`Удачи вам, ${usernameRef.current}!`, 100)
    onSignIn?.(e)
  }

  return (
    <main style={{
      minHeight: '100dvh', width: '100dvw',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'Gilroy, system-ui, sans-serif',
      background: '#ffffff',
    }}>

      {/* ── Full-screen robot background ── */}
      {splineScene && (
        <>
          {/* Blue radial glow */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 65% at 55% 55%, rgba(59,116,224,0.5) 0%, rgba(30,70,180,0.2) 50%, transparent 75%)',
          }} />

          <div style={{ position: 'absolute', inset: 0, zIndex: 1, transform: 'translateX(0)' }}>
            <SplineScene ref={splineRef} scene={splineScene} className="w-full h-full" />
          </div>

          {/* Edge blur vignette */}
          <div style={{
            position: 'absolute', inset: '-2px', zIndex: 2, pointerEvents: 'none',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            maskImage: 'radial-gradient(ellipse 60% 60% at 55% 55%, transparent 55%, black 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 55% 55%, transparent 55%, black 85%)',
          }} />

          {/* Typewriter phrase */}
          <div style={{
            position: 'absolute', top: '40px', left: 0, right: 0,
            zIndex: 4, pointerEvents: 'none',
            display: 'flex', justifyContent: 'center',
            opacity: showType ? 1 : 0,
            transition: 'opacity 400ms',
          }}>
            <span style={{
              fontSize: '22px', fontFamily: 'Gilroy, system-ui, sans-serif',
              color: '#0f1626', letterSpacing: '0.05em', fontWeight: 700,
            }}>
              {typeText}
              <span style={{
                display: 'inline-block', width: '2px', height: '20px',
                background: '#0f1626', marginLeft: '3px', verticalAlign: 'middle',
                animation: 'blink 1s step-end infinite',
              }} />
            </span>
          </div>
        </>
      )}

      {heroImageSrc && !splineScene && (
        <img src={heroImageSrc} alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          zIndex: 0,
        }} />
      )}

      {/* ── Sidebar ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex',
      }}>
        <section
          aria-label="Вход в систему"
          style={{
            width: '420px', flexShrink: 0,
            height: '100%', overflowY: 'auto',
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column',
            padding: '40px 48px',
            boxShadow: '4px 0 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '56px' }}>
            {logoSrc && <img src={logoSrc} alt="Logo" style={{ height: '48px', objectFit: 'contain' }} />}
            {onBackHome && <BackButton label={backHomeLabel} onClick={onBackHome} />}
          </div>

          {/* Form content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              <hgroup style={{ margin: 0 }}>
                <h1 style={{
                  margin: 0, fontSize: '36px',
                  fontWeight: 800, letterSpacing: '-0.04em',
                  lineHeight: 1.15, color: '#0f1626',
                }}>
                  {title}
                </h1>
                <p style={{
                  margin: '12px 0 0', fontSize: '15px',
                  color: 'rgba(15,22,38,0.45)', lineHeight: 1.65,
                  fontWeight: 400,
                }}>
                  {description}
                </p>
              </hgroup>

              {/* Form */}
              <form noValidate onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <Field
                  id="username" label={usernameLabel} name="username"
                  placeholder={usernamePlaceholder}
                  autoComplete="username" autoFocus
                  onFocus={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookAtForm(); setLoginFocused(true); runTypewriter('Слушаю вас!') }}
                  onBlur={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookStraight(); setLoginFocused(false); clearTypewriter() }}
                  onClick={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookAtForm(); runTypewriter('Слушаю вас!') }}
                />

                <Field
                  id="password" label={passwordLabel} name="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder={passwordPlaceholder}
                  autoComplete="current-password"
                  onFocus={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookAway(); setPwFocused(true); runTypewriter('Не смотрю...') }}
                  onBlur={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookStraight(); setPwFocused(false); clearTypewriter() }}
                  onClick={() => { if (!welcomeDone.current) return; splineRef.current?.triggerLookAway(); runTypewriter('Не смотрю...') }}
                  suffix={
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      aria-label={showPw ? 'Скрыть' : 'Показать'}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(15,22,38,0.28)', display: 'flex', padding: 0,
                        transition: 'color 150ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#0f1626')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,22,38,0.28)')}
                    >
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                {/* Remember + reset */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', marginTop: '2px',
                }}>
                  <label style={{
                    display: 'flex', alignItems: 'center',
                    gap: '9px', cursor: 'pointer', userSelect: 'none',
                  }}>
                    <Checkbox name="rememberMe" size="md" />
                    <span style={{ fontSize: '14px', color: 'rgba(15,22,38,0.55)' }}>
                      Запомнить меня
                    </span>
                  </label>
                  {onResetPassword && (
                    <button type="button" onClick={onResetPassword}
                      style={{
                        fontSize: '12px', color: 'rgba(59,116,224,0.7)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'color 150ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#3b74e0')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,116,224,0.7)')}
                    >
                      Сбросить пароль
                    </button>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <p role="alert" style={{
                    margin: 0, fontSize: '12px', lineHeight: 1.5,
                    color: '#fca5a5', padding: '10px 14px',
                    background: 'rgba(225,29,72,0.15)',
                    border: '1px solid rgba(225,29,72,0.25)',
                    borderRadius: '10px',
                  }}>
                    {error}
                  </p>
                )}

                {/* Submit */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                <button
                  type="submit" disabled={loading}
                  style={{
                    marginTop: '6px', width: '100%', height: '44px',
                    borderRadius: '999px', fontSize: '15px', fontWeight: 400,
                    letterSpacing: '0.02em', color: '#fff',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1, fontFamily: 'inherit',
                    background: 'linear-gradient(135deg, #4a85f5 0%, #3b74e0 50%, #2a5ec8 100%)',
                    boxShadow: '0 2px 12px rgba(59,116,224,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                    transition: 'filter 200ms, box-shadow 200ms, opacity 150ms',
                  }}
                  onMouseEnter={e => {
                    if (loading) return
                    e.currentTarget.style.filter = 'brightness(1.12)'
                    e.currentTarget.style.boxShadow = '0 6px 28px rgba(59,116,224,0.6)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = ''
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,116,224,0.45)'
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '13px', height: '13px', borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderTopColor: '#fff', flexShrink: 0,
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      {submitLabel}
                    </span>
                  ) : submitLabel}
                </button>
                </div>
              </form>

              {onGoogleSignIn && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: 0 }} />
                    <span style={{ fontSize: '11px', color: 'rgba(15,22,38,0.3)', letterSpacing: '0.08em' }}>ИЛИ</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: 0 }} />
                  </div>
                  <button type="button" onClick={onGoogleSignIn}
                    style={{
                      width: '100%', height: '44px', borderRadius: '12px',
                      background: '#fff',
                      border: '1.5px solid rgba(15,22,38,0.1)',
                      color: 'rgba(15,22,38,0.6)', fontSize: '13px', fontWeight: 500,
                      fontFamily: 'inherit', cursor: 'pointer',
                      transition: 'border-color 180ms, box-shadow 180ms',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(15,22,38,0.22)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,22,38,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(15,22,38,0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    Продолжить с Google
                  </button>
                </div>
              )}

              {onCreateAccount && (
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(15,22,38,0.36)', textAlign: 'center' }}>
                  Нет аккаунта?{' '}
                  <button type="button" onClick={onCreateAccount}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(59,116,224,0.75)', fontFamily: 'inherit',
                      fontSize: '12px', fontWeight: 600, transition: 'color 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#3b74e0')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(59,116,224,0.75)')}
                  >
                    Создать аккаунт
                  </button>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>


    </main>
  )
}
