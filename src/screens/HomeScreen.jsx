import { useState } from 'react'

// ── Per-role notification content (all share the same navy palette) ───────────
const NAVY = '#D86350'
const NAVY_BG     = 'rgba(216,99,80,0.08)'
const NAVY_BORDER = 'rgba(216,99,80,0.20)'

const ROLE_NOTIFICATIONS = {
  recruiter: {
    headline: '5 candidates waiting to hear from you',
    body:     'Some have been in the dark for over a week. A message from you would mean a lot right now.',
    cta:      'Send messages →',
    screen:   'not-suitable',
  },
  'hiring-manager': {
    headline: '10 CVs ready for your review',
    body:     'Valentina has flagged top candidates for the UX Designer role. Your input is needed ASAP.',
    cta:      'Review CVs →',
    screen:   'hm-cv-review',
  },
  interviewer: {
    headline: '1 interview debrief to complete',
    body:     'Candidates value your feedback — the sooner you share it, the better their experience.',
    cta:      'Complete debrief →',
    screen:   'interviewer-debrief',
  },
}

// ── Messages icon — top-left shortcut to CraftMessage (recruiter only) ───────
function MessagesButton({ th, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate('craft', { from: 'home' })}
      title="Craft a message"
      style={{
        position: 'absolute', top: 28, left: 28, zIndex: 10,
        width: 42, height: 42, borderRadius: '50%',
        background: th.cardBg,
        border: `1.5px solid ${th.borderBrt}`,
        backdropFilter: th.blur,
        WebkitBackdropFilter: th.blur,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 14px rgba(0,0,0,0.10)',
        transition: 'background 0.18s, box-shadow 0.18s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = th.cardBgHov; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.15)'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.style.stroke = '#D86350' }}
      onMouseLeave={e => { e.currentTarget.style.background = th.cardBg; e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.10)'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.style.stroke = '' }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke={th.text} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'stroke 0.18s' }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  )
}

// ── Notification bubble — collapsible to a bell icon ─────────────────────────
function NotificationBubble({ role, th, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
  const n = ROLE_NOTIFICATIONS[role]
  if (!n) return null

  return (
    <div style={{
      position: 'absolute', top: 28, right: 62,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      gap: 10, zIndex: 10,
    }}>

      {/* ── Bell toggle ── */}
      <button
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? 'Show notification' : 'Hide notification'}
        style={{
          width: 42, height: 42, borderRadius: '50%',
          background: th.cardBg,
          border: `1.5px solid ${th.borderBrt}`,
          backdropFilter: th.blur,
          WebkitBackdropFilter: th.blur,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 14px rgba(0,0,0,0.10)',
          transition: 'background 0.18s, box-shadow 0.18s',
          position: 'relative', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = th.cardBgHov; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.15)'; const svg = e.currentTarget.querySelector('svg'); if(svg) svg.style.stroke = '#D86350' }}
        onMouseLeave={e => { e.currentTarget.style.background = th.cardBg; e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.10)'; const svg = e.currentTarget.querySelector('svg'); if(svg) svg.style.stroke = '' }}
      >
        {/* Bell SVG */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={th.text} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {/* Unread dot */}
        <span style={{
          position: 'absolute', top: 8, right: 8,
          width: 7, height: 7, borderRadius: '50%',
          background: '#D86350',
          border: '1.5px solid white',
          boxShadow: '0 0 5px rgba(216,99,80,0.55)',
        }} />
      </button>

      {/* ── Expandable card ── */}
      <div style={{
        width: 288,
        background: th.cardBg,
        border: `1.5px solid ${th.borderBrt}`,
        borderLeft: `3px solid ${NAVY}`,
        borderRadius: '0.75rem',
        padding: '15px 17px 14px',
        backdropFilter: `blur(28px)`,
        WebkitBackdropFilter: `blur(28px)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)',
        // Collapse animation
        opacity:       collapsed ? 0 : 1,
        transform:     collapsed ? 'translateY(-6px) scale(0.96)' : 'translateY(0) scale(1)',
        pointerEvents: collapsed ? 'none' : 'auto',
        transition:    'opacity 0.22s ease, transform 0.22s ease',
        transformOrigin: 'top right',
      }}>

        {/* Headline */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 3,
            background: '#D86350', boxShadow: '0 0 6px rgba(216,99,80,0.45)',
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: th.text, lineHeight: 1.4 }}>
            {n.headline}
          </span>
        </div>

        {/* Body */}
        <p style={{ fontSize: 11, color: th.textMid, margin: '0 0 13px', lineHeight: 1.65, paddingLeft: 15 }}>
          {n.body}
        </p>

        {/* CTA */}
        <button
          onClick={() => onNavigate(n.screen)}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8,
            background: NAVY, color: 'white',
            border: 'none', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '0.03em', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {n.cta}
        </button>
      </div>
    </div>
  )
}

// ── Role-specific screen configs ──────────────────────────────────────────────
const ROLE_CONFIGS = {
  recruiter: {
    capsule: [
      { id: 'triage',       label_en: 'CV Triage',    sub_en: 'Review incoming CVs',      label_it: 'Selezione CV',  sub_it: 'Rivedi i CV in arrivo'  },
      { id: 'not-suitable', label_en: 'Not Suitable', sub_en: 'Rejected candidates',       label_it: 'Non Idoneo',    sub_it: 'Candidati rifiutati'    },
      { id: 'dashboard',    label_en: 'Dashboard',    sub_en: 'Active positions',          label_it: 'Bacheca',       sub_it: 'Posizioni attive'       },
    ],
    bottom: [
      { id: 'interview-summaries', label_en: 'Interview Debriefs', label_it: 'Debrief Colloqui' },
      { id: 'insights',            label_en: 'AI Insights',        label_it: 'Analisi AI'        },
    ],
  },
  'hiring-manager': {
    capsule: [
      { id: 'hm-cv-review',   label_en: 'Review CVs', sub_en: 'CVs assigned by recruiter',  label_it: 'Revisiona CV',  sub_it: 'CV assegnati dal recruiter' },
      { id: 'hiring-manager', label_en: 'Dashboard',  sub_en: 'Active candidates',           label_it: 'Bacheca',       sub_it: 'Candidati attivi'           },
    ],
    bottom: [
      { id: 'decision-list', label_en: 'Decision Reports',   label_it: 'Report Decisionali' },
      { id: 'debrief-list',  label_en: 'Interview Debriefs', label_it: 'Debrief Colloqui'   },
    ],
  },
  interviewer: {
    capsule: [
      { id: 'interviewer-debrief',   label_en: 'Interview Debrief', sub_en: 'Provide feedback',      label_it: 'Debrief Colloquio', sub_it: 'Fornisci feedback'    },
      { id: 'interviewer-dashboard', label_en: 'My Interviews',     sub_en: 'Interviews performed',  label_it: 'I Miei Colloqui',   sub_it: 'Colloqui effettuati'  },
    ],
    bottom: [],
  },
}

// ── Capsule button ─────────────────────────────────────────────────────────────
function CapsuleButton({ label, sub, th, hov, onEnter, onLeave, onClick, isFirst }) {
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
        textAlign: 'center',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 12,
        color: hov ? th.textMid : th.textDim,
        transition: 'color 0.2s',
        letterSpacing: '0.01em',
        textAlign: 'center',
      }}>
        {sub}
      </div>
    </button>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function HomeScreen({ theme, themeMode, lang = 'en', onNavigate, userName, role = 'recruiter' }) {
  const th = theme
  const cfg = ROLE_CONFIGS[role] || ROLE_CONFIGS.recruiter
  const [hovId, setHovId] = useState(null)

  // Use first name only; strip the trailing initial (e.g. "Valentina O." → "Valentina")
  const firstName = userName
    ? userName.replace(/\s+[A-Z]\.$/, '').trim().split(' ')[0]
    : 'there'

  const greeting_en = 'What would you like to work on today?'
  const greeting_it = 'Su cosa vorresti lavorare oggi?'
  const question = lang === 'it' ? greeting_it : greeting_en

  const capsuleBtns = cfg.capsule.map(b => ({
    id:    b.id,
    label: lang === 'it' ? (b.label_it || b.label_en) : b.label_en,
    sub:   lang === 'it' ? (b.sub_it   || b.sub_en)   : b.sub_en,
  }))

  const bottomBtns = cfg.bottom.map(b => ({
    id:    b.id,
    label: lang === 'it' ? (b.label_it || b.label_en) : b.label_en,
  }))

  // Use a compound key so each capsule slot has a unique hover ID
  const hovKey = (idx, id) => `${idx}-${id}`

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {role === 'recruiter' && <MessagesButton th={th} onNavigate={onNavigate} />}
      <NotificationBubble role={role} th={th} onNavigate={onNavigate} />

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
            {question}
          </p>
        </div>

        {/* Capsule */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: capsuleBtns.length === 2 ? 600 : 860,
          borderRadius: '1.25rem',
          overflow: 'hidden',
          border: `1px solid ${th.borderBrt}`,
          backdropFilter: th.blur,
          WebkitBackdropFilter: th.blur,
          background: th.cardBg,
          boxShadow: '0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)',
        }}>
          {capsuleBtns.map((btn, i) => {
            const key = hovKey(i, btn.id)
            return (
              <CapsuleButton
                key={key}
                label={btn.label}
                sub={btn.sub}
                th={th}
                hov={hovId === key}
                onEnter={() => setHovId(key)}
                onLeave={() => setHovId(null)}
                onClick={() => onNavigate(btn.id)}
                isFirst={i === 0}
              />
            )
          })}
        </div>
      </div>

      {/* Bottom row — only if there are bottom buttons */}
      {bottomBtns.length > 0 && (
        <div style={{ padding: '0 60px 52px', display: 'flex', justifyContent: 'space-between' }}>
          {bottomBtns.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                padding: '11px 24px', borderRadius: '0.75rem',
                background: th.cardBg, border: `1px solid ${th.border}`,
                color: th.textMid, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = th.red; e.currentTarget.style.borderColor = th.borderBrt }}
              onMouseLeave={e => { e.currentTarget.style.color = th.textMid; e.currentTarget.style.borderColor = th.border }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
