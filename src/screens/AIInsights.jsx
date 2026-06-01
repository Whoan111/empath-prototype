// ─────────────────────────────────────────────────────────────────────────────
// AIInsights.jsx — Recruiter-only AI Insights
// Place in: src/screens/AIInsights.jsx
//
// Grid of metric cards inspired by the widget-grid hierarchy in the reference
// photo — but using the existing Empath look & feel (white, coral, DM fonts).
//
// Each card: category label top-left · big number · small inline visual · descriptor
// Click any card → full drill-down panel slides in from the right
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    badge:       'Recruiter · Q2 2026',
    title:       'AI Insights',
    subtitle:    'Tap any card to explore the data in depth',
    updatedToday:'Updated today',
    breakdown:   'Breakdown',
    empathLabel: '✦ Empath insight',
    footer:      'Data aggregated across all positions · Recruiter-only',
  },
  it: {
    badge:       'Reclutatore · Q2 2026',
    title:       'Insight AI',
    subtitle:    'Tocca qualsiasi scheda per esplorare i dati in profondità',
    updatedToday:'Aggiornato oggi',
    breakdown:   'Suddivisione',
    empathLabel: '✦ Insight Empath',
    footer:      'Dati aggregati per tutte le posizioni · Solo reclutatori',
  },
}

// ── Brand tokens (identical to the rest of the app) ───────────────────────────
const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
}

