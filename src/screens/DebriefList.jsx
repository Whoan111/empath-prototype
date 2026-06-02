// ─────────────────────────────────────────────────────────────────────────────
// DebriefList.jsx
// Place in: src/screens/DebriefList.jsx
//
// Hub for post-interview debriefs — hiring manager's view.
// Shows two sections:
//   ⏳ Pending   — interviews done, questionnaire not yet submitted
//   ✓  Completed — questionnaire submitted, recommendation recorded
//
// From here the hiring manager can:
//   • Fill a pending debrief → goes to PostInterviewQuestionnaire with candidate
//   • View a completed one  → goes to HiringManagerSummary for that candidate
//
// Props:
//   onBack()     — navigate back
//   onNavigate() — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const SCREEN_T = {
  en: {
    back:             '← Back to dashboard',
    badge:            'Hiring Manager',
    title:            'Interview Summaries',
    subtitle:         "Fill a summary right after each interview while the conversation is fresh. Completed summaries feed into the decision summary and the candidate update.",
    pendingLabel:     'PENDING',
    completedLabel:   'COMPLETED',
    filterAll:        'All',
    filterPending:    '⏳ Pending',
    filterCompleted:  '✓ Completed',
    pendingTitle:     'Pending summaries',
    completedTitle:   'Completed summaries',
    colCandidate:     'Candidate',
    colInterview:     'Interview',
    colRound:         'Round',
    colStatus:        'Status',
    colAction:        'Action',
    colSubmittedBy:   'Submitted by',
    colFit:           'Candidate fit',
    colRecommend:     'Recommendation',
    colActions:       'Actions',
    pendingPill:      '⏳ Pending',
    fillDebrief:      'Fill summary →',
    hide:             'Hide',
    preview:          'Preview',
    fullBrief:        'Full summary →',
    allUpToDate:      'All summaries are up to date — nothing pending.',
    noCompleted:      'No completed summaries yet.',
    submittedBy:      'Submitted by',
    tip:              'Best practice:',
    tipText:          "fill the summary within a few hours of the interview — observations are sharpest right after the conversation. Completed summaries appear in the consolidated decision summary for all interviewers.",
    roundLabel:       (n) => `Round ${n} summary`,
    submittedOn:      'Submitted',
    recommendation:   'Fit:',
    roundOf:          (n) => `Round ${n}`,
    recLabels: {
      'strongly-advance': 'Strong advance',
      'advance': 'Average fit',
      'reservations': 'Fit with reservations',
      'not-moving': 'Not advancing',
    },
  },
  it: {
    back:             '← Torna alla bacheca',
    badge:            'Responsabile Assunzioni',
    title:            'Sommari Colloqui',
    subtitle:         "Compila il sommario subito dopo ogni colloquio, mentre la conversazione è fresca. I sommari completati confluiscono nel sommario decisionale.",
    pendingLabel:     'IN ATTESA',
    completedLabel:   'COMPLETATI',
    filterAll:        'Tutti',
    filterPending:    '⏳ In attesa',
    filterCompleted:  '✓ Completati',
    pendingTitle:     'Sommari in attesa',
    completedTitle:   'Sommari completati',
    colCandidate:     'Candidato',
    colInterview:     'Intervista',
    colRound:         'Round',
    colStatus:        'Stato',
    colAction:        'Azione',
    colSubmittedBy:   'Inviato da',
    colFit:           'Idoneità candidato',
    colRecommend:     'Raccomandazione',
    colActions:       'Azioni',
    pendingPill:      '⏳ In attesa',
    fillDebrief:      'Compila sommario →',
    hide:             'Nascondi',
    preview:          'Anteprima',
    fullBrief:        'Sommario completo →',
    allUpToDate:      'Tutti i sommari sono aggiornati — nessuno in attesa.',
    noCompleted:      'Nessun sommario completato ancora.',
    submittedBy:      'Inviato da',
    tip:              'Best practice:',
    tipText:          "compila il sommario entro poche ore dal colloquio — le osservazioni sono più nitide subito dopo. I sommari completati appaiono nel sommario decisionale consolidato.",
    roundLabel:       (n) => `Sommario round ${n}`,
    submittedOn:      'Inviato il',
    recommendation:   'Idoneità:',
    roundOf:          (n) => `Round ${n}`,
    recLabels: {
      'strongly-advance': 'Forte avanzamento',
      'advance': 'Idoneità media',
      'reservations': 'Idoneo con riserve',
      'not-moving': 'Non avanza',
    },
  },
}

