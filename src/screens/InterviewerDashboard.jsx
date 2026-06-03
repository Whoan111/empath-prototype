// ─────────────────────────────────────────────────────────────────────────────
// InterviewerDashboard.jsx  — Interviewer role · Alessandro S.
//
//  section='home'    → grid of candidates you've interviewed + outcome status
//                      "View profile" opens a right-panel inline (no page nav)
//  section='debrief' → pending & submitted interview-summary work
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    badge:              'Interviewer',
    greeting:           (n) => `Good morning, ${n}`,
    interviewsDone:     (n) => `${n} interview${n !== 1 ? 's' : ''} done`,
    allDebriefsDone:    'All debriefs up to date',
    debriefPending:     (n) => `${n} debrief${n !== 1 ? 's' : ''} pending`,
    myInterviews:       'My Interviews',
    debriefPageTitle:   'Interview Debriefs',
    debriefPageSub:     'Pending and submitted interview debriefs',
    pendingSection:     'Pending',
    submittedSection:   'Submitted',
    allDoneTitle:       'All debriefs submitted ✓',
    allDoneSub:         "You're up to date — no pending debriefs.",
    pendingBannerTitle: 'Debrief needed',
    pendingDesc:        (n) => `You haven't submitted your debrief for ${n} yet.`,
    fillDebrief:        'Fill debrief →',
    viewSummaries:      'View debriefs →',
    viewProfile:        'View profile',
    round:              (n) => `Round ${n}`,
    debriefDone:        '✓ Submitted',
    debriefNeeded:      '📝 Pending',
    outcome: {
      advancing:    '✓ Advancing',
      offer:        '🎉 Offer',
      notAdvancing: '✕ Not advancing',
      pending:      '⏳ Pending decision',
      debrief:      '📝 Debrief needed',
    },
    backToHome:         '← My Interviews',
    backToDebrief:      '← Interview Debriefs',
    interviewHistory:   'Interview history',
    roundCount:         (n) => `${n} round${n !== 1 ? 's' : ''}`,
    youLabel:           'You',
    noFeedbackYet:      'Debrief not submitted yet',
    noFeedbackFill:     'Fill the form to share your feedback on this candidate.',
    contact:            'Contact',
    currentStage:       'Current stage',
    yourContribution:   'Your contribution',
    advancingCount:     (n) => `${n} advancing`,
    rejectedOn:         (d) => `Closed · ${d}`,
    yourRoundLabel:     (type, date) => `${type} · ${date}`,
    fitLabel:           'Your fit assessment',
    closedBanner:       (d) => `This candidate was not selected · Process closed ${d}`,
    // Outcome notifications
    updatesTitle:       '📬 Updates on your candidates',
    dismiss:            'Dismiss',
    newTag:             'New',
    newOutcomeMsg:      (name, outcome) => `${name} — ${outcome}`,
    closePanel:         '×',
  },
  it: {
    badge:              'Intervistatore',
    greeting:           (n) => `Buongiorno, ${n}`,
    interviewsDone:     (n) => `${n} colloquio${n !== 1 ? 'i' : ''} svolto${n !== 1 ? 'i' : ''}`,
    allDebriefsDone:    'Tutti i debrief aggiornati',
    debriefPending:     (n) => `${n} debrief in attesa`,
    myInterviews:       'I Miei Colloqui',
    debriefPageTitle:   'Debrief Colloqui',
    debriefPageSub:     'Debrief in attesa e inviati',
    pendingSection:     'In Attesa',
    submittedSection:   'Inviati',
    allDoneTitle:       'Tutti i debrief inviati ✓',
    allDoneSub:         'Sei aggiornato — nessun debrief in sospeso.',
    pendingBannerTitle: 'Debrief necessario',
    pendingDesc:        (n) => `Non hai ancora inviato il tuo debrief per ${n}.`,
    fillDebrief:        'Compila debrief →',
    viewSummaries:      'Vedi debrief →',
    viewProfile:        'Vedi profilo',
    round:              (n) => `Round ${n}`,
    debriefDone:        '✓ Inviato',
    debriefNeeded:      '📝 In attesa',
    outcome: {
      advancing:    '✓ Avanza',
      offer:        '🎉 Offerta',
      notAdvancing: '✕ Non avanza',
      pending:      '⏳ Decisione in attesa',
      debrief:      '📝 Debrief necessario',
    },
    backToHome:         '← I Miei Colloqui',
    backToDebrief:      '← Debrief Colloqui',
    interviewHistory:   'Storico colloqui',
    roundCount:         (n) => `${n} round`,
    youLabel:           'Tu',
    noFeedbackYet:      'Debrief non ancora inviato',
    noFeedbackFill:     'Compila il modulo per condividere il tuo feedback su questo candidato.',
    contact:            'Contatto',
    currentStage:       'Fase attuale',
    yourContribution:   'Il tuo contributo',
    advancingCount:     (n) => `${n} avanzano`,
    rejectedOn:         (d) => `Chiuso · ${d}`,
    yourRoundLabel:     (type, date) => `${type} · ${date}`,
    fitLabel:           'La tua valutazione',
    closedBanner:       (d) => `Candidato non selezionato · Processo chiuso ${d}`,
    updatesTitle:       '📬 Aggiornamenti sui tuoi candidati',
    dismiss:            'Chiudi',
    newTag:             'Nuovo',
    newOutcomeMsg:      (name, outcome) => `${name} — ${outcome}`,
    closePanel:         '×',
  },
}

