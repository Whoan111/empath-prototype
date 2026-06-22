// ─────────────────────────────────────────────────────────────────────────────
// KanbanBoard.jsx — Trello-style pipeline · Design system applied
//
// Visual language:
//   · 3-color palette only: red #D86350 · navy #1B2461 · gray
//   · Monochromatic stage progression: gray → light navy → navy → deep navy → red
//   · Capsule staleness = DUAL FADE: opacity drops + CSS saturate() drops
//     so a 14-day-overdue capsule is both transparent AND desaturated
//   · Glassmorphic surfaces for columns and capsules
//
// Props: theme, themeMode, lang (from App), position, onBack, onNavigate
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react'
import { STAGE_TOKENS, STAGES, TRANSLATIONS, buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)

// ── Staleness computation (dual: opacity + saturation) ───────────────────────
const STALE_RULES = {
  'Pre-Call': { thresh: 3,   max: 12  },
  Interviews: { thresh: 7,   max: 21  },
  Decision:   { thresh: 5,   max: 16  },
  Offer:      { thresh: 6,   max: 18  },
}

function staleness(stage, daysAgo) {
  const { thresh, max } = STALE_RULES[stage] || { thresh: 999, max: 999 }
  if (daysAgo <= thresh) return { opacity: 1, sat: 100, pct: 0, isStale: false }
  const pct = Math.min(1, (daysAgo - thresh) / (max - thresh))
  return {
    pct,
    isStale: true,
    opacity: 1 - pct * 0.62,       // 1.0 → 0.38
    sat: 100 - pct * 68,            // 100% → 32%
  }
}

function daysLabel(d, T) {
  if (d === 0) return T.today
  return T.daysAgo(d)
}

function urgencyColor(stage, daysAgo, stageT) {
  const { thresh } = STALE_RULES[stage] || { thresh: 999 }
  if (daysAgo === 0)       return stageT[stage].accent
  if (daysAgo <= thresh)   return stageT[stage].accent
  return '#D86350'
}

function stageLabel(s, T) {
  return { 'Pre-Call': T.stage_PreCall, Interviews: T.stage_Interviews, Decision: T.stage_Decision, Offer: T.stage_Offer }[s] || s
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AV_TINTS = [
  ['rgba(216,99,80,0.22)',  '#FF8098'],
  ['rgba(217,119,6,0.25)',  '#FCD34D'],
  ['rgba(109,40,217,0.22)', '#C084FC'],
]
function Av({ id, ini, size = 32 }) {
  const [bg, color] = AV_TINTS[(id - 1) % AV_TINTS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700,
      border: `1px solid ${color}30`,
      backdropFilter: 'blur(8px)',
    }}>{ini}</div>
  )
}

// ── Celebration ───────────────────────────────────────────────────────────────
function Celebration({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t) }, [onDone])
  const particles = ['🎉','✨','⭐','🎊','✅','💫','🌟','🎈']
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{`
        @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(.4)}15%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-120px) scale(.7)}}
        @keyframes popIn{0%{opacity:0;transform:scale(.6)}60%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
        @keyframes fadeOut{0%{opacity:1}65%{opacity:1}100%{opacity:0}}
      `}</style>
      <div style={{ position:'relative', textAlign:'center', animation:'fadeOut 2.4s ease forwards' }}>
        <div style={{ background:'rgba(216,99,80,0.15)', border:'1.5px solid rgba(216,99,80,0.5)', backdropFilter:'blur(16px)', borderRadius:30, padding:'12px 26px', fontSize:14, fontWeight:700, color:'#D86350', boxShadow:'0 6px 32px rgba(216,99,80,0.25)', animation:'popIn 0.35s ease forwards', whiteSpace:'nowrap', letterSpacing:'0.01em' }}>
          {msg}
        </div>
        {particles.map((e, i) => (
          <span key={i} style={{ position:'absolute', fontSize:20, left:`${-56+i*18}px`, top:'-8px', animation:`floatUp 2s ease forwards`, animationDelay:`${i*0.07}s` }}>{e}</span>
        ))}
      </div>
    </div>
  )
}