const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// Pending — interview took place, no debrief submitted yet
const PENDING = [
  {
    id: 4,  name: 'Luca Ferrari',    ini: 'LF',
    role: 'Mid UX Designer',  pos: 'UX Designer',
    interviewDate: '18 May 2026', interviewType: 'Technical Deep-Dive', round: 2,
  },
  {
    id: 11, name: 'Sofia Esposito',  ini: 'SE',
    role: 'Senior PM',         pos: 'Product Manager',
    interviewDate: '22 May 2026', interviewType: 'Getting to know you', round: 1,
  },
]

// Completed — debrief questionnaire submitted
const COMPLETED = [
  {
    id: 1,  name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',     pos: 'UX Designer',
    completedDate: '14 May 2026', round: 1, interviewType: 'Portfolio Review',
    submittedBy: 'Marco T.', submitterRole: 'Hiring Manager',
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
    submittedBy: 'Marco T.', submitterRole: 'Hiring Manager',
    recommendation: 'strongly-advance',
  },
  {
    id: 7,  name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',       pos: 'UX Designer',
    completedDate: '6 May 2026',  round: 1, interviewType: 'Research Deep-Dive',
    submittedBy: 'Marco T.', submitterRole: 'Hiring Manager',
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
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
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

function RecBadge({ rec, T }) {
  const emojis = { 'strongly-advance': '⭐', 'advance': '✓', 'reservations': '△', 'not-moving': '✕' }
  const colors = {
    'strongly-advance': { color: C.sucT, bg: C.sucBg },
    'advance':          { color: C.sucT, bg: '#F0FDF4' },
    'reservations':     { color: C.warT, bg: C.warBg },
    'not-moving':       { color: C.red,  bg: '#FEF2F2' },
  }
  const label = T.recLabels[rec] || rec
  const { color, bg } = colors[rec] || colors['advance']
  const r = { emoji: emojis[rec] || '✓', label, color, bg }
  return (
    <span style={{ background: r.bg, color: r.color, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
      {r.emoji} {r.label}
    </span>
  )
}

// ── Pending row ───────────────────────────────────────────────────────────────
function PendingRow({ item, onFill, T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: C.white, borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}>
      <Av id={item.id} ini={item.ini} size={38} />

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.name}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{item.role} · {item.pos}</div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{item.interviewType}</div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{T.roundOf(item.round)} · {item.interviewDate}</div>
      </div>

      <span style={{ background: C.warBg, color: C.warT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>
        {T.pendingPill}
      </span>

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
function CompletedRow({ item, onView, T }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px' }}>
        <Av id={item.id} ini={item.ini} size={38} />

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{item.name}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {item.role} · {item.pos} · {item.interviewType} · Round {item.round}
          </div>
        </div>

        {/* Submitted by */}
        <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 6 }}>
          <div style={{ fontSize: 10, color: C.muted }}>{T.submittedBy}</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{item.submittedBy}</div>
          <div style={{ fontSize: 9, color: C.muted }}>{item.submitterRole} · {item.completedDate}</div>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.white, color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {expanded ? T.hide : T.preview}
          </button>
          <button
            onClick={() => onView(item)}
            style={{ padding: '7px 12px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {T.fullBrief}
          </button>
        </div>
      </div>

      {/* Expandable preview */}
      {expanded && (
        <div style={{ padding: '12px 20px 14px 72px', background: C.gray, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.text }}>{T.roundLabel(item.round)}</strong> · {T.submittedOn} {item.completedDate} · {item.submittedBy} ({item.submitterRole})
            <br />
            {T.recommendation} <strong style={{ color: C.text }}>{T.recLabels[item.recommendation] || item.recommendation}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function DebriefList({ lang = 'en', onBack, onNavigate }) {
  const T = SCREEN_T[lang] || SCREEN_T.en
  const [filter,        setFilter]        = useState('all') // 'all' | 'pending' | 'completed'
  const [completedOpen, setCompletedOpen] = useState(false)

  const showPending   = filter !== 'completed'
  const showCompleted = filter !== 'pending'

  const handleFill = (item) => {
    // Pass the candidate object so questionnaire pre-fills it
    const candidate = { id: item.id, name: item.name, ini: item.ini, role: item.role, pos: item.pos }
    onNavigate?.('questionnaire', { candidate })
  }

  const handleView = (item) => {
    const candidate = { id: item.id, name: item.name, ini: item.ini, role: item.role, pos: item.pos }
    onNavigate?.('hiring-summary', { candidate })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
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

          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 24 }}>
            <div style={{ background: C.warBg, borderRadius: 11, padding: '12px 18px', textAlign: 'center', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.war, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{PENDING.length}</div>
              <div style={{ fontSize: 9, color: C.warT, fontWeight: 600, marginTop: 3 }}>{T.pendingLabel}</div>
            </div>
            <div style={{ background: C.sucBg, borderRadius: 11, padding: '12px 18px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{COMPLETED.length}</div>
              <div style={{ fontSize: 9, color: C.sucT, fontWeight: 600, marginTop: 3 }}>{T.completedLabel}</div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 2, background: C.white, borderRadius: 9, padding: 3, border: `1px solid ${C.border}`, marginBottom: 20, width: 'fit-content' }}>
          {[['all', T.filterAll], ['pending', T.filterPending], ['completed', T.filterCompleted]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{ padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', background: filter === val ? C.red : 'transparent', color: filter === val ? 'white' : C.muted, fontWeight: filter === val ? 600 : 400, transition: 'all 0.13s' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Pending section ── */}
        {showPending && PENDING.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, boxShadow: '0 0 6px rgba(201,57,74,0.45)', flexShrink: 0 }} />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{T.pendingTitle}</h2>
              <span style={{ background: C.warBg, color: C.warT, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{PENDING.length}</span>
            </div>
            <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 130px 130px', padding: '9px 20px', background: C.warBg, borderBottom: `1px solid #FDE68A` }}>
                {[T.colCandidate, T.colInterview, T.colRound, T.colStatus, T.colAction].map(h => (
                  <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.warT, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>
              {PENDING.map(item => <PendingRow key={`${item.id}-${item.round}`} item={item} onFill={handleFill} T={T} />)}
            </div>
          </div>
        )}

        {showPending && PENDING.length === 0 && filter === 'pending' && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: C.muted, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
            {T.allUpToDate}
          </div>
        )}

        {/* ── Completed section ── */}
        {showCompleted && COMPLETED.length > 0 && (
          <div>
            {/* Collapsible header */}
            <button
              onClick={() => setCompletedOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: completedOpen ? 12 : 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0', width: '100%', textAlign: 'left' }}
            >
              <span style={{ fontSize: 12, color: C.muted, transition: 'transform 0.2s', display: 'inline-block', transform: completedOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: C.muted, margin: 0 }}>{T.completedTitle}</h2>
              <span style={{ background: C.sucBg, color: C.sucT, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{COMPLETED.length}</span>
            </button>

            {completedOpen && (
              <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 160px', padding: '9px 20px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
                  {[T.colCandidate, T.colSubmittedBy, T.colActions].map(h => (
                    <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                  ))}
                </div>
                {COMPLETED.map((item, i) => <CompletedRow key={`${item.id}-${item.round}-${i}`} item={item} onView={handleView} T={T} />)}
              </div>
            )}
          </div>
        )}

        {/* Empty completed */}
        {showCompleted && COMPLETED.length === 0 && filter === 'completed' && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: C.muted, fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
            {T.noCompleted}
          </div>
        )}

        {/* Tip */}
        {filter === 'all' && (
          <div style={{ marginTop: 24, padding: '13px 16px', background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: C.text }}>{T.tip}</strong> {T.tipText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
