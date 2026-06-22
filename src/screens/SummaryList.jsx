// ─────────────────────────────────────────────────────────────────────────────
// SummaryList.jsx
//
// Unified list screen:
//   mode="pre-call"  → Recruiter: candidates who completed ALL interviews,
//                      ready for a decision. Decision/Offer stage only.
//   mode="decision"  → Hiring Manager: pre-selected candidates needing a decision
//
// Props:
//   mode         — 'pre-call' | 'decision'
//   lang         — 'en' | 'it'
//   onBack()     — navigate back
//   onNavigate() — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false


// ── Translations ──────────────────────────────────────────────────────────────
const TEXT = {
  en: {
    back:             '← Back',
    recruiterBadge:   'Recruiter',
    hmBadge:          'Hiring Manager',
    preCallTitle:     'Interview Debriefs',
    decisionTitle:    'Decision Report',
    preCallDesc:      'Candidates who have completed all interviews and are ready for a decision. Use these debriefs to get up to speed before making the final call.',
    decisionDesc:     'Your pre-selected candidates across all positions. Review consolidated feedback and make your decisions here or inside each debrief.',
    overdue:          'OVERDUE',
    total:            'TOTAL',
    decided:          'DECIDED',
    summaryPending:   'DEBRIEF PENDING',
    noMatch:          'No candidates match this filter',
    openSummary:      'Open debrief →',
    openReport:       'Open report →',
    today:            'Today',
    daysAgo:          d => `${d}d ago`,
    all:              'All',
    colCandidate:     'Candidate',
    colPosition:      'Position',
    colLastContact:   'Last contact',
    colInterviews:    'Interviews performed',
    colFit:           'Candidate fit',
    colAction:        'Action',
    colInterviewReport: 'Interview report',
    colStage:         'Stage',
    colSummary:       'Debrief',
    colDecision:      'Decision',
    advancing:        '✓ Advancing',
    notMoving:        '✕ Not moving fwd',
    undo:             'undo',
    fillSummary:      'Fill debrief →',
    summaryPendingMsg: n => `⏳ ${n} interview debrief${n !== 1 ? 's' : ''} pending`,
    summaryUnlock:    'Complete the interview debrief to unlock the full decision debrief for these candidates.',
    strongAdvance:    'Strong advance',
    averageFit:       'Average fit',
    notAdvancing:     'Not advancing',
  },
  it: {
    back:             '← Indietro',
    recruiterBadge:   'Reclutatore',
    hmBadge:          'Responsabile Assunzioni',
    preCallTitle:     'Debrief Colloqui',
    decisionTitle:    'Report Decisionale',
    preCallDesc:      'Candidati che hanno completato tutti i colloqui e sono pronti per una decisione. Usa questi debrief per informarti prima di prendere la decisione finale.',
    decisionDesc:     'I tuoi candidati pre-selezionati per tutte le posizioni. Leggi il feedback consolidato e prendi le tue decisioni qui o all\'interno di ogni debrief.',
    overdue:          'IN RITARDO',
    total:            'TOTALE',
    decided:          'DECISI',
    summaryPending:   'DEBRIEF PENDENTE',
    noMatch:          'Nessun candidato corrisponde al filtro',
    openSummary:      'Apri debrief →',
    openReport:       'Apri report →',
    today:            'Oggi',
    daysAgo:          d => `${d}g fa`,
    all:              'Tutti',
    colCandidate:     'Candidato',
    colPosition:      'Posizione',
    colLastContact:   'Ultimo contatto',
    colInterviews:    'Colloqui effettuati',
    colFit:           'Idoneità candidato',
    colAction:        'Azione',
    colInterviewReport: 'Report colloquio',
    colStage:         'Fase',
    colSummary:       'Debrief',
    colDecision:      'Decisione',
    advancing:        '✓ Avanza',
    notMoving:        '✕ Non prosegue',
    undo:             'annulla',
    fillSummary:      'Compila debrief →',
    summaryPendingMsg: n => `⏳ ${n} debrief colloquio in attesa`,
    summaryUnlock:    'Completa il debrief del colloquio per sbloccare il debrief completo per questi candidati.',
    strongAdvance:    'Forte avanzamento',
    averageFit:       'Idoneità media',
    notAdvancing:     'Non avanza',
  },
}