// ── Card definitions ──────────────────────────────────────────────────────────
// Each card uses a bg (very light tint) + accent (darker, for number + visual)
const CARDS = [
  {
    id: 'pipeline',
    category: 'Pipeline',
    title: 'Pipeline Health',
    sub: 'Conversion Rate',
    value: '85', unit: '%', label: 'Strong',
    bg: '#FFF5F6', accent: '#C9394A', border: '#FECDD3',
    visual: 'wave',
    detail: {
      trend: [68,72,75,74,79,82,80,85],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Screening → Pre-call',  v: 62 },
        { label: 'Pre-call → Interviews', v: 54 },
        { label: 'Interviews → Offer',    v: 38 },
        { label: 'Offer accepted',        v: 85 },
      ],
      insight: 'Pipeline conversion improved 13 pts in 8 months. Biggest drop-off is between pre-call and interviews — tighten the pre-call brief.',
    },
  },
  {
    id: 'time',
    category: 'Speed',
    title: 'Time to Hire',
    sub: 'Average',
    value: '28', unit: 'd', label: 'Improving',
    bg: '#EFF6FF', accent: '#2563EB', border: '#BFDBFE',
    visual: 'ring', ringPct: 0.56,
    detail: {
      trend: [44,40,36,33,31,29,28,28],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Sourcing',     v: 25 },
        { label: 'Screening',   v: 18 },
        { label: 'Interviews',  v: 35 },
        { label: 'Decision',    v: 14 },
        { label: 'Offer',       v: 8  },
      ],
      insight: 'Down 36% from 44d in January. Interview scheduling is the longest phase — calendar integration could cut 5–8 days.',
    },
  },
  {
    id: 'nps',
    category: 'Experience',
    title: 'Candidate NPS',
    sub: 'Satisfaction',
    value: '72', unit: '', label: 'Excellent',
    bg: '#ECFDF5', accent: '#059669', border: '#A7F3D0',
    visual: 'hbar', barPct: 0.72,
    detail: {
      trend: [55,58,62,65,68,70,72,72],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Promoters',  v: 78 },
        { label: 'Passive',    v: 14 },
        { label: 'Detractors', v: 8  },
      ],
      insight: 'Empathetic messaging and same-day updates are cited as top positives in candidate exit surveys.',
    },
  },
  {
    id: 'diversity',
    category: 'Diversity',
    title: 'Gender Balance',
    sub: 'All Positions',
    value: '54', unit: '%', label: 'Women · Leading',
    bg: '#FAF5FF', accent: '#7C3AED', border: '#DDD6FE',
    visual: 'split',
    detail: {
      trend: [44,46,48,50,51,52,53,54],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Women',             v: 54 },
        { label: 'Men',               v: 41 },
        { label: 'Non-binary / Other',v: 5  },
      ],
      insight: 'Steady improvement since inclusive JD templates were introduced. Product design roles lead at 62% women.',
    },
  },
  {
    id: 'roles',
    category: 'Activity',
    title: 'Active Roles',
    sub: 'Open Positions',
    value: '+5', unit: '', label: 'This Quarter',
    bg: '#FFF7ED', accent: '#EA580C', border: '#FED7AA',
    visual: 'bars',
    detail: {
      trend: [3,4,4,6,5,7,6,8],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Engineering',    v: 38 },
        { label: 'Product Design', v: 30 },
        { label: 'Data',           v: 20 },
        { label: 'Marketing',      v: 12 },
      ],
      insight: 'Two senior engineering roles have been open 60+ days. Consider broadening the requirements or increasing sourcing budget.',
    },
  },
  {
    id: 'source',
    category: 'Sourcing',
    title: 'Top Source',
    sub: 'By Volume',
    value: '38', unit: '%', label: 'LinkedIn',
    bg: '#FFFBEB', accent: '#D97706', border: '#FDE68A',
    visual: 'scatter',
    detail: {
      trend: [26,28,30,32,35,36,37,38],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'LinkedIn',     v: 38 },
        { label: 'Referrals',    v: 25 },
        { label: 'Company site', v: 20 },
        { label: 'Job boards',   v: 12 },
        { label: 'Other',        v: 5  },
      ],
      insight: 'LinkedIn leads volume, but referrals close at 92% offer acceptance — the highest of any source. Invest in your referral programme.',
    },
  },
  {
    id: 'interviews',
    category: 'Volume',
    title: 'Interviews',
    sub: 'This Week',
    value: '24', unit: '', label: 'Normal Load',
    bg: '#FFF1F2', accent: '#E11D48', border: '#FECDD3',
    visual: 'radial', ringCount: 24,
    detail: {
      trend: [16,19,22,18,24,21,20,24],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Portfolio Reviews', v: 33 },
        { label: 'Technical',         v: 29 },
        { label: 'Culture Fit',       v: 21 },
        { label: 'Final Rounds',      v: 17 },
      ],
      insight: 'Final-round volume up 40% vs last quarter. Monitor panel capacity to avoid interviewer fatigue.',
    },
  },
  {
    id: 'response',
    category: 'Speed',
    title: 'Avg Response',
    sub: 'Recruiter Updates',
    value: '1.4', unit: 'd', label: 'Excellent',
    bg: '#F0FDF4', accent: '#16A34A', border: '#BBF7D0',
    visual: 'dots',
    detail: {
      trend: [3.5,3.0,2.6,2.2,1.9,1.7,1.5,1.4],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Same day', v: 45 },
        { label: '1 day',    v: 30 },
        { label: '2–3 days', v: 18 },
        { label: '4+ days',  v: 7  },
      ],
      insight: '75% of candidates hear back within 1 business day — up from 30% in January. Empath automated reminders are the key driver.',
    },
  },
  {
    id: 'offer',
    category: 'Outcomes',
    title: 'Offer Acceptance',
    sub: 'This Quarter',
    value: '89', unit: '%', label: '↑ 12% vs last Q',
    bg: '#FFF5F6', accent: '#C9394A', border: '#FECDD3',
    visual: 'wave',
    detail: {
      trend: [70,73,76,79,82,85,87,89],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'UX Designer',     v: 92 },
        { label: 'Frontend Eng.',   v: 88 },
        { label: 'Product Manager', v: 85 },
        { label: 'Data Analyst',    v: 90 },
      ],
      insight: 'Highest acceptance rate in company history. Growth-oriented candidate updates and faster offer delivery are key drivers.',
    },
  },
  {
    id: 'dropoff',
    category: 'Risk',
    title: 'Drop-off Risk',
    sub: 'Candidate Attrition',
    value: 'Low', unit: '', label: '3 at risk',
    bg: '#FFFBEB', accent: '#D97706', border: '#FDE68A',
    visual: 'hbar', barPct: 0.15,
    detail: {
      trend: [14,12,10,9,7,6,5,3],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
      breakdown: [
        { label: 'Silent 7+ days', v: 40 },
        { label: 'Long process',   v: 35 },
        { label: 'No feedback',    v: 25 },
      ],
      insight: '3 candidates flagged as high risk. Empath recommends crafting a personalised status update for each within 24 hours.',
    },
  },
]

