import { useState } from 'react'

const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
}

// Rejected candidates, sorted oldest rejection first within each position
const REJECTED_BY_POSITION = [
  {
    positionId: 1,
    positionTitle: 'UX Designer',
    dept: 'Product Design',
    candidates: [
      { id: 3,  name: 'Sara Conti',      ini: 'SC', role: 'Junior UX Designer',   rejectedDaysAgo: 18, messageSent: false },
      { id: 7,  name: 'Davide Russo',    ini: 'DR', role: 'Interaction Designer',  rejectedDaysAgo: 11, messageSent: false },
      { id: 5,  name: 'Andrea Ricci',    ini: 'AR', role: 'Product Designer',      rejectedDaysAgo:  6, messageSent: true  },
      { id: 2,  name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',    rejectedDaysAgo:  3, messageSent: false },
    ],
  },
  {
    positionId: 2,
    positionTitle: 'Frontend Engineer',
    dept: 'Engineering',
    candidates: [
      { id: 11, name: 'Nina Patel',      ini: 'NP', role: 'Frontend Dev',         rejectedDaysAgo: 21, messageSent: false },
      { id: 10, name: 'Thomas Wright',   ini: 'TW', role: 'React Developer',       rejectedDaysAgo:  9, messageSent: true  },
    ],
  },
  {
    positionId: 3,
    positionTitle: 'Product Manager',
    dept: 'Product',
    candidates: [
      { id: 20, name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',            rejectedDaysAgo: 14, messageSent: false },
    ],
  },
  {
    positionId: 4,
    positionTitle: 'Data Analyst',
    dept: 'Data & Insights',
    candidates: [
      { id: 31, name: 'Raj Patel',       ini: 'RP', role: 'Data Analyst',         rejectedDaysAgo: 28, messageSent: false },
      { id: 32, name: 'Mia Fernandez',   ini: 'MF', role: 'Junior Analyst',       rejectedDaysAgo:  4, messageSent: false },
    ],
  },
]

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

function daysLabel(d) {
  if (d === 0) return 'Today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

function CandidateRow({ candidate, onWriteMessage, messageSent, onMarkSent, onBackToPipeline }) {
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
              Message sent
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
        {daysLabel(candidate.rejectedDaysAgo)}
      </span>

      {/* Back to pipeline */}
      <button
        onClick={onBackToPipeline}
        style={{
          padding: '7px 14px', borderRadius: 8,
          background: 'transparent', border: `1px solid ${C.border}`,
          color: C.muted, fontSize: 11, cursor: 'pointer',
          fontFamily: 'inherit', whiteSpace: 'nowrap',
          transition: 'all 0.13s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B2461'; e.currentTarget.style.color = '#1B2461' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        title="Move back to active pipeline"
      >
        ↩ Pipeline
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
          Resend
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
          Write message
        </button>
      )}
    </div>
  )
}

function PositionGroup({ group, onWriteMessage, sentMap, onMarkSent, defaultOpen, onBackToPipeline }) {
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
          <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 17, fontWeight: 400, color: C.text }}>
            {group.positionTitle}
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
              onBackToPipeline={() => onBackToPipeline(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function NotSuitable({ theme, onBack, onNavigate }) {
  const [sentMap, setSentMap] = useState(() => {
    const map = {}
    REJECTED_BY_POSITION.forEach(g => g.candidates.forEach(c => { map[c.id] = c.messageSent }))
    return map
  })
  // Track which candidates have been moved back to pipeline (hidden from list)
  const [restoredIds, setRestoredIds] = useState(new Set())

  const totalPending = REJECTED_BY_POSITION
    .flatMap(g => g.candidates)
    .filter(c => !sentMap[c.id] && !restoredIds.has(c.id))
    .length

  const handleWriteMessage = (candidate) => {
    onNavigate?.('craft', { candidate })
  }

  const handleMarkSent = (id, val) => {
    setSentMap(m => ({ ...m, [id]: val }))
  }

  const handleBackToPipeline = (id) => {
    setRestoredIds(s => { const n = new Set(s); n.add(id); return n })
    onNavigate?.('dashboard')
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
          ←
        </button>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            Not Suitable
          </div>
          <h1 style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 20, fontWeight: 400, color: C.text, margin: 0,
          }}>
            Rejected Candidates
          </h1>
        </div>
        {totalPending > 0 && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 11, fontWeight: 600, color: C.red,
            background: '#FEE2E2', padding: '4px 12px', borderRadius: 20,
          }}>
            {totalPending} message{totalPending !== 1 ? 's' : ''} pending
          </span>
        )}
      </div>

      {/* Explanation */}
      <div style={{ padding: '16px 28px 8px', background: C.white, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
          Candidates are listed oldest rejection first — those waiting longer have higher priority for a message.
          Use <strong style={{ color: C.text }}>↩ Pipeline</strong> to restore a candidate to the active pipeline.
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 40px' }}>
        {visibleGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.muted }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <p style={{ fontSize: 14, margin: 0 }}>All candidates have been messaged or restored.</p>
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
            />
          ))
        )}
      </div>

    </div>
  )
}
