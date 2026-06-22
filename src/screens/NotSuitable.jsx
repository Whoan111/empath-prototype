import { useState, useEffect } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

const SCREEN_T = {
  en: {
    back:            '← Back',
    badge:           'Not Suitable',
    title:           'Rejected Candidates',
    messagesPending: (n) => `${n} message${n !== 1 ? 's' : ''} pending`,
    explanation:     'Candidates are listed oldest rejection first — those waiting longer have higher priority for a message.',
    pipelineNote:    'Use',
    pipelineBtn:     'Bring back',
    pipelineNote2:   'to restore a candidate to the active pipeline.',
    writeMessage:    'Write message',
    resend:          'Resend',
    pipeline:        'Bring back',
    messageSent:     'Message sent',
    emptyAll:        'All candidates have been messaged or restored.',
    allSentInGroup:  (pos) => `Every candidate from ${pos} has heard from you — that's what good recruitment looks like.`,
    bannerMsg:       'You reached everyone who needed to hear from you today. That matters.',
    waitDays:        (d) => d === 1 ? 'Waiting 1 day' : `Waiting ${d} days`,
    waitLong:        (d) => `Waiting ${d} days — that's a long time.`,
    waitVeryLong:    (d) => `Waiting ${d} days — that's a long time to be in the dark.`,
    // Restore modal
    restoreTitle:    'Bring back to pipeline',
    restoreTo:       'Restore to which stage?',
    restoreConfirm:  'Bring back →',
    cancel:          'Cancel',
    stageLabels: {
      'Pre-Call':  'Pre-Call',
      Interviews:  'Interviews',
      Decision:    'Decision',
    },
  },
  it: {
    back:            '← Indietro',
    badge:           'Non Idoneo',
    title:           'Candidati Rifiutati',
    messagesPending: (n) => `${n} ${n !== 1 ? 'messaggi' : 'messaggio'} in attesa`,
    explanation:     'I candidati sono elencati per data di rifiuto più vecchia — chi aspetta da più tempo ha priorità più alta.',
    pipelineNote:    'Usa',
    pipelineBtn:     'Riporta',
    pipelineNote2:   'per ripristinare un candidato nella pipeline attiva.',
    writeMessage:    'Scrivi messaggio',
    resend:          'Reinvia',
    pipeline:        'Riporta',
    messageSent:     'Messaggio inviato',
    emptyAll:        'Tutti i candidati sono stati contattati o ripristinati.',
    allSentInGroup:  (pos) => `Ogni candidato da ${pos} ha ricevuto risposta — è così che funziona un buon reclutamento.`,
    bannerMsg:       'Hai raggiunto tutti coloro che avevano bisogno di sentirti oggi. È importante.',
    waitDays:        (d) => d === 1 ? 'In attesa da 1 giorno' : `In attesa da ${d} giorni`,
    waitLong:        (d) => `In attesa da ${d} giorni — è molto tempo.`,
    waitVeryLong:    (d) => `In attesa da ${d} giorni — è molto tempo per stare al buio.`,
    restoreTitle:    'Riporta in pipeline',
    restoreTo:       'In quale fase ripristinare?',
    restoreConfirm:  'Riporta →',
    cancel:          'Annulla',
    stageLabels: {
      'Pre-Call':  'Pre-Chiamata',
      Interviews:  'Colloqui',
      Decision:    'Decisione',
    },
  },
}