// ── Inline SVG visuals (match Empath's light palette) ────────────────────────
function WaveVisual({ accent }) {
  return (
    <svg viewBox="0 0 140 42" style={{ width: '100%', height: 38 }}>
      <path d="M0 22 Q18 8 36 22 Q54 36 72 22 Q90 8 108 22 Q126 36 140 22"
        stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d="M0 28 Q18 18 36 28 Q54 38 72 28 Q90 18 108 28 Q126 38 140 28"
        stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.25"/>
      <polygon points="70,30 66,38 74,38" fill={accent} opacity="0.7"/>
    </svg>
  )
}

function RingVisual({ accent, pct = 0.6 }) {
  const r = 22, cx = 28, cy = 28
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  return (
    <svg viewBox="0 0 140 56" style={{ width: '100%', height: 50 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth="3" opacity="0.1"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} opacity="0.85"/>
      <text x="64" y="32" fontSize="10" fill={accent} fontFamily="DM Sans,sans-serif" fontWeight="600" opacity="0.6">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  )
}

function HbarVisual({ accent, barPct = 0.7 }) {
  return (
    <svg viewBox="0 0 140 34" style={{ width: '100%', height: 30 }}>
      <rect x="0" y="10" width="130" height="5" rx="3" fill={accent} opacity="0.12"/>
      <rect x="0" y="10" width={130 * barPct} height="5" rx="3" fill={accent} opacity="0.8"/>
      <polygon points={`${130 * barPct},18 ${130 * barPct - 4},26 ${130 * barPct + 4},26`} fill={accent} opacity="0.7"/>
    </svg>
  )
}

function SplitVisual({ accent }) {
  return (
    <svg viewBox="0 0 140 34" style={{ width: '100%', height: 30 }}>
      <rect x="0" y="12" width="140" height="7" rx="4" fill={accent} opacity="0.1"/>
      <rect x="0" y="12" width="75.6" height="7" rx="4" fill={accent} opacity="0.8"/>
      <rect x="75.6" y="12" width="57.4" height="7" rx="0" fill={accent} opacity="0.3"/>
      <text x="0"   y="30" fontSize="8" fill={accent} opacity="0.5" fontFamily="DM Sans,sans-serif">54% W</text>
      <text x="140" y="30" fontSize="8" fill={accent} opacity="0.4" textAnchor="end" fontFamily="DM Sans,sans-serif">41% M</text>
    </svg>
  )
}

function BarsVisual({ accent }) {
  const heights = [14,22,18,28,22,32,26,24,35,28,22,30,38,30,25]
  const maxH = 38
  return (
    <svg viewBox="0 0 140 48" style={{ width: '100%', height: 42 }}>
      {heights.map((h, i) => {
        const x = i * 9 + 1
        const y = maxH - h + 2
        const highlight = i === 12
        return (
          <rect key={i} x={x} y={y} width="6" height={h}
            fill={accent} rx="2"
            opacity={highlight ? 0.85 : 0.2 + i * 0.01}/>
        )
      })}
    </svg>
  )
}

function ScatterVisual({ accent }) {
  const dots = [
    {x:30,y:20,r:6},{x:48,y:14,r:4},{x:24,y:34,r:3},{x:60,y:24,r:3},
    {x:44,y:36,r:5},{x:70,y:16,r:3},{x:18,y:26,r:3},{x:82,y:28,r:4},
    {x:56,y:38,r:3},{x:36,y:10,r:3},{x:90,y:20,r:6},{x:74,y:38,r:3},
  ]
  return (
    <svg viewBox="0 0 140 52" style={{ width: '100%', height: 46 }}>
      <line x1="70" y1="2" x2="70" y2="48" stroke={accent} strokeWidth="0.5" opacity="0.15"/>
      <line x1="5"  y1="25" x2="135" y2="25" stroke={accent} strokeWidth="0.5" opacity="0.15"/>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={accent}
          opacity={0.3 + i * 0.05}/>
      ))}
    </svg>
  )
}

