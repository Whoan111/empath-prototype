import { useState, useRef } from 'react'
import { THEMES, TRANSLATIONS } from './designSystem'
import HomeScreen                from './screens/HomeScreen'
import RecruiterDashboard        from './screens/RecruiterDashboard'
import CVImportScreening         from './screens/CVImportScreening'
import CVScreening               from './screens/CVScreening'
import CVTriage                  from './screens/CVTriage'
import KanbanBoard               from './screens/KanbanBoard'
import CraftMessage              from './screens/CraftMessage'
import RecruiterSummary          from './screens/RecruiterSummary'
import HiringManagerSummary      from './screens/HiringManagerSummary'
import HiringManagerDashboard    from './screens/HiringManagerDashboard'
import HMCVReview               from './screens/HMCVReview'
import PostInterviewQuestionnaire from './screens/PostInterviewQuestionnaire'
import SummaryList               from './screens/SummaryList'
import DebriefList               from './screens/DebriefList'
import AIInsights                from './screens/AIInsights'
import NotSuitable               from './screens/NotSuitable'
import InterviewerDashboard      from './screens/InterviewerDashboard'

const ROLES = {
  recruiter:       { id:'recruiter',       name:'Valentina O.', ini:'VO', title_en:'Recruiter',         title_it:'Reclutatore',             home:'home' },
  'hiring-manager':{ id:'hiring-manager',  name:'Andrea P.',    ini:'AP', title_en:'Hiring Manager',    title_it:'Responsabile Assunzioni', home:'home' },
  interviewer:     { id:'interviewer',     name:'Alessandro S.',ini:'AL', title_en:'Interviewer',        title_it:'Intervistatore',          home:'home' },
}

const BUILT = ['home','dashboard','import','screening','triage','not-suitable','kanban','craft',
  'interview-summaries','decision-list','recruiter-summary','hiring-summary',
  'hiring-manager','questionnaire','debrief-list','insights','hm-cv-review',
  'interviewer-dashboard', 'interviewer-debrief']

// ── Settings panel items ───────────────────────────────────────────────────────
const SETTINGS_SECTIONS = [
  [
    { icon: '👤', label: 'Edit profile'       },
    { icon: '🔔', label: 'Notifications'      },
    { icon: '🌐', label: 'Language & region'  },
    { icon: '🎨', label: 'Appearance'         },
  ],
  [
    { icon: '❓', label: 'Help & support'     },
    { icon: '✨', label: "What's new"         },
  ],
  [
    { icon: '🚪', label: 'Log out', danger: true },
  ],
]

