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

// ── Confetti shapes for celebration ──────────────────────────────────────────
const CONFETTI_SHAPES = [
  { color:'#D86350', x:8,  delay:0,    size:9,  circle:false, rotate:45  },
  { color:'#1B2461', x:18, delay:0.12, size:6,  circle:true,  rotate:0   },
  { color:'#D86350', x:30, delay:0.06, size:10, circle:false, rotate:-30 },
  { color:'#FBBF24', x:42, delay:0.18, size:7,  circle:true,  rotate:0   },
  { color:'#1B2461', x:54, delay:0.03, size:9,  circle:false, rotate:60  },
  { color:'#D86350', x:65, delay:0.15, size:6,  circle:true,  rotate:0   },
  { color:'#FBBF24', x:76, delay:0.09, size:8,  circle:false, rotate:-45 },
  { color:'#1B2461', x:88, delay:0.21, size:7,  circle:true,  rotate:0   },
  { color:'#D86350', x:12, delay:0.28, size:5,  circle:false, rotate:30  },
  { color:'#FBBF24', x:50, delay:0.33, size:8,  circle:true,  rotate:0   },
  { color:'#1B2461', x:72, delay:0.24, size:6,  circle:false, rotate:-60 },
  { color:'#D86350', x:36, delay:0.38, size:7,  circle:true,  rotate:0   },
  { color:'#FBBF24', x:92, delay:0.16, size:5,  circle:false, rotate:20  },
]

