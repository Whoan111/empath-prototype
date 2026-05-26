// ─────────────────────────────────────────────────────────────────────────────
// App.jsx  —  main entry point with sidebar + screen router
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import RecruiterDashboard from './screens/RecruiterDashboard'

// ── Brand tokens (keep in sync with RecruiterDashboard.jsx) ──────────────────
const C = {
  red:   '#C9394A',
  redBg: '#FFF5F6',
  white: '#FFFFFF',
  muted: '#78716C',
}

// ── Sidebar nav items  (null = divider) ───────────────────────────────────────
const NAV = [
  { id: 'dashboard',     label: 'Recruiter Dashboard', icon: '⊞' },
  { id: 'import',        label: 'Import CVs',           icon: '📂' },
  { id: 'craft',         label: 'Craft Message',        icon: '✉'  },
  null,
  { id: 'hr',            label: 'HR Manager View',      icon: '👔' },
  { id: 'questionnaire', label: 'Post-Interview',       icon: '📋' },
  null,
  { id: 'insights',      label: 'AI Insights',          icon: '📊' },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ screen, onNavigate }) {
  return (
    <aside style={{
      width: 210,
      background: '#1C1917',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '22px 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
          <div style={{
            width: 30, height: 30, background: C.red, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
          }}>
            ♥
          </div>
          <span style={{ color: 'white', fontSize: 17, fontFamily: 'DM Serif Display, Georgia, serif' }}>
            empath
          </span>
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.09em' }}>
          PUBLICIS SAPIENT
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((item, i) => {
          if (item === null) {
            return <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '5px 0' }} />
          }
          const active = screen === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '9px 11px', borderRadius: 7,
                border: 'none', cursor: 'pointer',
                background: active ? 'rgba(201,57,74,0.18)' : 'transparent',
                color: active ? '#F87171' : 'rgba(255,255,255,0.4)',
                fontSize: 12, fontWeight: active ? 500 : 400,
                textAlign: 'left', width: '100%',
                transition: 'all 0.1s',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: C.red,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: 'white', fontWeight: 600,
        }}>
          SR
        </div>
        <div>
          <div style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>Sarah R.</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>Recruiter</div>
        </div>
      </div>
    </aside>
  )
}

// ── Placeholder for screens not yet built ─────────────────────────────────────
function ComingSoon({ screen, onBack }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flex: 1, flexDirection: 'column', gap: 14,
      color: C.muted,
    }}>
      <div style={{ fontSize: 36 }}>🚧</div>
      <p style={{ fontSize: 14, margin: 0 }}>
        <strong style={{ color: '#1C1917', fontWeight: 600, textTransform: 'capitalize' }}>{screen}</strong> screen coming soon
      </p>
      <button
        onClick={onBack}
        style={{
          padding: '8px 16px', borderRadius: 8,
          background: C.red, color: 'white', border: 'none',
          fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        ← Back to Dashboard
      </button>
    </div>
  )
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('dashboard')
  // craftCandidate is passed when navigating to the craft screen from a row
  const [craftCandidate, setCraftCandidate] = useState(null)

  // Central navigation handler — screens call this instead of setScreen directly
  const handleNavigate = (dest, candidate = null) => {
    if (dest === 'craft' && candidate) setCraftCandidate(candidate)
    setScreen(dest)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'DM Sans, sans-serif',
      background: C.redBg,
      overflow: 'hidden',
    }}>
      <Sidebar screen={screen} onNavigate={handleNavigate} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screen === 'dashboard' && (
          <RecruiterDashboard onNavigate={handleNavigate} />
        )}
        {screen !== 'dashboard' && (
          <ComingSoon screen={screen} onBack={() => handleNavigate('dashboard')} />
        )}
      </main>
    </div>
  )
}
