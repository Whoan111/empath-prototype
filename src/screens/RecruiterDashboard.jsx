import { useState } from 'react'
import { STAGE_TOKENS, STAGES, TRANSLATIONS } from '../designSystem'

// Totals = non-Screening candidates only (matching Kanban counts)
const POSITIONS = [
  { id:1, title:'UX Designer',       dept:'Product Design',  openDays:45, total:14,
    stages:{'Pre-Call':6, Interviews:5, Decision:2, Offer:1} },
  { id:2, title:'Frontend Engineer', dept:'Engineering',     openDays:31, total:9,
    stages:{'Pre-Call':4, Interviews:3, Decision:1, Offer:1} },
  { id:3, title:'Product Manager',   dept:'Product',         openDays:18, total:5,
    stages:{'Pre-Call':3, Interviews:1, Decision:1, Offer:0} },
  { id:4, title:'Data Analyst',      dept:'Data & Insights', openDays:9,  total:2,
    stages:{'Pre-Call':1, Interviews:1, Decision:0, Offer:0} },
  { id:5, title:'Brand Strategist',  dept:'Marketing',       openDays:22, total:3,
    stages:{'Pre-Call':1, Interviews:1, Decision:1, Offer:0} },
]

// ── Close-position confirmation modal ────────────────────────────────────────
function CloseConfirmModal({ pos, th, onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(5px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: th.cardBg, borderRadius:'0.875rem', padding:'28px 30px', width:420,
          border:`1px solid ${th.borderBrt}`,
          boxShadow:'0 24px 64px rgba(0,0,0,0.16)',
          animation:'modalIn 0.2s ease',
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{ fontSize:28, marginBottom:10 }}>🔒</div>
        <div style={{ fontFamily:'DM Serif Display, serif', fontSize:20, color:th.text, marginBottom:10 }}>
          Close this position?
        </div>
        <p style={{ fontSize:13, color:th.textDim, lineHeight:1.65, margin:'0 0 24px' }}>
          <strong style={{ color:th.text }}>{pos.title}</strong> will be moved to Closed positions.
          No new candidates will be accepted. You can reopen it at any time.
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${th.border}`, background:'transparent', color:th.textMid, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex:1.2, padding:'10px', borderRadius:9, border:'none', background:th.red, color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em' }}
          >
            Close position
          </button>
        </div>
      </div>
    </div>
  )
}

// ── New Position modal ─────────────────────────────────────────────────────────
function NewPositionModal({ th, onClose, onNavigate }) {
  const [title, setTitle] = useState('')
  const [dept,  setDept]  = useState('')

  const canSubmit = title.trim().length > 0

  const handle = (goToTriage) => {
    if (!canSubmit) return
    const newPos = { id: Date.now(), title: title.trim(), dept: dept.trim(), count: 0, openDays: 0 }
    onClose()
    if (goToTriage) onNavigate('triage', { position: newPos })
    // If not going to triage, the position is silently created (prototype behaviour)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    borderRadius: 8, border: `1px solid ${th.border}`,
    background: th.surface, color: th.text,
    fontSize: 13, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(5px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: th.cardBg, borderRadius: '0.875rem', padding: '28px 30px', width: 420,
          border: `1px solid ${th.borderBrt}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
          animation: 'modalIn 0.2s ease',
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div style={{ fontSize: 9, fontWeight: 700, color: th.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          New Opening
        </div>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: th.text, marginBottom: 22 }}>
          Create a new position
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            Position Title *
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = th.red)}
            onBlur={e => (e.target.style.borderColor = th.border)}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: 26 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            Department
          </label>
          <input
            value={dept}
            onChange={e => setDept(e.target.value)}
            placeholder="e.g. Product Design"
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = th.red)}
            onBlur={e => (e.target.style.borderColor = th.border)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px', borderRadius: 9, border: `1px solid ${th.border}`, background: 'transparent', color: th.textMid, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cancel
          </button>
          <button
            onClick={() => handle(false)}
            disabled={!canSubmit}
            style={{ flex: 1, padding: '10px', borderRadius: 9, border: `1px solid ${th.border}`, background: 'transparent', color: canSubmit ? th.text : th.textDim, fontSize: 13, cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', fontWeight: 500, opacity: canSubmit ? 1 : 0.5 }}
          >
            Create
          </button>
          <button
            onClick={() => handle(true)}
            disabled={!canSubmit}
            style={{ flex: 1.4, padding: '10px', borderRadius: 9, border: 'none', background: canSubmit ? th.red : th.border, color: 'white', fontSize: 12, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', letterSpacing: '0.02em', opacity: canSubmit ? 1 : 0.6, transition: 'all 0.15s' }}
          >
            Create &amp; Triage CVs
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Closed positions archive (collapsible) ────────────────────────────────────
function ClosedPositionsSection({ positions, th, T, stageT, onReopen }) {
  const [open, setOpen] = useState(false)
  if (!positions.length) return null
  return (
    <div style={{ marginTop:28 }}>
      {/* Section divider */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', marginBottom: open ? 12 : 0 }}
      >
        <span style={{ fontSize:11, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.08em' }}>
          Closed positions
        </span>
        <div style={{ flex:1, height:1, background:th.border }} />
        <span style={{ fontSize:11, fontWeight:700, color:th.textDim, background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:'2px 9px' }}>
          {positions.length}
        </span>
        <span style={{ fontSize:12, color:th.textDim, transform: open ? 'rotate(90deg)' : 'none', transition:'transform 0.2s', display:'inline-block' }}>
          ▶
        </span>
      </button>

      {open && (
        <div style={{ background:th.cardBg, border:`1px solid ${th.border}`, borderRadius:'0.75rem', overflow:'hidden' }}>
          {positions.map((p, i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 20px', borderBottom: i < positions.length - 1 ? `1px solid ${th.border}` : 'none', opacity:0.65 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{p.dept}</div>
                <div style={{ fontFamily:'DM Serif Display, serif', fontSize:15, color:th.text }}>{p.title}</div>
              </div>
              <span style={{ fontSize:9, fontWeight:700, color:th.textDim, background:th.surface, border:`1px solid ${th.border}`, padding:'2px 8px', borderRadius:20, letterSpacing:'0.06em', flexShrink:0 }}>CLOSED</span>
              <span style={{ fontSize:10, color:th.textDim, flexShrink:0 }}>📅 {T.openDays(p.openDays)}</span>
              <button
                onClick={() => onReopen(p.id)}
                style={{ fontSize:10, fontWeight:600, color:th.textMid, background:'transparent', border:`1px solid ${th.border}`, borderRadius:6, padding:'4px 12px', cursor:'pointer', fontFamily:'inherit', flexShrink:0, transition:'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = th.navy; e.currentTarget.style.color = th.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textMid }}
              >
                Reopen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Position card ─────────────────────────────────────────────────────────────
function PositionCard({ pos, th, stageT, T, onOpen, onCloseRequest }) {
  const [hov, setHov] = useState(false)
  const active   = (pos.stages.Interviews||0) + (pos.stages.Decision||0) + (pos.stages.Offer||0)
  const hasOffer = (pos.stages.Offer||0) > 0

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(pos)}
      style={{
        background: hov ? th.cardBgHov : th.cardBg,
        backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        border: `1px solid ${hov ? th.borderBrt : th.border}`,
        borderTop: `2.5px solid ${hov ? th.red : (hasOffer ? stageT.Offer.dot + '99' : th.border)}`,
        borderRadius: '0.75rem',
        padding: '20px 22px 18px',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        boxShadow: hov
          ? `0 0 0 1px ${th.redGlow}, 0 8px 28px rgba(0,0,0,0.12)`
          : `0 2px 10px rgba(0,0,0,0.06)`,
      }}
    >
      {/* Dept + title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>{pos.dept}</div>
          <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: th.text, margin: 0, lineHeight: 1.2 }}>
            {pos.title}
          </h2>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 30, fontWeight: 400, color: th.text, lineHeight: 1 }}>{pos.total}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: th.textDim, marginTop: 2, letterSpacing: '0.08em' }}>CANDIDATES</div>
        </div>
      </div>

      {/* Meta row: active · days open · Close position button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {active > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: stageT.Interviews.accent, background: stageT.Interviews.bg, padding: '2px 9px', borderRadius: 20 }}>
              {active} active
            </span>
          )}
          <span style={{ fontSize: 11, color: th.textDim }}>📅 {T.openDays(pos.openDays)}</span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onCloseRequest(pos) }}
          title="Close position"
          style={{
            fontSize: 10, fontWeight: 600, color: '#E90130',
            background: 'transparent',
            border: '1px solid #E9013030',
            borderRadius: 6, padding: '3px 10px',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.13s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F2'; e.currentTarget.style.borderColor = '#E90130' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E9013030' }}
        >
          Close position
        </button>
      </div>
    </div>
  )
}

function SpontaneousCard({ th, stageT, T, onOpen }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={() => onOpen({ id:0, title:'Spontaneous Applications', dept:'All Departments', openDays:0, total:3 })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? th.cardBgHov : th.cardBg,
        backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        border: `1px dashed ${hov ? th.navy+'99' : th.border}`,
        borderRadius: '0.75rem',
        padding: '18px 20px 16px',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'all 0.18s ease',
        boxShadow: hov ? `0 8px 28px ${th.navyGlow}` : `0 2px 10px rgba(0,0,0,0.06)`,
      }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:stageT.Decision.accent, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>{T.unsolicited}</div>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:19, fontWeight:400, color:th.text, margin:0 }}>{T.spontaneousLine1}</h2>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:19, fontWeight:400, color:th.textMid, margin:0 }}>{T.spontaneousLine2}</h2>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:30, fontWeight:400, color:stageT.Decision.dot, lineHeight:1 }}>3</div>
          <div style={{ fontSize:8, fontWeight:700, color:th.textDim, marginTop:2, letterSpacing:'0.08em' }}>{T.pendingLabel}</div>
        </div>
      </div>
      <p style={{ fontSize:11, color:th.textDim, margin:0, lineHeight:1.7 }}>{T.spontaneousDesc}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:5 }}>
          {T.deptTags.map(t => (
            <span key={t} style={{ fontSize:9, color:stageT.Decision.accent, background:stageT.Decision.bg, padding:'2px 7px', borderRadius:20 }}>{t}</span>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:hov ? th.navy : th.textDim, transition:'color 0.15s' }}>{T.reviewBtn}</span>
      </div>
    </div>
  )
}

export default function RecruiterDashboard({ theme, themeMode, lang, onNavigate }) {
  const T      = TRANSLATIONS[lang]
  const th     = theme
  const stageT = STAGE_TOKENS[themeMode]
  const hour   = new Date().getHours()
  const total  = POSITIONS.reduce((s,p) => s + p.total, 0)
  const [closedPositions, setClosedPositions] = useState(new Set())
  const [showNewPosition,  setShowNewPosition]  = useState(false)
  const [closePending,     setClosePending]     = useState(null)   // pos object | null

  const requestClose = (pos) => setClosePending(pos)
  const confirmClose = () => {
    if (!closePending) return
    setClosedPositions(s => { const n = new Set(s); n.add(closePending.id); return n })
    setClosePending(null)
  }
  const reopenPos = (id) => setClosedPositions(s => { const n = new Set(s); n.delete(id); return n })

  const stats = [
    { label: T.totalCandidates, value: total,                                                            color: th.text              },
    { label: T.inInterviews,    value: POSITIONS.reduce((s,p) => s+(p.stages.Interviews||0), 0),         color: stageT.Interviews.accent },
    { label: T.offerStage,      value: POSITIONS.reduce((s,p) => s+(p.stages.Offer||0), 0),              color: stageT.Offer.accent      },
    { label: T.avgDaysOpen,     value: Math.round(POSITIONS.reduce((s,p) => s+p.openDays, 0)/POSITIONS.length)+'d', color: stageT['Pre-Call'].accent },
  ]

  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <div style={{ maxWidth:980, margin:'0 auto', padding:'32px 32px 56px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:th.red, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 6px' }}>
              {T.dashboardBadge}
            </p>
            <h1 style={{ fontFamily:'DM Serif Display, Georgia, serif', fontSize:30, fontWeight:400, color:th.text, margin:'0 0 6px', letterSpacing:'-0.01em' }}>
              {T.greeting(hour)}, Valentina
            </h1>
            <p style={{ fontSize:13, color:th.textDim, margin:0 }}>
              {POSITIONS.length} {T.openPositions.toLowerCase()} · {total} {T.totalCandidates.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => setShowNewPosition(true)}
            style={{ padding:'10px 20px', borderRadius:'0.75rem', background:th.red, color:'white', border:'none', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', boxShadow:`0 0 20px ${th.redGlow}`, display:'flex', alignItems:'center', gap:8 }}
          >
            + New Position
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:30 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:th.cardBg, backdropFilter:th.blur, WebkitBackdropFilter:th.blur, border:`1px solid ${th.border}`, borderRadius:'0.75rem', padding:'14px 18px' }}>
              <div style={{ fontFamily:'DM Serif Display, serif', fontSize:26, fontWeight:400, color:s.color, lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:10, color:th.textDim, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Section divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
          <span style={{ fontSize:11, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.08em' }}>{T.openPositions}</span>
          <div style={{ flex:1, height:1, background:th.border }} />
        </div>

        {/* Open position cards (only non-closed) */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {POSITIONS.filter(p => !closedPositions.has(p.id)).map(pos => (
            <PositionCard key={pos.id} pos={pos} th={th} stageT={stageT} T={T}
              onOpen={p => onNavigate?.('kanban', { position:p })}
              onCloseRequest={requestClose} />
          ))}
          <SpontaneousCard th={th} stageT={stageT} T={T}
            onOpen={p => onNavigate?.('kanban', { position:p })} />
        </div>

        {/* Closed positions archive */}
        <ClosedPositionsSection
          positions={POSITIONS.filter(p => closedPositions.has(p.id))}
          th={th} T={T} stageT={stageT}
          onReopen={reopenPos}
        />

      </div>

      {/* New Position modal */}
      {showNewPosition && (
        <NewPositionModal
          th={th}
          onClose={() => setShowNewPosition(false)}
          onNavigate={onNavigate}
        />
      )}

      {/* Close position confirmation */}
      {closePending && (
        <CloseConfirmModal
          pos={closePending}
          th={th}
          onConfirm={confirmClose}
          onCancel={() => setClosePending(null)}
        />
      )}
    </div>
  )
}