function RadialVisual({ accent, count = 24 }) {
  const total = 36, cx = 28, cy = 28, r = 22
  return (
    <svg viewBox="0 0 140 56" style={{ width: '100%', height: 50 }}>
      {Array.from({ length: total }).map((_, i) => {
        const angle = (i * (360 / total) - 90) * (Math.PI / 180)
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        const filled = i < count
        return <circle key={i} cx={x} cy={y} r={filled ? 2 : 1.2}
          fill={accent} opacity={filled ? 0.8 : 0.15}/>
      })}
      <text x="65" y="30" fontSize="11" fill={accent} fontWeight="600" fontFamily="DM Sans,sans-serif" opacity="0.65">{count} this wk</text>
    </svg>
  )
}

function DotsVisual({ accent }) {
  return (
    <svg viewBox="0 0 140 34" style={{ width: '100%', height: 28 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={8 + i * 13} cy="16" r={i < 7 ? 5 : 4}
          fill={accent} opacity={i < 7 ? 0.8 : 0.15}/>
      ))}
    </svg>
  )
}

function CardVisual({ card }) {
  const p = { accent: card.accent }
  switch (card.visual) {
    case 'wave':   return <WaveVisual   {...p} />
    case 'ring':   return <RingVisual   {...p} pct={card.ringPct} />
    case 'hbar':   return <HbarVisual   {...p} barPct={card.barPct} />
    case 'split':  return <SplitVisual  {...p} />
    case 'bars':   return <BarsVisual   {...p} />
    case 'scatter':return <ScatterVisual {...p} />
    case 'radial': return <RadialVisual  {...p} count={card.ringCount} />
    case 'dots':   return <DotsVisual   {...p} />
    default: return null
  }
}