// ── Interview Summaries data (recruiter)
// Only candidates with ALL interviews complete — Decision or Offer stage
const PRE_CALL_CANDIDATES = [
  {
    id: 7,   name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',          pos: 'UX Designer',      stage: 'Decision', lastContact: 14, interviewsDone: 2,
    note: 'All interviews complete — strong consensus from all interviewers.',
    rec: 'strongly-advance',
  },
  {
    id: 110, name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',         pos: 'UX Designer',      stage: 'Decision', lastContact: 3,  interviewsDone: 3,
    note: 'All rounds complete. Design systems gap noted but overall strong.',
    rec: 'advance',
  },
  {
    id: 20,  name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',               pos: 'Product Manager',  stage: 'Decision', lastContact: 5,  interviewsDone: 2,
    note: 'All interviews complete. Team consensus was very positive.',
    rec: 'advance',
  },
  {
    id: 13,  name: 'Valentina Greco', ini: 'VG', role: 'Senior Brand Strategist', pos: 'Brand Strategist', stage: 'Offer',    lastContact: 1,  interviewsDone: 3,
    note: 'All done — offer extended. Decision expected this week.',
    rec: 'strongly-advance',
  },
]

// ── Decision summaries data (hiring manager) ─────────────────────────────────
const DECISION_CANDIDATES = [
  {
    id: 7,  name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',      pos: 'UX Designer',    stage: 'Interviews',       interviewsDone: 2, summaryStatus: 'complete', decision: null,
    rec: 'strongly-advance',
  },
  {
    id: 2,  name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer', pos: 'UX Designer',    stage: 'Preliminary Call', interviewsDone: 1, summaryStatus: 'complete', decision: null,
    rec: 'advance',
  },
  {
    id: 1,  name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',    pos: 'UX Designer',    stage: 'Interviews',       interviewsDone: 2, summaryStatus: 'complete', decision: null,
    rec: 'advance',
  },
  {
    id: 4,  name: 'Luca Ferrari',    ini: 'LF', role: 'Mid UX Designer',    pos: 'UX Designer',    stage: 'Interviews',       interviewsDone: 1, summaryStatus: 'pending',  decision: null,
    rec: null,
  },
  {
    id: 11, name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',          pos: 'Product Manager',stage: 'Preliminary Call', interviewsDone: 0, summaryStatus: 'not-started', decision: null,
    rec: null,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 40 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

// ── Mini pipeline ─────────────────────────────────────────────────────────────
const SL_PIPELINE = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']
const SL_SHORT    = { Screening: 'Screen', 'Pre-Call': 'Pre-Call', 'Preliminary Call': 'Pre-Call', Interviews: 'Interview', Decision: 'Decision', Offer: 'Offer' }

function MiniPipeline({ stage }) {
  // normalise stage name
  const normStage = stage === 'Preliminary Call' ? 'Pre-Call' : stage
  const idx = SL_PIPELINE.indexOf(normStage)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {SL_PIPELINE.map((s, i) => {
        const past = i <= idx
        const curr = i === idx
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < SL_PIPELINE.length - 1 && (
              <div style={{ position: 'absolute', top: 6, left: '50%', width: '100%', height: 2, background: i < idx ? C.red : C.border, zIndex: 0 }} />
            )}
            <div style={{ width: 12, height: 12, borderRadius: 2, transform: 'rotate(45deg)', background: curr ? C.red : past ? `${C.red}55` : C.gray, border: `1.5px solid ${curr ? C.red : past ? `${C.red}55` : C.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? '0 0 0 2.5px white' : 'none' }} />
            <div style={{ fontSize: 7, color: curr ? C.red : C.muted, fontWeight: curr ? 700 : 400, textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              {SL_SHORT[s] || s}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Right profile panel ───────────────────────────────────────────────────────
function SummaryProfilePanel({ candidate, onOpen, onClose, T }) {
  return (
    <aside style={{ width: 300, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${C.border}`, background: `${C.red}08`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
          <Av id={candidate.id} ini={candidate.ini} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
            {candidate.pos && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{candidate.pos}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0 }}>×</button>
        </div>
        <MiniPipeline stage={candidate.stage} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Interview feedback</div>
        {candidate.note ? (
          <div style={{ background: isDark ? 'rgba(255,255,255,0.09)' : C.gray, borderRadius: 9, padding: '10px 12px', borderLeft: `3px solid ${C.red}`, marginBottom: 10 }}>
            <p style={{ fontSize: 11, color: C.text, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>"{candidate.note}"</p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted }}>
            <div style={{ fontSize: 22, marginBottom: 7 }}>📋</div>
            <div style={{ fontSize: 12, color: C.muted }}>No debriefs submitted yet</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Feedback appears here after interviews</div>
          </div>
        )}
        {candidate.interviewsDone > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: isDark ? 'rgba(255,255,255,0.09)' : C.gray, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: 'quincy-cf, serif', lineHeight: 1 }}>{candidate.interviewsDone}</span>
            <span style={{ fontSize: 10, color: C.muted }}>interview{candidate.interviewsDone !== 1 ? 's' : ''} completed</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => onOpen(candidate)}
          style={{ padding: '10px', borderRadius: 9, background: `${C.red}0D`, color: C.red, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
          onMouseEnter={e => e.currentTarget.style.background = `${C.red}1A`}
          onMouseLeave={e => e.currentTarget.style.background = `${C.red}0D`}
        >
          {T.openReport}
        </button>
      </div>
    </aside>
  )
}

function UrgencyPill({ days, T }) {
  const bg    = days >= 7 ? '#FFF5F2' : days >= 3 ? C.warBg : C.sucBg
  const color = days >= 7 ? C.red     : days >= 3 ? C.war   : C.suc
  const label = days === 0 ? T.today : T.daysAgo(days)
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '3px 9px 3px 7px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {days >= 7 && <span style={{ fontSize: 10, lineHeight: 1 }}>⚠</span>}
      {label}
    </span>
  )
}

function SummaryStatusPill({ status }) {
  if (status === 'complete')    return <span style={{ background: C.sucBg,  color: C.sucT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✓ Debrief done</span>
  if (status === 'pending')     return <span style={{ background: C.warBg,  color: C.warT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>⏳ Debrief pending</span>
  return                               <span style={{ background: C.gray,   color: C.muted,fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>— No interviews yet</span>
}

// Candidate fit pill derived from rec field
function FitPill({ rec, T }) {
  if (!rec) return <span style={{ fontSize: 11, color: C.muted }}>—</span>
  if (rec === 'strongly-advance') return (
    <span style={{ background: 'rgba(27,36,97,0.09)', color: '#1B2461', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
      ★ {T.strongAdvance}
    </span>
  )
  if (rec === 'advance') return (
    <span style={{ background: 'rgba(254,154,12,0.10)', color: '#B45309', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
      ◎ {T.averageFit}
    </span>
  )
  return (
    <span style={{ background: '#FFF5F2', color: C.red, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
      ✕ {T.notAdvancing}
    </span>
  )
}

function StagePill({ stage }) {
  const map = {
    'Preliminary Call': { bg: C.infBg,   color: C.infT },
    'Interviews':       { bg: C.warBg,   color: C.warT },
    'Decision':         { bg: '#EDE9FE', color: '#6D28D9' },
    'Offer':            { bg: C.sucBg,   color: C.sucT },
  }
  const s = map[stage] || { bg: '#F3F4F6', color: '#374151' }
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>{stage === 'Preliminary Call' ? 'Pre-Call' : stage}</span>
}

// ── Pre-call row (Interview Summaries — post-interview only) ──────────────────
function PreCallRow({ c, onOpen, onSelect, isSelected, T }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 1.2fr 130px',
      alignItems: 'center', padding: '14px 22px',
      background: isSelected ? C.redBg : C.white,
      borderBottom: `1px solid ${C.border}`,
      borderLeft: `3px solid ${isSelected ? C.red : 'transparent'}`,
      transition: 'background 0.15s, border-left-color 0.15s',
    }}>
      {/* Candidate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <button onClick={() => onSelect?.(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
          <Av id={c.id} ini={c.ini} size={38} />
        </button>
        <div>
          <button onClick={() => onSelect?.(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: C.text, display: 'block' }}>{c.name}</button>
          <div style={{ fontSize: 10, color: C.muted }}>{c.role}</div>
        </div>
      </div>
      {/* Position */}
      <span style={{ fontSize: 11, color: C.muted }}>{c.pos}</span>
      {/* Interviews count */}
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'block', textAlign: 'center' }}>{c.interviewsDone}</span>
      {/* Candidate fit */}
      <FitPill rec={c.rec} T={T} />
      {/* Action */}
      <button
        onClick={() => onOpen(c)}
        style={{ padding: '7px 14px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
      >
        {T.openReport}
      </button>
    </div>
  )
}

// ── Decision card ─────────────────────────────────────────────────────────────
function DecisionCard({ c, onOpen, onSelect, isSelected, T }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected ? C.redBg : C.white,
        border: `1.5px solid ${isSelected ? C.red : hovered ? C.red : C.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected ? `0 6px 24px rgba(216,99,80,0.14)` : hovered ? '0 6px 24px rgba(216,99,80,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.18s',
        cursor: 'default',
      }}
    >
      {/* Card header stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${C.red}, #F87171)` }} />

      {/* Body */}
      <div style={{ padding: '18px 20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Candidate identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => onSelect?.(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            <Av id={c.id} ini={c.ini} size={42} />
          </button>
          <div>
            <button onClick={() => onSelect?.(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.3, display: 'block' }}>{c.name}</button>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{c.role}</div>
          </div>
        </div>

        {/* Position tag + action on same row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ background: C.redBg, color: C.red, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` }}>
            {c.pos}
          </span>
          <button
            onClick={() => onOpen(c)}
            style={{ padding: '5px 14px', borderRadius: 20, background: hovered ? C.red : C.redBg, color: hovered ? 'white' : C.red, border: `1.5px solid ${hovered ? C.red : C.redL}`, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
          >
            {T.openReport}
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.border }} />

        {/* Stat row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.redBg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.red, flexShrink: 0 }}>
            {c.interviewsDone}
          </div>
          <span style={{ fontSize: 11, color: C.muted }}>{T.colInterviews}</span>
        </div>
      </div>

    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function SummaryList({ theme, mode = 'pre-call', lang = 'en', onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme?.text?.startsWith('rgba(255')

  const T         = TEXT[lang] || TEXT.en
  const isPreCall = mode === 'pre-call'
  // Decision mode: only show candidates with a completed summary
  const candidates = isPreCall
    ? PRE_CALL_CANDIDATES
    : DECISION_CANDIDATES.filter(c => c.summaryStatus === 'complete')

  const [posFilter, setPosFilter] = useState(T.all)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const handleSelect = (c) => {
    setSelectedCandidate(prev => prev?.id === c.id ? null : c)
  }

  const allPosLabel  = T.all
  // Always include every position that exists in the full dataset, even if 0 pass the filter
  const allPosSource = isPreCall ? PRE_CALL_CANDIDATES : DECISION_CANDIDATES
  const positions    = [allPosLabel, ...new Set(allPosSource.map(c => c.pos))]

  // Sync the "All" filter pill label with lang changes
  const effectiveFilter = positions.includes(posFilter) ? posFilter : allPosLabel

  // filtered display list (decision mode only shows complete summaries)
  const filtered = effectiveFilter === allPosLabel
    ? candidates
    : candidates.filter(c => c.pos === effectiveFilter)

  const handleOpen = (c) => {
    const dest = isPreCall ? 'recruiter-summary' : 'hiring-summary'
    onNavigate?.(dest, { candidate: c })
  }

  const headers = [T.colCandidate, T.colPosition, T.colInterviews, T.colFit, T.colInterviewReport]
  const cols    = '2fr 1.2fr 0.8fr 1.2fr 130px'

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', background: C.redBg }}>
      {/* Scrollable left content */}
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 36px 48px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          {T.back}
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
              {isPreCall ? T.recruiterBadge : T.hmBadge}
            </p>
            <h1 style={{ fontFamily: 'quincy-cf, serif', fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
              {isPreCall ? T.preCallTitle : T.decisionTitle}
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, maxWidth: 540, lineHeight: 1.6 }}>
              {isPreCall ? T.preCallDesc : T.decisionDesc}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 24 }}>
            <div style={{ background: C.white, borderRadius: 11, padding: '12px 16px', textAlign: 'center', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: 'quincy-cf, serif' }}>{candidates.length}</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{T.total}</div>
            </div>
          </div>
        </div>

        {/* Position filter */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
          {positions.map(p => (
            <button
              key={p}
              onClick={() => setPosFilter(p)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${effectiveFilter === p ? C.red : C.border}`, background: effectiveFilter === p ? C.red : C.white, color: effectiveFilter === p ? 'white' : C.muted, fontSize: 11, fontWeight: effectiveFilter === p ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Pre-call: table layout */}
        {isPreCall && (
          <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(216,99,80,0.04)' }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '10px 22px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
              {headers.map((h, i) => (
                <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i === 2 ? 'center' : 'left' }}>{h}</span>
              ))}
            </div>
            {filtered.map(c => <PreCallRow key={c.id} c={c} onOpen={handleOpen} onSelect={handleSelect} isSelected={selectedCandidate?.id === c.id} T={T} />)}
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>{T.noMatch}</div>
            )}
          </div>
        )}

        {/* Decision: card grid layout */}
        {!isPreCall && (
          <>
            {filtered.length === 0
              ? <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>{T.noMatch}</div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                  {filtered.map(c => <DecisionCard key={c.id} c={c} onOpen={handleOpen} onSelect={handleSelect} isSelected={selectedCandidate?.id === c.id} T={T} />)}
                </div>
              )
            }
          </>
        )}

      </div>
      </div>{/* end scrollable left */}

      {selectedCandidate && (
        <SummaryProfilePanel
          candidate={selectedCandidate}
          onOpen={handleOpen}
          onClose={() => setSelectedCandidate(null)}
          T={T}
        />
      )}
    </div>
  )
}