// ── Design tokens ─────────────────────────────────────────────────────────────

// ── Interviewer identity ──────────────────────────────────────────────────────
const INTERVIEWER = { name: 'Alessandro S.', ini: 'AL', role: 'Senior UX Designer' }

// ── Mock data ─────────────────────────────────────────────────────────────────
const MY_CANDIDATES = [
  {
    id: 1, name: 'Giulia Rossi', ini: 'GR',
    role: 'UX Designer', exp: '4 yrs', loc: 'Milan, Italy',
    email: 'giulia.rossi@gmail.com', phone: '+39 333 456 7890',
    edu: 'Politecnico di Milano · MSc Design',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    portfolio: 'giuliarossi.com', linkedin: 'linkedin.com/in/giuliarossi',
    file: 'GiuliaRossi_CV.pdf', pages: 2,
    position: 'UX Designer', dept: 'Product Design',
    myRound: 2, myType: 'Technical Deep-Dive', myDate: 'May 17', myFit: 'advance',
    debriefDone: true,
    outcome: 'notAdvancing',
    newOutcome: true,        // ← new: Alessandro hasn't seen this result yet
    currentStage: 'Closed',
    rejectedDate: 'May 24',
    allFeedback: [
      {
        round: 1, type: 'Portfolio Review',
        by: 'Andrea P.', byRole: 'Hiring Manager', date: 'May 14', fit: 'strongly-advance', isMine: false,
        txt: 'Strong portfolio and excellent communication. Clear learning drive despite some design-systems gaps. I would be comfortable having her on the team.',
        strengths: ['Portfolio depth', 'Communication', 'Growth mindset'],
        concerns: ['Design systems experience'],
      },
      {
        round: 2, type: 'Technical Deep-Dive',
        by: 'Alessandro S.', byRole: 'Senior UX Designer', date: 'May 17', fit: 'advance', isMine: true,
        txt: 'Enthusiastic and highly collaborative. Cultural fit is strong. Could sharpen complex problem-solving under pressure — gave surface-level answers on two edge cases.',
        strengths: ['Cultural fit', 'Collaboration'],
        concerns: ['Problem-solving under pressure'],
      },
    ],
  },
  {
    id: 7, name: 'Chiara Lombardi', ini: 'CL',
    role: 'UX Researcher', exp: '6 yrs', loc: 'Milan, Italy',
    email: 'chiara.lombardi@gmail.com', phone: '+39 339 234 5678',
    edu: 'Università Cattolica · MA Psychology',
    skills: ['Mixed Methods', 'Usability Testing', 'Survey Design', 'Data Analysis', 'Facilitation'],
    portfolio: null, linkedin: 'linkedin.com/in/chiaralombardi',
    file: 'ChiaraLombardi_CV.pdf', pages: 2,
    position: 'UX Designer', dept: 'Product Design',
    myRound: 1, myType: 'Research Deep-Dive', myDate: 'May 6', myFit: 'strongly-advance',
    debriefDone: true,
    outcome: 'advancing',
    newOutcome: true,        // ← new: advancing now confirmed
    currentStage: 'Decision',
    allFeedback: [
      {
        round: 1, type: 'Research Deep-Dive',
        by: 'Alessandro S.', byRole: 'Senior UX Designer', date: 'May 6', fit: 'strongly-advance', isMine: true,
        txt: 'Outstanding. Research depth is rare at this level. She thinks in systems and articulates complexity with genuine clarity. Strong recommend.',
        strengths: ['Research depth', 'Systems thinking', 'Communication'],
        concerns: [],
      },
      {
        round: 2, type: 'Values & Team Fit',
        by: 'Andrea P.', byRole: 'Design Director', date: 'May 10', fit: 'strongly-advance', isMine: false,
        txt: 'Strong recommend. She asks exactly the right questions. The team would grow with her around.',
        strengths: ['Values alignment', 'Intellectual curiosity'],
        concerns: [],
      },
    ],
  },
  {
    id: 11, name: 'Nina Patel', ini: 'NP',
    role: 'Frontend Dev', exp: '3 yrs', loc: 'Berlin, Germany',
    email: 'nina.patel@gmail.com', phone: '+49 176 1234 5678',
    edu: 'TU Berlin · MSc Informatics',
    skills: ['Vue.js', 'React', 'CSS', 'Accessibility', 'Performance'],
    portfolio: 'ninapatel.dev', linkedin: 'linkedin.com/in/ninapatel',
    file: 'NinaPatel_CV.pdf', pages: 1,
    position: 'Frontend Engineer', dept: 'Engineering',
    myRound: 1, myType: 'Technical Assessment', myDate: 'May 22', myFit: null,
    debriefDone: false,
    outcome: 'debrief',
    newOutcome: false,
    currentStage: 'Interviews',
    allFeedback: [],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
]
function Av({ id, ini, size = 36, muted = false }) {
  const [bg, color] = AV_PALETTE[(id - 1) % AV_PALETTE.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: muted ? '#EAE7E4' : bg, color: muted ? '#9CA3AF' : color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600, opacity: muted ? 0.85 : 1 }}>
      {ini}
    </div>
  )
}

