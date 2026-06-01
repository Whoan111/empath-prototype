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

const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
}

// ── Translations ──────────────────────────────────────────────────────────────
const TEXT = {
  en: {
    back:             '← Back',
    recruiterBadge:   'Recruiter',
    hmBadge:          'Hiring Manager',
    preCallTitle:     'Interview Briefings',
    decisionTitle:    'Decision Briefs',
    preCallDesc:      'Candidates who have completed all interviews and are ready for a decision. Use these summaries to get briefed on what happened before making the final call.',
    decisionDesc:     'Your pre-selected candidates across all positions. Review consolidated feedback and make your decisions here or inside each brief.',
    overdue:          'OVERDUE',
    total:            'TOTAL',
    decided:          'DECIDED',
    debriefPending:   'DEBRIEF PENDING',
    noMatch:          'No candidates match this filter',
    openBriefing:     'Open briefing →',
    openBrief:        'Open brief →',
    today:            'Today',
    daysAgo:          d => `${d}d ago`,
    all:              'All',
    colCandidate:     'Candidate',
    colPosition:      'Position',
    colLastContact:   'Last contact',
    colInterviews:    'Interviews',
    colScore:         'Avg score',
    colAction:        'Action',
    colStage:         'Stage',
    colDebrief:       'Debrief',
    colDecision:      'Decision',
    advancing:        '✓ Advancing',
    notMoving:        '✕ Not moving fwd',
    undo:             'undo',
    fillDebrief:      'Fill debrief →',
    debriefPendingMsg: n => `⏳ ${n} post-interview debrief${n > 1 ? 's' : ''} pending`,
    debriefUnlock:    'Complete the debrief questionnaire to unlock the full decision brief for these candidates.',
  },
  it: {
    back:             '← Indietro',
    recruiterBadge:   'Reclutatore',
    hmBadge:          'Responsabile Assunzioni',
    preCallTitle:     'Briefing Colloqui',
    decisionTitle:    'Decisioni',
    preCallDesc:      'Candidati che hanno completato tutti i colloqui e sono pronti per una decisione. Usa questi riepiloghi per informarti su quanto accaduto prima di prendere la decisione finale.',
    decisionDesc:     'I tuoi candidati pre-selezionati per tutte le posizioni. Leggi il feedback consolidato e prendi le tue decisioni qui o all\'interno di ogni brief.',
    overdue:          'IN RITARDO',
    total:            'TOTALE',
    decided:          'DECISI',
    debriefPending:   'DEBRIEF PENDENTE',
    noMatch:          'Nessun candidato corrisponde al filtro',
    openBriefing:     'Apri briefing →',
    openBrief:        'Apri brief →',
    today:            'Oggi',
    daysAgo:          d => `${d}g fa`,
    all:              'Tutti',
    colCandidate:     'Candidato',
    colPosition:      'Posizione',
    colLastContact:   'Ultimo contatto',
    colInterviews:    'Colloqui',
    colScore:         'Punteggio medio',
    colAction:        'Azione',
    colStage:         'Fase',
    colDebrief:       'Debrief',
    colDecision:      'Decisione',
    advancing:        '✓ Avanza',
    notMoving:        '✕ Non prosegue',
    undo:             'annulla',
    fillDebrief:      'Compila debrief →',
    debriefPendingMsg: n => `⏳ ${n} debrief post-colloquio${n > 1 ? ' in attesa' : ' in attesa'}`,
    debriefUnlock:    'Completa il questionario di debrief per sbloccare il brief completo per questi candidati.',
  },
}

// ── Decision Briefings data (recruiter)
// Only candidates with ALL interviews complete — Decision or Offer stage
const PRE_CALL_CANDIDATES = [
  {
    id: 7,   name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',          pos: 'UX Designer',      stage: 'Decision', lastContact: 14, interviewsDone: 2, interviewsTotal: 2, avgScore: 5.0,
    note: 'All interviews complete — strong consensus from all interviewers.',
  },
  {
    id: 110, name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',         pos: 'UX Designer',      stage: 'Decision', lastContact: 3,  interviewsDone: 3, interviewsTotal: 3, avgScore: 3.5,
    note: 'All rounds complete. Design systems gap noted but overall strong.',
  },
  {
    id: 20,  name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',               pos: 'Product Manager',  stage: 'Decision', lastContact: 5,  interviewsDone: 2, interviewsTotal: 2, avgScore: 4.0,
    note: 'All interviews complete. Team consensus was very positive.',
  },
  {
    id: 13,  name: 'Valentina Greco', ini: 'VG', role: 'Senior Brand Strategist', pos: 'Brand Strategist', stage: 'Offer',    lastContact: 1,  interviewsDone: 3, interviewsTotal: 3, avgScore: 5.0,
    note: 'All done — offer extended. Decision expected this week.',
  },
]

