// ─────────────────────────────────────────────────────────────────────────────
// DebriefList.jsx
// Place in: src/screens/DebriefList.jsx
//
// Hub for post-interview debriefs — hiring manager's view.
// Shows two collapsible sections:
//   ⏳ Pending   — interviews done, questionnaire not yet submitted
//   ✓  Completed — questionnaire submitted, recommendation recorded
//
// Props:
//   onBack()     — navigate back
//   onNavigate() — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

const SCREEN_T = {
  en: {
    back:             '← Back to dashboard',
    badge:            'Hiring Manager',
    title:            'Interview Debriefs',
    subtitle:         "Fill a debrief right after each interview while the conversation is fresh. Completed debriefs feed into the decision debrief and the candidate update.",
    pendingLabel:     'PENDING',
    completedLabel:   'COMPLETED',
    pendingTitle:     'Pending debriefs',
    completedTitle:   'Completed debriefs',
    colCandidate:     'Candidate',
    colDaysAgo:       'Days ago',
    colAction:        'Action',
    colSubmittedBy:   'Submitted by',
    colActions:       'Actions',
    fillDebrief:      'Fill debrief →',
    editBtn:          'Edit',
    allUpToDate:      'All debriefs are up to date — nothing pending.',
    noCompleted:      'No completed debriefs yet.',
    submittedBy:      'Submitted by',
    tip:              'Best practice:',
    tipText:          "fill the debrief within a few hours of the interview — observations are sharpest right after the conversation. Completed debriefs appear in the consolidated decision debrief for all interviewers.",
    roundLabel:       (n) => `Round ${n} debrief`,
    submittedOn:      'Submitted',
    recommendation:   'Fit:',
    roundOf:          (n) => `Round ${n}`,
    recLabels: {
      'strongly-advance': 'Strong advance',
      'advance':          'Average fit',
      'reservations':     'Fit with reservations',
      'not-moving':       'Not advancing',
    },
  },
  it: {
    back:             '← Torna alla bacheca',
    badge:            'Responsabile Assunzioni',
    title:            'Debrief Colloqui',
    subtitle:         "Compila il debrief subito dopo ogni colloquio, mentre la conversazione è fresca. I debrief completati confluiscono nel debrief decisionale.",
    pendingLabel:     'IN ATTESA',
    completedLabel:   'COMPLETATI',
    pendingTitle:     'Debrief in attesa',
    completedTitle:   'Debrief completati',
    colCandidate:     'Candidato',
    colDaysAgo:       'Giorni fa',
    colAction:        'Azione',
    colSubmittedBy:   'Inviato da',
    colActions:       'Azioni',
    fillDebrief:      'Compila debrief →',
    editBtn:          'Modifica',
    allUpToDate:      'Tutti i debrief sono aggiornati — nessuno in attesa.',
    noCompleted:      'Nessun debrief completato ancora.',
    submittedBy:      'Inviato da',
    tip:              'Best practice:',
    tipText:          "compila il debrief entro poche ore dal colloquio — le osservazioni sono più nitide subito dopo. I debrief completati appaiono nel debrief decisionale consolidato.",
    roundLabel:       (n) => `Debrief round ${n}`,
    submittedOn:      'Inviato il',
    recommendation:   'Idoneità:',
    roundOf:          (n) => `Round ${n}`,
    recLabels: {
      'strongly-advance': 'Forte avanzamento',
      'advance':          'Idoneità media',
      'reservations':     'Idoneo con riserve',
      'not-moving':       'Non avanza',
    },
  },
}


// ── Mock data ─────────────────────────────────────────────────────────────────
// Pending — interview took place, no debrief submitted yet
const PENDING = [
  {
    id: 4,  name: 'Luca Ferrari',    ini: 'LF',
    role: 'Mid UX Designer',  pos: 'UX Designer',
    interviewDate: '18 May 2026', interviewType: 'Technical Deep-Dive', round: 2,
    daysAgo: 15,
  },
  {
    id: 11, name: 'Sofia Esposito',  ini: 'SE',
    role: 'Senior PM',         pos: 'Product Manager',
    interviewDate: '22 May 2026', interviewType: 'Getting to know you', round: 1,
    daysAgo: 11,
  },
]

