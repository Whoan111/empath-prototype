// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — sidebar + screen router + role switcher
//
// Two POVs switchable from the profile chip in the sidebar:
//   Recruiter  (Sarah R.)  — full platform access
//   Hiring Manager (Marco T.) — focused on review, decisions, debriefs
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import RecruiterDashboard        from './screens/RecruiterDashboard'
import CVImportScreening         from './screens/CVImportScreening'
import CVScreening               from './screens/CVScreening'
import CVTriage                  from './screens/CVTriage'
import CraftMessage              from './screens/CraftMessage'
import RecruiterSummary          from './screens/RecruiterSummary'
import HiringManagerSummary      from './screens/HiringManagerSummary'
import HiringManagerDashboard    from './screens/HiringManagerDashboard'
import PostInterviewQuestionnaire from './screens/PostInterviewQuestionnaire'
import SummaryList               from './screens/SummaryList'

const C = { red: '#C9394A', redBg: '#FFF5F6', muted: '#78716C', border: '#F0D0D4', white: '#FFFFFF', gray: '#F5F4F3' }

// ── Role profiles ─────────────────────────────────────────────────────────────
const ROLES = {
  recruiter: {
    id: 'recruiter', name: 'Sarah R.', title: 'Recruiter',
    ini: 'SR', home: 'dashboard', color: C.red,
  },
  'hiring-manager': {
    id: 'hiring-manager', name: 'Marco T.', title: 'Hiring Manager',
    ini: 'MT', home: 'hiring-manager', color: '#2563EB',
  },
}

// ── Nav definitions per role ──────────────────────────────────────────────────
const NAV = {
  recruiter: [
    { id: 'dashboard',           label: 'Recruiter Dashboard',  icon: '⊞' },
    { id: 'import',              label: 'Import CVs',           icon: '📂' },
    { id: 'triage',              label: 'CV Triage',            icon: '🗂'  },
    { id: 'craft',               label: 'Craft Message',        icon: '✉'  },
    { id: 'interview-summaries', label: 'Interview Summaries',  icon: '📋' },
    null,
    { id: 'insights',            label: 'AI Insights',          icon: '✦'  },
  ],
  'hiring-manager': [
    { id: 'hiring-manager',  label: 'My Dashboard',           icon: '⊞' },
    { id: 'decision-list',   label: 'Decision Briefs',        icon: '📊' },
    { id: 'questionnaire',   label: 'Post-interview Debrief', icon: '📝' },
  ],
}