// ── Fixed sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ screen, role, theme, themeMode, lang, onNavigate, onSwitchRole, onToggleLang, onToggleTheme, notifications, collapsed, onToggleCollapse }) {
  const th = theme
  const [showSettings, setShowSettings] = useState(false)
  const [showPicker,   setShowPicker]   = useState(false)
  const user = ROLES[role]
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en

  const NAV_RECRUITER = [
    { id: 'dashboard',           label: T.navDashboard     },
    { id: 'not-suitable',        label: T.navNotSuitable   },
    { id: 'triage',              label: T.navTriage        },
    { id: 'interview-summaries', label: T.navSummaries     },
    { id: 'insights',            label: T.navInsights      },
  ]
  const NAV_HM = [
    { id: 'hiring-manager',  label: T.navDashboard      },
    { id: 'hm-cv-review',    label: T.navHmCVReview     },
    { id: 'decision-list',   label: T.navDecisionBriefs },
    { id: 'debrief-list',    label: T.navDebriefs       },
  ]
  const NAV_INTERVIEWER = [
    { id: 'interviewer-dashboard', label: T.navInterviewerHome   },
    { id: 'interviewer-debrief',   label: T.navInterviewerDebrief },
  ]
  const navItems = role === 'hiring-manager' ? NAV_HM
                 : role === 'interviewer'    ? NAV_INTERVIEWER
                 : NAV_RECRUITER

  const isActive = (id) => {
    if (id === 'dashboard' && screen === 'kanban') return true
    return screen === id
  }

  const closeAll = () => { setShowSettings(false); setShowPicker(false) }

  return (
    <aside style={{
      width: collapsed ? 60 : 218,
      flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      // Transparent when collapsed so only the icon buttons float
      background: collapsed ? 'transparent' : th.sidebarBg,
      backdropFilter: collapsed ? 'none' : th.blur,
      WebkitBackdropFilter: collapsed ? 'none' : th.blur,
      borderRight: collapsed ? 'none' : `1px solid ${th.border}`,
      position: 'relative', zIndex: 10,
      transition: 'width 0.24s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      <style>{`
        .sb-nav-btn:hover   { background: rgba(27,36,97,0.06) !important; }
        .sb-role-opt:hover  { background: rgba(27,36,97,0.05) !important; }
        .sb-logo:hover      { opacity: 0.75; }
        .sb-set-item:hover  { background: rgba(27,36,97,0.04) !important; }
        .sb-collapse:hover  { background: rgba(27,36,97,0.08) !important; }
        .sb-name-row:hover  { background: rgba(27,36,97,0.04) !important; }
      `}</style>

      {/* ══════════════════════════════════════════════
          COLLAPSED VIEW — ♥ home button + › expand
          ══════════════════════════════════════════════ */}
      {collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 10 }}>
          {/* ♥ → always home */}
          <button
            className="sb-logo"
            onClick={() => onNavigate('home')}
            title="Home"
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: th.red, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: 'white',
              boxShadow: `0 0 14px ${th.redGlow}`,
              transition: 'opacity 0.15s', fontFamily: 'inherit',
            }}
          >♥</button>

          {/* › → expand sidebar */}
          <button
            onClick={onToggleCollapse}
            title="Expand menu"
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: th.textDim, fontFamily: 'inherit',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,1,48,0.12)'; e.currentTarget.style.color = '#E90130' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent';          e.currentTarget.style.color = th.textDim }}
          >›</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          EXPANDED VIEW — full sidebar
          ══════════════════════════════════════════════ */}
      {!collapsed && <>

        {/* ── Logo + collapse arrow ── */}
        <div style={{ padding: '22px 10px 18px 20px', borderBottom: `1px solid ${th.border}`, display: 'flex', alignItems: 'flex-start', gap: 6, whiteSpace: 'nowrap' }}>
          {/* Logo area — clicks navigate home */}
          <div
            className="sb-logo"
            onClick={() => onNavigate('home')}
            style={{ flex: 1, cursor: 'pointer', transition: 'opacity 0.15s', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, background: th.red, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: `0 0 14px ${th.redGlow}` }}>♥</div>
              <span style={{ color: th.text, fontSize: 17, fontFamily: 'DM Serif Display, Georgia, serif', letterSpacing: '-0.01em' }}>empath</span>
            </div>
            <div style={{ fontSize: 9, color: th.textDim, letterSpacing: '0.1em', fontWeight: 700 }}>PUBLICIS SAPIENT</div>
          </div>
          {/* ‹ collapse arrow — near the right border */}
          <button
            className="sb-collapse"
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              border: `1px solid ${th.border}`, background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: th.textDim, fontFamily: 'inherit',
              transition: 'all 0.15s', marginTop: 5,
            }}
          >‹</button>
        </div>

        {/* ── Nav ── */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item, i) => {
            if (!item) return <div key={i} style={{ height: 1, background: th.border, margin: '6px 4px' }} />
            const active = isActive(item.id)
            const hasDot = notifications?.[item.id]
            return (
              <button key={item.id} className="sb-nav-btn"
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px',
                  borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(233,1,48,0.08)' : 'transparent',
                  color: active ? th.red : th.textDim,
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  textAlign: 'left', width: '100%', fontFamily: 'inherit',
                  borderLeft: `3px solid ${active ? th.red : 'transparent'}`,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                <span style={{ flex: 1 }}>{item.label}</span>
                {hasDot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: th.red, flexShrink: 0, boxShadow: `0 0 6px ${th.redGlow}` }} />}
              </button>
            )
          })}
        </nav>

        {/* ── Language switcher ── */}
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${th.border}`, whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: 9, padding: 3, border: `1px solid ${th.border}` }}>
            {['en', 'it'].map(l => (
              <button key={l} onClick={() => { if (lang !== l) onToggleLang() }}
                style={{
                  flex: 1, padding: '5px 0', borderRadius: 7, border: 'none',
                  cursor: lang !== l ? 'pointer' : 'default', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: lang === l ? 700 : 400,
                  background: lang === l ? th.red : 'transparent',
                  color: lang === l ? 'white' : th.textDim,
                  transition: 'all 0.18s', letterSpacing: '0.05em',
                }}
              >
                {l === 'en' ? '🇬🇧 EN' : '🇮🇹 IT'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Profile switcher popup ── */}
        {showPicker && (
          <div style={{
            position: 'absolute', bottom: 62, left: 8, right: 8,
            background: themeMode === 'dark' ? 'rgba(16,14,28,0.97)' : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 12, border: `1px solid ${th.borderBrt}`, overflow: 'hidden',
            zIndex: 30, boxShadow: '0 -4px 28px rgba(0,0,0,0.18)',
          }}>
            <div style={{ padding: '8px 12px 5px', fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{T.switchView}</div>
            {Object.values(ROLES).map(r => (
              <button key={r.id} className="sb-role-opt"
                onClick={() => { onSwitchRole(r.id); closeAll() }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 12px', border: 'none', cursor: 'pointer', background: role === r.id ? 'rgba(233,1,48,0.07)' : 'transparent', fontFamily: 'inherit' }}
              >
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: th.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0 }}>{r.ini}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: th.text }}>{r.name}</div>
                  <div style={{ fontSize: 9, color: th.textDim }}>{lang === 'en' ? r.title_en : r.title_it}</div>
                </div>
                {role === r.id && <span style={{ marginLeft: 'auto', fontSize: 10, color: th.red }}>✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* ── Settings popup ── */}
        {showSettings && (
          <div style={{
            position: 'absolute', bottom: 62, left: 8, right: 8,
            background: themeMode === 'dark' ? 'rgba(16,14,28,0.97)' : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 12, border: `1px solid ${th.borderBrt}`, overflow: 'hidden',
            zIndex: 30, boxShadow: '0 -4px 28px rgba(0,0,0,0.18)',
          }}>
            <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${th.border}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Settings</div>
            </div>
            {SETTINGS_SECTIONS.map((section, si) => (
              <div key={si} style={{ borderBottom: si < SETTINGS_SECTIONS.length - 1 ? `1px solid ${th.border}` : 'none', padding: '4px 0' }}>
                {section.map(item => {
                  const isAppearance = item.label === 'Appearance'
                  return (
                    <button key={item.label} className={isAppearance ? 'sb-set-item' : 'sb-set-item'}
                      onClick={isAppearance ? onToggleTheme : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 9,
                        width: '100%', padding: '8px 14px',
                        border: 'none', background: 'transparent',
                        cursor: isAppearance ? 'pointer' : 'default',
                        fontFamily: 'inherit', color: item.danger ? '#C9394A' : th.textMid,
                        fontSize: 12, textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {isAppearance ? (
                        /* Light / Dark pill toggle */
                        <div style={{
                          display: 'flex', background: themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                          borderRadius: 20, padding: 2, gap: 2, border: `1px solid ${th.border}`,
                        }}>
                          {['light', 'dark'].map(m => (
                            <span key={m} style={{
                              fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 14,
                              background: themeMode === m ? (m === 'dark' ? '#1B2461' : 'white') : 'transparent',
                              color: themeMode === m ? (m === 'dark' ? 'rgba(255,255,255,0.9)' : '#1B2461') : th.textDim,
                              transition: 'all 0.18s',
                            }}>{m === 'light' ? '☀' : '◑'}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 9, color: th.textDim, background: th.surface || '#F5F4F3', padding: '1px 6px', borderRadius: 10, border: `1px solid ${th.border}` }}>soon</span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom row: [avatar + name → picker] [⚙ → settings] ── */}
        <div style={{ borderTop: `1px solid ${th.border}`, display: 'flex', alignItems: 'center' }}>

          {/* Left: name area → profile switcher */}
          <button
            className="sb-name-row"
            onClick={() => { setShowPicker(v => !v); setShowSettings(false) }}
            style={{
              flex: 1, padding: '11px 12px 11px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
              background: showPicker ? 'rgba(27,36,97,0.04)' : 'transparent',
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'background 0.15s',
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: th.red, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700, boxShadow: `0 0 8px ${th.redGlow}` }}>
              {user.ini}
            </div>
            <div style={{ textAlign: 'left', overflow: 'hidden', flex: 1 }}>
              <div style={{ color: th.text, fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ color: th.textDim, fontSize: 9 }}>{lang === 'en' ? user.title_en : user.title_it}</div>
            </div>
          </button>

          {/* Right: ⚙ gear → settings */}
          <button
            onClick={() => { setShowSettings(v => !v); setShowPicker(false) }}
            title="Settings"
            style={{
              width: 44, height: 44, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: showSettings ? 'rgba(27,36,97,0.06)' : 'transparent',
              border: 'none', borderLeft: `1px solid ${th.border}`,
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 20, color: showSettings ? th.text : th.textDim,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,36,97,0.06)'; e.currentTarget.style.color = th.text }}
            onMouseLeave={e => { e.currentTarget.style.background = showSettings ? 'rgba(27,36,97,0.06)' : 'transparent'; e.currentTarget.style.color = showSettings ? th.text : th.textDim }}
          >
            ⚙
          </button>
        </div>

      </>}
    </aside>
  )
}

function ComingSoon({ screen, onBack, theme }) {
  const th = theme
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 36 }}>🚧</div>
      <p style={{ fontSize: 14, margin: 0, color: th.textMid }}><strong style={{ color: th.text }}>{screen}</strong></p>
      <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: 8, background: th.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>←</button>
    </div>
  )
}

export default function App() {
  const [role,            setRole]            = useState('recruiter')
  const [screen,          setScreen]          = useState('home')
  const [screenData,      setScreenData]      = useState(null)
  const [lang,            setLang]            = useState('en')
  const [customPositions, setCustomPositions] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [themeMode, setThemeMode] = useState('light')
  const theme = THEMES[themeMode]

  const switchRole = (r) => { setRole(r); setScreen(ROLES[r].home); setScreenData(null) }
  const nav = (dest, data = null) => { setScreenData(data); setScreen(dest) }
  const goBack = () => nav(ROLES[role].home)

  const sp = { theme, themeMode, lang, onNavigate: nav, userName: ROLES[role].name }
  const toggleTheme = () => setThemeMode(m => m === 'light' ? 'dark' : 'light')

  // Cursor spotlight — direct DOM update for perf (no re-render on every mousemove)
  const spotlightRef = useRef(null)
  const handleMouseMove = (e) => {
    if (!spotlightRef.current) return
    const c = themeMode === 'dark'
      ? 'rgba(255,255,255,0.038)'
      : 'rgba(27,36,97,0.05)'
    spotlightRef.current.style.background =
      `radial-gradient(circle 360px at ${e.clientX}px ${e.clientY}px, ${c} 0%, transparent 70%)`
  }

  // Red dots: triage always has pending CVs, not-suitable always has pending messages,
  // hm-cv-review always has assigned CVs awaiting HM review
  const notifications = { triage: true, 'not-suitable': true, 'hm-cv-review': true, 'debrief-list': true, 'interviewer-debrief': true }

  return (
    <div onMouseMove={handleMouseMove} style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif', background: theme.bg, position: 'relative' }}>

      {/* ── Animated orb background (dark + light) ── */}
      <style>{`
        @keyframes empathOrb {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.85; }
          33%      { transform: translate(-42%,-58%) scale(1.12); opacity: 0.95; }
          66%      { transform: translate(-58%,-42%) scale(0.91); opacity: 0.75; }
        }
        @keyframes empathOrb2 {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.55; }
          50%      { transform: translate(-60%,-40%) scale(1.15); opacity: 0.72; }
        }
        @keyframes empathOrbL {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.85; }
          33%      { transform: translate(-42%,-58%) scale(1.11); opacity: 1;    }
          66%      { transform: translate(-58%,-42%) scale(0.92); opacity: 0.70; }
        }
        @keyframes empathOrbL2 {
          0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 0.65; }
          50%      { transform: translate(-60%,-40%) scale(1.14); opacity: 0.85; }
        }
      `}</style>

      {themeMode === 'dark' ? (
        <>
          {/* Primary orb — navy-purple centre */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none',
            top: '42%', left: '56%', width: 900, height: 900,
            borderRadius: '50%', filter: 'blur(68px)',
            background: 'radial-gradient(circle at center, rgba(80,40,200,0.58) 0%, rgba(27,36,97,0.40) 36%, rgba(233,1,48,0.12) 58%, transparent 72%)',
            transform: 'translate(-50%,-50%)',
            animation: 'empathOrb 8s ease-in-out infinite',
          }} />
          {/* Secondary orb — red-pink accent */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none',
            top: '62%', left: '38%', width: 600, height: 600,
            borderRadius: '50%', filter: 'blur(80px)',
            background: 'radial-gradient(circle at center, rgba(233,1,48,0.24) 0%, rgba(140,20,100,0.18) 42%, transparent 68%)',
            transform: 'translate(-50%,-50%)',
            animation: 'empathOrb2 11s ease-in-out infinite',
          }} />
          {/* Dot grid texture */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }} />
        </>
      ) : (
        <>
          {/* Light — primary orb: vibrant coral-red */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none',
            top: '38%', left: '58%', width: 900, height: 900,
            borderRadius: '50%', filter: 'blur(70px)',
            background: 'radial-gradient(circle at center, rgba(233,1,48,0.28) 0%, rgba(233,1,48,0.12) 38%, rgba(27,36,97,0.06) 60%, transparent 75%)',
            transform: 'translate(-50%,-50%)',
            animation: 'empathOrbL 9s ease-in-out infinite',
          }} />
          {/* Light — secondary orb: rich navy-blue */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none',
            top: '65%', left: '36%', width: 660, height: 660,
            borderRadius: '50%', filter: 'blur(80px)',
            background: 'radial-gradient(circle at center, rgba(27,36,97,0.22) 0%, rgba(27,36,97,0.10) 45%, rgba(233,1,48,0.06) 65%, transparent 78%)',
            transform: 'translate(-50%,-50%)',
            animation: 'empathOrbL2 12s ease-in-out infinite',
          }} />
          {/* Light — dot grid texture */}
          <div style={{
            position: 'fixed', zIndex: 0, pointerEvents: 'none', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </>
      )}

      <Sidebar
        screen={screen} role={role} theme={theme} themeMode={themeMode} lang={lang}
        onNavigate={nav} onSwitchRole={switchRole}
        onToggleLang={() => setLang(l => l === 'en' ? 'it' : 'en')}
        onToggleTheme={toggleTheme}
        notifications={notifications}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(v => !v)}
      />

      {/* ── Cursor spotlight overlay ── */}
      <div ref={spotlightRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 4 }} />

      {/* ── Fixed theme toggle (top-right) ── */}
      <button
        onClick={toggleTheme}
        title={themeMode === 'dark' ? 'Switch to light' : 'Switch to dark'}
        style={{
          position: 'fixed', top: 14, right: 16, zIndex: 50,
          width: 34, height: 34, borderRadius: '50%',
          background: theme.cardBg,
          border: `1.5px solid ${theme.borderBrt}`,
          backdropFilter: theme.blur, WebkitBackdropFilter: theme.blur,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, color: theme.text,
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = theme.cardBgHov; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.16)' }}
        onMouseLeave={e => { e.currentTarget.style.background = theme.cardBg;    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)' }}
      >
        {themeMode === 'dark' ? '☀' : '◑'}
      </button>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, transition: 'background 0.3s' }}>
        {screen === 'home'                && <HomeScreen                    {...sp} role={role} />}
        {screen === 'dashboard'           && <RecruiterDashboard            {...sp} customPositions={customPositions} onAddPosition={p => setCustomPositions(prev => [...prev, p])} />}
        {screen === 'kanban'              && <KanbanBoard                   {...sp} position={screenData?.position} restoreCandidate={screenData?.restoreCandidate} onBack={() => nav('dashboard')} />}
        {screen === 'import'              && <CVImportScreening             lang={lang} theme={theme} initialPosition={screenData?.position} extraPositions={customPositions} onBack={goBack} onNavigate={nav} />}
        {screen === 'screening'           && <CVScreening                   lang={lang} theme={theme} position={screenData?.position} manager={screenData?.manager} cvs={screenData?.cvs} onBack={() => nav('import')} onNavigate={nav} />}
        {screen === 'triage'              && <CVTriage                      {...sp} onBack={goBack} onNavigate={nav} initialPosition={screenData?.position} extraCandidates={screenData?.extraCandidates} />}
        {screen === 'not-suitable'        && <NotSuitable                   lang={lang} theme={theme} onBack={goBack} onNavigate={nav} />}
        {screen === 'craft'               && <CraftMessage                  lang={lang} theme={theme} candidate={screenData?.candidate || null} template={screenData?.template || null} from={screenData?.from || 'dashboard'} onBack={() => nav(screenData?.from || 'dashboard')} onNavigate={nav} />}
        {screen === 'interview-summaries' && <SummaryList                   mode="pre-call" onBack={goBack} onNavigate={nav} lang={lang} theme={theme} />}
        {screen === 'decision-list'       && <SummaryList                   mode="decision" onBack={goBack} onNavigate={nav} lang={lang} theme={theme} />}
        {screen === 'recruiter-summary'   && <RecruiterSummary              lang={lang} theme={theme} candidate={screenData?.candidate || null} onBack={() => nav('interview-summaries')} onNavigate={nav} />}
        {screen === 'hiring-summary'      && <HiringManagerSummary          lang={lang} theme={theme} candidate={screenData?.candidate || null} onBack={() => nav('decision-list')} onNavigate={nav} />}
        {screen === 'hm-cv-review'        && <HMCVReview                    lang={lang} theme={theme} onBack={() => nav('hiring-manager')} onNavigate={nav} />}
        {screen === 'hiring-manager'      && <HiringManagerDashboard        lang={lang} theme={theme} onBack={goBack} onNavigate={nav} />}
        {screen === 'questionnaire'       && <PostInterviewQuestionnaire    lang={lang} theme={theme} candidate={screenData?.candidate || null} isHM={role === 'hiring-manager'} summariesScreen={role === 'hiring-manager' ? 'debrief-list' : 'interviewer-debrief'} homeScreen={role === 'hiring-manager' ? 'hiring-manager' : 'interviewer-dashboard'} onBack={() => nav(role === 'hiring-manager' ? 'debrief-list' : 'interviewer-debrief')} onNavigate={nav} />}
        {screen === 'debrief-list'        && <DebriefList                   lang={lang} theme={theme} onBack={() => nav('hiring-manager')} onNavigate={nav} />}
        {screen === 'insights'            && <AIInsights                    {...sp} onBack={goBack} />}
        {screen === 'interviewer-dashboard' && <InterviewerDashboard        lang={lang} theme={theme} section="home"   onBack={goBack} onNavigate={nav} />}
        {screen === 'interviewer-debrief'   && <InterviewerDashboard        lang={lang} theme={theme} section="debrief" onBack={goBack} onNavigate={nav} />}
        {!BUILT.includes(screen)          && <ComingSoon screen={screen} onBack={goBack} theme={theme} />}
      </main>
    </div>
  )
}
