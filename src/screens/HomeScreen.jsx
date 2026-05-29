import { useState } from 'react'

const MAIN_BTNS = [
  { id: 'triage',       label: 'CV Triage',    sub: 'Review incoming CVs'  },
  { id: 'not-suitable', label: 'Not Suitable', sub: 'Rejected candidates'  },
  { id: 'dashboard',    label: 'Dashboard',    sub: 'Active positions'     },
]

function CapsuleButton({ btn, th, hov, onEnter, onLeave, onClick, isFirst }) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        flex: 1,
        padding: '52px 36px',
        background: hov ? th.cardBgHov : 'transparent',
        border: 'none',
        borderLeft: isFirst ? 'none' : `1px solid ${th.border}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 11,
        transition: 'background 0.18s ease',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* top accent line on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: th.red,
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition: 'transform 0.2s ease',
        borderRadius: '3px 3px 0 0',
      }} />

      <div style={{
        fontFamily: 'DM Serif Display, Georgia, serif',
        fontSize: 27,
        fontWeight: 400,
        color: hov ? th.red : th.text,
        transition: 'color 0.2s',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
      }}>
        {btn.label}
      </div>
      <div style={{
        fontSize: 12,
        color: hov ? th.textMid : th.textDim,
        transition: 'color 0.2s',
        letterSpacing: '0.01em',
      }}>
        {btn.sub}
      </div>
    </button>
  )
}

export default function HomeScreen({ theme, themeMode, lang, onNavigate, userName }) {
  const th = theme
  const [hovId, setHovId] = useState(null)
  const firstName = userName ? userName.split(' ')[0] : 'there'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Main area — vertically centered */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 60px',
      }}>

        {/* Welcome copy */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: th.red,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            margin: '0 0 16px',
          }}>
            Publicis Sapient · empath
          </p>
          <h1 style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 44, fontWeight: 400,
            color: th.text, margin: '0 0 14px',
            letterSpacing: '-0.025em', lineHeight: 1.12,
          }}>
            Hello, {firstName}.
          </h1>
          <p style={{
            fontSize: 16, color: th.textMid, margin: 0,
            letterSpacing: '-0.01em', fontWeight: 300,
          }}>
            What would you like to work on today?
          </p>
        </div>

        {/* 3-section capsule */}
        <div style={{
          display: 'flex',
          width: '100%', maxWidth: 860,
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: `1px solid ${th.borderBrt}`,
          backdropFilter: th.blur,
          WebkitBackdropFilter: th.blur,
          background: th.cardBg,
          boxShadow: '0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)',
        }}>
          {MAIN_BTNS.map((btn, i) => (
            <CapsuleButton
              key={btn.id}
              btn={btn}
              th={th}
              hov={hovId === btn.id}
              onEnter={() => setHovId(btn.id)}
              onLeave={() => setHovId(null)}
              onClick={() => onNavigate(btn.id)}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>

      {/* Bottom row: Summary ← → AI Insights */}
      <div style={{ padding: '0 60px 52px', display: 'flex', justifyContent: 'space-between' }}>
        {[
          { label: 'Summary',     dest: 'interview-summaries' },
          { label: 'AI Insights', dest: 'insights' },
        ].map(({ label, dest }) => (
          <button
            key={dest}
            onClick={() => onNavigate(dest)}
            style={{
              padding: '11px 24px', borderRadius: '0.75rem',
              background: th.cardBg, border: `1px solid ${th.border}`,
              color: th.textMid, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = th.text; e.currentTarget.style.borderColor = th.borderBrt }}
            onMouseLeave={e => { e.currentTarget.style.color = th.textMid; e.currentTarget.style.borderColor = th.border }}
          >
            {label}
          </button>
        ))}
      </div>

    </div>
  )
}