// ── Close-position modal (choose reason → celebrate or silently close) ────────
function ClosePositionModal({ pos, th, onConfirm, onCancel }) {
  const [phase, setPhase] = useState('choose') // 'choose' | 'celebrate'

  const choose = (reason) => {
    if (reason === 'hired') {
      setPhase('celebrate')
    } else {
      onConfirm('no-match')
    }
  }

  // ── Phase 1: choose reason ─────────────────────────────────────────────────
  if (phase === 'choose') {
    return (
      <div
        onClick={onCancel}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.42)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(6px)' }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: th.cardBg, borderRadius:'0.875rem', padding:'28px 30px', width:450,
            border:`1px solid ${th.borderBrt}`,
            boxShadow:'0 28px 72px rgba(0,0,0,0.2)',
            animation:'modalIn 0.22s ease',
          }}
        >
          <div style={{ fontSize:26, marginBottom:10 }}>🔒</div>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:21, color:th.text, marginBottom:8 }}>
            Close this position?
          </div>
          <p style={{ fontSize:13, color:th.textDim, lineHeight:1.65, margin:'0 0 22px' }}>
            <strong style={{ color:th.text }}>{pos.title}</strong> will be moved to the archive.
            No new candidates will be accepted. You can reopen it at any time.
          </p>

          <div style={{ fontSize:10, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:10 }}>
            Why are you closing it?
          </div>

          {/* Option A — Found the right candidate */}
          <button
            onClick={() => choose('hired')}
            style={{
              width:'100%', padding:'15px 16px', borderRadius:11, marginBottom:9,
              border:`2px solid rgba(5,150,105,0.22)`,
              background:`rgba(5,150,105,0.05)`,
              cursor:'pointer', fontFamily:'inherit', textAlign:'left',
              display:'flex', alignItems:'center', gap:13,
              transition:'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(5,150,105,0.5)'; e.currentTarget.style.background = 'rgba(5,150,105,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(5,150,105,0.22)'; e.currentTarget.style.background = 'rgba(5,150,105,0.05)' }}
          >
            <span style={{ fontSize:22, flexShrink:0 }}>🎯</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#065F46', marginBottom:3 }}>
                We found the right candidate
              </div>
              <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.5 }}>
                The position has been filled — great work.
              </div>
            </div>
          </button>

          {/* Option B — Didn't find anyone */}
          <button
            onClick={() => choose('no-match')}
            style={{
              width:'100%', padding:'15px 16px', borderRadius:11, marginBottom:22,
              border:`1px solid ${th.border}`,
              background:th.surface,
              cursor:'pointer', fontFamily:'inherit', textAlign:'left',
              display:'flex', alignItems:'center', gap:13,
              transition:'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = th.borderBrt; e.currentTarget.style.background = th.surfaceHov }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.background = th.surface }}
          >
            <span style={{ fontSize:22, flexShrink:0 }}>🔍</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:th.textMid, marginBottom:3 }}>
                We didn't find anyone for now
              </div>
              <div style={{ fontSize:11, color:th.textDim, lineHeight:1.5 }}>
                Archived · You can revisit this in the closed positions below.
              </div>
            </div>
          </button>

          <button
            onClick={onCancel}
            style={{ width:'100%', padding:'10px', borderRadius:9, border:`1px solid ${th.border}`, background:'transparent', color:th.textMid, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Phase 2: celebration ───────────────────────────────────────────────────
  return (
    <div
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(8px)' }}
    >
      <style>{`
        @keyframes confettiPop {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
          12%  { opacity: 1; }
          100% { transform: translateY(-180px) rotate(540deg) scale(0.3); opacity: 0; }
        }
        @keyframes celebrateIn {
          0%   { opacity: 0; transform: scale(0.88) translateY(12px); }
          65%  { transform: scale(1.02) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes trophyBounce {
          0%   { transform: scale(0) rotate(-15deg); }
          55%  { transform: scale(1.25) rotate(8deg); }
          75%  { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes shimmerPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      <div style={{ position:'relative', width:480 }}>

        {/* Confetti particles */}
        {CONFETTI_SHAPES.map((s, i) => (
          <div
            key={i}
            style={{
              position:'absolute',
              left:`${s.x}%`,
              bottom:'38%',
              width: s.size, height: s.size,
              background: s.color,
              borderRadius: s.circle ? '50%' : '2px',
              transform: `rotate(${s.rotate}deg)`,
              animation: `confettiPop 1.6s cubic-bezier(0.25,0.46,0.45,0.94) ${s.delay}s both`,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Card */}
        <div
          style={{
            background: th.cardBg,
            borderRadius:'1.1rem', padding:'40px 34px 32px',
            border:`1px solid ${th.borderBrt}`,
            boxShadow:'0 36px 90px rgba(0,0,0,0.24)',
            animation: 'celebrateIn 0.4s cubic-bezier(0.22,0.61,0.36,1) both',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Radial glow background */}
          <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% -10%, rgba(216,99,80,0.08) 0%, transparent 62%)`, pointerEvents:'none', animation:'shimmerPulse 2.5s ease-in-out infinite' }} />

          {/* Trophy */}
          <div
            style={{
              width:72, height:72, borderRadius:'50%',
              background:'linear-gradient(135deg, rgba(5,150,105,0.15) 0%, rgba(5,150,105,0.06) 100%)',
              border:'2px solid rgba(5,150,105,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 22px',
              animation:'trophyBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both',
            }}
          >
            <span style={{ fontSize:34 }}>🏆</span>
          </div>

          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:28, color:th.text, marginBottom:10, lineHeight:1.2, letterSpacing:'-0.01em' }}>
            Congratulations, Valentina!
          </div>

          <p style={{ fontSize:14, color:th.textMid, lineHeight:1.75, margin:'0 0 6px' }}>
            You found the right person for{' '}
            <strong style={{ color:th.text }}>{pos.title}</strong>.
          </p>
          <p style={{ fontSize:13, color:th.textDim, lineHeight:1.75, margin:'0 0 28px', maxWidth:340, marginLeft:'auto', marginRight:'auto' }}>
            Great work bringing the right talent to the team — this is what it's all about.
            The hard work paid off.
          </p>

          {/* Pill note */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:'5px 16px', marginBottom:26, fontSize:11, color:th.textDim }}>
            <span style={{ color:'#059669', fontWeight:700 }}>✓</span>
            Position closed · Reopen anytime from the archive below
          </div>

          <div>
            <button
              onClick={() => onConfirm('hired')}
              style={{
                padding:'13px 36px', borderRadius:10, background:th.red, color:'white',
                border:'none', fontSize:14, fontWeight:700, cursor:'pointer',
                fontFamily:'inherit', letterSpacing:'0.04em',
                boxShadow:`0 0 28px ${th.redGlow}`,
                transition:'transform 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Done →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Hiring manager options ─────────────────────────────────────────────────────
const HM_OPTIONS = ['Andrea P.', 'Sofia C.', 'Marco R.', 'Elena T.', 'Giulia B.']

// ── New Position modal ─────────────────────────────────────────────────────────
function NewPositionModal({ th, onClose, onNavigate, onCreated }) {
  const [title,         setTitle]         = useState('')
  const [dept,          setDept]          = useState('')
  const [hiringManager, setHiringManager] = useState('')

  const canSubmit = title.trim().length > 0

  const handle = (goToTriage) => {
    if (!canSubmit) return
    const newPos = {
      id: Date.now(),
      title: title.trim(),
      dept: dept.trim() || 'New Department',
      hiringManager: hiringManager || null,
      total: 0, openDays: 0, stages: {},
    }
    onCreated?.(newPos)
    onClose()
    if (goToTriage) onNavigate('triage', { position: newPos })
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

        {/* Title */}
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

        {/* Department */}
        <div style={{ marginBottom: 14 }}>
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

        {/* Hiring Manager */}
        <div style={{ marginBottom: 26 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
            Hiring Manager
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={hiringManager}
              onChange={e => setHiringManager(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: hiringManager ? th.text : th.textDim }}
              onFocus={e => (e.target.style.borderColor = th.red)}
              onBlur={e => (e.target.style.borderColor = th.border)}
            >
              <option value="">Select hiring manager…</option>
              {HM_OPTIONS.map(hm => (
                <option key={hm} value={hm}>{hm}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: th.textDim, pointerEvents: 'none', fontSize: 12 }}>▾</span>
          </div>
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
function ClosedPositionsSection({ positions, th, T, onReopen }) {
  const [open, setOpen] = useState(false)
  if (!positions.length) return null

  return (
    <div style={{ marginTop:28 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', marginBottom: open ? 12 : 0 }}
      >
        <span style={{ fontSize:11, fontWeight:700, color: th.navy, textTransform:'uppercase', letterSpacing:'0.08em' }}>
          Closed positions
        </span>
        <div style={{ flex:1, height:1, background: `${th.navy}28` }} />
        <span style={{ fontSize:11, fontWeight:700, color: th.navy, background: `${th.navy}10`, border:`1px solid ${th.navy}30`, borderRadius:20, padding:'2px 9px' }}>
          {positions.length}
        </span>
        <span style={{ fontSize:12, color: th.navy, transform: open ? 'rotate(90deg)' : 'none', transition:'transform 0.2s', display:'inline-block' }}>
          ▶
        </span>
      </button>

      {open && (
        <div style={{ background: th.text.startsWith('rgba(255') ? 'rgba(27,36,97,0.18)' : th.cardBg, border:`1px solid ${th.navy}28`, borderRadius:'0.75rem', overflow:'hidden' }}>
          {positions.map((p, i) => {
            const hired   = p.closeReason === 'hired'
            const last    = i === positions.length - 1
            return (
              <div
                key={p.id}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom: last ? 'none' : `1px solid ${th.border}`, opacity: hired ? 0.85 : 0.6 }}
              >
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>{p.dept}</div>
                  <div style={{ fontFamily:'DM Serif Display, serif', fontSize:15, color:th.text }}>{p.title}</div>
                  {!hired && (
                    <div style={{ fontSize:10, color:th.textDim, marginTop:3 }}>
                      No match found · You can revisit this anytime.
                    </div>
                  )}
                </div>

                {/* Reason badge */}
                {hired ? (
                  <span style={{ fontSize:9, fontWeight:700, color:'#065F46', background:'rgba(5,150,105,0.1)', border:'1px solid rgba(5,150,105,0.25)', padding:'3px 9px', borderRadius:20, letterSpacing:'0.06em', flexShrink:0, whiteSpace:'nowrap' }}>
                    ✓ Filled
                  </span>
                ) : (
                  <span style={{ fontSize:9, fontWeight:700, color:th.textDim, background:th.surface, border:`1px solid ${th.border}`, padding:'3px 9px', borderRadius:20, letterSpacing:'0.06em', flexShrink:0, whiteSpace:'nowrap' }}>
                    🔍 No match
                  </span>
                )}

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
            )
          })}
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
  const isDark   = th.text.startsWith('rgba(255')
  const cardBg   = isDark
    ? (hov ? 'rgba(27,36,97,0.38)' : 'rgba(27,36,97,0.24)')
    : (hov ? th.cardBgHov : th.cardBg)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(pos)}
      style={{
        background: cardBg,
        backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        border: `1px solid ${hov ? th.borderBrt : th.border}`,
        borderTop: `2.5px solid ${th.red}`,
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
            <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#FE9A0C' : '#6B8290', background: isDark ? 'rgba(254,154,12,0.15)' : 'rgba(107,130,144,0.12)', padding: '2px 9px', borderRadius: 20 }}>
              {active} active
            </span>
          )}
          <span style={{ fontSize: 11, color: th.textDim }}>📅 {T.openDays(pos.openDays)}</span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onCloseRequest(pos) }}
          title="Close position"
          style={{
            fontSize: 10, fontWeight: 600, color: '#D86350',
            background: 'transparent',
            border: '1px solid #D8635030',
            borderRadius: 6, padding: '3px 10px',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.13s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F2'; e.currentTarget.style.borderColor = '#D86350' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#D8635030' }}
        >
          Close position
        </button>
      </div>
    </div>
  )
}

function SpontaneousCard({ th, stageT, T, onOpen }) {
  const [hov, setHov] = useState(false)
  const isDark = th.text.startsWith('rgba(255')
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
          <div style={{ fontSize:9, fontWeight:700, color:isDark ? '#FE9A0C' : '#6B8290', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>{T.unsolicited}</div>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:19, fontWeight:400, color:th.text, margin:0 }}>{T.spontaneousLine1}</h2>
          <h2 style={{ fontFamily:'DM Serif Display, serif', fontSize:19, fontWeight:400, color:th.textMid, margin:0 }}>{T.spontaneousLine2}</h2>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:30, fontWeight:400, color:isDark ? '#FE9A0C' : '#6B8290', lineHeight:1 }}>3</div>
          <div style={{ fontSize:8, fontWeight:700, color:th.textDim, marginTop:2, letterSpacing:'0.08em' }}>{T.pendingLabel}</div>
        </div>
      </div>
      <p style={{ fontSize:11, color:th.textDim, margin:0, lineHeight:1.7 }}>{T.spontaneousDesc}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:5 }}>
          {T.deptTags.map(t => (
            <span key={t} style={{ fontSize:9, color:isDark ? '#FE9A0C' : '#6B8290', background:isDark ? 'rgba(254,154,12,0.15)' : 'rgba(107,130,144,0.12)', padding:'2px 7px', borderRadius:20 }}>{t}</span>
          ))}
        </div>
        <span style={{ fontSize:11, fontWeight:600, color:hov ? th.navy : th.textDim, transition:'color 0.15s' }}>{T.reviewBtn}</span>
      </div>
    </div>
  )
}

export default function RecruiterDashboard({ theme, themeMode, lang, onNavigate, customPositions = [], onAddPosition }) {
  const T      = TRANSLATIONS[lang]
  const th     = theme
  const stageT = STAGE_TOKENS[themeMode]
  const isDarkDash = th.text.startsWith('rgba(255')
  const hour   = new Date().getHours()
  const total  = POSITIONS.reduce((s,p) => s + p.total, 0)

  // closed positions: id → { reason: 'hired' | 'no-match' }
  const [closedPositions, setClosedPositions] = useState({})
  const [showNewPosition,  setShowNewPosition]  = useState(false)
  const [closePending,     setClosePending]     = useState(null)   // pos object | null

  const requestClose = (pos) => setClosePending(pos)

  const confirmClose = (reason) => {
    if (!closePending) return
    setClosedPositions(s => ({ ...s, [closePending.id]: { reason } }))
    setClosePending(null)
  }

  const reopenPos = (id) => setClosedPositions(s => { const n = { ...s }; delete n[id]; return n })

  const stats = [
    { label: T.totalCandidates, value: total,                                                            color: th.text              },
    { label: T.inInterviews,    value: POSITIONS.reduce((s,p) => s+(p.stages.Interviews||0), 0),         color: isDarkDash ? '#FE9A0C' : '#3A4244' },
    { label: T.offerStage,      value: POSITIONS.reduce((s,p) => s+(p.stages.Offer||0), 0),              color: stageT.Offer.accent      },
    { label: T.avgDaysOpen,     value: Math.round(POSITIONS.reduce((s,p) => s+p.openDays, 0)/POSITIONS.length)+'d', color: isDarkDash ? '#FE9A0C' : '#6A8E9E' },
  ]

  const openPositions   = POSITIONS.filter(p => !closedPositions[p.id])
  const openCustom      = customPositions.filter(p => !closedPositions[p.id])
  const closedAll       = [...POSITIONS, ...customPositions]
    .filter(p => !!closedPositions[p.id])
    .map(p => ({ ...p, closeReason: closedPositions[p.id].reason }))

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
              {openPositions.length + openCustom.length} {T.openPositions.toLowerCase()} · {total} {T.totalCandidates.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => setShowNewPosition(true)}
            style={{ padding:'10px 20px', borderRadius:'0.75rem', background:th.red, color:'white', border:'none', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', boxShadow:`0 0 20px ${th.redGlow}`, display:'flex', alignItems:'center', gap:8 }}
          >
            New Position
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:30 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: th.text.startsWith('rgba(255') ? 'rgba(27,36,97,0.24)' : th.cardBg, backdropFilter:th.blur, WebkitBackdropFilter:th.blur, border:`1px solid ${th.border}`, borderRadius:'0.75rem', padding:'14px 18px' }}>
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

        {/* Open position cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {openPositions.map(pos => (
            <PositionCard key={pos.id} pos={pos} th={th} stageT={stageT} T={T}
              onOpen={p => onNavigate?.('kanban', { position:p })}
              onCloseRequest={requestClose} />
          ))}
          {openCustom.map(pos => (
            <PositionCard key={pos.id} pos={pos} th={th} stageT={stageT} T={T}
              onOpen={p => onNavigate?.('kanban', { position:p })}
              onCloseRequest={requestClose} />
          ))}
          <SpontaneousCard th={th} stageT={stageT} T={T}
            onOpen={p => onNavigate?.('kanban', { position:p })} />
        </div>

        {/* Closed positions archive */}
        <ClosedPositionsSection
          positions={closedAll}
          th={th} T={T}
          onReopen={reopenPos}
        />

      </div>

      {/* New Position modal */}
      {showNewPosition && (
        <NewPositionModal
          th={th}
          onClose={() => setShowNewPosition(false)}
          onNavigate={onNavigate}
          onCreated={onAddPosition}
        />
      )}

      {/* Close position modal */}
      {closePending && (
        <ClosePositionModal
          pos={closePending}
          th={th}
          onConfirm={confirmClose}
          onCancel={() => setClosePending(null)}
        />
      )}
    </div>
  )
}
