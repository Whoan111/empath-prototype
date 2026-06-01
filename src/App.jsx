import { useState } from 'react'
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
  recruiter:       { id:'recruiter',       name:'Valentina O.', ini:'VO', title_en:'Recruiter',         title_it:'Reclutatore',             home:'home'          },
  'hiring-manager':{ id:'hiring-manager',  name:'Andrea',       ini:'AM', title_en:'Hiring Manager',    title_it:'Responsabile Assunzioni', home:'hiring-manager'},
  interviewer:     { id:'interviewer',     name:'Alessandro M.',ini:'AL', title_en:'Interviewer',        title_it:'Intervistatore',          home:'interviewer-dashboard'},
}

const BUILT = ['home','dashboard','import','screening','triage','not-suitable','kanban','craft',
  'interview-summaries','decision-list','recruiter-summary','hiring-summary',
  'hiring-manager','questionnaire','debrief-list','insights','hm-cv-review',
  'interviewer-dashboard', 'interviewer-debrief']

// ── Fixed sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ screen, role, theme, lang, onNavigate, onSwitchRole, onToggleLang, notifications }) {
  const th = theme
  const [showPicker, setShowPicker] = useState(false)
  const user = ROLES[role]
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en

  const NAV_RECRUITER = [
    { id: 'triage',              label: T.navTriage        },
    { id: 'not-suitable',        label: T.navNotSuitable   },
    { id: 'dashboard',           label: T.navDashboard     },
    null,
    { id: 'insights',            label: T.navInsights      },
    { id: 'interview-summaries', label: T.navSummaries     },
  ]
  const NAV_HM = [
    { id: 'hm-cv-review',    label: T.navHmCVReview     },
    { id: 'hiring-manager',  label: T.navMyDashboard    },
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

  return (
    <aside style={{
      width: 218, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: th.sidebarBg,
      backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
      borderRight: `1px solid ${th.border}`,
      position: 'relative', zIndex: 10,
    }}>
      <style>{`
        .sb-nav-btn:hover { background: rgba(27,36,97,0.06) !important; }
        .sb-role-opt:hover { background: rgba(27,36,97,0.05) !important; }
        .sb-lang:hover { border-color: ${th.red} !important; color: ${th.red} !important; }
        .sb-logo:hover { opacity: 0.75; }
      `}</style>

      {/* Logo — click → home */}
      <div
        className="sb-logo"
        onClick={() => onNavigate('home')}
        style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${th.border}`, cursor: 'pointer', transition: 'opacity 0.15s' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, background: th.red, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: `0 0 14px ${th.redGlow}` }}>♥</div>
          <span style={{ color: th.text, fontSize: 17, fontFamily: 'DM Serif Display, Georgia, serif', letterSpacing: '-0.01em' }}>empath</span>
        </div>
        <div style={{ fontSize: 9, color: th.textDim, letterSpacing: '0.1em', fontWeight: 700 }}>PUBLICIS SAPIENT</div>
      </div>

      {/* Nav */}
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
                transition: 'all 0.15s',
              }}
            >
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasDot && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: th.red, flexShrink: 0, boxShadow: `0 0 6px ${th.redGlow}` }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Language toggle */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${th.border}` }}>
        <button className="sb-lang"
          onClick={onToggleLang}
          style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: `1px solid ${th.border}`, background: 'transparent', color: th.textMid, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', letterSpacing: '0.04em' }}
        >
          {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
        </button>
      </div>

      {/* Role picker popup */}
      {showPicker && (
        <div style={{ position: 'absolute', bottom: 68, left: 8, right: 8, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 12, border: `1px solid ${th.borderBrt}`, overflow: 'hidden', zIndex: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: '8px 12px 5px', fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{T.switchView}</div>
          {Object.values(ROLES).map(r => (
            <button key={r.id} className="sb-role-opt"
              onClick={() => { onSwitchRole(r.id); setShowPicker(false) }}
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

      {/* User chip */}
      <button
        onClick={() => setShowPicker(v => !v)}
        style={{ padding: '12px 14px', borderTop: `1px solid ${th.border}`, display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit', transition: 'background 0.15s' }}
      >
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: th.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700, flexShrink: 0, boxShadow: `0 0 10px ${th.redGlow}` }}>
          {user.ini}
        </div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ color: th.text, fontSize: 12, fontWeight: 500 }}>{user.name}</div>
          <div style={{ color: th.textDim, fontSize: 9 }}>{lang === 'en' ? user.title_en : user.title_it}</div>
        </div>
        <span style={{ color: th.textDim, fontSize: 10 }}>⇅</span>
      </button>
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
  const [role,       setRole]       = useState('recruiter')
  const [screen,     setScreen]     = useState('home')
  const [screenData, setScreenData] = useState(null)
  const [lang,       setLang]       = useState('en')

  // Light mode only
  const theme     = THEMES.light
  const themeMode = 'light'

  const switchRole = (r) => { setRole(r); setScreen(ROLES[r].home); setScreenData(null) }
  const nav = (dest, data = null) => { setScreenData(data); setScreen(dest) }
  const goBack = () => nav(ROLES[role].home)

  const sp = { theme, themeMode, lang, onNavigate: nav, userName: ROLES[role].name }

  // Red dots: triage always has pending CVs, not-suitable always has pending messages,
  // hm-cv-review always has assigned CVs awaiting HM review
  const notifications = { triage: true, 'not-suitable': true, 'hm-cv-review': true, 'interviewer-debrief': true }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif', background: theme.bg }}>
      <Sidebar
        screen={screen} role={role} theme={theme} lang={lang}
        onNavigate={nav} onSwitchRole={switchRole}
        onToggleLang={() => setLang(l => l === 'en' ? 'it' : 'en')}
        notifications={notifications}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {screen === 'home'                && <HomeScreen                    {...sp} />}
        {screen === 'dashboard'           && <RecruiterDashboard            {...sp} />}
        {screen === 'kanban'              && <KanbanBoard                   {...sp} position={screenData?.position} onBack={() => nav('dashboard')} />}
        {screen === 'import'              && <CVImportScreening             lang={lang} onBack={goBack} onNavigate={nav} />}
        {screen === 'screening'           && <CVScreening                   lang={lang} position={screenData?.position} manager={screenData?.manager} cvs={screenData?.cvs} onBack={() => nav('import')} onNavigate={nav} />}
        {screen === 'triage'              && <CVTriage                      {...sp} onBack={goBack} onNavigate={nav} initialPosition={screenData?.position} />}
        {screen === 'not-suitable'        && <NotSuitable                   lang={lang} theme={theme} onBack={goBack} onNavigate={nav} />}
        {screen === 'craft'               && <CraftMessage                  lang={lang} candidate={screenData?.candidate || null} onBack={goBack} onNavigate={nav} />}
        {screen === 'interview-summaries' && <SummaryList                   mode="pre-call" onBack={goBack} onNavigate={nav} lang={lang} />}
        {screen === 'decision-list'       && <SummaryList                   mode="decision" onBack={goBack} onNavigate={nav} lang={lang} />}
        {screen === 'recruiter-summary'   && <RecruiterSummary              lang={lang} candidate={screenData?.candidate || null} onBack={() => nav('interview-summaries')} onNavigate={nav} />}
        {screen === 'hiring-summary'      && <HiringManagerSummary          lang={lang} candidate={screenData?.candidate || null} onBack={() => nav('decision-list')} onNavigate={nav} />}
        {screen === 'hm-cv-review'        && <HMCVReview                    lang={lang} theme={theme} onBack={() => nav('hiring-manager')} onNavigate={nav} />}
        {screen === 'hiring-manager'      && <HiringManagerDashboard        lang={lang} onBack={goBack} onNavigate={nav} />}
        {screen === 'questionnaire'       && <PostInterviewQuestionnaire    lang={lang} candidate={screenData?.candidate || null} isHM={role === 'hiring-manager'} onBack={() => nav('debrief-list')} onNavigate={nav} />}
        {screen === 'debrief-list'        && <DebriefList                   lang={lang} onBack={() => nav('hiring-manager')} onNavigate={nav} />}
        {screen === 'insights'            && <AIInsights                    {...sp} onBack={goBack} />}
        {screen === 'interviewer-dashboard' && <InterviewerDashboard        lang={lang} theme={theme} section="home"   onBack={goBack} onNavigate={nav} />}
        {screen === 'interviewer-debrief'   && <InterviewerDashboard        lang={lang} theme={theme} section="debrief" onBack={goBack} onNavigate={nav} />}
        {!BUILT.includes(screen)          && <ComingSoon screen={screen} onBack={goBack} theme={theme} />}
      </main>
    </div>
  )
}
