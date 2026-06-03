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

import { useState } from 'react'
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
    preCall:           'Pre-Call',
    interviews:        'INTERVIEWS',
    lastActivity:      'LAST ACTIVITY',
    pendingDecision:   'Pending review',
    interviewsOf:      (d, t) => `${d} of ${t}`,
    noScoreYet:        'No score yet',
    strongAdvance:     'Strong advance',
    averageFit:        'Average fit',
    notAdvancing:      'Not advancing',
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
    preCall:           'Pre-Colloquio',
    interviews:        'INTERVISTE',
    lastActivity:      'ULTIMA ATTIVITÀ',
    pendingDecision:   'In attesa',
    interviewsOf:      (d, t) => `${d} di ${t}`,
    noScoreYet:        'Nessun punteggio',
    strongAdvance:     'Forte avanzamento',
    averageFit:        'Idoneità media',
    notAdvancing:      'Non avanza',
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
    <span style={{ background: isDark ? 'rgba(27,36,97,0.55)' : 'rgba(27,36,97,0.09)', color: isDark ? 'white' : '#1B2461', fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 20, whiteSpace: 'nowrap', display: 'inline-block' }}>
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

// ── Candidate panel ───────────────────────────────────────────────────────────
function CandidatePanel({ candidate, decision, onDecide, onClose, onNavigate, T }) {
  return (
    <aside style={{ width: 340, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

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
            <button
              onClick={() => onNavigate?.('hiring-summary', { candidate })}
              style={{ padding: '8px 0', borderRadius: 9, background: C.white, color: C.inf, border: `1.5px solid ${C.border}`, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
            >
              {T.openBrief}
            </button>
          </div>
        )}
      </div>

      {/* Decision footer */}
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate?.('hm-cv-review')}
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
            <button onClick={() => onDecide(candidate.id, 'advancing')} style={{ padding: '10px 0', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.advanceBtn}
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
  )
}

// ── Archived section ──────────────────────────────────────────────────────────
function ArchivedSection({ candidates, onRestore, T }) {
  const [open, setOpen] = useState(false)
  if (!candidates.length) return null

  return (
    <div style={{ marginTop: 10, background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: 13, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block', color: C.muted }}>▶</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{T.archivedSection(candidates.length)}</span>
        <span style={{ fontSize: 11, color: C.muted, marginLeft: 'auto' }}>{T.archivedSaved}</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {candidates.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < candidates.length - 1 ? `1px solid ${C.border}` : 'none', opacity: 0.6 }}>
              <Av id={c.id} ini={c.ini} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{c.name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{c.role} · {c.stage}</div>
              </div>
              <span style={{ fontSize: 10, color: C.red, background: '#FEF2F2', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{T.archivedPill}</span>
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
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <style>{`@keyframes hmBannerIn{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

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

      {/* ── Top bar ── */}
      <header style={{ padding: '18px 28px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: 0 }}>
              Good morning, {HM.name} ☀️
            </h1>
            <span style={{ background: C.infBg, color: C.infT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
              {T.hiringManager}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
            {POSITIONS.map(p => p.title).join(' · ')} · {T.preSelected(allCands.length)}
          </p>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {advancing > 0 && (
            <span style={{ background: C.redBg, color: C.red, fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 20 }}>
              {T.advancing(advancing)}
            </span>
          )}
          {notMoving > 0 && (
            <span style={{ background: '#FEF2F2', color: C.red, fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 20 }}>
              {T.archived(notMoving)}
            </span>
          )}
        </div>
      </header>


      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Main ── */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Position tabs */}
          <div style={{ display: 'flex', gap: 0, background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
            {POSITIONS.map((p, i) => {
              const isActive = p.id === activePosId
              const cands    = PRE_SELECTED[p.id] || []
              return (
                <button
                  key={p.id}
                  onClick={() => { setActivePosId(p.id); setSelectedCandidate(null) }}
                  style={{
                    flex: 1, padding: '14px 20px', border: 'none',
                    background: isActive ? C.redBg : C.white,
                    borderRight: i < POSITIONS.length - 1 ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    borderBottom: isActive ? `3px solid ${C.red}` : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? C.red : C.text }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.dept} · {cands.length} pre-selected · Recruiter: {p.recruiter}</div>
                </button>
              )
            })}
          </div>

          {/* Filter + sort bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{T.preSelectedTitle}</h2>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
                {T.preSelectedSub(pos?.openSince)}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 11, color: C.text, background: C.white, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="score">{T.sortScore}</option>
              <option value="activity">{T.sortActivity}</option>
              <option value="name">{T.sortName}</option>
            </select>
          </div>

          {/* Candidate table */}
          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', flexShrink: 0 }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 1fr', padding: '10px 20px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
              {[T.colCandidate, T.colInterviews, T.colActions].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {sortedActive.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>
                {T.allReviewed}
              </div>
            )}

            {sortedActive.map((c, i) => {
              const dec  = decisions[c.id]
              const isSel = selectedCandidate?.id === c.id

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(isSel ? null : c)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 100px 1fr',
                    alignItems: 'center', padding: '13px 20px',
                    borderBottom: i < sortedActive.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: isSel ? C.redBg : C.white,
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                >
                  {/* Candidate */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Av id={c.id} ini={c.ini} size={36} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{c.role}</div>
                    </div>
                  </div>

                  {/* Interviews done */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: c.interviewsDone > 0 ? C.text : C.muted }}>
                    {c.interviewsDone}
                  </span>

                  {/* Actions */}
                  <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {dec ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DecisionPill dec={dec} T={T} />
                        <button onClick={() => decide(c.id, null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: C.muted, fontFamily: 'inherit' }}>{T.undo}</button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSuggestHire(c.id)}
                          style={{ padding: '5px 8px', borderRadius: 7, background: C.red, color: 'white', border: 'none', fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          {T.suggestHire}
                        </button>
                        <button
                          onClick={() => decide(c.id, 'request-round')}
                          style={{ padding: '5px 8px', borderRadius: 7, background: C.gray, color: C.muted, border: `1px solid ${C.border}`, fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          ↺ {T.requestRound}
                        </button>
                        <button
                          onClick={() => decide(c.id, 'not-moving-forward')}
                          style={{ padding: '5px 8px', borderRadius: 7, background: C.infBg, color: C.infT, border: 'none', fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                        >
                          {T.rejectBtn}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Archived section */}
          <ArchivedSection candidates={archived} onRestore={restore} T={T} />

          {/* Empty state if all decided */}
          {active.length === 0 && archived.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 6 }}>{T.noPreSelected}</div>
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

        {/* ── Candidate panel ── */}
        {selectedCandidate && (
          <CandidatePanel
            key={selectedCandidate.id}
            candidate={selectedCandidate}
            decision={decisions[selectedCandidate.id]}
            onDecide={decide}
            T={T}
            onClose={() => setSelectedCandidate(null)}
            onNavigate={onNavigate}
          />
        )}
      </div>

      {/* ── Confirm hire modal ── */}
      {confirmHireId && allCands.find(c => c.id === confirmHireId) && (
        <ConfirmHireModal
          candidate={allCands.find(c => c.id === confirmHireId)}
          onConfirm={handleConfirmHire}
          onCancel={() => setConfirmHireId(null)}
          T={T}
        />
      )}
    </div>
  )
}