// import/screening are treated as one flow in the nav highlight
const IMPORT_FAMILY = ['import', 'screening']

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ screen, role, onNavigate, onSwitchRole }) {
  const [showRolePicker, setShowRolePicker] = useState(false)
  const user    = ROLES[role]
  const navItems = NAV[role] || NAV.recruiter
  const otherRole = role === 'recruiter' ? ROLES['hiring-manager'] : ROLES['recruiter']

  return (
    <aside style={{ width: 218, background: '#1C1917', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>

      {/* Logo */}
      <div style={{ padding: '22px 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
          <div style={{ width: 30, height: 30, background: C.red, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>♥</div>
          <span style={{ color: 'white', fontSize: 17, fontFamily: 'DM Serif Display, Georgia, serif' }}>empath</span>
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.09em' }}>PUBLICIS SAPIENT</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item, i) => {
          if (item === null) return <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '6px 0' }} />
          const inImportFamily = item.id === 'import' && IMPORT_FAMILY.includes(screen)
          const active = screen === item.id || inImportFamily
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px',
              borderRadius: 7, border: 'none', cursor: 'pointer',
              background: active ? 'rgba(201,57,74,0.18)' : 'transparent',
              color: active ? '#F87171' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: active ? 500 : 400,
              textAlign: 'left', width: '100%', transition: 'all 0.1s', fontFamily: 'inherit',
            }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {inImportFamily && screen === 'screening' && (
                <span style={{ marginLeft: 'auto', fontSize: 9, color: '#F87171', background: 'rgba(201,57,74,0.14)', padding: '2px 6px', borderRadius: 10 }}>
                  Screening
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Role switcher dropdown (appears above footer) */}
      {showRolePicker && (
        <div style={{ position: 'absolute', bottom: 64, left: 10, right: 10, background: '#2C2A28', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', zIndex: 10 }}>
          <div style={{ padding: '8px 12px 6px', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Switch view
          </div>
          {Object.values(ROLES).map(r => (
            <button key={r.id} onClick={() => { onSwitchRole(r.id); setShowRolePicker(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 9, width: '100%',
              padding: '10px 12px', border: 'none', cursor: 'pointer',
              background: role === r.id ? 'rgba(201,57,74,0.15)' : 'transparent',
              fontFamily: 'inherit', transition: 'background 0.1s',
            }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {r.ini}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>{r.name}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{r.title}</div>
              </div>
              {role === r.id && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#F87171' }}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* User chip — click to switch POV */}
      <button
        onClick={() => setShowRolePicker(v => !v)}
        style={{
          padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: showRolePicker ? 'rgba(255,255,255,0.05)' : 'transparent',
          border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit',
          transition: 'background 0.1s',
        }}
      >
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 600, flexShrink: 0 }}>
          {user.ini}
        </div>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>{user.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>{user.title}</div>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>⇅</span>
      </button>
    </aside>
  )
}

function ComingSoon({ screen, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'column', gap: 14, color: C.muted }}>
      <div style={{ fontSize: 36 }}>🚧</div>
      <p style={{ fontSize: 14, margin: 0 }}>
        <strong style={{ color: '#1C1917', fontWeight: 600 }}>{screen}</strong> — coming soon
      </p>
      <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        ← Back
      </button>
    </div>
  )
}

// ── App root ──────────────────────────────────────────────────────────────────
const BUILT = ['dashboard','import','screening','triage','craft','interview-summaries','decision-list','recruiter-summary','hiring-summary','hiring-manager','questionnaire']

export default function App() {
  const [role,       setRole]       = useState('recruiter')
  const [screen,     setScreen]     = useState('dashboard')
  const [screenData, setScreenData] = useState(null)

  const switchRole = (newRole) => {
    setRole(newRole)
    setScreen(ROLES[newRole].home)
    setScreenData(null)
  }

  const handleNavigate = (dest, data = null) => {
    setScreenData(data)
    setScreen(dest)
  }

  const goBack = () => handleNavigate(ROLES[role].home)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif', background: C.redBg, overflow: 'hidden' }}>
      <Sidebar
        screen={screen}
        role={role}
        onNavigate={handleNavigate}
        onSwitchRole={switchRole}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {screen === 'dashboard' && (
          <RecruiterDashboard onNavigate={handleNavigate} />
        )}

        {screen === 'import' && (
          <CVImportScreening onBack={goBack} onNavigate={handleNavigate} />
        )}

        {screen === 'triage' && (
          <CVTriage onBack={goBack} onNavigate={handleNavigate} />
        )}

        {screen === 'screening' && (
          <CVScreening
            position={screenData?.position}
            manager={screenData?.manager}
            cvs={screenData?.cvs}
            onBack={() => handleNavigate('import')}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'craft' && (
          <CraftMessage candidate={screenData?.candidate || null} onBack={goBack} onNavigate={handleNavigate} />
        )}

        {screen === 'interview-summaries' && (
          <SummaryList mode="pre-call" onBack={goBack} onNavigate={handleNavigate} />
        )}

        {screen === 'decision-list' && (
          <SummaryList mode="decision" onBack={goBack} onNavigate={handleNavigate} />
        )}

        {/* Individual summary screens — reached from list or candidate panel */}
        {screen === 'recruiter-summary' && (
          <RecruiterSummary candidate={screenData?.candidate || null} onBack={() => handleNavigate('interview-summaries')} onNavigate={handleNavigate} />
        )}

        {screen === 'hiring-summary' && (
          <HiringManagerSummary candidate={screenData?.candidate || null} onBack={() => handleNavigate('decision-list')} onNavigate={handleNavigate} />
        )}

        {screen === 'hiring-manager' && (
          <HiringManagerDashboard onBack={goBack} onNavigate={handleNavigate} />
        )}

        {screen === 'questionnaire' && (
          <PostInterviewQuestionnaire
            candidate={screenData?.candidate || null}
            isHM={role === 'hiring-manager'}
            onBack={() => handleNavigate('hiring-manager')}
            onNavigate={handleNavigate}
          />
        )}

        {!BUILT.includes(screen) && (
          <ComingSoon screen={screen} onBack={goBack} />
        )}
      </main>
    </div>
  )
}