function FitPill({ fit }) {
  if (!fit) return <span style={{ fontSize: 10, color: C.muted }}>—</span>
  if (fit === 'strongly-advance') return <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>★ Strong advance</span>
  if (fit === 'advance') return <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>◎ Average fit</span>
  return <span style={{ background: '#FEE2E2', color: '#C9394A', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✕ Not advancing</span>
}

function OutcomePill({ outcome, T }) {
  const map = {
    advancing:    { bg: C.sucBg,   color: C.sucT,  border: C.sucBorder, label: T.outcome.advancing    },
    offer:        { bg: C.redBg,   color: C.red,   border: C.redL,      label: T.outcome.offer        },
    notAdvancing: { bg: '#F3F4F6', color: '#6B7280',border: '#E5E7EB',  label: T.outcome.notAdvancing },
    pending:      { bg: C.warBg,   color: C.warT,  border: C.warBorder, label: T.outcome.pending      },
    debrief:      { bg: '#FEF2F2', color: C.red,   border: C.redL,      label: T.outcome.debrief      },
  }
  const o = map[outcome] || map.pending
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: o.color, background: o.bg, border: `1px solid ${o.border}`, padding: '4px 11px', borderRadius: 20, whiteSpace: 'nowrap' }}>
      {o.label}
    </span>
  )
}

