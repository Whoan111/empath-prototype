import { useState } from 'react'

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

const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  navy:  '#1B2461',
}

// Rejected candidates — sorted oldest rejection first within each position
// previousStage = the Kanban stage they were in when rejected
const REJECTED_BY_POSITION = [
  {
    positionId: 1,
    positionTitle: 'UX Designer',
    dept: 'Product Design',
    candidates: [
      { id: 3,  name: 'Sara Conti',    ini: 'SC', role: 'Junior UX Designer',  rejectedDaysAgo: 18, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 7,  name: 'Davide Russo',  ini: 'DR', role: 'Interaction Designer', rejectedDaysAgo: 11, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 5,  name: 'Andrea Ricci',  ini: 'AR', role: 'Product Designer',     rejectedDaysAgo:  6, messageSent: true,  previousStage: 'Interviews'},
      { id: 2,  name: 'Marco Bianchi', ini: 'MB', role: 'Senior UX Designer',   rejectedDaysAgo:  3, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
  {
    positionId: 2,
    positionTitle: 'Frontend Engineer',
    dept: 'Engineering',
    candidates: [
      { id: 11, name: 'Nina Patel',    ini: 'NP', role: 'Frontend Dev',         rejectedDaysAgo: 21, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 10, name: 'Thomas Wright', ini: 'TW', role: 'React Developer',      rejectedDaysAgo:  9, messageSent: true,  previousStage: 'Interviews'},
    ],
  },
  {
    positionId: 3,
    positionTitle: 'Product Manager',
    dept: 'Product',
    candidates: [
      { id: 20, name: 'Sofia Esposito',ini: 'SE', role: 'Senior PM',            rejectedDaysAgo: 14, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
  {
    positionId: 4,
    positionTitle: 'Data Analyst',
    dept: 'Data & Insights',
    candidates: [
      { id: 31, name: 'Raj Patel',     ini: 'RP', role: 'Data Analyst',         rejectedDaysAgo: 28, messageSent: false, previousStage: 'Pre-Call'  },
      { id: 32, name: 'Mia Fernandez', ini: 'MF', role: 'Junior Analyst',       rejectedDaysAgo:  4, messageSent: false, previousStage: 'Pre-Call'  },
    ],
  },
]

const RESTORE_STAGES = ['Pre-Call', 'Interviews', 'Decision']

const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
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
  if (daysAgo >= 14) return '#C9394A'
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
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.redBg, border:`1px solid ${C.redL}`, borderRadius:20, padding:'3px 12px', marginBottom:18, fontSize:10, fontWeight:700, color:C.red, letterSpacing:'0.06em' }}>
          {group.positionTitle} · {group.dept}
        </div>

        <div style={{ fontFamily:'DM Serif Display, Georgia, serif', fontSize:20, color:C.text, marginBottom:18 }}>
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
                    border: sel ? `2px solid ${C.navy}` : `1px solid ${C.border}`,
                    background: sel ? C.navy : C.white,
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
            style={{ flex:1.4, padding:'10px', borderRadius:9, border:'none', background:C.navy, color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.02em' }}
          >
            {T.restoreConfirm}
          </button>
        </div>
      </div>
    </div>
  )
}

function CandidateRow({ candidate, onWriteMessage, messageSent, onMarkSent, onBackToPipeline, T, lang }) {
  const [hov, setHov] = useState(false)
  const urg = urgencyColor(candidate.rejectedDaysAgo)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 20px',
        background: hov ? '#FFF8F8' : C.white,
        borderBottom: `1px solid ${C.border}`,
        transition: 'background 0.13s',
      }}
    >
      <Av id={candidate.id} ini={candidate.ini} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{candidate.name}</span>
          {messageSent && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#059669', background: '#D1FAE5', padding: '1px 8px', borderRadius: 20 }}>
              {T.messageSent}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{candidate.role}</div>
      </div>

      <span style={{
        fontSize: 10, fontWeight: 700, color: urg,
        background: candidate.rejectedDaysAgo >= 14 ? '#FEE2E2' : candidate.rejectedDaysAgo >= 7 ? '#FEF3C7' : C.gray,
        padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
      }}>
        {daysLabel(candidate.rejectedDaysAgo, lang)}
      </span>

      {/* Back to pipeline — opens stage-picker modal */}
      <button
        onClick={() => onBackToPipeline(candidate)}
        style={{
          padding: '7px 14px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${C.border}`,
          color: C.muted, fontSize: 11, cursor: 'pointer',
          fontFamily: 'inherit', whiteSpace: 'nowrap',
          transition: 'all 0.13s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy }}
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
            background: 'transparent', border: `1px solid ${C.border}`,
            color: C.muted, fontSize: 11, cursor: 'pointer',
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

function PositionGroup({ group, onWriteMessage, sentMap, onMarkSent, defaultOpen, onBackToPipeline, T, lang }) {
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
          background: '#FFF5F6', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>
            {group.dept}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {pendingCount > 0 && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, boxShadow: '0 0 6px rgba(201,57,74,0.45)', flexShrink: 0 }} />
            )}
            <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 17, fontWeight: 400, color: C.text }}>
              {group.positionTitle}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: C.muted }}>
            {group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''}
          </span>
          {pendingCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: C.red, background: '#FEE2E2', padding: '2px 9px', borderRadius: 20 }}>
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
              T={T}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function NotSuitable({ lang = 'en', theme, onBack, onNavigate }) {
  const T = SCREEN_T[lang] || SCREEN_T.en
  const [sentMap, setSentMap] = useState(() => {
    const map = {}
    REJECTED_BY_POSITION.forEach(g => g.candidates.forEach(c => { map[c.id] = c.messageSent }))
    return map
  })
  const [restoredIds,    setRestoredIds]    = useState(new Set())
  const [restorePending, setRestorePending] = useState(null)  // { candidate, group }

  const totalPending = REJECTED_BY_POSITION
    .flatMap(g => g.candidates)
    .filter(c => !sentMap[c.id] && !restoredIds.has(c.id))
    .length

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FAFAF8' }}>

      {/* Header */}
      <div style={{
        padding: '16px 28px',
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
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 20, fontWeight: 400, color: C.text, margin: 0,
          }}>
            {T.title}
          </h1>
        </div>
        {totalPending > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 11, fontWeight: 600, color: C.red,
            background: '#FEE2E2', padding: '4px 12px', borderRadius: 20,
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

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
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
              T={T}
              lang={lang}
            />
          ))
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