// ── Confirm dialog ─────────────────────────────────────────────────────────────
function ConfirmMove({ move, candidates, th, stageT, T, onConfirm, onCancel }) {
  const c = Object.values(candidates).flat().find(x => x.id === move.candidateId)
  if (!c) return null
  const toS = stageT[move.to]

  return (
    <div onClick={onCancel} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(6px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background: th.bgPanel, backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        borderRadius: '0.75rem', padding:'26px 28px', width:380,
        border: `1px solid ${th.borderBrt}`,
        boxShadow:'0 24px 64px rgba(0,0,0,0.5)',
        animation:'modalIn 0.2s ease',
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div style={{ fontSize:17, fontWeight:600, color:th.text, fontFamily:'quincy-cf, serif', marginBottom:14 }}>
          {T.moveCandidate}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:18 }}>
          <Av id={c.id} ini={c.ini} size={38} />
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:th.text }}>{c.name}</div>
            <div style={{ fontSize:11, color:th.textDim }}>{c.role}</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22, padding:'10px 14px', background:toS.bg, borderRadius:10, border:`1px solid ${toS.header}` }}>
          <span style={{ fontSize:12, color:th.textMid }}>{stageLabel(move.from, T)}</span>
          <span style={{ fontSize:16, color:toS.accent }}>→</span>
          <span style={{ fontSize:13, fontWeight:700, color:toS.accent, letterSpacing:'0.02em' }}>{stageLabel(move.to, T)}</span>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${th.border}`, background:'transparent', color:th.textMid, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            {T.cancel}
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:'10px', borderRadius:9, border:'none', background:toS.accent, color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.03em' }}>
            {T.moveTo(stageLabel(move.to, T))}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Mini pipeline bar ─────────────────────────────────────────────────────────
const PIPELINE_STAGES = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']
function MiniPipeline({ stage, th }) {
  const idx = PIPELINE_STAGES.indexOf(stage)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {PIPELINE_STAGES.map((s, i) => {
        const past = i <= idx
        const curr = i === idx
        const short = s === 'Preliminary Call' ? 'Pre-Call' : s === 'Screening' ? 'Screen' : s === 'Interviews' ? 'Interview' : s
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ position: 'absolute', top: 6, left: '50%', width: '100%', height: 2, background: i < idx ? th.red : th.border, zIndex: 0 }} />
            )}
            <div style={{ width: 12, height: 12, borderRadius: 2, transform: 'rotate(45deg)', background: curr ? th.red : past ? `${th.red}55` : th.surface, border: `1.5px solid ${curr ? th.red : past ? `${th.red}55` : th.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? `0 0 0 2.5px ${th.surface}` : 'none' }} />
            <div style={{ fontSize: 7, color: curr ? th.red : th.textDim, fontWeight: curr ? 700 : 400, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {short}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Profile panel (right sidebar) ────────────────────────────────────────────
function KanbanProfilePanel({ candidate, stage, th, stageT, T, onClose, onContact, onViewCV }) {
  return (
    <aside style={{
      width: 300, flexShrink: 0,
      background: th.bgPanel,
      backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
      borderLeft: `1px solid ${th.border}`,
      boxShadow: '-6px 0 28px rgba(0,0,0,0.14)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'kbPanelIn 0.26s cubic-bezier(0.22,0.61,0.36,1)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${th.border}`, background: `${th.red}08`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
          <Av id={candidate.id} ini={candidate.ini} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: th.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: th.textDim }}>{candidate.role}</div>
            {(candidate.loc || candidate.exp) && (
              <div style={{ fontSize: 10, color: th.textDim, marginTop: 2 }}>
                {[candidate.loc && `📍 ${candidate.loc}`, candidate.exp && `🕐 ${candidate.exp}`].filter(Boolean).join(' · ')}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.textDim, fontSize: 18, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}>×</button>
        </div>
        {/* Pipeline */}
        <MiniPipeline stage={stage} th={th} />
      </div>

      {/* Body — feedback placeholder */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Interview feedback</div>
        <div style={{ textAlign: 'center', padding: '24px 0', color: th.textDim }}>
          <div style={{ fontSize: 22, marginBottom: 7 }}>📋</div>
          <div style={{ fontSize: 12, color: th.textDim }}>No debriefs submitted yet</div>
          <div style={{ fontSize: 10, color: th.textDim, marginTop: 3 }}>Feedback appears here after interviews</div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${th.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => onViewCV?.(candidate)}
          style={{ padding: '10px', borderRadius: 9, background: `${th.red}0D`, color: th.red, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.background = `${th.red}1A`}
          onMouseLeave={e => e.currentTarget.style.background = `${th.red}0D`}
        >
          📄 View CV →
        </button>
        <button
          onClick={onContact}
          style={{ padding: '10px', borderRadius: 9, background: C.infBg, color: C.infT, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ✉ Send message
        </button>
      </div>
    </aside>
  )
}

// ── Candidate capsule ─────────────────────────────────────────────────────────
function Capsule({ candidate, stage, th, stageT, T, onMove, onContact, onReject, onSelect, isSelected, isDragging, onDragStart, onDragEnd }) {
  const isDark = th.text.startsWith('rgba(255')
  const [hov, setHov] = useState(false)
  const [didDrag, setDidDrag] = useState(false)
  const { opacity, sat, isStale } = staleness(stage, candidate.daysAgo)
  const st        = stageT[stage]
  const visStages = STAGES.filter(s => s !== 'Screening')
  const stageIdx  = visStages.indexOf(stage)
  const nextStage = stageIdx < visStages.length - 1 ? visStages[stageIdx + 1] : null
  const nextSt    = nextStage ? stageT[nextStage] : null
  const urgColor  = urgencyColor(stage, candidate.daysAgo, stageT)

  return (
    <div
      draggable
      onDragStart={(e) => { setDidDrag(true); e.dataTransfer.effectAllowed = 'move'; onDragStart() }}
      onDragEnd={() => { onDragEnd(); setTimeout(() => setDidDrag(false), 80) }}
      onClick={() => { if (!didDrag) onSelect(candidate, stage) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isSelected
          ? (isDark ? `${th.red}28` : `${th.red}0E`)
          : hov
            ? (isDark ? 'rgba(27,36,97,0.32)' : th.cardBgHov)
            : (isDark ? 'rgba(27,36,97,0.20)' : th.cardBg),
        backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        borderRadius: '0.75rem',
        border: `1px solid ${isSelected ? th.red + '60' : isStale ? 'rgba(216,99,80,0.22)' : th.border}`,
        borderLeft: `3px solid ${isSelected ? th.red : isStale ? '#D86350' : st.dot}`,
        padding: '11px 12px',
        marginBottom: 8,
        cursor: isDragging ? 'grabbing' : 'pointer',
        opacity,
        filter: sat < 100 ? `saturate(${sat}%)` : 'none',
        transition: 'opacity 0.3s, filter 0.3s, box-shadow 0.15s, border-color 0.2s',
        boxShadow: isDragging
          ? `0 10px 32px rgba(0,0,0,0.35), 0 0 0 1px ${st.dot}40`
          : hov
            ? `0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px ${st.dot}30`
            : '0 1px 4px rgba(0,0,0,0.12)',
      }}
    >
      {/* Avatar + name row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:9, marginBottom:8 }}>
        <Av id={candidate.id} ini={candidate.ini} size={30} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12, fontWeight:600, color:th.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'0.01em' }}>
            {candidate.name}
          </div>
          <div style={{ fontSize:10, color:th.textMid, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {candidate.role}
          </div>
        </div>
        {stage === 'Decision' && candidate.fit && (() => {
          const fitCfg = {
            strong:  { label:'★ Strong fit',   color: isDark ? 'rgba(255,140,120,0.95)' : '#FFFFFF', bg: isDark ? 'rgba(216,99,80,0.28)' : '#D86350',          border: isDark ? '1px solid rgba(216,99,80,0.45)' : 'none' },
            average: { label:'◎ Average fit',  color: isDark ? '#FCD34D' : '#92400E',               bg: isDark ? 'rgba(252,211,77,0.14)' : 'rgba(254,154,12,0.14)', border: `1px solid ${isDark ? 'rgba(252,211,77,0.30)' : 'rgba(217,119,6,0.28)'}` },
            'not-fit':{ label:'✗ Not a fit',   color: isDark ? '#94A3B8' : '#6B7280',               bg: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(107,114,128,0.10)', border: `1px solid ${isDark ? 'rgba(148,163,184,0.22)' : 'rgba(107,114,128,0.20)'}` },
          }[candidate.fit]
          if (!fitCfg) return null
          return (
            <span style={{ fontSize:8, fontWeight:700, color:fitCfg.color, background:fitCfg.bg, border:fitCfg.border, padding:'2px 7px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, alignSelf:'flex-start', letterSpacing:'0.01em' }}>
              {fitCfg.label}
            </span>
          )
        })()}
        {stage === 'Interviews' && (() => {
          const done = candidate.interviewsDone ?? 0
          const next = candidate.nextInterview ?? null
          if (next) return (
            <span style={{ fontSize:8, fontWeight:700,
              color:       isDark ? '#FE9A0C'                   : '#1B2461',
              background:  isDark ? 'rgba(254,154,12,0.15)'    : 'rgba(27,36,97,0.10)',
              border:      `1px solid ${isDark ? 'rgba(254,154,12,0.32)' : 'rgba(27,36,97,0.18)'}`,
              padding:'2px 6px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, alignSelf:'flex-start', letterSpacing:'0.01em' }}>
              📅 {next}
            </span>
          )
          if (done > 0) return (
            <span style={{ fontSize:8, fontWeight:700,
              color:       isDark ? '#86EFAC'                   : '#166534',
              background:  isDark ? 'rgba(134,239,172,0.14)'    : 'rgba(21,128,61,0.10)',
              border:      `1px solid ${isDark ? 'rgba(134,239,172,0.28)' : 'rgba(21,128,61,0.20)'}`,
              padding:'2px 6px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, alignSelf:'flex-start' }}>
              ✓ {done} done
            </span>
          )
          return (
            <span style={{ fontSize:8, fontWeight:700,
              color:       isDark ? '#FCD34D'                   : '#92400E',
              background:  isDark ? 'rgba(252,211,77,0.14)'     : 'rgba(217,119,6,0.10)',
              border:      `1px solid ${isDark ? 'rgba(252,211,77,0.28)' : 'rgba(217,119,6,0.22)'}`,
              padding:'2px 6px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0, alignSelf:'flex-start' }}>
              ⏳ Waiting
            </span>
          )
        })()}
      </div>

      {/* Info pills */}
      {(candidate.loc || candidate.exp) && (
        <div style={{ display:'flex', gap:5, marginBottom:7, flexWrap:'wrap' }}>
          {candidate.loc && (
            <span style={{ fontSize:9, color:th.textDim, background:th.surface, border:`1px solid ${th.border}`, padding:'2px 7px', borderRadius:20, backdropFilter:'blur(4px)' }}>
              {candidate.loc}
            </span>
          )}
          {candidate.exp && (
            <span style={{ fontSize:9, color:th.textDim, background:th.surface, border:`1px solid ${th.border}`, padding:'2px 7px', borderRadius:20 }}>
              {candidate.exp}
            </span>
          )}
        </div>
      )}

      {/* Skills */}
      {candidate.skills?.length > 0 && (
        <div style={{ display:'flex', gap:4, marginBottom:9, flexWrap:'wrap' }}>
          {candidate.skills.slice(0, 3).map(s => (
            <span key={s} style={{ fontSize:9, fontWeight:600, color:st.accent, background:st.bg, border:`1px solid ${st.dot}30`, padding:'1px 6px', borderRadius:20 }}>{s}</span>
          ))}
        </div>
      )}

      {/* Bottom row: days + actions */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:9, fontWeight:700, color:urgColor, letterSpacing:'0.02em' }}>
          {daysLabel(candidate.daysAgo, T)}
        </span>

        <div style={{ display:'flex', gap:5, alignItems:'center' }}>
          <button
            onClick={e => { e.stopPropagation(); onContact(candidate) }}
            title={T.sendMessage}
            style={{ width:24, height:24, borderRadius:'50%', border:`1px solid ${th.border}`, background:th.surface, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:th.textDim, backdropFilter:'blur(4px)', transition:'all 0.15s' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </button>

          <button
            onClick={e => { e.stopPropagation(); onReject(candidate) }}
            title="Reject candidate"
            style={{ height:24, padding:'0 8px', borderRadius:20, border:'1px solid rgba(216,99,80,0.25)', background:'rgba(216,99,80,0.07)', cursor:'pointer', color:'#D86350', fontSize:9, fontWeight:700, fontFamily:'inherit', transition:'all 0.15s', letterSpacing:'0.02em' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(216,99,80,0.14)'; e.currentTarget.style.borderColor='#D86350' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(216,99,80,0.07)'; e.currentTarget.style.borderColor='rgba(216,99,80,0.25)' }}
          >
            ✕ Reject
          </button>

          {nextStage && nextSt && (
            <button
              onClick={e => { e.stopPropagation(); onMove(candidate.id, stage, nextStage) }}
              title={T.moveTo(stageLabel(nextStage, T))}
              style={{ height:24, padding:'0 8px', borderRadius:20, border:`1px solid ${nextSt.dot}50`, background:nextSt.bg, cursor:'pointer', color:nextSt.accent, fontSize:9, fontWeight:700, fontFamily:'inherit', transition:'all 0.15s', backdropFilter:'blur(4px)', letterSpacing:'0.02em', whiteSpace:'nowrap' }}
            >
              {stageLabel(nextStage, T)} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Kanban column ─────────────────────────────────────────────────────────────
function Column({ stage, candidates, th, stageT, T, onMove, onContact, onReject, onSelect, selectedId, dragOver, onDragOver, onDrop, draggingId, onCapsuleDragStart, onCapsuleDragEnd }) {
  const st           = stageT[stage]
  const isDropTarget = dragOver === stage
  const label        = stageLabel(stage, T)
  const sorted       = [...candidates].sort((a, b) => b.daysAgo - a.daysAgo)

  return (
    <div
      onDragOver={e => { e.preventDefault(); onDragOver(stage) }}
      onDrop={e => { e.preventDefault(); onDrop(stage) }}
      style={{
        flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column',
        borderRadius: '0.75rem',
        background: isDropTarget ? st.bg : 'transparent',
        border: `2px solid ${isDropTarget ? st.dot+'60' : 'transparent'}`,
        boxShadow: isDropTarget ? `0 0 0 1px ${st.dot}30, 0 4px 20px rgba(0,0,0,0.15)` : 'none',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Column header */}
      <div style={{
        padding: '10px 12px 9px',
        background: st.header,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '0.75rem 0.75rem 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
        borderBottom: `1px solid ${st.dot}30`,
      }}>
        <span style={{ fontSize:11, fontWeight:700, color:st.accent, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          {label}
        </span>
        <span style={{ background:'white', color:st.accent, fontSize:10, fontWeight:800, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${st.dot}30`, boxShadow:'0 1px 4px rgba(0,0,0,0.1)' }}>
          {candidates.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ flex:1, overflowY:'auto', padding:'10px 8px 8px', minHeight:120 }}>
        {sorted.length === 0 && (
          <div style={{ padding:'24px 0', textAlign:'center', color:th.textFaint, fontSize:11 }}>
            {T.noCandidates}
          </div>
        )}
        {sorted.map(c => (
          <Capsule
            key={c.id}
            candidate={c}
            stage={stage}
            th={th}
            stageT={stageT}
            T={T}
            onMove={onMove}
            onContact={onContact}
            onReject={onReject}
            onSelect={onSelect}
            isSelected={selectedId === c.id}
            isDragging={draggingId === c.id}
            onDragStart={() => onCapsuleDragStart(c.id)}
            onDragEnd={onCapsuleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

// ── Mock candidate data (matches Dashboard POSITIONS totals) ──────────────────
const INIT = {
  1: {  // UX Designer — Pre-Call:3, Interviews:2, Decision:2, Offer:1 = 8
    'Pre-Call': [
      { id:105, name:'Marco Bianchi',     ini:'MB', role:'Senior UX',            loc:'Rome',     exp:'7 yrs', daysAgo:2,  skills:['Strategy','Leadership'] },
      { id:106, name:'Anna Ferretti',     ini:'AF', role:'Visual Designer',      loc:'Milan',    exp:'4 yrs', daysAgo:6,  skills:['Figma','Branding']      },
      { id:107, name:'Carla Esposito',    ini:'CE', role:'UX Researcher',        loc:'Rome',     exp:'3 yrs', daysAgo:10, skills:['Research','Survey']     },
    ],
    Interviews: [
      { id:108, name:'Luca Ferrari',      ini:'LF', role:'Product Designer',     loc:'Florence', exp:'5 yrs', daysAgo:5,  skills:['Figma','Agile'],        interviewsDone:2, nextInterview:'Jun 12 · 10:00' },
      { id:109, name:'Chiara Lombardi',   ini:'CL', role:'UX Researcher',        loc:'Milan',    exp:'6 yrs', daysAgo:14, skills:['Research','Analysis'],  interviewsDone:1, nextInterview:null              },
    ],
    Decision: [
      { id:110, name:'Giulia Rossi',      ini:'GR', role:'Mid UX Designer',      loc:'Milan',    exp:'4 yrs', daysAgo:3,  skills:['Figma','Research'],     fit:'strong'  },
      { id:118, name:'Serena Costa',      ini:'SC', role:'Lead Designer',        loc:'Milan',    exp:'7 yrs', daysAgo:7,  skills:['Leadership','Figma'],   fit:'average' },
    ],
    Offer: [
      { id:111, name:'Valentina Greco',   ini:'VG', role:'UX Designer',          loc:'Milan',    exp:'8 yrs', daysAgo:8,  skills:['Strategy','Systems']    },
    ],
  },
  2: {  // Frontend Engineer — Pre-Call:4, Interviews:3, Decision:1, Offer:1 = 9
    'Pre-Call': [
      { id:203, name:'Lukas Weber',       ini:'LW', role:'JS Engineer',          loc:'Munich',   exp:'4 yrs', daysAgo:4,  skills:['React','Node']          },
      { id:205, name:'Andrea Chen',       ini:'AC', role:'Frontend Dev',         loc:'Barcelona',exp:'4 yrs', daysAgo:2,  skills:['React','TypeScript']    },
      { id:206, name:'Sophie Laurent',    ini:'SL', role:'Vue Developer',        loc:'Paris',    exp:'3 yrs', daysAgo:7,  skills:['Vue','CSS']             },
      { id:207, name:'Erik Müller',       ini:'EM', role:'JS Engineer',          loc:'Berlin',   exp:'5 yrs', daysAgo:11, skills:['Node','React']          },
    ],
    Interviews: [
      { id:204, name:'Maria Silva',       ini:'MS', role:'UI Engineer',          loc:'Lisbon',   exp:'6 yrs', daysAgo:9,  skills:['React','CSS'],          interviewsDone:1, nextInterview:'Jun 10 · 14:00' },
      { id:208, name:'Jana Novak',        ini:'JN', role:'Frontend Engineer',    loc:'Prague',   exp:'4 yrs', daysAgo:5,  skills:['Angular','RxJS'],       interviewsDone:0, nextInterview:null              },
      { id:209, name:'Ravi Kumar',        ini:'RK', role:'React Specialist',     loc:'London',   exp:'6 yrs', daysAgo:13, skills:['React','Redux'],        interviewsDone:2, nextInterview:null              },
    ],
    Decision: [
      { id:210, name:'Isabelle Blanc',    ini:'IB', role:'Senior FE',            loc:'Lyon',     exp:'8 yrs', daysAgo:4,  skills:['React','Next.js'],      fit:'strong'  },
    ],
    Offer: [
      { id:211, name:"James O'Brien",     ini:'JO', role:'Lead Frontend',        loc:'Dublin',   exp:'9 yrs', daysAgo:6,  skills:['React','TypeScript']    },
    ],
  },
  3: {  // Product Manager — Pre-Call:3, Interviews:1, Decision:1 = 5
    'Pre-Call': [
      { id:302, name:'Dario Mancini',     ini:'DM', role:'Product Lead',         loc:'Turin',    exp:'6 yrs', daysAgo:4,  skills:['Roadmap','Data']        },
      { id:304, name:'Elena Vitali',      ini:'EV', role:'Product Manager',      loc:'Milan',    exp:'5 yrs', daysAgo:3,  skills:['OKRs','Analytics']      },
      { id:305, name:'Marco Pellegrini',  ini:'MP', role:'Senior PM',            loc:'Rome',     exp:'7 yrs', daysAgo:9,  skills:['Strategy','Agile']      },
    ],
    Interviews: [
      { id:303, name:'Clara Rossi',       ini:'CR', role:'Associate PM',         loc:'Rome',     exp:'3 yrs', daysAgo:2,  skills:['Agile','Research'],     interviewsDone:0, nextInterview:'Jun 11 · 11:30' },
    ],
    Decision: [
      { id:306, name:'Valentina Serra',   ini:'VS', role:'Product Lead',         loc:'Florence', exp:'6 yrs', daysAgo:5,  skills:['Vision','Roadmap'],     fit:'average' },
    ],
    Offer: [],
  },
  4: {  // Data Analyst — Pre-Call:1, Interviews:1 = 2
    'Pre-Call': [
      { id:401, name:'Giulia Fontana',    ini:'GF', role:'Data Analyst',         loc:'Milan',    exp:'3 yrs', daysAgo:4,  skills:['SQL','Python']          },
    ],
    Interviews: [
      { id:402, name:'Luca Battaglia',    ini:'LB', role:'Senior Analyst',       loc:'Turin',    exp:'5 yrs', daysAgo:7,  skills:['Python','Tableau'],     interviewsDone:1, nextInterview:null              },
    ],
    Decision: [],
    Offer: [],
  },
  5: {  // Brand Strategist — Pre-Call:1, Interviews:1, Decision:1 = 3
    'Pre-Call': [
      { id:501, name:'Camilla Rizzo',     ini:'CR', role:'Brand Strategist',     loc:'Milan',    exp:'4 yrs', daysAgo:2,  skills:['Branding','Strategy']   },
    ],
    Interviews: [
      { id:502, name:'Federico Gallo',    ini:'FG', role:'Creative Strategist',  loc:'Rome',     exp:'6 yrs', daysAgo:8,  skills:['Campaigns','Brand'],    interviewsDone:1, nextInterview:'Jun 13 · 15:00' },
    ],
    Decision: [
      { id:503, name:'Anastasia Bruno',   ini:'AB', role:'Senior Brand Manager', loc:'Milan',    exp:'8 yrs', daysAgo:3,  skills:['Strategy','Leadership'], fit:'strong' },
    ],
    Offer: [],
  },
  0: {  // Spontaneous Applications
    'Pre-Call': [
      { id:601, name:'Marco Neri',        ini:'MN', role:'Full Stack Dev',       loc:'Milan',    exp:'5 yrs', daysAgo:3,  skills:['React','Node']          },
      { id:602, name:'Lucia Boni',        ini:'LB', role:'UX Designer',          loc:'Turin',    exp:'4 yrs', daysAgo:7,  skills:['Figma']                 },
      { id:603, name:'Fabio Greco',       ini:'FG', role:'Data Scientist',       loc:'Rome',     exp:'3 yrs', daysAgo:9,  skills:['Python','ML']           },
    ],
    Interviews: [],
    Decision: [],
    Offer: [],
  },
}

const VIS_STAGES = STAGES.filter(s => s !== 'Screening')

// ── Add-candidates modal ───────────────────────────────────────────────────────
const IMPORT_FILES = [
  { name: 'YasmineBouali_CV.pdf',    size: '1.1 MB' },
  { name: 'DiegoMendoza_CV.pdf',     size: '890 KB' },
  { name: 'PriyaKumar_CV.pdf',       size: '1.3 MB' },
  { name: 'TomasVarga_CV.pdf',       size: '760 KB' },
  { name: 'AishaOkonkwo_CV.pdf',     size: '1.0 MB' },
  { name: 'MarcosAlves_CV.pdf',      size: '1.4 MB' },
]
const IMPORT_CANDIDATES = [
  {
    id:901, name:'Yasmine Bouali',  ini:'YB', role:'UX Designer',     loc:'Paris, France',  exp:'4 yrs', daysAgo:0,
    skills:['Figma','Research','Design Systems'],
    email:'yasmine.bouali@email.com', phone:null,
    edu:'ESAG Penninghen · BA Design',
    snippet:'Led end-to-end UX redesign for a retail e-commerce platform, increasing conversion by 28%. Strong in qualitative research and component-level design systems.',
    portfolio:'yasminedesign.com', linkedin:'linkedin.com/in/yasminedesign',
    file:'YasmineBouali_CV.pdf', docType:'cv', pages:2,
  },
  {
    id:902, name:'Diego Mendoza',   ini:'DM', role:'Product Designer', loc:'Madrid, Spain', exp:'6 yrs', daysAgo:0,
    skills:['Sketch','Prototyping','Agile'],
    email:'diego.mendoza@email.com', phone:null,
    edu:'IED Madrid · BA Product Design',
    snippet:'6 years shipping B2B SaaS products at scale. Experience leading cross-functional design teams and running stakeholder workshops.',
    portfolio:'diegomendoza.io', linkedin:'linkedin.com/in/diegomendoza',
    file:'DiegoMendoza_CV.pdf', docType:'cv', pages:2,
  },
  {
    id:903, name:'Priya Kumar',     ini:'PK', role:'UX Researcher',    loc:'London, UK',    exp:'3 yrs', daysAgo:0,
    skills:['UserTesting','Usability','Analytics'],
    email:'priya.kumar@email.com', phone:null,
    edu:'UCL · MSc Human-Computer Interaction',
    snippet:'Specialist in mixed-methods research. Published work on accessibility in mobile banking apps. Comfortable presenting findings to C-level stakeholders.',
    portfolio:null, linkedin:'linkedin.com/in/priyakumarux',
    file:'PriyaKumar_CV.pdf', docType:'cv', pages:1,
  },
]

function AddCandidatesModal({ posTitle, th, lang, onClose, onComplete }) {
  const [phase,    setPhase]    = useState('drop')
  const [progress, setProgress] = useState(0)
  const [loaded,   setLoaded]   = useState(0)
  const total = IMPORT_FILES.length

  const isIt = lang === 'it'
  const L = {
    badge:      'CV Import',
    title:      isIt ? `Importa CV per ${posTitle}` : `Import CVs for ${posTitle}`,
    drop:       isIt ? 'Trascina file PDF o Word qui'           : 'Drop PDF or Word files here',
    hint:       isIt ? 'o clicca per sfogliare · Più file supportati' : 'or click to browse · Multiple files supported',
    types:      isIt ? 'PDF, DOCX — max 10 MB ciascuno'         : 'PDF, DOCX — max 10 MB each',
    analysing:  isIt ? (n, t) => `Analisi di ${n} su ${t} CV…` : (n, t) => `Analysing ${n} of ${t} CVs…`,
    done:       isIt ? 'Analizzato ✓' : 'Analysed ✓',
    waiting:    isIt ? 'In attesa…'   : 'Waiting…',
  }

  const startImport = () => {
    if (phase !== 'drop') return
    setPhase('loading')
    let prog = 0
    const timer = setInterval(() => {
      prog += 7
      const capped = Math.min(100, prog)
      setProgress(capped)
      setLoaded(Math.round((capped / 100) * total))
      if (capped >= 100) {
        clearInterval(timer)
        setTimeout(() => onComplete(IMPORT_CANDIDATES), 380)
      }
    }, 80)
  }

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.58)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:400, backdropFilter:'blur(7px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: th.bgPanel, backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
          borderRadius: '1rem', padding: '32px 36px', width: 500,
          border: `1px solid ${th.borderBrt}`,
          boxShadow: '0 28px 72px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.22s ease',
        }}
      >
        {/* Badge + title */}
        <div style={{ fontSize: 10, fontWeight: 700, color: '#D86350', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          {L.badge}
        </div>
        <h2 style={{ fontFamily: 'quincy-cf, serif', fontSize: 22, fontWeight: 700, color: th.text, margin: '0 0 24px', lineHeight: 1.2 }}>
          {L.title}
        </h2>

        {/* ── Drop zone ── */}
        {phase === 'drop' && (
          <div
            onClick={startImport}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); startImport() }}
            style={{
              border: `2px dashed ${th.border}`,
              borderRadius: 14, padding: '52px 28px',
              textAlign: 'center', cursor: 'pointer',
              background: th.surface, transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#D86350'; e.currentTarget.style.background = 'rgba(216,99,80,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = th.border;  e.currentTarget.style.background = th.surface }}
          >
            <div style={{ fontSize: 44, marginBottom: 14 }}>📂</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: th.text, marginBottom: 6 }}>{L.drop}</div>
            <div style={{ fontSize: 12, color: th.textDim, lineHeight: 1.6 }}>
              {L.hint}<br />
              <span style={{ fontSize: 11 }}>{L.types}</span>
            </div>
          </div>
        )}

        {/* ── Loading / analysing ── */}
        {phase === 'loading' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: th.textDim, marginBottom: 8 }}>
              <span>{L.analysing(loaded, total)}</span>
              <span style={{ fontWeight: 700, color: '#D86350' }}>{progress}%</span>
            </div>

            {/* Progress bar */}
            <div style={{ background: th.surface, borderRadius: 6, height: 6, marginBottom: 22, overflow: 'hidden', border: `1px solid ${th.border}` }}>
              <div style={{ height: '100%', background: '#D86350', borderRadius: 6, width: `${progress}%`, transition: 'width 0.08s linear' }} />
            </div>

            {/* File rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {IMPORT_FILES.map((f, i) => {
                const done = i < loaded
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 14px', borderRadius: 9,
                    background: done ? th.bgPanel : th.surface,
                    border: `1px solid ${done ? th.borderBrt : th.border}`,
                    opacity: done ? 1 : 0.38,
                    transition: 'opacity 0.28s, background 0.28s, border-color 0.28s',
                  }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: th.text }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: done ? '#1B2461' : th.textDim }}>
                        {done ? L.done : L.waiting}
                      </div>
                    </div>
                    {done && <span style={{ fontSize: 13, color: '#1B2461', fontWeight: 700 }}>✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── CV overlay modal ──────────────────────────────────────────────────────────
function CVModal({ candidate, onClose }) {
  if (!candidate) return null
  const Line = ({ w = '100%', h = 7, mb = 5 }) => (
    <div style={{ width: w, height: h, background: '#E8E4E0', borderRadius: 2, marginBottom: mb }} />
  )
  const Sec = ({ children }) => (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 10, marginTop: 18, paddingBottom: 5, borderBottom: '1px solid #E8E4E0' }}>{children}</div>
  )
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: 14, width: '90%', maxWidth: 640, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 28px 80px rgba(0,0,0,0.5)', overflow: 'hidden', animation: 'modalIn 0.22s ease' }}
      >
        {/* Modal toolbar */}
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #E8E4E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'white' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#D86350', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>CV</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1917' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{candidate.role}{candidate.loc ? ` · ${candidate.loc}` : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#888', lineHeight: 1, padding: '0 0 0 16px' }}>×</button>
        </div>
        {/* Scrollable document */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', background: '#FAFAF9', fontFamily: 'Georgia, serif', color: '#1C1917' }}>
          <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{candidate.name}</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{candidate.role}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 10, color: '#888' }}>
              {candidate.loc && <span>📍 {candidate.loc}</span>}
              {candidate.exp && <span>🕐 {candidate.exp} experience</span>}
            </div>
          </div>
          <Sec>Professional Experience</Sec>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{candidate.role}</span>
              <span style={{ fontSize: 10, color: '#888' }}>2022 – Present</span>
            </div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>TechCorp · {candidate.loc?.split(',')[0] || 'Europe'}</div>
            <Line w="91%" /><Line w="84%" /><Line w="78%" /><Line w="88%" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Previous Role</span>
              <span style={{ fontSize: 10, color: '#888' }}>2020 – 2022</span>
            </div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>Design Studio · Europe</div>
            <Line w="87%" /><Line w="72%" /><Line w="80%" />
          </div>
          <Sec>Education</Sec>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Bachelor of Design</div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>Design University · 2016–2020</div>
            <Line w="55%" />
          </div>
          {candidate.skills?.length > 0 && (
            <>
              <Sec>Skills</Sec>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                {candidate.skills.map(s => (
                  <span key={s} style={{ background: '#F5F2EF', border: '1px solid #E0DDD9', borderRadius: 3, padding: '2px 8px', fontSize: 10, color: '#555' }}>{s}</span>
                ))}
              </div>
            </>
          )}
          <Sec>Projects & Highlights</Sec>
          <Line w="94%" /><Line w="88%" /><Line w="76%" /><Line w="82%" /><Line w="68%" />
          <div style={{ marginTop: 10 }} />
          <Line w="90%" /><Line w="83%" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function KanbanBoard({ position, restoreCandidate, theme, themeMode, lang, onBack, onNavigate }) {
  C = buildC(theme)
  const pos    = position || { id:1, title:'UX Designer', dept:'Product Design' }
  const posId  = pos.id ?? 1
  const th     = theme
  const stageT = STAGE_TOKENS[themeMode]
  const T      = TRANSLATIONS[lang]

  const [showImport, setShowImport] = useState(false)

  const [candidates, setCandidates] = useState(() => {
    const base = INIT[posId] || {}
    const init = VIS_STAGES.reduce((acc, s) => ({ ...acc, [s]: base[s] || [] }), {})
    // Inject a restored candidate into the right column
    if (restoreCandidate) {
      const { stage, ...cand } = restoreCandidate
      const targetStage = VIS_STAGES.includes(stage) ? stage : 'Pre-Call'
      init[targetStage] = [{ ...cand, daysAgo: 0 }, ...(init[targetStage] || [])]
    }
    return init
  })
  const [pendingMove,     setPendingMove]     = useState(null)
  const [celebration,     setCelebration]     = useState(null)
  const [dragState,       setDragState]       = useState({ id:null, from:null })
  const [dragOverCol,     setDragOverCol]     = useState(null)
  const [selectedInfo,    setSelectedInfo]    = useState(null)   // { candidate, stage }
  const [cvCandidate,     setCvCandidate]     = useState(null)   // open CV modal
  const [restoredBanner,  setRestoredBanner]  = useState(
    restoreCandidate ? { name: restoreCandidate.name, stage: restoreCandidate.stage } : null
  )

  // Auto-dismiss the restored banner after 3.5 s
  useEffect(() => {
    if (!restoredBanner) return
    const t = setTimeout(() => setRestoredBanner(null), 3500)
    return () => clearTimeout(t)
  }, [restoredBanner])

  const handleSelect = (candidate, stage) => {
    setSelectedInfo(prev => prev?.candidate.id === candidate.id ? null : { candidate, stage })
  }

  const total = VIS_STAGES.reduce((sum, s) => sum + (candidates[s]?.length || 0), 0)

  const requestMove = useCallback((candidateId, from, to) => {
    setPendingMove({ candidateId, from, to })
  }, [])

  const confirmMove = useCallback(() => {
    if (!pendingMove) return
    const { candidateId, from, to } = pendingMove
    const fromIdx = VIS_STAGES.indexOf(from)
    const toIdx   = VIS_STAGES.indexOf(to)
    const isForward = toIdx > fromIdx

    // Capture candidate before state update
    const movedCandidate = Object.values(candidates).flat().find(x => x.id === candidateId)

    setCandidates(prev => {
      const next  = { ...prev }
      const movedC = prev[from].find(c => c.id === candidateId)
      next[from]  = prev[from].filter(c => c.id !== candidateId)
      if (movedC) next[to] = [...prev[to], { ...movedC, daysAgo: 0 }]
      return next
    })

    // Celebrate ANY forward move
    if (isForward && movedCandidate) {
      setCelebration(T.celebrationMsg(movedCandidate.name, stageLabel(to, T)))
    }
    setPendingMove(null)
  }, [pendingMove, candidates, T])

  const handleDrop = useCallback((toStage) => {
    setDragOverCol(null)
    if (dragState.id && dragState.from !== toStage) {
      requestMove(dragState.id, dragState.from, toStage)
    }
    setDragState({ id:null, from:null })
  }, [dragState, requestMove])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <style>{`
        @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(.4)}15%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-120px) scale(.7)}}
        @keyframes popIn{0%{opacity:0;transform:scale(.6)}60%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
        @keyframes fadeOut{0%{opacity:1}65%{opacity:1}100%{opacity:0}}
        @keyframes modalIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes restoreIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes kbPanelIn{from{transform:translateX(100%);opacity:0.7}to{transform:translateX(0);opacity:1}}
      `}</style>

      {/* Header */}
      <div style={{ padding:'12px 22px', background:th.bgPanel, backdropFilter:th.blur, WebkitBackdropFilter:th.blur, borderBottom:`1px solid ${th.border}`, display:'flex', alignItems:'center', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, flex:1 }}>
          <button onClick={onBack} style={{ background:'none', border:'none', color:th.textDim, cursor:'pointer', fontSize:13, fontFamily:'inherit', flexShrink:0 }}>
            {T.backBtn}
          </button>
          <div style={{ width:1, height:18, background:th.border, flexShrink:0 }} />
          <div style={{ flexShrink:0 }}>
            <div style={{ fontSize:10, color:th.textDim, letterSpacing:'0.06em' }}>{pos.dept}</div>
            <div style={{ fontFamily:'quincy-cf, serif', fontSize:17, color:th.text, lineHeight:1.2 }}>{pos.title}</div>
          </div>
          <button
            onClick={() => setShowImport(true)}
            style={{ fontSize:10, fontWeight:700, color:'white', background:'#D86350', border:'none', borderRadius:20, padding:'5px 14px', cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em', whiteSpace:'nowrap', transition:'all 0.13s', flexShrink:0 }}
            onMouseEnter={e => { e.currentTarget.style.background='#C8012A' }}
            onMouseLeave={e => { e.currentTarget.style.background='#D86350' }}
          >
            + Add candidates
          </button>
        </div>
      </div>

      {/* Board + profile panel */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative' }}>

        {/* Restored banner */}
        {restoredBanner && (
          <div style={{
            position:'absolute', top:14, left:'50%', transform:'translateX(-50%)',
            zIndex:200, pointerEvents:'none',
            background:'rgba(27,36,97,0.1)', border:'1.5px solid rgba(27,36,97,0.3)',
            backdropFilter:'blur(16px)', borderRadius:20, padding:'8px 20px',
            fontSize:12, fontWeight:700, color:'#1B2461',
            boxShadow:'0 4px 20px rgba(27,36,97,0.15)',
            whiteSpace:'nowrap', letterSpacing:'0.01em',
            animation:'restoreIn 0.3s cubic-bezier(0.22,0.61,0.36,1) both',
          }}>
            ✓ {restoredBanner.name} restored to {restoredBanner.stage}
          </div>
        )}

        <div style={{ flex:1, overflow:'hidden', padding:'16px 18px', display:'flex', gap:10 }}>
          {VIS_STAGES.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              candidates={candidates[stage] || []}
              th={th}
              stageT={stageT}
              T={T}
              onMove={requestMove}
              onContact={c => onNavigate?.('craft', { candidate:c })}
              onReject={c => onNavigate?.('craft', { candidate:c, template:'rejection' })}
              onSelect={handleSelect}
              selectedId={selectedInfo?.candidate.id}
              dragOver={dragOverCol}
              onDragOver={setDragOverCol}
              onDrop={handleDrop}
              draggingId={dragState.id}
              onCapsuleDragStart={(id) => setDragState({ id, from: stage })}
              onCapsuleDragEnd={() => setDragState({ id:null, from:null })}
            />
          ))}
        </div>

        {selectedInfo && (
          <KanbanProfilePanel
            key={selectedInfo.candidate.id}
            candidate={selectedInfo.candidate}
            stage={selectedInfo.stage}
            th={th} stageT={stageT} T={T}
            onClose={() => setSelectedInfo(null)}
            onContact={() => { setSelectedInfo(null); onNavigate?.('craft', { candidate: selectedInfo.candidate }) }}
            onViewCV={c => setCvCandidate(c)}
          />
        )}
      </div>

      {/* Confirmation */}
      {pendingMove && (
        <ConfirmMove
          move={pendingMove}
          candidates={candidates}
          th={th} stageT={stageT} T={T}
          onConfirm={confirmMove}
          onCancel={() => setPendingMove(null)}
        />
      )}

      {/* Celebration */}
      {celebration && <Celebration msg={celebration} onDone={() => setCelebration(null)} />}

      {/* CV overlay */}
      {cvCandidate && <CVModal candidate={cvCandidate} onClose={() => setCvCandidate(null)} />}

      {/* Add-candidates import modal */}
      {showImport && (
        <AddCandidatesModal
          posTitle={pos.title}
          th={th}
          lang={lang}
          onClose={() => setShowImport(false)}
          onComplete={(newCandidates) => {
            setShowImport(false)
            setCelebration(`${newCandidates.length} CVs sent to CV Triage! 🎉`)
            setTimeout(() => {
              onNavigate?.('triage', { position: pos, extraCandidates: newCandidates })
            }, 1600)
          }}
        />
      )}
    </div>
  )
}