// ── CV document mockup ────────────────────────────────────────────────────────
function CVDocumentMockup({ cv }) {
  const Line = ({ w = '100%', h = 7, mb = 5 }) => (
    <div style={{ width: w, height: h, background: '#E8E4E0', borderRadius: 2, marginBottom: mb }} />
  )
  const Sec = ({ children }) => (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 10, marginTop: 18, paddingBottom: 5, borderBottom: '1px solid #E8E4E0' }}>
      {children}
    </div>
  )
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1C1917' }}>
      <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>{cv.name}</div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{cv.role}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 9, color: '#888' }}>
          {cv.email    && <span>✉ {cv.email}</span>}
          {cv.phone    && <span>📞 {cv.phone}</span>}
          {cv.loc      && <span>📍 {cv.loc}</span>}
          {cv.linkedin && <span>💼 {cv.linkedin}</span>}
          {cv.portfolio && <span>🎨 {cv.portfolio}</span>}
        </div>
      </div>
      <Sec>Professional Experience</Sec>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{cv.role}</span>
          <span style={{ fontSize: 9, color: '#888' }}>2022 – Present</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>TechCorp · {cv.loc}</div>
        <Line w="91%" /><Line w="84%" /><Line w="78%" /><Line w="88%" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Previous Role</span>
          <span style={{ fontSize: 9, color: '#888' }}>2020 – 2022</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>DesignStudio · {cv.loc?.split(',')[1]?.trim() || 'Europe'}</div>
        <Line w="87%" /><Line w="72%" />
      </div>
      <Sec>Education</Sec>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{cv.edu?.split('·')[1]?.trim()}</div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 5 }}>{cv.edu?.split('·')[0]?.trim()} · 2016–2020</div>
        <Line w="55%" />
      </div>
      <Sec>Skills</Sec>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {cv.skills?.map(s => (
          <span key={s} style={{ background: '#F5F2EF', border: '1px solid #E0DDD9', borderRadius: 3, padding: '2px 8px', fontSize: 9, color: '#555' }}>{s}</span>
        ))}
      </div>
      <Sec>Projects & Highlights</Sec>
      <Line w="94%" /><Line w="88%" /><Line w="76%" /><Line w="82%" /><Line w="68%" />
      <div style={{ marginTop: 10 }} />
      <Line w="90%" /><Line w="83%" />
    </div>
  )
}