// Completed — debrief questionnaire submitted
const COMPLETED = [
  {
    id: 1,  name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',     pos: 'UX Designer',
    completedDate: '14 May 2026', round: 1, interviewType: 'Portfolio Review',
    submittedBy: 'Andrea P.', submitterRole: 'Hiring Manager',
    recommendation: 'advance',
  },
  {
    id: 1,  name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',     pos: 'UX Designer',
    completedDate: '17 May 2026', round: 2, interviewType: 'Technical Deep-Dive',
    submittedBy: 'Elena C.', submitterRole: 'Tech Lead',
    recommendation: 'advance',
  },
  {
    id: 2,  name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',  pos: 'UX Designer',
    completedDate: '14 May 2026', round: 1, interviewType: 'Portfolio Review',
    submittedBy: 'Andrea P.', submitterRole: 'Hiring Manager',
    recommendation: 'strongly-advance',
  },
  {
    id: 7,  name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',       pos: 'UX Designer',
    completedDate: '6 May 2026',  round: 1, interviewType: 'Research Deep-Dive',
    submittedBy: 'Andrea P.', submitterRole: 'Hiring Manager',
    recommendation: 'strongly-advance',
  },
  {
    id: 7,  name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',       pos: 'UX Designer',
    completedDate: '10 May 2026', round: 2, interviewType: 'Values & Team Fit',
    submittedBy: 'Andrea P.', submitterRole: 'Design Director',
    recommendation: 'strongly-advance',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 36 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

// ── Mini pipeline ─────────────────────────────────────────────────────────────
const DL_PIPELINE = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']
const DL_STAGE_SHORT = { Screening: 'Screen', 'Pre-Call': 'Pre-Call', Interviews: 'Interview', Decision: 'Decision', Offer: 'Offer' }

function MiniPipeline({ stage }) {
  const idx = DL_PIPELINE.indexOf(stage)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {DL_PIPELINE.map((s, i) => {
        const past = i <= idx
        const curr = i === idx
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < DL_PIPELINE.length - 1 && (
              <div style={{ position: 'absolute', top: 6, left: '50%', width: '100%', height: 2, background: i < idx ? C.red : C.border, zIndex: 0 }} />
            )}
            <div style={{ width: 12, height: 12, borderRadius: 2, transform: 'rotate(45deg)', background: curr ? C.red : past ? `${C.red}55` : C.gray, border: `1.5px solid ${curr ? C.red : past ? `${C.red}55` : C.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? `0 0 0 2.5px white` : 'none' }} />
            <div style={{ fontSize: 7, color: curr ? C.red : C.muted, fontWeight: curr ? 700 : 400, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {DL_STAGE_SHORT[s] || s}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Right profile panel ───────────────────────────────────────────────────────
const REC_COLORS = {
  'strongly-advance': { bg: '#D86350', text: '#FFFFFF', border: '#D86350' },
  'advance':          { bg: 'rgba(5,150,105,0.07)', text: '#065F46', border: 'rgba(5,150,105,0.25)' },
  'reservations':     { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'not-moving':       { bg: '#FFF5F2', text: '#D86350', border: '#FDDDD7' },
}

function DebriefProfilePanel({ item, isPending, onFill, onEdit, onClose, T }) {
  const recColors = item.recommendation ? (REC_COLORS[item.recommendation] || REC_COLORS['advance']) : null
  // Pending items are in Interviews stage; completed might be at Decision
  const panelStage = isPending ? 'Interviews' : (item.recommendation === 'strongly-advance' || item.recommendation === 'advance') ? 'Decision' : 'Interviews'
  return (
    <aside style={{ width: 300, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${C.border}`, background: `${C.red}08`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
          <Av id={item.id} ini={item.ini} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{item.role}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{item.pos}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}>×</button>
        </div>
        <MiniPipeline stage={panelStage} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          {isPending ? 'Debrief pending' : 'Debrief completed'}
        </div>

        {isPending ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted }}>
            <div style={{ fontSize: 22, marginBottom: 7 }}>📋</div>
            <div style={{ fontSize: 12, color: C.muted }}>No debrief submitted yet</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
              Round {item.round} · {item.interviewType}
            </div>
            {item.daysAgo > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: item.daysAgo > 7 ? C.red : '#D97706' }}>
                {item.daysAgo}d since interview
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Round & type */}
            <div style={{ background: isDark ? 'rgba(255,255,255,0.09)' : C.gray, borderRadius: 8, padding: '9px 11px', border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.red}` }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Round {item.round} · {item.interviewType}</div>
              <div style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{item.completedDate}</div>
            </div>
            {/* Recommendation */}
            {item.recommendation && recColors && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', background: recColors.bg, border: `1px solid ${recColors.border}`, borderRadius: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: recColors.text }}>{T.recLabels[item.recommendation]}</span>
              </div>
            )}
            {/* Submitted by */}
            {item.submittedBy && (
              <div style={{ fontSize: 11, color: C.muted }}>
                by <span style={{ color: C.text, fontWeight: 500 }}>{item.submittedBy}</span> · {item.submitterRole}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => isPending ? onFill(item) : onEdit(item)}
          style={{ padding: '10px', borderRadius: 9, background: `${C.red}0D`, color: C.red, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.background = `${C.red}1A`}
          onMouseLeave={e => e.currentTarget.style.background = `${C.red}0D`}
        >
          {isPending ? T.fillDebrief : `✏ ${T.editBtn}`}
        </button>
      </div>
    </aside>
  )
}

// ── Pending row ───────────────────────────────────────────────────────────────
function PendingRow({ item, onFill, onSelect, isSelected, T }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: isSelected ? C.redBg : hov ? C.surfaceHov : C.white, borderBottom: `1px solid ${C.border}`, borderLeft: isSelected ? `3px solid ${C.red}` : '3px solid transparent', transition: 'background 0.1s' }}
    >
      <button onClick={() => onSelect?.(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, flexShrink: 0 }}>
        <Av id={item.id} ini={item.ini} size={38} />
      </button>

      <div style={{ flex: 1 }}>
        <button onClick={() => onSelect?.(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, fontWeight: 500, color: C.text, fontFamily: 'inherit', textAlign: 'left' }}>{item.name}</button>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.role} · {item.pos}</div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 70 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: item.daysAgo > 7 ? C.red : C.muted }}>{item.daysAgo}d ago</div>
      </div>

      <button
        onClick={() => onFill(item)}
        style={{ padding: '8px 16px', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
      >
        {T.fillDebrief}
      </button>
    </div>
  )
}

// ── Completed row ─────────────────────────────────────────────────────────────
function CompletedRow({ item, onEdit, onSelect, isSelected, T }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: isSelected ? C.redBg : hov ? C.surfaceHov : C.white, borderBottom: `1px solid ${C.border}`, borderLeft: isSelected ? `3px solid ${C.red}` : '3px solid transparent', transition: 'background 0.1s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px' }}>
        <button onClick={() => onSelect?.(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, flexShrink: 0 }}>
          <Av id={item.id} ini={item.ini} size={38} />
        </button>

        <div style={{ flex: 1 }}>
          <button onClick={() => onSelect?.(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13, fontWeight: 500, color: C.text, fontFamily: 'inherit', textAlign: 'left' }}>{item.name}</button>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {item.role} · {item.pos} · {item.interviewType} · Round {item.round}
          </div>
        </div>

        {/* Submitted by */}
        <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
          <div style={{ fontSize: 10, color: C.muted }}>{T.submittedBy}</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{item.submittedBy}</div>
          <div style={{ fontSize: 9, color: C.muted }}>{item.submitterRole} · {item.completedDate}</div>
        </div>

        <button
          onClick={() => onEdit(item)}
          style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.text, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
        >
          {T.editBtn}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function DebriefList({ theme, lang = 'en', onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [pendingOpen,   setPendingOpen]   = useState(true)
  const [completedOpen, setCompletedOpen] = useState(false)
  const [selectedItem,  setSelectedItem]  = useState(null)  // { item, isPending }

  const handleSelect = (item, isPending) => {
    const key = `${item.id}-${item.round}`
    const curKey = selectedItem ? `${selectedItem.item.id}-${selectedItem.item.round}` : null
    if (curKey === key && selectedItem?.isPending === isPending) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ item, isPending })
    }
  }

  const handleFill = (item) => {
    const candidate = { id: item.id, name: item.name, ini: item.ini, role: item.role, pos: item.pos }
    onNavigate?.('questionnaire', { candidate })
  }

  const handleEdit = (item) => {
    const candidate = { id: item.id, name: item.name, ini: item.ini, role: item.role, pos: item.pos }
    onNavigate?.('questionnaire', { candidate })
  }

  const isRowSelected = (item, isPending) =>
    selectedItem?.isPending === isPending &&
    selectedItem?.item.id === item.id &&
    selectedItem?.item.round === item.round

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: isDark ? C.gray : 'transparent' }}>
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 36px 48px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          {T.back}
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{T.badge}</p>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 6px' }}>
              {T.title}
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>
              {T.subtitle}
            </p>
          </div>

          {/* Count chips */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 24 }}>
            <div style={{ background: 'rgba(254,154,12,0.08)', borderRadius: 11, padding: '12px 18px', textAlign: 'center', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#B45309', fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{PENDING.length}</div>
              <div style={{ fontSize: 9, color: '#B45309', fontWeight: 600, marginTop: 3 }}>{T.pendingLabel}</div>
            </div>
            <div style={{ background: C.redBg, borderRadius: 11, padding: '12px 18px', textAlign: 'center', border: `1px solid ${C.redL}` }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{COMPLETED.length}</div>
              <div style={{ fontSize: 9, color: C.red, fontWeight: 600, marginTop: 3 }}>{T.completedLabel}</div>
            </div>
          </div>
        </div>

        {/* ── Pending section ── */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setPendingOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: pendingOpen ? 12 : 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontSize: 11, color: '#B45309', transition: 'transform 0.2s', display: 'inline-block', transform: pendingOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D97706', boxShadow: '0 0 6px rgba(254,154,12,0.45)', flexShrink: 0, display: 'inline-block' }} />
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{T.pendingTitle}</h2>
            <span style={{ background: 'rgba(254,154,12,0.08)', color: '#B45309', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{PENDING.length}</span>
          </button>

          {pendingOpen && (
            PENDING.length > 0 ? (
              <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px', padding: '9px 20px 9px 72px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
                  {[T.colCandidate, T.colDaysAgo, T.colAction].map(h => (
                    <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                  ))}
                </div>
                {PENDING.map(item => <PendingRow key={`${item.id}-${item.round}`} item={item} onFill={handleFill} onSelect={(i) => handleSelect(i, true)} isSelected={isRowSelected(item, true)} T={T} />)}
              </div>
            ) : (
              <div style={{ padding: '32px 0', textAlign: 'center', color: C.muted, fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
                {T.allUpToDate}
              </div>
            )
          )}
        </div>

        {/* ── Completed section ── */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => setCompletedOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: completedOpen ? 12 : 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0', width: '100%', textAlign: 'left' }}
          >
            <span style={{ fontSize: 11, color: C.muted, transition: 'transform 0.2s', display: 'inline-block', transform: completedOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.muted, margin: 0 }}>{T.completedTitle}</h2>
            <span style={{ background: C.redBg, color: C.red, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{COMPLETED.length}</span>
          </button>

          {completedOpen && (
            COMPLETED.length > 0 ? (
              <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 80px', padding: '9px 20px 9px 72px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
                  {[T.colCandidate, T.colSubmittedBy, T.colActions].map(h => (
                    <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                  ))}
                </div>
                {COMPLETED.map((item, i) => <CompletedRow key={`${item.id}-${item.round}-${i}`} item={item} onEdit={handleEdit} onSelect={(it) => handleSelect(it, false)} isSelected={isRowSelected(item, false)} T={T} />)}
              </div>
            ) : (
              <div style={{ padding: '32px 0', textAlign: 'center', color: C.muted, fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
                {T.noCompleted}
              </div>
            )
          )}
        </div>

        {/* Tip */}
        <div style={{ marginTop: 8, padding: '13px 16px', background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: C.text }}>{T.tip}</strong> {T.tipText}
          </p>
        </div>

      </div>
    </div>

    {/* Right profile panel — inside the flex row so it appears to the right */}
    {selectedItem && (
      <DebriefProfilePanel
        item={selectedItem.item}
        isPending={selectedItem.isPending}
        onFill={handleFill}
        onEdit={handleEdit}
        onClose={() => setSelectedItem(null)}
        T={T}
      />
    )}
    </div>
    </div>
  )
}