// Rejected candidates — sorted oldest rejection first within each position
// previousStage = the Kanban stage they were in when rejected
const REJECTED_BY_POSITION = [
  {
    positionId: 1,
    positionTitle: 'UX Designer',
    dept: 'Product Design',
    candidates: [
      { id: 3,  name: 'Sara Conti',    ini: 'SC', role: 'Junior UX Designer',  rejectedDaysAgo: 12, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 7,  name: 'Davide Russo',  ini: 'DR', role: 'Interaction Designer', rejectedDaysAgo:  8, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 5,  name: 'Andrea Ricci',  ini: 'AR', role: 'Product Designer',     rejectedDaysAgo:  6, messageSent: true,  previousStage: 'Interviews'},
      { id: 2,  name: 'Marco Bianchi', ini: 'MB', role: 'Senior UX Designer',   rejectedDaysAgo:  2, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
  {
    positionId: 2,
    positionTitle: 'Frontend Engineer',
    dept: 'Engineering',
    candidates: [
      { id: 11, name: 'Nina Patel',    ini: 'NP', role: 'Frontend Dev',         rejectedDaysAgo: 11, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 10, name: 'Thomas Wright', ini: 'TW', role: 'React Developer',      rejectedDaysAgo:  7, messageSent: true,  previousStage: 'Interviews'},
    ],
  },
  {
    positionId: 3,
    positionTitle: 'Product Manager',
    dept: 'Product',
    candidates: [
      { id: 20, name: 'Sofia Esposito',ini: 'SE', role: 'Senior PM',            rejectedDaysAgo:  9, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
  {
    positionId: 4,
    positionTitle: 'Data Analyst',
    dept: 'Data & Insights',
    candidates: [
      { id: 31, name: 'Raj Patel',     ini: 'RP', role: 'Data Analyst',         rejectedDaysAgo: 13, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 32, name: 'Mia Fernandez', ini: 'MF', role: 'Junior Analyst',       rejectedDaysAgo:  3, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
]

const RESTORE_STAGES = ['Pre-Call', 'Interviews', 'Decision']

const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]

function Av({ id, ini, size = 36 }) {
  const [bg, color] = AV_PALETTE[(id - 1) % AV_PALETTE.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.30, fontWeight: 600,
    }}>{ini}</div>
  )
}

function urgencyColor(daysAgo) {
  if (daysAgo >= 14) return '#D86350'
  if (daysAgo >= 7)  return '#D97706'
  return '#78716C'
}

function daysLabel(d, lang) {
  if (lang === 'it') {
    if (d === 0) return 'Oggi'
    if (d === 1) return '1 giorno fa'
    return `${d} giorni fa`
  }
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

// ── Restore modal ─────────────────────────────────────────────────────────────
function RestoreModal({ candidate, group, T, onConfirm, onCancel }) {
  const [stage, setStage] = useState(candidate.previousStage || 'Pre-Call')

  return (
    <div
      onClick={onCancel}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(5px)' }}
    >
      <style>{`@keyframes rmIn{from{opacity:0;transform:scale(.95) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.white, borderRadius: '0.875rem', padding: '26px 28px', width: 420,
          border: `1px solid ${C.border}`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          animation: 'rmIn 0.2s ease',
        }}
      >
        {/* Position badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: isDark ? 'rgba(254,154,12,0.12)' : '#FEF3C7', border:`1px solid ${isDark ? 'rgba(254,154,12,0.3)' : '#FDE68A'}`, borderRadius:20, padding:'3px 12px', marginBottom:18, fontSize:10, fontWeight:700, color: isDark ? '#FE9A0C' : '#B45309', letterSpacing:'0.06em' }}>
          {group.positionTitle} · {group.dept}
        </div>

        <div style={{ fontFamily:'Quincy CF, Georgia, serif', fontSize:20, color:C.text, marginBottom:18 }}>
          {T.restoreTitle}
        </div>

        {/* Candidate */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:C.gray, borderRadius:10, marginBottom:22, border:`1px solid ${C.border}` }}>
          <Av id={candidate.id} ini={candidate.ini} size={40} />
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{candidate.name}</div>
            <div style={{ fontSize:11, color:C.muted }}>{candidate.role}</div>
          </div>
        </div>

        {/* Stage picker */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
            {T.restoreTo}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {RESTORE_STAGES.map(s => {
              const sel = stage === s
              return (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  style={{
                    flex:1, padding:'9px 6px', borderRadius:9,
                    border: sel ? `2px solid ${C.red}` : `1px solid ${C.border}`,
                    background: sel ? C.red : C.white,
                    color: sel ? C.white : C.muted,
                    fontSize:11, fontWeight: sel ? 700 : 400,
                    cursor:'pointer', fontFamily:'inherit',
                    transition:'all 0.13s',
                  }}
                >
                  {T.stageLabels[s]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
          >
            {T.cancel}
          </button>
          <button
            onClick={() => onConfirm(stage)}
            style={{ flex:1.4, padding:'10px', borderRadius:9, border:'none', background:C.red, color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em' }}
          >
            {T.restoreConfirm}
          </button>
        </div>
      </div>
    </div>
  )
}

// Varied phrasings so each candidate reads differently — picked deterministically by id
const PHRASES_LONG = [
  "they're still waiting to hear.",
  "silence can feel louder than words.",
  "that's longer than it should be.",
  "they haven't heard anything yet.",
  "that's a long time to sit with uncertainty.",
]
const PHRASES_VERY_LONG = [
  "that's a long time to be in the dark.",
  "every day of silence adds up.",
  "they deserve to hear from you.",
  "uncertainty at this stage isn't kind.",
  "they've been wondering since then.",
]

// ── Mini pipeline ─────────────────────────────────────────────────────────────
const NS_PIPELINE = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']
const NS_STAGE_SHORT = { Screening: 'Screen', 'Pre-Call': 'Pre-Call', Interviews: 'Interview', Decision: 'Decision', Offer: 'Offer' }

function MiniPipeline({ stage }) {
  const idx = NS_PIPELINE.indexOf(stage)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {NS_PIPELINE.map((s, i) => {
        const past = i <= idx
        const curr = i === idx
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < NS_PIPELINE.length - 1 && (
              <div style={{ position: 'absolute', top: 6, left: '50%', width: '100%', height: 2, background: i < idx ? C.red : C.border, zIndex: 0 }} />
            )}
            <div style={{ width: 12, height: 12, borderRadius: 2, transform: 'rotate(45deg)', background: curr ? C.red : past ? `${C.red}55` : C.gray, border: `1.5px solid ${curr ? C.red : past ? `${C.red}55` : C.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? `0 0 0 2.5px white` : 'none' }} />
            <div style={{ fontSize: 7, color: curr ? C.red : C.muted, fontWeight: curr ? 700 : 400, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {NS_STAGE_SHORT[s] || s}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Right profile panel ───────────────────────────────────────────────────────
function CandidateProfilePanel({ candidate, group, messageSent, onWriteMessage, onBackToPipeline, onClose }) {
  const d = candidate.rejectedDaysAgo
  const urgColor = d > 10 ? C.red : d > 5 ? '#D97706' : C.muted
  return (
    <aside style={{ width: 300, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${C.border}`, background: `${C.red}08`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
          <Av id={candidate.id} ini={candidate.ini} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
            {group && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{group.dept} · {group.positionTitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}>×</button>
        </div>
        <MiniPipeline stage={candidate.previousStage} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Rejection status</div>

        {/* Wait time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: d > 5 ? (d > 10 ? C.redBg : '#FEF3C7') : C.gray, borderRadius: 8, border: `1px solid ${d > 10 ? C.redL : d > 5 ? '#FDE68A' : C.border}`, marginBottom: 10 }}>
          {d > 5 && <span style={{ width: 6, height: 6, borderRadius: '50%', background: urgColor, flexShrink: 0 }} />}
          <span style={{ fontSize: 11, fontWeight: 600, color: urgColor }}>
            {d === 0 ? 'Rejected today' : d === 1 ? 'Waiting 1 day' : `Waiting ${d} days`}
          </span>
        </div>

        {/* Message status */}
        {messageSent
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.sucT, background: C.sucBg, padding: '7px 10px', borderRadius: 8 }}>
              <span>✓</span> Message sent
            </div>
          : <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.red, background: C.redBg, padding: '7px 10px', borderRadius: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, flexShrink: 0 }} />
              Not yet messaged
            </div>
        }
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => onWriteMessage(candidate)}
          style={{ padding: '10px', borderRadius: 9, background: `${C.red}0D`, color: C.red, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.background = `${C.red}1A`}
          onMouseLeave={e => e.currentTarget.style.background = `${C.red}0D`}
        >
          ✉ {messageSent ? 'Resend message' : 'Write message'}
        </button>
        <button
          onClick={() => onBackToPipeline(candidate, group)}
          style={{ padding: '10px', borderRadius: 9, background: C.redBg, color: C.red, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ↩ Bring back to pipeline
        </button>
      </div>
    </aside>
  )
}

function CandidateRow({ candidate, onWriteMessage, messageSent, onMarkSent, onBackToPipeline, onSelect, isSelected, T, lang }) {
  const [hov, setHov] = useState(false)
  const d = candidate.rejectedDaysAgo
  const isVeryLong = !messageSent && d > 10
  const isLong     = !messageSent && d > 5 && d <= 10

  // Pick phrase by id+days so each row gets a distinct voice
  const phraseKey = candidate.id + d
  const phrase = isVeryLong
    ? PHRASES_VERY_LONG[phraseKey % PHRASES_VERY_LONG.length]
    : PHRASES_LONG[phraseKey % PHRASES_LONG.length]

  const waitLabel = isVeryLong ? `Waiting ${d} days — ${phrase}`
                  : isLong     ? `Waiting ${d} days — ${phrase}`
                  : !messageSent && d > 0 ? T.waitDays(d)
                  : null

  const waitColor = isVeryLong ? C.red : isLong ? '#D97706' : C.muted

  const rowBg = isSelected ? C.redBg : hov ? C.surfaceHov : C.white

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px',
        background: rowBg,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: isSelected ? `3px solid ${C.red}` : '3px solid transparent',
        transition: 'background 0.13s',
      }}
    >
      {/* Clickable avatar */}
      <button onClick={() => onSelect?.(candidate)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 0 }}>
        <Av id={candidate.id} ini={candidate.ini} />
      </button>

      {/* Name / role / wait time — all in one text block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => onSelect?.(candidate)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: 'inherit', textAlign: 'left' }}>{candidate.name}</button>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{candidate.role}</div>
        {messageSent && (
          <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 500, color: C.sucT, background: C.sucBg, padding: '2px 8px', borderRadius: 20 }}>
            {T.messageSent}
          </span>
        )}
        {waitLabel && (
          <div style={{
            fontSize: 11, marginTop: 4,
            fontWeight: (isLong || isVeryLong) ? 600 : 400,
            color: waitColor,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {isVeryLong && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.red, flexShrink: 0, boxShadow: '0 0 4px rgba(216,99,80,0.5)' }} />
            )}
            {isLong && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706', flexShrink: 0 }} />
            )}
            {waitLabel}
          </div>
        )}
      </div>

      {/* Back to pipeline */}
      <button
        onClick={() => onBackToPipeline(candidate)}
        style={{
          padding: '7px 14px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${C.border}`,
          color: C.muted, fontSize: 11, cursor: 'pointer',
          fontFamily: 'inherit', whiteSpace: 'nowrap',
          transition: 'all 0.13s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        title="Move back to active pipeline"
      >
        {T.pipeline}
      </button>

      {messageSent ? (
        <button
          onClick={() => onMarkSent(candidate.id, false)}
          style={{
            padding: '7px 16px', borderRadius: 8,
            background: C.gray, border: `1px solid ${C.grayB}`,
            color: C.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}
        >
          {T.resend}
        </button>
      ) : (
        <button
          onClick={() => onWriteMessage(candidate)}
          style={{
            padding: '7px 16px', borderRadius: 8,
            background: C.red, color: '#FFFFFF',
            border: 'none', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}
        >
          {T.writeMessage}
        </button>
      )}
    </div>
  )
}

function PositionGroup({ group, onWriteMessage, sentMap, onMarkSent, defaultOpen, onBackToPipeline, onSelect, selectedId, T, lang }) {
  const [open, setOpen] = useState(defaultOpen)
  const pendingCount = group.candidates.filter(c => !sentMap[c.id]).length

  // Sort: oldest rejection first
  const sorted = [...group.candidates].sort((a, b) => b.rejectedDaysAgo - a.rejectedDaysAgo)

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: '0.75rem', overflow: 'hidden', marginBottom: 14 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          background: isDark ? 'rgba(216,99,80,0.06)' : '#FFF8F6', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            {group.dept}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pendingCount > 0 && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: isDark ? '#FE9A0C' : '#D97706', boxShadow: '0 0 6px rgba(254,154,12,0.4)', flexShrink: 0 }} />
            )}
            <div style={{ fontFamily: 'Quincy CF, Georgia, serif', fontSize: 17, fontWeight: 400, color: C.text }}>
              {group.positionTitle}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: C.muted }}>
            {group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''}
          </span>
          {pendingCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#FE9A0C' : '#B45309', background: isDark ? 'rgba(254,154,12,0.12)' : '#FEF3C7', border: `1px solid ${isDark ? 'rgba(254,154,12,0.3)' : '#FDE68A'}`, padding: '2px 9px', borderRadius: 20 }}>
              {pendingCount} pending
            </span>
          )}
          <span style={{ fontSize: 14, color: C.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {open && (
        <div>
          {sorted.map(c => (
            <CandidateRow
              key={c.id}
              candidate={c}
              onWriteMessage={onWriteMessage}
              messageSent={sentMap[c.id] ?? c.messageSent}
              onMarkSent={onMarkSent}
              onBackToPipeline={(cand) => onBackToPipeline(cand, group)}
              onSelect={(cand) => onSelect?.(cand, group)}
              isSelected={selectedId === c.id}
              T={T}
              lang={lang}
            />
          ))}
          {/* Per-group completion note — only when every candidate has been messaged */}
          {pendingCount === 0 && group.candidates.length > 0 && (
            <div style={{
              padding: '11px 20px',
              background: isDark ? 'rgba(216,99,80,0.06)' : 'rgba(216,99,80,0.04)',
              borderTop: `1px solid rgba(216,99,80,0.12)`,
              display: 'flex', alignItems: 'center', gap: 9,
              fontSize: 11, color: C.red, fontWeight: 500,
            }}>
              <span style={{ fontSize: 13 }}>✓</span>
              {T.allSentInGroup(group.positionTitle)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function NotSuitable({ lang = 'en', theme, onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [sentMap, setSentMap] = useState(() => {
    const map = {}
    REJECTED_BY_POSITION.forEach(g => g.candidates.forEach(c => { map[c.id] = c.messageSent }))
    return map
  })
  const [restoredIds,    setRestoredIds]    = useState(new Set())
  const [restorePending, setRestorePending] = useState(null)  // { candidate, group }
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedGroup,     setSelectedGroup]     = useState(null)

  const handleSelect = (candidate, group) => {
    if (selectedCandidate?.id === candidate.id) {
      setSelectedCandidate(null)
      setSelectedGroup(null)
    } else {
      setSelectedCandidate(candidate)
      setSelectedGroup(group)
    }
  }

  const totalPending = REJECTED_BY_POSITION
    .flatMap(g => g.candidates)
    .filter(c => !sentMap[c.id] && !restoredIds.has(c.id))
    .length

  // Urgent = waiting > 5 days and not yet messaged
  const urgentCount = REJECTED_BY_POSITION
    .flatMap(g => g.candidates)
    .filter(c => !restoredIds.has(c.id) && !sentMap[c.id] && c.rejectedDaysAgo > 5)
    .length

  // Positive reinforcement banner — fires once per session when urgentCount hits 0
  const [hadUrgent,  setHadUrgent]  = useState(() => urgentCount > 0)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (urgentCount > 0) setHadUrgent(true)
  }, [urgentCount])

  useEffect(() => {
    if (hadUrgent && urgentCount === 0) {
      setShowBanner(true)
      const t = setTimeout(() => setShowBanner(false), 6000)
      return () => clearTimeout(t)
    }
  }, [hadUrgent, urgentCount])

  const handleWriteMessage = (candidate) => {
    onNavigate?.('craft', { candidate, from: 'not-suitable' })
  }

  const handleMarkSent = (id, val) => {
    setSentMap(m => ({ ...m, [id]: val }))
  }

  // Step 1: open the stage-picker modal
  const handleBackToPipeline = (candidate, group) => {
    setRestorePending({ candidate, group })
  }

  // Step 2: confirmed — remove from list, navigate to the right Kanban column
  const handleConfirmRestore = (stage) => {
    const { candidate, group } = restorePending
    setRestoredIds(s => { const n = new Set(s); n.add(candidate.id); return n })
    setRestorePending(null)

    const position = { id: group.positionId, title: group.positionTitle, dept: group.dept }
    const restoreCandidate = {
      id:    candidate.id,
      name:  candidate.name,
      ini:   candidate.ini,
      role:  candidate.role,
      stage,           // which column to land in
      daysAgo: 0,
    }
    onNavigate?.('kanban', { position, restoreCandidate })
  }

  // Filter out restored candidates
  const visibleGroups = REJECTED_BY_POSITION
    .map(g => ({ ...g, candidates: g.candidates.filter(c => !restoredIds.has(c.id)) }))
    .filter(g => g.candidates.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: isDark ? C.gray : 'transparent' }}>

      {/* Header */}
      <div style={{
        padding: '16px 28px',
        paddingRight: 60,
        background: C.white,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 16,
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}
        >
          {T.back}
        </button>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            {T.badge}
          </div>
          <h1 style={{
            fontFamily: 'Quincy CF, Georgia, serif',
            fontSize: 20, fontWeight: 400, color: C.text, margin: 0,
          }}>
            {T.title}
          </h1>
        </div>
        {totalPending > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 11, fontWeight: 600, color: C.red,
            background: C.redBg, padding: '4px 12px', borderRadius: 20,
          }}>
            {T.messagesPending(totalPending)}
          </span>
        )}
      </div>

      {/* Explanation */}
      <div style={{ padding: '16px 28px 8px', background: C.white, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
          {T.explanation}{' '}
          {T.pipelineNote} <strong style={{ color: C.text }}>{T.pipelineBtn}</strong> {T.pipelineNote2}
        </p>
      </div>

      {/* Body: list + optional right profile panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>

          {/* Positive reinforcement banner — appears when all urgent follow-ups are cleared */}
          {showBanner && (
            <div style={{
              position: 'sticky', top: 0, zIndex: 20,
              marginBottom: 18,
              padding: '13px 18px',
              background: isDark ? 'rgba(216,99,80,0.10)' : 'rgba(216,99,80,0.06)',
              border: `1.5px solid rgba(216,99,80,0.22)`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 10,
              color: C.red,
              fontSize: 13, fontWeight: 500, lineHeight: 1.55,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>✓</span>
              {T.bannerMsg}
            </div>
          )}

          {visibleGroups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: C.muted }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <p style={{ fontSize: 14, margin: 0 }}>{T.emptyAll}</p>
            </div>
          ) : (
            visibleGroups.map((group, i) => (
              <PositionGroup
                key={group.positionId}
                group={group}
                onWriteMessage={handleWriteMessage}
                sentMap={sentMap}
                onMarkSent={handleMarkSent}
                defaultOpen={i === 0}
                onBackToPipeline={handleBackToPipeline}
                onSelect={handleSelect}
                selectedId={selectedCandidate?.id}
                T={T}
                lang={lang}
              />
            ))
          )}
        </div>

        {/* Right profile panel */}
        {selectedCandidate && (
          <CandidateProfilePanel
            candidate={selectedCandidate}
            group={selectedGroup}
            messageSent={sentMap[selectedCandidate.id] ?? selectedCandidate.messageSent}
            onWriteMessage={handleWriteMessage}
            onBackToPipeline={handleBackToPipeline}
            onClose={() => { setSelectedCandidate(null); setSelectedGroup(null) }}
          />
        )}
      </div>

      {/* Restore modal */}
      {restorePending && (
        <RestoreModal
          candidate={restorePending.candidate}
          group={restorePending.group}
          T={T}
          onConfirm={handleConfirmRestore}
          onCancel={() => setRestorePending(null)}
        />
      )}
    </div>
  )
}