// ── Decision briefs data (hiring manager) ─────────────────────────────────────
const DECISION_CANDIDATES = [
  {
    id: 7,  name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',      pos: 'UX Designer',    stage: 'Interviews',       avgScore: 5.0, interviewsDone: 2, interviewsTotal: 2, debriefStatus: 'complete', decision: null,
    rec: 'strongly-advance',
  },
  {
    id: 2,  name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer', pos: 'UX Designer',    stage: 'Preliminary Call', avgScore: 5.0, interviewsDone: 1, interviewsTotal: 2, debriefStatus: 'complete', decision: null,
    rec: 'advance',
  },
  {
    id: 1,  name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',    pos: 'UX Designer',    stage: 'Interviews',       avgScore: 3.5, interviewsDone: 2, interviewsTotal: 3, debriefStatus: 'complete', decision: null,
    rec: 'advance',
  },
  {
    id: 4,  name: 'Luca Ferrari',    ini: 'LF', role: 'Mid UX Designer',    pos: 'UX Designer',    stage: 'Interviews',       avgScore: 3.0, interviewsDone: 1, interviewsTotal: 3, debriefStatus: 'pending',  decision: null,
    rec: null,
  },
  {
    id: 11, name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',          pos: 'Product Manager',stage: 'Preliminary Call', avgScore: null,interviewsDone: 0, interviewsTotal: 2, debriefStatus: 'not-started', decision: null,
    rec: null,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
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

function UrgencyPill({ days, T }) {
  const bg    = days >= 7 ? '#FEE2E2' : days >= 3 ? C.warBg : C.sucBg
  const color = days >= 7 ? C.red     : days >= 3 ? C.war   : C.suc
  const label = days === 0 ? T.today : T.daysAgo(days)
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>{label}</span>
}

function DebriefPill({ status }) {
  if (status === 'complete')    return <span style={{ background: C.sucBg,  color: C.sucT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✓ Debrief done</span>
  if (status === 'pending')     return <span style={{ background: C.warBg,  color: C.warT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>⏳ Debrief pending</span>
  return                               <span style={{ background: C.gray,   color: C.muted,fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>— No interviews yet</span>
}

function ScorePill({ score }) {
  if (score === null) return <span style={{ fontSize: 11, color: C.muted }}>—</span>
  const color = score >= 4 ? C.suc : score >= 3 ? C.war : C.red
  const bg    = score >= 4 ? C.sucBg : score >= 3 ? C.warBg : '#FEE2E2'
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>
      {'★'.repeat(Math.round(score))} {score}
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

// ── Pre-call row (Decision Briefings — post-interview only) ───────────────────
function PreCallRow({ c, onOpen, T }) {
  const isUrgent = c.lastContact >= 7
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1.2fr 1fr 1fr 130px',
      alignItems: 'center', padding: '14px 22px',
      background: isUrgent ? '#FFF8F8' : C.white,
      borderBottom: `1px solid ${C.border}`,
      transition: 'background 0.1s',
    }}>
      {/* Candidate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <Av id={c.id} ini={c.ini} size={38} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
          <div style={{ fontSize: 10, color: C.muted }}>{c.role}</div>
        </div>
      </div>
      {/* Position */}
      <span style={{ fontSize: 11, color: C.muted }}>{c.pos}</span>
      {/* Last contact */}
      <UrgencyPill days={c.lastContact} T={T} />
      {/* Interviews progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.suc }}>
          {c.interviewsDone}/{c.interviewsTotal}
        </span>
        <div style={{ height: 4, width: 36, background: C.gray, borderRadius: 2 }}>
          <div style={{ height: '100%', width: '100%', background: C.suc, borderRadius: 2 }} />
        </div>
      </div>
      {/* Avg score */}
      <ScorePill score={c.avgScore} />
      {/* Action */}
      <button
        onClick={() => onOpen(c)}
        style={{ padding: '7px 14px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
      >
        {T.openBriefing}
      </button>
    </div>
  )
}

// ── Decision row ──────────────────────────────────────────────────────────────
function DecisionRow({ c, decision, onOpen, onDecide, T }) {
  const [localDec, setLocalDec] = useState(decision)

  const handleDecide = (d) => {
    setLocalDec(d)
    onDecide?.(c.id, d)
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.1fr 1.2fr 130px',
      alignItems: 'center', padding: '14px 22px',
      background: c.debriefStatus === 'pending' ? C.warBg + '44' : C.white,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Candidate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <Av id={c.id} ini={c.ini} size={38} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
          <div style={{ fontSize: 10, color: C.muted }}>{c.role} · {c.pos}</div>
        </div>
      </div>
      {/* Stage */}
      <StagePill stage={c.stage} />
      {/* Score */}
      <ScorePill score={c.avgScore} />
      {/* Debrief status */}
      <DebriefPill status={c.debriefStatus} />
      {/* Decision */}
      {localDec ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
            background: localDec === 'advance' ? C.sucBg : '#FEE2E2',
            color: localDec === 'advance' ? C.sucT : C.red,
          }}>
            {localDec === 'advance' ? T.advancing : T.notMoving}
          </span>
          <button onClick={() => handleDecide(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: C.muted, fontFamily: 'inherit' }}>{T.undo}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={() => handleDecide('advance')}     style={{ padding: '5px 9px', borderRadius: 7, border: 'none', background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 700, cursor: 'pointer' }} title="Advance">✓</button>
          <button onClick={() => handleDecide('not-moving')}  style={{ padding: '5px 9px', borderRadius: 7, border: 'none', background: '#FEE2E2', color: C.red, fontSize: 11, fontWeight: 700, cursor: 'pointer' }} title="Not moving forward">✕</button>
        </div>
      )}
      {/* Action */}
      <button
        onClick={() => onOpen(c)}
        style={{ padding: '7px 14px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
      >
        {T.openBrief}
      </button>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function SummaryList({ mode = 'pre-call', lang = 'en', onBack, onNavigate }) {
  const T         = TEXT[lang] || TEXT.en
  const isPreCall = mode === 'pre-call'
  const candidates = isPreCall ? PRE_CALL_CANDIDATES : DECISION_CANDIDATES

  const [posFilter, setPosFilter] = useState(T.all)
  const [decisions, setDecisions] = useState({})

  const allPosLabel  = T.all
  const positions    = [allPosLabel, ...new Set(candidates.map(c => c.pos))]

  // Sync the "All" filter pill label with lang changes
  const effectiveFilter = positions.includes(posFilter) ? posFilter : allPosLabel

  const filtered = effectiveFilter === allPosLabel
    ? candidates
    : candidates.filter(c => c.pos === effectiveFilter)

  const urgentCount  = isPreCall ? candidates.filter(c => c.lastContact >= 7).length : 0
  const pendingCount = !isPreCall ? candidates.filter(c => c.debriefStatus === 'pending').length : 0
  const decidedCount = !isPreCall ? Object.keys(decisions).length : 0

  const handleOpen = (c) => {
    const dest = isPreCall ? 'recruiter-summary' : 'hiring-summary'
    onNavigate?.(dest, { candidate: c })
  }

  const handleDecide = (id, dec) => {
    setDecisions(d => dec ? { ...d, [id]: dec } : (() => { const n = { ...d }; delete n[id]; return n })())
  }

  const preCallHeaders = [T.colCandidate, T.colPosition, T.colLastContact, T.colInterviews, T.colScore, T.colAction]
  const decHeaders     = [T.colCandidate, T.colStage, T.colScore, T.colDebrief, T.colDecision, T.colAction]
  const headers        = isPreCall ? preCallHeaders : decHeaders
  const cols           = isPreCall ? '2.2fr 1.2fr 1.2fr 1fr 1fr 130px' : '2fr 1fr 1fr 1.1fr 1.2fr 130px'

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
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
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 6px' }}>
              {isPreCall ? T.preCallTitle : T.decisionTitle}
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: 0, maxWidth: 540, lineHeight: 1.6 }}>
              {isPreCall ? T.preCallDesc : T.decisionDesc}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 24 }}>
            {isPreCall && urgentCount > 0 && (
              <div style={{ background: '#FEE2E2', borderRadius: 11, padding: '12px 16px', textAlign: 'center', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif' }}>{urgentCount}</div>
                <div style={{ fontSize: 10, color: C.red, fontWeight: 600 }}>{T.overdue}</div>
              </div>
            )}
            {!isPreCall && pendingCount > 0 && (
              <div style={{ background: C.warBg, borderRadius: 11, padding: '12px 16px', textAlign: 'center', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.war, fontFamily: 'DM Serif Display, serif' }}>{pendingCount}</div>
                <div style={{ fontSize: 10, color: C.war, fontWeight: 600 }}>{T.debriefPending}</div>
              </div>
            )}
            <div style={{ background: C.white, borderRadius: 11, padding: '12px 16px', textAlign: 'center', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: 'DM Serif Display, serif' }}>{candidates.length}</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{T.total}</div>
            </div>
            {!isPreCall && (
              <div style={{ background: C.sucBg, borderRadius: 11, padding: '12px 16px', textAlign: 'center', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif' }}>{decidedCount}</div>
                <div style={{ fontSize: 10, color: C.sucT, fontWeight: 600 }}>{T.decided}</div>
              </div>
            )}
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

        {/* Table */}
        <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 2px 16px rgba(201,57,74,0.04)' }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: cols, padding: '10px 22px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
            {headers.map(h => (
              <span key={h} style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map(c =>
            isPreCall
              ? <PreCallRow key={c.id} c={c} onOpen={handleOpen} T={T} />
              : <DecisionRow key={c.id} c={c} decision={decisions[c.id]} onOpen={handleOpen} onDecide={handleDecide} T={T} />
          )}

          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>
              {T.noMatch}
            </div>
          )}
        </div>

        {/* Debrief reminder (decision mode) */}
        {!isPreCall && pendingCount > 0 && (
          <div style={{ marginTop: 16, padding: '13px 18px', background: C.warBg, borderRadius: 11, border: '1px solid #FDE68A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.warT }}>{T.debriefPendingMsg(pendingCount)}</div>
              <div style={{ fontSize: 11, color: C.war, marginTop: 2 }}>{T.debriefUnlock}</div>
            </div>
            <button
              onClick={() => onNavigate?.('questionnaire')}
              style={{ padding: '8px 16px', borderRadius: 9, background: C.war, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, marginLeft: 16 }}
            >
              {T.fillDebrief}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
