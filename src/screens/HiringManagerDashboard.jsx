// ─────────────────────────────────────────────────────────────────────────────
// HiringManagerDashboard.jsx
// Place in: src/screens/HiringManagerDashboard.jsx
//
// Key differences from RecruiterDashboard:
//   • Only shows positions this hiring manager owns
//   • Only shows pre-selected candidates (not the full import batch)
//   • Focused on review and decision-making, not logistics
//   • "Not moving forward" candidates are archived — saved but separated
//   • No messaging — that stays with the recruiter
//   • Comment section per candidate (no chat thread)
//
// Props:
//   onBack()     — navigate back
//   onNavigate() — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

const SCREEN_T = {
  en: {
    hiringManager:     'Hiring Manager',
    preSelected:       (n) => `${n} pre-selected candidates`,
    pendingReview:     (n) => `${n} pending review`,
    advancing:         (n) => `✓ ${n} advancing`,
    archived:          (n) => `✕ ${n} archived`,
    debrief:           '📝 Interview Debriefs',
    pendingDebriefs:   (n) => `${n} interview debrief${n !== 1 ? 's' : ''} pending — `,
    viewDebriefs:      'View debriefs →',
    preSelectedTitle:  'Pre-selected candidates',
    preSelectedSub:    (since) => `You are seeing only candidates that passed the recruiter's screening · Open since ${since}`,
    sortScore:         '↓ Highest score first',
    sortActivity:      '↑ Most recent activity',
    sortName:          'A–Z Name',
    colCandidate:      'Candidate',
    colStage:          'Stage',
    colInterviews:     'Interviews performed',
    colFit:            'Candidate fit',
    colSummary:        'Debrief',
    colDecision:       'Decision',
    colActions:        'Actions',
    allReviewed:       'All candidates have been reviewed',
    noPreSelected:     'No pre-selected candidates yet',
    noPreSelectedSub:  "The recruiter will add candidates here after screening.",
    recruiterContact:  'Recruiter:',
    recruiterNote:     'Reach out to the recruiter for any logistics, scheduling, or messaging updates.',
    debriefBtn:        'Debrief',
    briefBtn:          'Debrief',
    postDebrief:       '📝 Interview Debriefs',
    yourDecision:      'Your decision',
    advancingPill:     '✓ Advancing',
    notMovingPill:     '✕ Not moving forward',
    undo:              'Undo',
    notMovingBtn:      '✕ Not moving forward',
    advanceBtn:        '✓ Advance',
    tabs:              { feedback: 'Feedback', notes: 'My Notes' },
    noFeedback:        'No feedback yet',
    noFeedbackSub:     'Feedbacks appear after interviews are completed and the post-interview questionnaire is filled in.',
    fillForm:          'Fill post-interview form',
    openBrief:         '📊 Open full decision debrief →',
    notesPrivate:      'Your notes are private and visible only to you. They help inform your decision and can feed into the recruiter\'s debrief.',
    savedNote:         'Saved note',
    saveNote:          'Save note',
    suggestHire:       'Suggest to hire',
    rejectBtn:         'Reject',
    requestRound:      'Request interview round',
    confirmHireTitle:  'Suggest to hire?',
    confirmHireMsg:    (name) => `Are you sure you want to suggest the recruiter to hire ${name}?`,
    hireMultiple:      'Hire multiple',
    confirmYes:        'Yes, suggest',
    confirmCancel:     'Cancel',
    viewSummary:       'View report →',
    completeSummary:   'Complete debrief',
    archivedSection:   (n) => `Not moving forward — ${n} archived`,
    archivedSaved:     'Saved · Recruiter notified',
    archivedPill:      'Archived',
    restore:           'Restore',
    suggestTitle:      'Suggest new candidates',
    suggestSub:        'Share LinkedIn profiles or CV links — Valentina will review them for this position',
    suggestPlaceholder:'Paste a LinkedIn URL or CV link…',
    suggestAdd:        'Add',
    suggestNotify:     (n) => `Notify Valentina · ${n} suggestion${n !== 1 ? 's' : ''}`,
    suggestSent:       (pos) => `✓ Valentina has been notified to check these people for ${pos}`,
    suggestSentSub:    "She'll review them and add suitable candidates to the pipeline.",
    preCall:           'Pre-Call',
    interviews:        'INTERVIEWS',
    lastActivity:      'LAST ACTIVITY',
    pendingDecision:   'Pending review',
    interviewsOf:      (d, t) => `${d} of ${t}`,
    noScoreYet:        'No score yet',
    strongAdvance:      'Strong advance',
    averageFit:         'Average fit',
    notAdvancing:       'Not advancing',
    requestPosBtn:      '+ Request a position',
    requestPosTitle:    'Request a new position',
    requestPosSub:      'Describe the role and requirements in your own words. Valentina will set it up in the system.',
    requestPosPlaceholder: 'e.g. We need a senior backend engineer with 5+ years Node.js experience, remote-friendly...',
    requestPosSend:     'Send to Valentina',
    requestPosSent:     '✓ Sent to Valentina',
  },
  it: {
    hiringManager:     'Responsabile Assunzioni',
    preSelected:       (n) => `${n} candidati pre-selezionati`,
    pendingReview:     (n) => `${n} in attesa di revisione`,
    advancing:         (n) => `✓ ${n} avanzano`,
    archived:          (n) => `✕ ${n} archiviati`,
    debrief:           '📝 Debrief Colloqui',
    pendingDebriefs:   (n) => `${n} debrief colloquio in attesa — `,
    viewDebriefs:      'Vedi debrief →',
    preSelectedTitle:  'Candidati pre-selezionati',
    preSelectedSub:    (since) => `Vedi solo i candidati che hanno superato lo screening del recruiter · Aperto da ${since}`,
    sortScore:         '↓ Punteggio più alto',
    sortActivity:      '↑ Attività più recente',
    sortName:          'A–Z Nome',
    colCandidate:      'Candidato',
    colStage:          'Fase',
    colInterviews:     'Colloqui effettuati',
    colFit:            'Idoneità candidato',
    colSummary:        'Debrief',
    colDecision:       'Decisione',
    colActions:        'Azioni',
    allReviewed:       'Tutti i candidati sono stati esaminati',
    noPreSelected:     'Nessun candidato pre-selezionato ancora',
    noPreSelectedSub:  'Il recruiter aggiungerà candidati qui dopo lo screening.',
    recruiterContact:  'Recruiter:',
    recruiterNote:     'Contatta il recruiter per logistica, pianificazione o aggiornamenti messaggi.',
    debriefBtn:        'Debrief',
    briefBtn:          'Debrief',
    postDebrief:       '📝 Debrief Colloqui',
    yourDecision:      'La tua decisione',
    advancingPill:     '✓ Avanza',
    notMovingPill:     '✕ Non avanza',
    undo:              'Annulla',
    notMovingBtn:      '✕ Non avanza',
    advanceBtn:        '✓ Avanza',
    tabs:              { feedback: 'Feedback', notes: 'Le mie note' },
    noFeedback:        'Nessun feedback ancora',
    noFeedbackSub:     'I feedback appaiono dopo le interviste e la compilazione del questionario post-intervista.',
    fillForm:          'Compila il modulo post-intervista',
    openBrief:         '📊 Apri debrief decisionale completo →',
    notesPrivate:      'Le tue note sono private e visibili solo a te. Aiutano a informare la tua decisione.',
    savedNote:         'Nota salvata',
    saveNote:          'Salva nota',
    suggestHire:       'Suggerisci assunzione',
    rejectBtn:         'Rifiuta',
    requestRound:      'Richiedi altro colloquio',
    confirmHireTitle:  'Suggerisci assunzione?',
    confirmHireMsg:    (name) => `Sei sicuro di voler suggerire al recruiter di assumere ${name}?`,
    hireMultiple:      'Assumi più candidati',
    confirmYes:        'Sì, suggerisci',
    confirmCancel:     'Annulla',
    viewSummary:       'Vedi report →',
    completeSummary:   'Completa debrief',
    archivedSection:   (n) => `Non avanza — ${n} archiviati`,
    archivedSaved:     'Salvato · Recruiter notificato',
    archivedPill:      'Archiviato',
    restore:           'Ripristina',
    suggestTitle:      'Suggerisci nuovi candidati',
    suggestSub:        'Condividi profili LinkedIn o CV — Valentina li esaminerà per questa posizione',
    suggestPlaceholder:'Incolla un URL LinkedIn o link CV…',
    suggestAdd:        'Aggiungi',
    suggestNotify:     (n) => `Notifica Valentina · ${n} suggeriment${n !== 1 ? 'i' : 'o'}`,
    suggestSent:       (pos) => `✓ Valentina è stata notificata per esaminare questi profili per ${pos}`,
    suggestSentSub:    'Li esaminerà e aggiungerà i candidati idonei alla pipeline.',
    preCall:           'Pre-Colloquio',
    interviews:        'INTERVISTE',
    lastActivity:      'ULTIMA ATTIVITÀ',
    pendingDecision:   'In attesa',
    interviewsOf:      (d, t) => `${d} di ${t}`,
    noScoreYet:        'Nessun punteggio',
    strongAdvance:      'Forte avanzamento',
    averageFit:         'Idoneità media',
    notAdvancing:       'Non avanza',
    requestPosBtn:      '+ Richiedi una posizione',
    requestPosTitle:    'Richiedi una nuova posizione',
    requestPosSub:      'Descrivi il ruolo e i requisiti con parole tue. Valentina lo creerà nel sistema.',
    requestPosPlaceholder: 'es. Abbiamo bisogno di un senior backend engineer con 5+ anni di Node.js...',
    requestPosSend:     'Invia a Valentina',
    requestPosSent:     '✓ Inviato a Valentina',
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────

// ── Mock data — Andrea P.'s view ───────────────────────────────────────────────
const HM = { name: 'Andrea P.', role: 'Hiring Manager', dept: 'Product Design', ini: 'AP' }

const POSITIONS = [
  { id: 1, title: 'UX Designer',    dept: 'Product Design', openSince: 'Mar 12', recruiter: 'Valentina O.', totalApplicants: 28, preSelected: 4 },
  { id: 3, title: 'Product Manager', dept: 'Product',        openSince: 'Apr 28', recruiter: 'Valentina O.', totalApplicants: 19, preSelected: 1 },
]

const PIPELINE = ['Screening', 'Preliminary Call', 'Interviews', 'Offer']

// Only pre-selected candidates — what the hiring manager sees
const PRE_SELECTED = {
  1: [
    {
      id: 1, name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',
      stage: 'Interviews', lastActivity: '3d ago', interviewsDone: 2, interviewsTotal: 3,
      email: 'giulia.rossi@gmail.com',
      fb: [
        {
          round: 1, type: 'Portfolio Review',
          by: 'Andrea P.', byRole: 'Hiring Manager', date: '14 May', score: 4,
          txt: 'Strong portfolio and excellent communication. Clear learning drive despite some design-systems gaps. I would be comfortable having her on the team.',
          strengths: ['Portfolio depth', 'Communication', 'Growth mindset'],
          concerns: ['Design systems experience'],
        },
        {
          round: 2, type: 'Technical Deep-Dive',
          by: 'Elena C.', byRole: 'Tech Lead', date: '17 May', score: 3,
          txt: 'Enthusiastic and highly collaborative. Cultural fit is strong. Could sharpen complex problem-solving under pressure.',
          strengths: ['Cultural fit', 'Collaboration'],
          concerns: ['Problem-solving under pressure'],
        },
      ],
    },
    {
      id: 2, name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',
      stage: 'Preliminary Call', lastActivity: '4d ago', interviewsDone: 1, interviewsTotal: 2,
      email: 'marco.bianchi@gmail.com',
      fb: [
        {
          round: 1, type: 'Portfolio Review',
          by: 'Andrea P.', byRole: 'Hiring Manager', date: '14 May', score: 5,
          txt: 'Excellent strategic thinking. Leads with empathy — exactly what the team needs. Strong recommend from my side.',
          strengths: ['Strategic thinking', 'Leadership', 'Empathy-driven design'],
          concerns: [],
        },
      ],
    },
    {
      id: 4, name: 'Luca Ferrari',    ini: 'LF', role: 'Mid UX Designer',
      stage: 'Interviews', lastActivity: '12d ago', interviewsDone: 1, interviewsTotal: 3,
      email: 'luca.ferrari@gmail.com',
      fb: [
        {
          round: 1, type: 'Portfolio Review',
          by: 'Andrea P.', byRole: 'Design Director', date: '8 May', score: 3,
          txt: 'Solid fundamentals. Needs coaching on stakeholder communication but shows real craft. Worth progressing to see how he handles pressure.',
          strengths: ['Design craft', 'Attention to detail'],
          concerns: ['Stakeholder communication', 'Leadership presence'],
        },
      ],
    },
    {
      id: 7, name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',
      stage: 'Interviews', lastActivity: '14d ago', interviewsDone: 2, interviewsTotal: 2,
      email: 'chiara.lombardi@gmail.com',
      fb: [
        {
          round: 1, type: 'Research Deep-Dive',
          by: 'Andrea P.', byRole: 'Hiring Manager', date: '6 May', score: 5,
          txt: 'Outstanding. Research depth is rare at this level. She thinks in systems and articulates complexity with clarity.',
          strengths: ['Research depth', 'Systems thinking', 'Communication'],
          concerns: [],
        },
        {
          round: 2, type: 'Values & Team Fit',
          by: 'Andrea P.', byRole: 'Design Director', date: '10 May', score: 5,
          txt: 'Strong recommend. She asks the right questions. The team would grow with her around.',
          strengths: ['Values alignment', 'Intellectual curiosity'],
          concerns: [],
        },
      ],
    },
  ],
  3: [
    {
      id: 11, name: 'Sofia Esposito', ini: 'SE', role: 'Senior PM',
      stage: 'Preliminary Call', lastActivity: '4d ago', interviewsDone: 0, interviewsTotal: 2,
      email: 'sofia.esposito@gmail.com',
      fb: [],
    },
  ],
}

// ── Summary completion status (per candidate) ─────────────────────────────────
// In production this comes from the submitted questionnaire records.
const SUMMARY_STATUS = {
  1:  'complete',    // Giulia — 2 rounds, both filled
  2:  'complete',    // Marco B. — round 1 filled
  4:  'pending',     // Luca F. — round 1 done but questionnaire not submitted
  7:  'complete',    // Chiara — 2 rounds, both filled
  11: 'not-started', // Sofia — no interviews yet
}

// ── Candidate fit assessment (per candidate, from completed summaries) ────────
const CANDIDATE_FIT = {
  1:  'advance',         // Giulia
  2:  'strongly-advance',// Marco B.
  4:  null,              // Luca F. — pending
  7:  'strongly-advance',// Chiara
  11: null,              // Sofia — no interviews yet
}
// ── Summary badge atom ────────────────────────────────────────────────────────
function SummaryBadge({ status }) {
  if (status === 'complete')    return <span style={{ background: C.sucBg, color: C.sucT, fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>✓ Done</span>
  if (status === 'pending')     return <span style={{ background: C.warBg, color: C.warT, fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>⏳ Pending</span>
  return                               <span style={{ background: C.gray,  color: C.muted, fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20 }}>— N/A</span>
}

// ── Candidate fit pill ────────────────────────────────────────────────────────
function FitPill({ rec, T }) {
  if (!rec) return <span style={{ fontSize: 11, color: C.muted }}>—</span>
  if (rec === 'strongly-advance') return (
    <span style={{
      background: isDark ? 'rgba(147,197,253,0.16)' : 'rgba(27,36,97,0.09)',
      color:      isDark ? '#93C5FD'                : '#1B2461',
      border:     isDark ? '1px solid rgba(147,197,253,0.30)' : 'none',
      fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20, whiteSpace: 'nowrap', display: 'inline-block' }}>
      ★ {T.strongAdvance}
    </span>
  )
  if (rec === 'advance') return (
    <span style={{ background: 'rgba(37,99,235,0.10)', color: '#1E40AF', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20, whiteSpace: 'nowrap', display: 'inline-block' }}>
      ◎ {T.averageFit}
    </span>
  )
  return (
    <span style={{ background: '#FEE2E2', color: C.red, fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20, whiteSpace: 'nowrap', display: 'inline-block' }}>
      ✕ {T.notAdvancing}
    </span>
  )
}

const AV_PALETTE = [
  ['#FECDD3','#C9394A'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

// ── Atoms ─────────────────────────────────────────────────────────────────────
function Av({ id, ini, size = 36 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function DecisionPill({ dec, T }) {
  if (!dec) return <span style={{ fontSize: 11, color: C.muted, background: C.gray, padding: '3px 9px', borderRadius: 20, fontWeight: 500 }}>{T.pendingDecision}</span>
  if (dec === 'advancing') return <span style={{ fontSize: 11, color: C.red, background: C.redBg, padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>{T.advancingPill}</span>
  if (dec === 'request-round') return <span style={{ fontSize: 11, color: C.warT, background: C.warBg, padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>↺ {T.requestRound}</span>
  return <span style={{ fontSize: 11, color: C.red, background: '#FEE2E2', padding: '3px 9px', borderRadius: 20, fontWeight: 600 }}>{T.notMovingPill}</span>
}

function StagePipeline({ stage }) {
  const idx = PIPELINE.indexOf(stage)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {PIPELINE.map((s, i) => {
        const past = i <= idx
        const curr = i === idx
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < PIPELINE.length - 1 && (
              <div style={{ position: 'absolute', top: 7, left: '50%', width: '100%', height: 2, background: i < idx ? C.red : C.border, zIndex: 0 }} />
            )}
            <div style={{ width: 14, height: 14, borderRadius: 3, transform: 'rotate(45deg)', background: curr ? C.red : past ? C.redL : C.gray, border: `2px solid ${curr ? C.red : past ? C.redL : C.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? `0 0 0 3px ${C.redBg}` : 'none' }} />
            <div style={{ fontSize: 8, color: curr ? C.red : C.muted, fontWeight: curr ? 600 : 400, textAlign: 'center', lineHeight: 1.2 }}>
              {s === 'Preliminary Call' ? 'Pre-Call' : s}
            </div>
          </div>
        )
      })}
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
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #E8E4E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'white' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#C9394A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>CV</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1917' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{candidate.role}{candidate.email ? ` · ${candidate.email}` : ''}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#888', lineHeight: 1, padding: '0 0 0 16px' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', background: '#FAFAF9', fontFamily: 'Georgia, serif', color: '#1C1917' }}>
          <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{candidate.name}</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{candidate.role}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 10, color: '#888' }}>
              {candidate.email && <span>✉ {candidate.email}</span>}
              {candidate.stage && <span>📍 Stage: {candidate.stage}</span>}
            </div>
          </div>
          <Sec>Professional Experience</Sec>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{candidate.role}</span>
              <span style={{ fontSize: 10, color: '#888' }}>2022 – Present</span>
            </div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>TechCorp · Europe</div>
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
          <Sec>Projects & Highlights</Sec>
          <Line w="94%" /><Line w="88%" /><Line w="76%" /><Line w="82%" /><Line w="68%" />
          <div style={{ marginTop: 10 }} />
          <Line w="90%" /><Line w="83%" />
        </div>
      </div>
    </div>
  )
}

// ── Candidate panel ───────────────────────────────────────────────────────────
function CandidatePanel({ candidate, decision, onDecide, onSuggestHire, onClose, onNavigate, T }) {
  const [showCV, setShowCV] = useState(false)
  return (
    <>
    <aside style={{ width: 340, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden', animation: 'hmPanelIn 0.24s cubic-bezier(0.22,0.61,0.36,1) both' }}>

      {/* Header */}
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}`, background: C.redBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
            <Av id={candidate.id} ini={candidate.ini} size={46} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{candidate.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 20, lineHeight: 1, padding: 0, alignSelf: 'flex-start' }}>×</button>
        </div>
        {/* Stage pipeline */}
        <StagePipeline stage={candidate.stage} />
      </div>

      {/* Feedback */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Interview feedback {candidate.fb.length > 0 && <span style={{ background: C.redL, color: C.red, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, marginLeft: 5 }}>{candidate.fb.length}</span>}
        </div>
        {candidate.fb.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: C.muted }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 12, marginBottom: 4 }}>{T.noFeedback}</div>
            <div style={{ fontSize: 11 }}>{T.noFeedbackSub}</div>
            <button onClick={() => onNavigate?.('questionnaire')} style={{ marginTop: 10, padding: '6px 14px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.fillForm}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidate.fb.map((f, i) => {
              const avColors = [['#FECDD3', C.red], ['#FEF3C7', '#D97706'], ['#EDE9FE', '#6D28D9']]
              const [bg, col] = avColors[i % 3]
              return (
                <div key={i} style={{ background: C.gray, borderRadius: 10, padding: '11px 13px', borderLeft: `3px solid ${col}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                        {f.by.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{f.by}</div>
                        <div style={{ fontSize: 9, color: C.muted }}>{f.byRole} · R{f.round}</div>
                      </div>
                    </div>
                    <FitPill rec={f.score >= 4 ? 'strongly-advance' : f.score >= 3 ? 'advance' : null} T={T} />
                  </div>
                  <p style={{ fontSize: 11, color: C.text, lineHeight: 1.65, margin: 0 }}>{f.txt}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Decision footer */}
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate?.('hiring-manager-summary')}
          style={{ padding: '9px 0', borderRadius: 9, background: isDark ? 'rgba(233,1,48,0.14)' : '#FEE2E2', color: C.red, border: `1px solid ${isDark ? 'rgba(233,1,48,0.28)' : 'rgba(233,1,48,0.18)'}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {T.openBrief}
        </button>
        <button
          onClick={() => setShowCV(true)}
          style={{ padding: '9px 0', borderRadius: 9, background: C.gray, color: C.text, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          📄 View CV
        </button>

        <div style={{ height: 1, background: C.border, margin: '2px 0' }} />
        <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{T.yourDecision}</div>

        {decision ? (
          <div style={{ padding: '10px 13px', borderRadius: 9, background: decision === 'advancing' ? C.redBg : decision === 'request-round' ? C.gray : C.infBg, border: `1px solid ${decision === 'advancing' ? C.redL : decision === 'request-round' ? C.border : C.infL}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: decision === 'advancing' ? C.red : decision === 'request-round' ? C.muted : C.infT }}>
              {decision === 'advancing' ? T.advancingPill : decision === 'request-round' ? `↺ ${T.requestRound}` : T.notMovingPill}
            </span>
            <button onClick={() => onDecide(candidate.id, null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.muted, fontFamily: 'inherit' }}>{T.undo}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button onClick={() => onSuggestHire?.(candidate.id)} style={{ padding: '10px 0', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.suggestHire}
            </button>
            <button onClick={() => onDecide(candidate.id, 'request-round')} style={{ padding: '10px 0', borderRadius: 9, background: C.gray, color: C.muted, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ↺ {T.requestRound}
            </button>
            <button onClick={() => onDecide(candidate.id, 'not-moving-forward')} style={{ padding: '10px 0', borderRadius: 9, background: C.infBg, color: C.infT, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.notMovingBtn}
            </button>
          </div>
        )}
      </div>
    </aside>
    {showCV && <CVModal candidate={candidate} onClose={() => setShowCV(false)} />}
    </>
  )
}

// ── Archived section ──────────────────────────────────────────────────────────
function ArchivedSection({ candidates, onRestore, T }) {
  const [open, setOpen] = useState(false)
  if (!candidates.length) return null

  return (
    <div style={{ marginTop: 10, background: C.infBg, borderRadius: 11, border: `1px solid ${C.infL}`, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: 13, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block', color: C.navy }}>▶</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{T.archivedSection(candidates.length)}</span>
        <span style={{ fontSize: 11, color: C.muted, marginLeft: 'auto' }}>{T.archivedSaved}</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < candidates.length - 1 ? `1px solid ${C.border}` : 'none', opacity: 0.75 }}>
              <Av id={c.id} ini={c.ini} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{c.name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{c.role} · {c.stage}</div>
              </div>
              <span style={{ fontSize: 10, color: C.navy, background: C.infBg, border: `1px solid ${C.infL}`, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{T.archivedPill}</span>
              <button onClick={() => onRestore(c.id)} style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: C.white, color: C.muted, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                {T.restore}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Suggest-to-hire confirmation modal ───────────────────────────────────────
function ConfirmHireModal({ candidate, onConfirm, onCancel, T }) {
  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(4px)' }}
    >
      <style>{`@keyframes hmModalIn{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 14, padding: '26px 28px', width: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', animation: 'hmModalIn 0.2s ease' }}
      >
        <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, marginBottom: 14 }}>
          {T.confirmHireTitle}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 14px', background: C.redBg, borderRadius: 10, border: `1px solid ${C.redL}` }}>
          <Av id={candidate.id} ini={candidate.ini} size={40} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role} · {candidate.stage}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: '0 0 22px' }}>
          {T.confirmHireMsg(candidate.name.split(' ')[0])}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onConfirm}
            style={{ padding: '12px 0', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {T.confirmYes}
          </button>
          <button
            onClick={onCancel}
            style={{ padding: '10px 0', borderRadius: 10, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {T.confirmCancel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Suggest candidates modal ──────────────────────────────────────────────────
function SuggestModal({ position, onClose, T }) {
  const [links,      setLinks]      = useState([])
  const [inputValue, setInputValue] = useState('')
  const [submitted,  setSubmitted]  = useState(false)
  const fileInputRef = useRef(null)

  const isFile     = (s) => s.startsWith('file:')
  const isLinkedIn = (s) => !isFile(s) && s.toLowerCase().includes('linkedin')
  const getLinkIcon    = (s) => isFile(s) ? '📎' : isLinkedIn(s) ? '💼' : '📄'
  const getLinkDisplay = (s) => isFile(s) ? s.slice(5) : s

  const addLink = () => {
    const val = inputValue.trim()
    if (!val) return
    setLinks(prev => [...prev, val])
    setInputValue('')
  }

  const removeLink = (idx) => setLinks(prev => prev.filter((_, i) => i !== idx))

  // Submit: also consume whatever is currently typed in the input
  const submit = () => {
    const extra = inputValue.trim()
    const all   = extra ? [...links, extra] : links
    if (all.length === 0) return
    setSubmitted(true)
  }

  const hasContent = links.length > 0 || inputValue.trim().length > 0

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(5px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 14, padding: '28px 30px', width: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', animation: 'hmModalIn 0.2s ease' }}
      >
        {submitted ? (
          /* ── Thank-you state ── */
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🙏</div>
            <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, color: C.text, marginBottom: 10 }}>
              Thank you, {HM.name.split(' ')[0]}!
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: '0 0 24px' }}>
              Valentina has been notified and will review your suggestions for{' '}
              <strong style={{ color: C.text }}>{position?.title}</strong>.{' '}
              Your contribution to the team is appreciated.
            </p>
            <button
              onClick={onClose}
              style={{ padding: '11px 36px', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Done
            </button>
          </div>
        ) : (
          /* ── Input state ── */
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              {position?.title}
            </div>
            <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, color: C.text, marginBottom: 8 }}>
              {T.suggestTitle}
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: '0 0 20px', lineHeight: 1.65 }}>
              {T.suggestSub}
            </p>

            {/* Input + add */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addLink() }}
                placeholder={T.suggestPlaceholder}
                autoFocus
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 8,
                  border: `1.5px solid ${C.border}`, fontSize: 13,
                  color: C.text, background: C.white, fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = C.red)}
                onBlur={e => (e.target.style.borderColor = C.border)}
              />
              <button
                onClick={addLink}
                disabled={!inputValue.trim()}
                style={{
                  padding: '10px 16px', borderRadius: 8,
                  background: inputValue.trim() ? C.infBg : C.grayB,
                  color: inputValue.trim() ? C.infT : C.muted,
                  border: `1px solid ${inputValue.trim() ? C.infL : C.border}`,
                  fontSize: 12, fontWeight: 600,
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
              >
                {T.suggestAdd}
              </button>
            </div>

            {/* Upload CV PDF */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              style={{ display: 'none' }}
              onChange={e => {
                const files = Array.from(e.target.files || [])
                if (files.length > 0) {
                  setLinks(prev => [...prev, ...files.map(f => `file:${f.name}`)])
                  e.target.value = ''
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: 8, marginBottom: 12,
                border: `1.5px dashed ${C.border}`, background: C.gray,
                color: C.muted, fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 7, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              <span style={{ fontSize: 14 }}>📎</span>
              Upload CV PDF
            </button>

            {/* Queued links */}
            {links.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                {links.map((link, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 8, background: C.gray, border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13 }}>{getLinkIcon(link)}</span>
                    <span style={{ flex: 1, fontSize: 11, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLinkDisplay(link)}</span>
                    <button onClick={() => removeLink(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 9 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '11px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!hasContent}
                style={{
                  flex: 2, padding: '11px', borderRadius: 9, border: 'none',
                  background: hasContent ? C.red : C.grayB,
                  color: hasContent ? 'white' : C.muted,
                  fontSize: 13, fontWeight: 600,
                  cursor: hasContent ? 'pointer' : 'default',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
              >
                {T.suggestNotify(links.length + (inputValue.trim() ? 1 : 0))}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Request Position Modal ────────────────────────────────────────────────────
function RequestPositionModal({ T, onClose }) {
  const [text,      setText]      = useState('')
  const [sent,      setSent]      = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const send = () => {
    if (!text.trim()) return
    recognitionRef.current?.stop()
    setSent(true)
    setTimeout(onClose, 1600)
  }

  const toggleDictation = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setText(transcript)
    }
    rec.onerror = () => setListening(false)
    rec.onend   = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.46)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:400, backdropFilter:'blur(7px)' }}
    >
      <style>{`@keyframes rpmIn{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 16, padding: '28px 30px', width: 500, boxShadow: '0 28px 72px rgba(0,0,0,0.24)', animation: 'rpmIn 0.22s ease', position: 'relative' }}
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>✅</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: C.text, marginBottom: 6 }}>{T.requestPosSent}</div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>Valentina will review your request and create the position.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Hiring Manager
            </div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: '0 0 8px' }}>
              {T.requestPosTitle}
            </h2>
            <p style={{ fontSize: 12, color: C.muted, margin: '0 0 18px', lineHeight: 1.65 }}>
              {T.requestPosSub}
            </p>
            <div style={{ position: 'relative' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={T.requestPosPlaceholder}
                rows={5}
                style={{ width: '100%', padding: '12px 14px', paddingBottom: 42, borderRadius: 10, border: `1.5px solid ${listening ? C.red : C.border}`, fontSize: 13, fontFamily: 'inherit', color: C.text, background: C.gray, resize: 'vertical', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box', lineHeight: 1.65 }}
                onFocus={e => { e.target.style.borderColor = listening ? C.red : '#999' }}
                onBlur={e => { e.target.style.borderColor = listening ? C.red : C.border }}
              />
              {/* Mic button inside textarea */}
              <button
                type="button"
                onClick={toggleDictation}
                title={listening ? 'Stop dictation' : 'Dictate with microphone'}
                style={{
                  position: 'absolute', bottom: 10, left: 12,
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 11px', borderRadius: 20,
                  background: listening ? C.red : C.gray,
                  border: `1.5px solid ${listening ? C.red : C.border}`,
                  color: listening ? 'white' : C.muted,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.18s',
                  boxShadow: listening ? `0 0 0 3px ${C.red}22` : 'none',
                }}
              >
                <span style={{ fontSize: 14 }}>{listening ? '⏹' : '🎙'}</span>
                {listening ? 'Listening…' : 'Dictate'}
              </button>
              {listening && (
                <div style={{ position: 'absolute', bottom: 12, right: 14, display: 'flex', gap: 3, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 3, borderRadius: 3, background: C.red, animation: `micBar${i} 0.6s ease-in-out ${i*0.15}s infinite alternate` }} />
                  ))}
                </div>
              )}
            </div>
            <style>{`
              @keyframes micBar0{from{height:4px}to{height:12px}}
              @keyframes micBar1{from{height:8px}to{height:18px}}
              @keyframes micBar2{from{height:4px}to{height:10px}}
            `}</style>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button
                onClick={onClose}
                style={{ flex: 1, padding: '11px', borderRadius: 9, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={send}
                disabled={!text.trim()}
                style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: text.trim() ? C.red : C.border, color: 'white', fontSize: 13, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'default', fontFamily: 'inherit', letterSpacing: '0.02em', transition: 'all 0.15s' }}
              >
                {T.requestPosSend}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function HiringManagerDashboard({ theme, lang = 'en', onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [activePosId,        setActivePosId]        = useState(1)
  const [selectedCandidate,  setSelectedCandidate]  = useState(null)
  const [decisions,          setDecisions]          = useState({})    // id → 'advancing' | 'not-moving-forward'
  const [comments,           setComments]           = useState({})    // id → string
  const [sortBy,             setSortBy]             = useState('score') // 'score' | 'activity' | 'name'
  const [confirmHireId,      setConfirmHireId]      = useState(null)  // candidate id pending hire confirmation
  const [hireBanner,         setHireBanner]         = useState(null)  // candidate name for navy banner
  const [showSuggest,        setShowSuggest]        = useState(false) // suggest candidates modal
  const [showRequestPos,     setShowRequestPos]     = useState(false) // request new position modal

  const pos      = POSITIONS.find(p => p.id === activePosId)
  const allCands = PRE_SELECTED[activePosId] || []

  // Split: active (Interviews-stage only, not archived) vs archived (not-moving-forward)
  const active   = allCands.filter(c => decisions[c.id] !== 'not-moving-forward' && c.stage === 'Interviews')
  const archived = allCands.filter(c => decisions[c.id] === 'not-moving-forward')

  // Fit order for sorting: strongly-advance > advance > null
  const fitRank = (id) => {
    const fit = CANDIDATE_FIT[id]
    return fit === 'strongly-advance' ? 2 : fit === 'advance' ? 1 : 0
  }

  const sortedActive = [...active].sort((a, b) => {
    if (sortBy === 'score') return fitRank(b.id) - fitRank(a.id)
    if (sortBy === 'activity') return a.lastActivity.localeCompare(b.lastActivity)
    return a.name.localeCompare(b.name)
  })

  const decide = (id, dec) => {
    setDecisions(d => ({ ...d, [id]: dec }))
    if (dec === 'not-moving-forward' && selectedCandidate?.id === id) {
      setSelectedCandidate(null)
    }
  }

  const restore = (id) => {
    setDecisions(d => { const next = { ...d }; delete next[id]; return next })
  }

  const saveComment = (id, text) => {
    setComments(c => ({ ...c, [id]: text }))
  }

  const handleSuggestHire = (id) => setConfirmHireId(id)

  const handleConfirmHire = () => {
    const cand = allCands.find(c => c.id === confirmHireId)
    decide(confirmHireId, 'advancing')
    setConfirmHireId(null)
    if (cand) {
      setHireBanner(cand.name.split(' ')[0])
      setTimeout(() => setHireBanner(null), 4000)
    }
  }

  // Summary stats
  const advancing    = Object.values(decisions).filter(d => d === 'advancing').length
  const notMoving    = Object.values(decisions).filter(d => d === 'not-moving-forward').length
  const pendingCount = allCands.length - advancing - notMoving

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <style>{`@keyframes hmBannerIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} @keyframes hmPanelIn{from{transform:translateX(100%);opacity:0.6}to{transform:translateX(0);opacity:1}}`}</style>

      {hireBanner && (
        <div style={{
          position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, pointerEvents: 'none',
          background: 'rgba(27,36,97,0.1)', border: '1.5px solid rgba(27,36,97,0.3)',
          backdropFilter: 'blur(16px)', borderRadius: 20, padding: '8px 20px',
          fontSize: 12, fontWeight: 700, color: '#1B2461',
          boxShadow: '0 4px 20px rgba(27,36,97,0.15)',
          animation: 'hmBannerIn 0.3s cubic-bezier(0.22,0.61,0.36,1) both',
          whiteSpace: 'nowrap',
        }}>
          ✓ This will notify the recruiter about your decision
        </div>
      )}

      {/* ── Left column: header + body ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

      {/* ── Greeting hero + position cards ── */}
      <header style={{ padding: '26px 32px 22px', paddingRight: 60, background: 'transparent', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px' }}>
          {T.hiringManager}
        </p>
        <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 3px', letterSpacing: '-0.01em' }}>
          Good morning, {HM.name.split(' ')[0]}.
        </h1>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 20px' }}>
          {T.preSelected(allCands.length)} across {POSITIONS.length} open positions
        </p>

        {/* Position pills + request button */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {POSITIONS.map(p => {
            const isActive = p.id === activePosId
            const cands    = PRE_SELECTED[p.id] || []
            const pending  = cands.filter(c => decisions[c.id] !== 'not-moving-forward').length
            return (
              <button
                key={p.id}
                onClick={() => { setActivePosId(p.id); setSelectedCandidate(null) }}
                style={{
                  padding: '6px 14px', borderRadius: 20,
                  background: isActive
                    ? isDark ? 'rgba(233,1,48,0.18)' : C.redBg
                    : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.60)',
                  border: `1.5px solid ${isActive ? C.redL : C.border}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 7,
                  transition: 'all 0.16s',
                  boxShadow: isActive ? `0 2px 14px rgba(233,1,48,0.12)` : 'none',
                }}
              >
                <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, fontWeight: 400, color: isActive ? C.red : C.muted, lineHeight: 1 }}>
                  {cands.length}
                </span>
                <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? C.text : C.muted }}>
                  {p.title}
                </span>
                {pending > 0 && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? C.red : C.muted, background: isActive ? `${C.red}18` : C.gray, padding: '1px 5px', borderRadius: 9, border: `1px solid ${isActive ? C.redL : C.border}` }}>
                    {pending}
                  </span>
                )}
              </button>
            )
          })}

          {/* Request new position */}
          <button
            onClick={() => setShowRequestPos(true)}
            style={{ padding: '6px 14px', borderRadius: 20, background: 'transparent', border: `1.5px dashed ${C.border}`, color: C.muted, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            {T.requestPosBtn}
          </button>
        </div>
      </header>


      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18, background: isDark ? C.gray : 'transparent' }}>

          {/* Filter + sort bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{T.preSelectedTitle}</h2>
                <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                  {T.preSelectedSub(pos?.openSince)}
                </p>
              </div>
              <button
                onClick={() => setShowSuggest(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 20,
                  background: C.infBg, color: C.infT,
                  border: `1.5px solid ${C.infL}`,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,36,97,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.infBg }}
              >
                <span style={{ fontSize: 13 }}>+</span>
                {T.suggestTitle}
              </button>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, background: C.gray, border: `1px solid ${C.border}`, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>
              ★ Highest fit first
            </span>
          </div>

          {/* Candidate table — only rendered when there are candidates */}
          {sortedActive.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            {sortedActive.map((c) => {
              const dec   = decisions[c.id]
              const isSel = selectedCandidate?.id === c.id
              const fit   = CANDIDATE_FIT[c.id]
              const dots  = Array.from({ length: c.interviewsTotal || 3 }, (_, i) => i < (c.interviewsDone || 0))

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(isSel ? null : c)}
                  style={{
                    background: isSel
                      ? (isDark ? 'rgba(233,1,48,0.12)' : C.redBg)
                      : (isDark ? 'rgba(255,255,255,0.06)' : C.white),
                    borderRadius: 12,
                    border: `1px solid ${isSel ? C.redL : C.border}`,
                    borderLeft: `3px solid ${isSel ? C.red : fit === 'strongly-advance' ? C.navy : fit === 'advance' ? '#3B82F6' : C.border}`,
                    padding: '14px 18px',
                    cursor: 'pointer', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  {/* Avatar */}
                  <Av id={c.id} ini={c.ini} size={38} />

                  {/* Name + role + interview dots */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.name}</span>
                      <FitPill rec={fit} T={T} />
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{c.role}</div>
                    {/* Interview progress dots */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {dots.map((done, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: done ? C.navy : C.border, border: `1.5px solid ${done ? C.navy : C.border}`, transition: 'all 0.2s' }} />
                      ))}
                      <span style={{ fontSize: 10, color: C.muted, marginLeft: 5 }}>
                        {c.interviewsDone || 0} {T.interviews.toLowerCase()} performed
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    {dec ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DecisionPill dec={dec} T={T} />
                        <button onClick={() => decide(c.id, null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: C.muted, fontFamily: 'inherit' }}>{T.undo}</button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSuggestHire(c.id)}
                          style={{ padding: '6px 10px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          {T.suggestHire}
                        </button>
                        <button
                          onClick={() => decide(c.id, 'request-round')}
                          style={{ padding: '6px 10px', borderRadius: 8, background: C.gray, color: C.muted, border: `1px solid ${C.border}`, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          ↺
                        </button>
                        <button
                          onClick={() => decide(c.id, 'not-moving-forward')}
                          style={{ padding: '6px 10px', borderRadius: 8, background: C.infBg, color: C.infT, border: 'none', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          )} {/* end sortedActive.length > 0 */}

          {/* Archived section */}
          <ArchivedSection candidates={archived} onRestore={restore} T={T} />

          {/* Empty state — shown when position has no candidates at all */}
          {active.length === 0 && archived.length === 0 && (
            <div style={{ textAlign: 'center', padding: '52px 0 40px', color: C.muted }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 6 }}>{T.noPreSelected}</div>
              <div style={{ fontSize: 12 }}>{T.noPreSelectedSub}</div>
            </div>
          )}

          {/* Recruiter contact note */}
          {allCands.length > 0 && (
            <div style={{ padding: '13px 16px', background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{T.recruiterContact} {pos?.recruiter}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{T.recruiterNote}</div>
              </div>
              <span style={{ fontSize: 11, color: C.muted, background: C.gray, padding: '4px 10px', borderRadius: 20 }}>valentina.o@publicissapient.com</span>
            </div>
          )}
        </div>
      </div> {/* end left column */}

      {/* ── Candidate panel (full height) ── */}
      {selectedCandidate && (
        <CandidatePanel
          key={selectedCandidate.id}
          candidate={selectedCandidate}
          decision={decisions[selectedCandidate.id]}
          onDecide={decide}
          onSuggestHire={handleSuggestHire}
          T={T}
          onClose={() => setSelectedCandidate(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* ── Suggest candidates modal ── */}
      {showSuggest && (
        <SuggestModal
          position={pos}
          onClose={() => setShowSuggest(false)}
          T={T}
        />
      )}

      {/* ── Confirm hire modal ── */}
      {confirmHireId && allCands.find(c => c.id === confirmHireId) && (
        <ConfirmHireModal
          candidate={allCands.find(c => c.id === confirmHireId)}
          onConfirm={handleConfirmHire}
          onCancel={() => setConfirmHireId(null)}
          T={T}
        />
      )}

      {/* ── Request position modal ── */}
      {showRequestPos && (
        <RequestPositionModal
          T={T}
          onClose={() => setShowRequestPos(false)}
        />
      )}
    </div>
  )
}