// ── Trend sparkline for detail panel ─────────────────────────────────────────
function Sparkline({ data, accent }) {
  const n = data.length
  const min = Math.min(...data) * 0.92
  const max = Math.max(...data) * 1.06
  const W = 300, H = 70
  const pts = data.map((v, i) => [
    (i / (n - 1)) * W,
    H - ((v - min) / (max - min || 1)) * (H - 12) - 6,
  ])
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area = `${path} L${W},${H} L0,${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      <defs>
        <linearGradient id="spark-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-g)"/>
      <path d={path} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill={accent}/>)}
    </svg>
  )
}

// ── Detail side panel ─────────────────────────────────────────────────────────
function DetailPanel({ card, onClose, T }) {
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.25)', zIndex: 100, backdropFilter: 'blur(2px)' }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: C.white, zIndex: 101, display: 'flex', flexDirection: 'column',
        borderLeft: `1px solid ${C.border}`,
        animation: 'panelIn 0.22s ease',
        boxShadow: '-8px 0 32px rgba(201,57,74,0.08)',
      }}>
        <style>{`@keyframes panelIn { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

        {/* Panel header */}
        <div style={{ padding: '20px 22px 16px', background: card.bg, borderBottom: `1px solid ${card.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 600, color: card.accent, textTransform: 'uppercase', letterSpacing: '0.08em', background: card.border + '60', padding: '2px 8px', borderRadius: 20 }}>
                {card.category}
              </span>
              <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: '6px 0 2px' }}>{card.title}</h2>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{card.sub}</p>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: C.white, border: `1px solid ${C.border}`, cursor: 'pointer', fontSize: 16, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>
          </div>

          {/* Big value */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 14 }}>
            <span style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 48, fontWeight: 400, color: card.accent, lineHeight: 1 }}>{card.value}</span>
            {card.unit && <span style={{ fontSize: 20, color: card.accent, opacity: 0.6 }}>{card.unit}</span>}
          </div>

          {/* Sparkline */}
          <Sparkline data={card.detail.trend} accent={card.accent} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, color: C.muted }}>{card.detail.labels[0]}</span>
            <span style={{ fontSize: 9, color: C.muted }}>{card.detail.labels[card.detail.labels.length - 1]}</span>
          </div>
        </div>

        {/* Panel body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>

          {/* Breakdown */}
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>{T.breakdown}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 24 }}>
            {card.detail.breakdown.map((b, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.text }}>{b.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: card.accent }}>{b.v}%</span>
                </div>
                <div style={{ height: 5, background: card.bg, borderRadius: 3, border: `1px solid ${card.border}` }}>
                  <div style={{ height: '100%', width: `${b.v}%`, background: card.accent, borderRadius: 3, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div style={{ padding: '13px 15px', background: card.bg, borderRadius: 11, border: `1px solid ${card.border}`, borderLeft: `3px solid ${card.accent}` }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: card.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{T.empathLabel}</p>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, margin: 0 }}>{card.detail.insight}</p>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Single metric card ────────────────────────────────────────────────────────
function MetricCard({ card, onClick, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: card.bg,
        borderRadius: 14,
        border: `1.5px solid ${hovered ? card.accent + '60' : card.border}`,
        padding: '16px 16px 12px',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        minHeight: 176,
        transition: 'all 0.18s ease',
        boxShadow: hovered ? `0 6px 24px ${card.accent}18` : '0 1px 4px rgba(0,0,0,0.04)',
        animation: `cardIn 0.35s ease ${delay}s backwards`,
      }}
    >
      <style>{`@keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Top row: category label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>{card.title}</div>
          <div style={{ fontSize: 10, color: card.accent, fontWeight: 500, opacity: 0.8 }}>{card.sub}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 600, color: card.accent, background: card.border + '80', padding: '2px 7px', borderRadius: 20, flexShrink: 0, marginLeft: 6, letterSpacing: '0.04em' }}>
          {card.category}
        </span>
      </div>

      {/* Big metric */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 6 }}>
        <span style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 42, fontWeight: 400, color: card.accent, lineHeight: 1, letterSpacing: '-0.5px' }}>
          {card.value}
        </span>
        {card.unit && (
          <span style={{ fontSize: 17, color: card.accent, opacity: 0.6, marginBottom: 2 }}>{card.unit}</span>
        )}
      </div>

      {/* Inline visual */}
      <div style={{ flex: 1 }}>
        <CardVisual card={card} />
      </div>

      {/* Bottom label */}
      <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{card.label}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function AIInsights({ lang = 'en', onBack }) {
  const T = SCREEN_T[lang] || SCREEN_T.en
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 32px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 26 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{T.badge}</p>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
              {T.title}
            </h1>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{T.subtitle}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.suc }} />
            <span style={{ fontSize: 11, color: C.muted }}>{T.updatedToday}</span>
          </div>
        </div>

        {/* 4-column card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 13 }}>
          {CARDS.map((card, i) => (
            <MetricCard
              key={card.id}
              card={card}
              delay={i * 0.04}
              onClick={() => setSelected(card)}
            />
          ))}
        </div>

        <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 28, opacity: 0.6 }}>
          {T.footer}
        </p>
      </div>

      {/* Detail panel */}
      {selected && <DetailPanel card={selected} onClose={() => setSelected(null)} T={T} />}
    </div>
  )
}