// ── Document viewer ───────────────────────────────────────────────────────────
function DocumentViewer({ cv }) {
  const [zoom, setZoom] = useState(1)
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.gray }}>
      <div style={{ padding: '10px 16px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ background: C.infBg, color: C.infT, fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 20 }}>📄 CV</span>
        <span style={{ fontSize: 11, color: C.muted }}>{cv.file}</span>
        <span style={{ fontSize: 10, color: C.muted }}>· {cv.pages} page{cv.pages !== 1 ? 's' : ''}</span>
        {cv.portfolio && (
          <a href={`https://${cv.portfolio}`} target="_blank" rel="noreferrer"
            style={{ marginLeft: 'auto', fontSize: 10, color: C.purp, textDecoration: 'none', background: C.purpBg, border: `1px solid ${C.purpL}`, padding: '3px 10px', borderRadius: 7, fontWeight: 600 }}>
            🎨 {cv.portfolio} ↗
          </a>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', width: `${Math.min(100, 72 * zoom)}%`, minHeight: '100%', padding: '44px 50px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', borderRadius: 2, boxSizing: 'border-box' }}>
          <CVDocumentMockup cv={cv} />
        </div>
      </div>
      <div style={{ padding: '7px 16px', background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontSize: 11, color: C.muted, width: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        <span style={{ width: 1, height: 14, background: C.border }} />
        <button onClick={() => setZoom(1)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
      </div>
    </div>
  )
}

// ── Interview-history timeline ────────────────────────────────────────────────
const ROUND_COLORS = [
  [C.infBg,  C.inf ],
  [C.purpBg, C.purp],
  [C.sucBg,  C.suc ],
  [C.warBg,  C.war ],
]

function InterviewTimeline({ candidate, onFillDebrief, T }) {
  const rounds = candidate.allFeedback
  if (rounds.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 12px', background: C.gray, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 26, marginBottom: 8 }}>📋</div>
        <p style={{ fontSize: 12, fontWeight: 600, color: C.text, margin: '0 0 3px' }}>{T.noFeedbackYet}</p>
        <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: '0 0 14px' }}>{T.noFeedbackFill}</p>
        <button
          onClick={onFillDebrief}
          style={{ padding: '8px 20px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {T.fillDebrief}
        </button>
      </div>
    )
  }
  return (
    <div style={{ position: 'relative' }}>
      {rounds.length > 1 && (
        <div style={{ position: 'absolute', left: 13, top: 28, width: 2, bottom: 28, background: C.border, zIndex: 0 }} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rounds.map((f, i) => {
          const [rcBg, rcCol] = ROUND_COLORS[i % ROUND_COLORS.length]
          const isMe = f.isMine
          return (
            <div key={i} style={{ display: 'flex', gap: 11, position: 'relative', zIndex: 1 }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isMe ? C.red : rcCol, color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isMe ? `0 0 0 3px ${C.redBg}` : `0 0 0 3px ${rcBg}` }}>
                  {f.round}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ background: isMe ? C.redBg : C.gray, border: `1px solid ${isMe ? C.redL : C.border}`, borderRadius: 10, padding: '11px 13px', position: 'relative' }}>
                  {isMe && (
                    <span style={{ position: 'absolute', top: 9, right: 10, fontSize: 9, fontWeight: 700, color: C.red, background: C.white, border: `1px solid ${C.redL}`, padding: '2px 8px', borderRadius: 20 }}>
                      {T.youLabel}
                    </span>
                  )}
                  <div style={{ fontSize: 10, fontWeight: 700, color: isMe ? C.red : rcCol, marginBottom: 7, paddingRight: isMe ? 48 : 0 }}>
                    {f.type} · {f.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: isMe ? C.redBg : rcBg, color: isMe ? C.red : rcCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
                      {f.by.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{f.by}</div>
                      <div style={{ fontSize: 9, color: C.muted }}>{f.byRole}</div>
                    </div>
                    <FitPill fit={f.fit} />
                  </div>
                  <p style={{ fontSize: 11, color: C.text, lineHeight: 1.65, margin: '0 0 8px' }}>{f.txt}</p>
                  {(f.strengths?.length > 0 || f.concerns?.length > 0) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {f.strengths?.map(s => (
                        <span key={s} style={{ fontSize: 9, fontWeight: 600, color: C.sucT, background: C.sucBg, padding: '2px 7px', borderRadius: 20 }}>{s}</span>
                      ))}
                      {f.concerns?.map(s => (
                        <span key={s} style={{ fontSize: 9, fontWeight: 600, color: C.warT, background: C.warBg, padding: '2px 7px', borderRadius: 20 }}>△ {s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Right panel — shown inline on home view ───────────────────────────────────
function CandidateProfilePanel({ candidate, onClose, onNavigate, T }) {
  const isRejected = candidate.outcome === 'notAdvancing'
  const myFeedback = candidate.allFeedback.find(f => f.isMine)

  return (
    <aside style={{ width: 360, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

      {/* ── Header ── */}
      <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            <Av id={candidate.id} ini={candidate.ini} size={42} muted={isRejected} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: isRejected ? C.muted : C.text }}>{candidate.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.role} · {candidate.exp}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{candidate.loc}</div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: '0 0 0 8px', flexShrink: 0, alignSelf: 'flex-start' }}
            >
              {T.closePanel}
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <OutcomePill outcome={candidate.outcome} T={T} />
          {isRejected && (
            <span style={{ fontSize: 10, color: '#9CA3AF', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '3px 9px', borderRadius: 20 }}>
              {T.rejectedOn(candidate.rejectedDate)}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Interview history */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{T.interviewHistory}</div>
            {candidate.allFeedback.length > 0 && (
              <span style={{ fontSize: 10, color: C.muted, background: C.gray, padding: '2px 9px', borderRadius: 20, border: `1px solid ${C.border}` }}>
                {T.roundCount(candidate.allFeedback.length)}
              </span>
            )}
          </div>
          {isRejected && (
            <div style={{ padding: '9px 13px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>📁</span>
              <span style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{T.closedBanner(candidate.rejectedDate)}</span>
            </div>
          )}
          <InterviewTimeline
            candidate={candidate}
            onFillDebrief={() => onNavigate?.('questionnaire', { candidate })}
            T={T}
          />
        </div>

        {/* Your contribution */}
        {myFeedback && (
          <div style={{ padding: '12px 14px', background: C.navyBg, borderRadius: 10, border: `1px solid ${C.navyB}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
              {T.yourContribution}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{T.yourRoundLabel(candidate.myType, candidate.myDate)}</span>
              {candidate.myFit && <FitPill fit={candidate.myFit} />}
            </div>
          </div>
        )}

        <div style={{ height: 1, background: C.border }} />

        {/* Stage */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{T.currentStage}</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: isRejected ? '#9CA3AF' : C.text }}>{candidate.currentStage}</div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{T.contact}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {candidate.email && (
              <span style={{ fontSize: 11, color: C.text, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: C.muted }}>✉</span> {candidate.email}
              </span>
            )}
            {candidate.linkedin && (
              <span style={{ fontSize: 11, color: C.infT, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span>💼</span> {candidate.linkedin}
              </span>
            )}
          </div>
        </div>

      </div>
    </aside>
  )
}

// ── Candidate card (home view) — whole card is clickable ─────────────────────
function CandidateCard({ candidate, onViewProfile, isSelected, T }) {
  const [hov, setHov] = useState(false)
  const isRejected = candidate.outcome === 'notAdvancing'

  const topBorderColor = isRejected ? '#D1D5DB'
    : candidate.outcome === 'advancing' ? C.suc
    : candidate.outcome === 'debrief' ? C.red
    : C.border

  return (
    <div
      onClick={onViewProfile}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isSelected ? C.redBg : isRejected ? '#FAFAF9' : (hov ? '#FFFAFA' : C.white),
        border: `1.5px solid ${isSelected ? C.redL : hov && !isRejected ? C.redL : C.border}`,
        borderTop: `3px solid ${topBorderColor}`,
        borderRadius: '0.75rem',
        padding: 20,
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isSelected
          ? `0 0 0 2px ${C.redL}, 0 4px 20px rgba(201,57,74,0.08)`
          : hov && !isRejected ? '0 4px 20px rgba(0,0,0,0.07)' : '0 1px 4px rgba(0,0,0,0.04)',
        opacity: isRejected ? 0.88 : 1,
      }}
    >
      {/* Identity */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Av id={candidate.id} ini={candidate.ini} size={44} muted={isRejected} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: isRejected ? C.muted : C.text }}>{candidate.name}</span>
            {candidate.newOutcome && (
              <span style={{ fontSize: 9, fontWeight: 700, color: C.white, background: C.red, padding: '2px 7px', borderRadius: 20, flexShrink: 0 }}>
                {T.newTag}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{candidate.position} · {candidate.dept}</div>
        </div>
        {/* Selected indicator */}
        {isSelected && (
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>✓</span>
          </div>
        )}
      </div>

      {/* Interview info */}
      <div style={{ padding: '9px 12px', background: isSelected ? C.white : C.gray, borderRadius: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
          {T.round(candidate.myRound)} · {candidate.myType}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: C.muted }}>{candidate.myDate}</span>
          <FitPill fit={candidate.myFit} />
        </div>
      </div>

      {/* Outcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 5 }}>
        <OutcomePill outcome={candidate.outcome} T={T} />
        {isRejected && candidate.rejectedDate && (
          <span style={{ fontSize: 10, color: '#9CA3AF' }}>{T.rejectedOn(candidate.rejectedDate)}</span>
        )}
      </div>
    </div>
  )
}

// ── Interview Summaries section view ──────────────────────────────────────────
function SummaryView({ onViewProfile, onNavigate, T }) {
  const pending   = MY_CANDIDATES.filter(c => !c.debriefDone)
  const submitted = MY_CANDIDATES.filter(c => c.debriefDone)

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.gray }}>
      <header style={{ padding: '22px 32px 20px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: 0 }}>
            {T.debriefPageTitle}
          </h1>
          <span style={{ background: C.navyBg, color: C.navy, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.navyB}` }}>
            {T.badge}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{T.debriefPageSub}</p>
      </header>

      <div style={{ padding: '28px 32px 52px', maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Pending ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {pending.length > 0 && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, boxShadow: '0 0 6px rgba(201,57,74,0.45)', flexShrink: 0 }} />
            )}
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{T.pendingSection}</h2>
            {pending.length > 0 && (
              <span style={{ background: '#FEF2F2', color: C.red, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${C.redL}` }}>
                {pending.length}
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <div style={{ padding: '16px 20px', background: C.sucBg, borderRadius: 12, border: `1px solid ${C.sucBorder}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.sucT }}>{T.allDoneTitle}</div>
                <div style={{ fontSize: 11, color: C.sucT }}>{T.allDoneSub}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(c => (
                <div key={c.id} style={{ padding: '16px 20px', background: C.white, borderRadius: 12, border: `1.5px solid ${C.redL}`, borderLeft: `4px solid ${C.red}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Av id={c.id} ini={c.ini} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c.role} · {c.position}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>
                      {T.round(c.myRound)} · {c.myType} · {c.myDate}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => onViewProfile(c)}
                      style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                    >
                      {T.viewProfile}
                    </button>
                    <button
                      onClick={() => onNavigate?.('questionnaire', { candidate: c })}
                      style={{ padding: '7px 18px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {T.fillDebrief}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Submitted ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{T.submittedSection}</h2>
            <span style={{ background: C.sucBg, color: C.sucT, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${C.sucBorder}` }}>
              {submitted.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submitted.map(c => {
              const myF = c.allFeedback.find(f => f.isMine)
              const isRejected = c.outcome === 'notAdvancing'
              return (
                <div key={c.id} style={{ padding: '14px 18px', background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: isRejected ? 0.85 : 1 }}>
                  <Av id={c.id} ini={c.ini} size={38} muted={isRejected} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isRejected ? C.muted : C.text }}>{c.name}</span>
                      <OutcomePill outcome={c.outcome} T={T} />
                      {isRejected && <span style={{ fontSize: 10, color: '#9CA3AF' }}>{T.rejectedOn(c.rejectedDate)}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
                      {T.round(myF?.round || c.myRound)} · {myF?.type || c.myType} · {myF?.date || c.myDate}
                    </div>
                    {myF && (
                      <>
                        <FitPill fit={myF.fit} />
                        <p style={{ fontSize: 11, color: C.text, lineHeight: 1.6, margin: '5px 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {myF.txt}
                        </p>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => onViewProfile(c)}
                    style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, flexShrink: 0, alignSelf: 'flex-start', transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
                  >
                    {T.viewProfile}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export default function InterviewerDashboard({ lang = 'en', theme, section = 'home', onBack, onNavigate }) {
  C = buildC(theme)

  const T = SCREEN_T[lang] || SCREEN_T.en

  // Full CV profile view (used from Summary section)
  const [view,     setView]     = useState('list')
  const [selected, setSelected] = useState(null)

  // Inline right-panel for home view
  const [panelCandidate,  setPanelCandidate]  = useState(null)
  const [notifDismissed,  setNotifDismissed]  = useState(false)
  const [activeOpen,      setActiveOpen]      = useState(true)
  const [pastOpen,        setPastOpen]        = useState(true)

  const openProfile  = (c) => { setSelected(c); setView('profile') }
  const closeProfile = () => { setSelected(null); setView('list') }

  const openPanel  = (c) => setPanelCandidate(prev => prev?.id === c.id ? null : c)
  const closePanel = () => setPanelCandidate(null)

  const pendingDebriefs = MY_CANDIDATES.filter(c => !c.debriefDone)
  const advancingCount  = MY_CANDIDATES.filter(c => c.outcome === 'advancing').length
  const newOutcomeCandidates = MY_CANDIDATES.filter(c => c.newOutcome)

  // ── FULL PROFILE VIEW (accessed from Summary section) ────────────────────
  if (view === 'profile' && selected) {
    const backLabel = section === 'debrief' ? T.backToDebrief : T.backToHome
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <header style={{ padding: '12px 22px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button
            onClick={closeProfile}
            style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {backLabel}
          </button>
          <div style={{ width: 1, height: 18, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Av id={selected.id} ini={selected.ini} size={28} muted={selected.outcome === 'notAdvancing'} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{selected.role} · {selected.position}</div>
            </div>
          </div>
          <OutcomePill outcome={selected.outcome} T={T} />
          {!selected.debriefDone && (
            <button
              onClick={() => onNavigate?.('questionnaire', { candidate: selected })}
              style={{ padding: '7px 16px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              {T.fillDebrief}
            </button>
          )}
        </header>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DocumentViewer cv={selected} />
          <CandidateProfilePanel candidate={selected} onNavigate={onNavigate} T={T} />
        </div>
      </div>
    )
  }

  // ── SUMMARY SECTION ──────────────────────────────────────────────────────
  if (section === 'debrief') {
    return <SummaryView onViewProfile={openProfile} onNavigate={onNavigate} T={T} />
  }

  // ── HOME VIEW (My Interviews) ─────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Scrollable main content */}
      <div style={{ flex: 1, overflow: 'auto', background: C.gray }}>

        {/* Header */}
        <header style={{ padding: '22px 32px 20px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: 0 }}>
                  {T.greeting(INTERVIEWER.name)} 👋
                </h1>
                <span style={{ background: C.navyBg, color: C.navy, fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.navyB}` }}>
                  {T.badge}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: C.muted }}>
                {T.interviewsDone(MY_CANDIDATES.length)} ·{' '}
                {pendingDebriefs.length > 0 ? T.debriefPending(pendingDebriefs.length) : T.allDebriefsDone}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {advancingCount > 0 && (
                <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20 }}>
                  ✓ {T.advancingCount(advancingCount)}
                </span>
              )}
              {pendingDebriefs.length > 0 && (
                <span style={{ background: '#FEF2F2', color: C.red, fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20 }}>
                  📝 {pendingDebriefs.length} pending
                </span>
              )}
            </div>
          </div>
        </header>

        <div style={{ padding: '28px 32px 52px', maxWidth: panelCandidate ? 760 : 980, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── New outcome notification banner ── */}
          {!notifDismissed && newOutcomeCandidates.length > 0 && (
            <div style={{ padding: '14px 20px', background: C.infBg, borderRadius: 12, border: `1px solid #BFDBFE`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>📬</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.infT, marginBottom: 7 }}>{T.updatesTitle}</div>
                {newOutcomeCandidates.map(c => (
                  <div key={c.id} style={{ fontSize: 12, color: C.infT, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10 }}>→</span>
                    {T.newOutcomeMsg(c.name, T.outcome[c.outcome])}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setNotifDismissed(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.infT, fontSize: 12, fontFamily: 'inherit', fontWeight: 600, flexShrink: 0, padding: '0 0 0 8px' }}
              >
                {T.dismiss} ×
              </button>
            </div>
          )}

          {/* ── My Interviews section title ── */}
          <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: 0, letterSpacing: '-0.01em' }}>
            {T.myInterviews}
          </h2>

          {/* ── Active processes ── */}
          {(() => {
            const active = MY_CANDIDATES.filter(c => c.outcome !== 'notAdvancing')
            const cols = panelCandidate ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
            return (
              <div>
                <button
                  onClick={() => setActiveOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: activeOpen ? 14 : 0 }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: activeOpen ? C.suc : 'transparent', border: `2px solid ${activeOpen ? C.suc : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: activeOpen ? 'white' : C.muted, fontWeight: 700, lineHeight: 1 }}>{activeOpen ? '−' : '+'}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Active processes</span>
                  <span style={{ fontSize: 11, color: C.muted, background: C.sucBg, padding: '2px 8px', borderRadius: 20, color: C.sucT, fontWeight: 600 }}>{active.length}</span>
                </button>
                {activeOpen && (
                  <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
                    {active.map(c => (
                      <CandidateCard key={c.id} candidate={c} onViewProfile={() => openPanel(c)} isSelected={panelCandidate?.id === c.id} T={T} />
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* ── Past processes ── */}
          {(() => {
            const past = MY_CANDIDATES.filter(c => c.outcome === 'notAdvancing')
            if (!past.length) return null
            const cols = panelCandidate ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
            return (
              <div>
                <button
                  onClick={() => setPastOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: pastOpen ? 14 : 0 }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: pastOpen ? C.muted : 'transparent', border: `2px solid ${pastOpen ? C.muted : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: pastOpen ? 'white' : C.muted, fontWeight: 700, lineHeight: 1 }}>{pastOpen ? '−' : '+'}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Past processes</span>
                  <span style={{ fontSize: 11, fontWeight: 600, background: C.gray, color: C.muted, padding: '2px 8px', borderRadius: 20 }}>{past.length}</span>
                </button>
                {pastOpen && (
                  <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
                    {past.map(c => (
                      <CandidateCard key={c.id} candidate={c} onViewProfile={() => openPanel(c)} isSelected={panelCandidate?.id === c.id} T={T} />
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

        </div>
      </div>

      {/* ── Inline right panel ── */}
      {panelCandidate && (
        <CandidateProfilePanel
          key={panelCandidate.id}
          candidate={panelCandidate}
          onClose={closePanel}
          onNavigate={onNavigate}
          T={T}
        />
      )}

    </div>
  )
}
