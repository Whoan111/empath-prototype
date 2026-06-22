// ─────────────────────────────────────────────────────────────────────────────
// InterviewerDashboard.jsx  — Interviewer role · Alessandro S.
//
//  Left sidebar: Dashboard | Interview Debriefs
//  Dashboard sections: Current (pending debrief) | Upcoming | Done
//  Clicking Current opens CV + inline debrief split view
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    badge:              'Interviewer',
    greeting:           (n) => `Good morning, ${n}`,
    interviewsDone:     (n) => `${n} interview${n !== 1 ? 's' : ''} done`,
    allDebriefsDone:    'All debriefs up to date',
    debriefPending:     (n) => `${n} debrief${n !== 1 ? 's' : ''} pending`,
    upcoming:           (n) => `${n} upcoming`,
    currentSection:     'Current',
    upcomingSection:    'Upcoming',
    doneSection:        'Done',
    noCurrentSub:       'Interviews waiting for debrief will appear here.',
    noUpcomingSub:      'Scheduled interviews will appear here.',
    noDoneSub:          'Submitted debriefs will appear here.',
    debriefCTA:         'Complete this after your interview',
    startDebrief:       'Start interview →',
    reminderSet:        'Reminder set',
    setReminder:        'Set reminder',
    debriefPageTitle:   'Interview Debriefs',
    debriefPageSub:     'Pending and submitted interview debriefs',
    pendingSection:     'Pending',
    submittedSection:   'Submitted',
    allDoneTitle:       'All debriefs submitted ✓',
    allDoneSub:         "You're up to date — no pending debriefs.",
    fillDebrief:        'Fill debrief →',
    viewProfile:        'View details →',
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
    backToDebrief:      '← Interview Debriefs',
    youLabel:           'You',
    noFeedbackYet:      'Debrief not submitted yet',
    noFeedbackFill:     'Fill the form to share your feedback on this candidate.',
    rejectedOn:         (d) => `Closed · ${d}`,
    updatesTitle:       'Updates on your candidates',
    dismiss:            'Dismiss',
    newOutcomeMsg:      (name, outcome) => `${name} — ${outcome}`,
  },
  it: {
    badge:              'Intervistatore',
    greeting:           (n) => `Buongiorno, ${n}`,
    interviewsDone:     (n) => `${n} colloquio${n !== 1 ? 'i' : ''} svolto${n !== 1 ? 'i' : ''}`,
    allDebriefsDone:    'Tutti i debrief aggiornati',
    debriefPending:     (n) => `${n} debrief in attesa`,
    upcoming:           (n) => `${n} in programma`,
    currentSection:     'In corso',
    upcomingSection:    'In programma',
    doneSection:        'Completati',
    noCurrentSub:       'I colloqui in attesa di debrief appariranno qui.',
    noUpcomingSub:      'I colloqui programmati appariranno qui.',
    noDoneSub:          'I debrief inviati appariranno qui.',
    debriefCTA:         'Completare dopo il colloquio',
    startDebrief:       'Inizia debrief →',
    reminderSet:        'Promemoria impostato',
    setReminder:        'Imposta promemoria',
    debriefPageTitle:   'Debrief Colloqui',
    debriefPageSub:     'Debrief in attesa e inviati',
    pendingSection:     'In Attesa',
    submittedSection:   'Inviati',
    allDoneTitle:       'Tutti i debrief inviati ✓',
    allDoneSub:         'Sei aggiornato — nessun debrief in sospeso.',
    fillDebrief:        'Compila debrief →',
    viewProfile:        'Vedi dettagli →',
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
    backToDebrief:      '← Debrief Colloqui',
    youLabel:           'Tu',
    noFeedbackYet:      'Debrief non ancora inviato',
    noFeedbackFill:     'Compila il modulo per condividere il tuo feedback.',
    rejectedOn:         (d) => `Chiuso · ${d}`,
    updatesTitle:       'Aggiornamenti sui tuoi candidati',
    dismiss:            'Chiudi',
    newOutcomeMsg:      (name, outcome) => `${name} — ${outcome}`,
  },
}

// ── Identity & mock data ──────────────────────────────────────────────────────
const INTERVIEWER = { name: 'Alessandro S.', ini: 'AL', role: 'Senior UX Designer' }

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
    currentStage: 'Closed', rejectedDate: 'May 24',
    allFeedback: [
      { round: 1, type: 'Portfolio Review', by: 'Andrea P.', byRole: 'Hiring Manager', date: 'May 14', fit: 'strongly-advance', isMine: false, txt: 'Strong portfolio and excellent communication. Clear learning drive despite some design-systems gaps.', strengths: ['Portfolio depth', 'Communication', 'Growth mindset'], concerns: ['Design systems experience'] },
      { round: 2, type: 'Technical Deep-Dive', by: 'Alessandro S.', byRole: 'Senior UX Designer', date: 'May 17', fit: 'advance', isMine: true, txt: 'Enthusiastic and highly collaborative. Cultural fit is strong. Could sharpen complex problem-solving under pressure.', strengths: ['Cultural fit', 'Collaboration'], concerns: ['Problem-solving under pressure'] },
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
    currentStage: 'Decision',
    allFeedback: [
      { round: 1, type: 'Research Deep-Dive', by: 'Alessandro S.', byRole: 'Senior UX Designer', date: 'May 6', fit: 'strongly-advance', isMine: true, txt: 'Outstanding. Research depth is rare at this level. She thinks in systems and articulates complexity with genuine clarity.', strengths: ['Research depth', 'Systems thinking', 'Communication'], concerns: [] },
      { round: 2, type: 'Values & Team Fit', by: 'Andrea P.', byRole: 'Design Director', date: 'May 10', fit: 'strongly-advance', isMine: false, txt: 'Strong recommend. She asks exactly the right questions.', strengths: ['Values alignment', 'Intellectual curiosity'], concerns: [] },
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
    currentStage: 'Interviews',
    allFeedback: [],
  },
]

const UPCOMING_INTERVIEWS = [
  {
    id: 201, name: 'Lorenzo Russo', ini: 'LR',
    role: 'UX Designer', dept: 'Product Design',
    round: 1, type: 'Portfolio Review',
    date: 'Jun 15', time: '10:00 AM',
  },
  {
    id: 202, name: 'Emma Bianchi', ini: 'EB',
    role: 'Product Designer', dept: 'Product Design',
    round: 2, type: 'Values Deep-Dive',
    date: 'Jun 19', time: '2:30 PM',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
  ['#D1FAE5','#065F46'],
  ['#FEF3C7','#B45309'],
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
  if (fit === 'strongly-advance') return <span style={{ background: isDark ? 'rgba(216,99,80,0.24)' : '#D86350', color: isDark ? 'rgba(255,140,120,0.95)' : '#FFFFFF', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>★ Strong advance</span>
  if (fit === 'advance') return <span style={{ background: isDark ? 'rgba(254,154,12,0.28)' : '#FEF3C7', color: isDark ? '#FE9A0C' : '#B45309', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>◎ Advance</span>
  return <span style={{ background: isDark ? 'rgba(216,99,80,0.22)' : '#FFF5F2', color: isDark ? '#FF9070' : '#D86350', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✕ Not advancing</span>
}

function OutcomePill({ outcome, T }) {
  const map = {
    advancing:    { bg: isDark ? 'rgba(22,101,52,0.18)' : '#F0FDF4', color: '#16A34A', border: 'rgba(22,101,52,0.22)', label: T.outcome.advancing },
    offer:        { bg: isDark ? 'rgba(22,101,52,0.18)' : '#F0FDF4', color: '#16A34A', border: 'rgba(22,101,52,0.22)', label: T.outcome.offer },
    notAdvancing: { bg: C.gray,  color: C.muted, border: C.border, label: T.outcome.notAdvancing },
    pending:      { bg: C.gray,  color: C.muted, border: C.border, label: T.outcome.pending },
    debrief:      { bg: isDark ? 'rgba(252,211,77,0.14)' : '#FEF3C7', color: isDark ? '#FCD34D' : '#D97706', border: isDark ? 'rgba(252,211,77,0.25)' : '#FDE68A', label: T.outcome.debrief },
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
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 10, marginTop: 18, paddingBottom: 5, borderBottom: '1px solid #E8E4E0' }}>{children}</div>
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
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>DesignStudio</div>
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
    </div>
  )
}

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
            style={{ marginLeft: 'auto', fontSize: 10, color: '#6D28D9', textDecoration: 'none', background: '#EDE9FE', border: '1px solid #DDD6FE', padding: '3px 10px', borderRadius: 7, fontWeight: 600 }}>
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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 14, width: '90%', maxWidth: 640, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 28px 80px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 22px', borderBottom: '1px solid #E8E4E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#D86350', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>CV</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1C1917' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{candidate.role}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#888', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', background: '#FAFAF9', fontFamily: 'Georgia, serif', color: '#1C1917' }}>
          <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{candidate.name}</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>{candidate.role}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 10, color: '#888' }}>
              {candidate.email    && <span>✉ {candidate.email}</span>}
              {candidate.phone    && <span>📞 {candidate.phone}</span>}
              {candidate.loc      && <span>📍 {candidate.loc}</span>}
              {candidate.linkedin && <span>💼 {candidate.linkedin}</span>}
            </div>
          </div>
          <Sec>Professional Experience</Sec>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{candidate.role}</span>
              <span style={{ fontSize: 10, color: '#888' }}>2022 – Present</span>
            </div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>TechCorp</div>
            <Line w="91%" /><Line w="84%" /><Line w="78%" /><Line w="88%" />
          </div>
          <Sec>Education</Sec>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{candidate.edu?.split('·')[1]?.trim() || 'Design Degree'}</div>
            <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>{candidate.edu?.split('·')[0]?.trim() || 'University'} · 2016–2020</div>
            <Line w="55%" />
          </div>
          {candidate.skills?.length > 0 && (
            <>
              <Sec>Skills</Sec>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                {candidate.skills.map(s => (
                  <span key={s} style={{ background: '#F5F2EF', border: '1px solid #E0DDD9', borderRadius: 3, padding: '2px 8px', fontSize: 10, color: '#555' }}>{s}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Stage pipeline ────────────────────────────────────────────────────────────
const IL_PIPELINE = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']
function ILStagePipeline({ stage }) {
  const stageMap = { Closed: 'Decision', Offer: 'Offer', Decision: 'Decision', Interviews: 'Interviews', 'Pre-Call': 'Pre-Call', Screening: 'Screening' }
  const mapped = stageMap[stage] || stage
  const idx = IL_PIPELINE.indexOf(mapped)
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {IL_PIPELINE.map((s, i) => {
        const past = i <= idx, curr = i === idx
        const short = s === 'Screening' ? 'Screen' : s === 'Interviews' ? 'Interview' : s
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i < IL_PIPELINE.length - 1 && (
              <div style={{ position: 'absolute', top: 7, left: '50%', width: '100%', height: 2, background: i < idx ? C.red : C.border, zIndex: 0 }} />
            )}
            <div style={{ width: 14, height: 14, borderRadius: 3, transform: 'rotate(45deg)', background: curr ? C.red : past ? C.redL : C.gray, border: `2px solid ${curr ? C.red : past ? C.redL : C.border}`, zIndex: 1, marginBottom: 4, boxShadow: curr ? `0 0 0 3px ${C.redBg}` : 'none' }} />
            <div style={{ fontSize: 8, color: curr ? C.red : C.muted, fontWeight: curr ? 600 : 400, textAlign: 'center', lineHeight: 1.2 }}>{short}</div>
          </div>
        )
      })}
    </div>
  )
}

// ── Inline debrief form panel ─────────────────────────────────────────────────
const CRITERIA = [
  { key: 'communication',   label: 'Communication & Collaboration' },
  { key: 'culturalFit',     label: 'Cultural Fit' },
  { key: 'growthPotential', label: 'Growth Potential' },
  { key: 'technical',       label: 'Technical Skills', optional: true },
]
const RATING_OPTS = [
  { val: 1, label: 'Not fit',    short: '✕', col: '#D86350', bg: '#FFF5F2' },
  { val: 2, label: 'Somewhat',   short: '△', col: '#D97706', bg: '#FEF3C7' },
  { val: 3, label: 'Good fit',   short: '◎', col: '#B45309', bg: '#FEF3C7' },
  { val: 4, label: 'Strong fit', short: '★', col: '#166534', bg: '#DCFCE7' },
]
const FIT_OPTS = [
  { val: 'not-advancing',    label: 'Not advancing',    col: '#D86350', bg: '#FFF5F2', bord: 'rgba(216,99,80,0.25)' },
  { val: 'advance',          label: 'Advance',          col: '#B45309', bg: '#FEF3C7', bord: 'rgba(254,154,12,0.25)' },
  { val: 'strongly-advance', label: 'Strongly advance', col: '#166534', bg: '#DCFCE7', bord: 'rgba(22,101,52,0.25)' },
]

function useDictation(onResult) {
  const [active,    setActive]    = useState(false)
  const [supported, setSupported] = useState(false)
  const [interim,   setInterim]   = useState('')
  const recRef = useRef(null)
  useEffect(() => {
    setSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition))
    return () => { recRef.current?.stop() }
  }, [])
  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US'
    rec.onresult = (e) => {
      let fin = '', int = ''
      for (const r of e.results) { if (r.isFinal) fin += r[0].transcript + ' '; else int += r[0].transcript }
      if (fin) onResult(fin.trim())
      setInterim(int)
    }
    rec.onend = () => { setActive(false); setInterim('') }
    rec.onerror = () => { setActive(false); setInterim('') }
    rec.start(); recRef.current = rec; setActive(true)
  }, [onResult])
  const stop = useCallback(() => { recRef.current?.stop(); setActive(false); setInterim('') }, [])
  const toggle = useCallback(() => { active ? stop() : start() }, [active, start, stop])
  return { active, toggle, supported, interim }
}

function DictateBtn({ active, toggle, supported }) {
  if (!supported) return null
  return (
    <button onClick={toggle} style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 11px', borderRadius: 20, border: 'none',
      background: active ? C.red : C.gray,
      color: active ? 'white' : C.muted,
      fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
      boxShadow: active ? `0 0 0 3px ${C.redL}` : 'none',
      transition: 'all 0.2s', flexShrink: 0,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="2" width="6" height="11" rx="3"/>
        <path d="M5 10a7 7 0 0 0 14 0"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="9" y1="22" x2="15" y2="22"/>
      </svg>
      {active ? 'Stop' : 'Dictate'}
      {active && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite', display: 'inline-block' }} />}
    </button>
  )
}

function InlineDebriefPanel({ candidate, onClose, onDone }) {
  const [step,         setStep]         = useState(1)
  const [submitted,    setSubmitted]    = useState(false)
  const [fit,          setFit]          = useState(null)
  const [ratings,      setRatings]      = useState({})
  const [strengths,    setStrengths]    = useState('')
  const [improvements, setImprovements] = useState('')

  const strDictation = useDictation(useCallback(t => setStrengths(p => p ? p + ' ' + t : t), []))
  const impDictation = useDictation(useCallback(t => setImprovements(p => p ? p + ' ' + t : t), []))

  const TOTAL = 3
  const reqRated = CRITERIA.filter(c => !c.optional)
  const canStep2 = reqRated.every(c => ratings[c.key] > 0)
  const canSubmit = fit !== null && strengths.trim().length > 0

  const StepDot = ({ n }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ width: i === n ? 18 : 6, height: 6, borderRadius: 3, background: i === n ? C.red : i < n ? C.redL : C.border, transition: 'all 0.2s' }} />
      ))}
    </div>
  )

  if (submitted) {
    const o = FIT_OPTS.find(f => f.val === fit)
    return (
      <aside style={{ width: 360, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${C.border}`, background: isDark ? 'rgba(22,101,52,0.10)' : '#F0FDF4', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>✓ Debrief submitted</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>✓</div>
          <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, color: C.text }}>Feedback saved</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>Your input for {candidate.name} has been saved and will inform the hiring decision.</div>
          {o && <span style={{ background: o.bg, color: o.col, border: `1px solid ${o.bord}`, fontSize: 12, fontWeight: 600, padding: '5px 16px', borderRadius: 20 }}>{o.label}</span>}
          <button onClick={onDone} style={{ marginTop: 8, padding: '9px 24px', borderRadius: 9, background: C.gray, color: C.text, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Back to dashboard
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside style={{ width: 360, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${C.border}`, background: isDark ? 'rgba(216,99,80,0.07)' : '#FFF5F5', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Av id={candidate.id} ini={candidate.ini} size={34} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{candidate.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{candidate.myType} · {candidate.myDate}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Step {step} of {TOTAL} · Debrief</span>
          <StepDot n={step} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Before you begin</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65 }}>Filling in the debrief right after the interview leads to the sharpest, most useful feedback.</div>
            </div>
            <div style={{ background: C.gray, borderRadius: 10, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[['Candidate', candidate.name], ['Round', `Round ${candidate.myRound} · ${candidate.myType}`], ['Date', candidate.myDate]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k}</span>
                    <span style={{ fontSize: 11, color: C.text, fontWeight: 500 }}>{v}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: C.infT, lineHeight: 1.65, fontStyle: 'italic', padding: '8px 12px', background: isDark ? 'rgba(254,154,12,0.08)' : '#FEF3C7', borderRadius: 8, borderLeft: '3px solid #FE9A0C' }}>
              The CV is open on the left — reference it as you fill in your feedback.
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>How did they fit?</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>Rate only what you actually evaluated. Technical is optional.</div>
            </div>
            {CRITERIA.map(cr => {
              const val = ratings[cr.key] || 0
              return (
                <div key={cr.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{cr.label}</span>
                    {cr.optional && <span style={{ fontSize: 9, color: C.muted, background: C.gray, padding: '1px 7px', borderRadius: 20 }}>optional</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {RATING_OPTS.map(opt => {
                      const sel = val === opt.val
                      return (
                        <button key={opt.val} onClick={() => setRatings(r => ({ ...r, [cr.key]: sel ? 0 : opt.val }))}
                          style={{ flex: 1, padding: '6px 0', borderRadius: 8, border: `1.5px solid ${sel ? opt.col : C.border}`, background: sel ? opt.bg : C.gray, color: sel ? opt.col : C.muted, fontSize: 10, fontWeight: sel ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <span style={{ fontSize: 11 }}>{opt.short}</span>
                          <span style={{ fontSize: 8 }}>{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>Your observations</div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>Specific, honest feedback helps the candidate grow regardless of the outcome.</div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>What did they do well? <span style={{ color: C.red }}>*</span></label>
                <DictateBtn {...strDictation} />
              </div>
              {strDictation.active && strDictation.interim && (
                <div style={{ marginBottom: 5, padding: '5px 9px', background: C.redBg, borderRadius: 6, border: `1px solid ${C.redL}`, fontSize: 10, color: C.muted, fontStyle: 'italic' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: C.red, display: 'block', marginBottom: 1 }}>🎤 Transcribing…</span>
                  {strDictation.interim}
                </div>
              )}
              <textarea value={strengths} onChange={e => setStrengths(e.target.value)} placeholder="A real example is worth ten adjectives" rows={3}
                style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: `1px solid ${strDictation.active ? C.red : C.border}`, background: C.gray, color: C.text, fontSize: 11, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>What could they develop?</label>
                <DictateBtn {...impDictation} />
              </div>
              {impDictation.active && impDictation.interim && (
                <div style={{ marginBottom: 5, padding: '5px 9px', background: C.redBg, borderRadius: 6, border: `1px solid ${C.redL}`, fontSize: 10, color: C.muted, fontStyle: 'italic' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: C.red, display: 'block', marginBottom: 1 }}>🎤 Transcribing…</span>
                  {impDictation.interim}
                </div>
              )}
              <textarea value={improvements} onChange={e => setImprovements(e.target.value)} placeholder="Growth-oriented and honest" rows={3}
                style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: `1px solid ${impDictation.active ? C.red : C.border}`, background: C.gray, color: C.text, fontSize: 11, fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Recommendation <span style={{ color: C.red }}>*</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {FIT_OPTS.map(o => (
                  <button key={o.val} onClick={() => setFit(fit === o.val ? null : o.val)}
                    style={{ padding: '9px 14px', borderRadius: 9, border: `1.5px solid ${fit === o.val ? o.col : C.border}`, background: fit === o.val ? o.bg : C.gray, color: fit === o.val ? o.col : C.muted, fontSize: 11, fontWeight: fit === o.val ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.13s' }}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, flexShrink: 0, background: C.white }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            style={{ padding: '9px 16px', borderRadius: 9, background: C.gray, color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Back
          </button>
        )}
        {step < TOTAL && (
          <button onClick={() => setStep(s => s + 1)} disabled={step === 2 && !canStep2}
            style={{ flex: 1, padding: '9px 0', borderRadius: 9, background: (step === 2 && !canStep2) ? C.gray : C.red, color: (step === 2 && !canStep2) ? C.muted : 'white', border: 'none', fontSize: 11, fontWeight: 600, cursor: (step === 2 && !canStep2) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            Continue →
          </button>
        )}
        {step === TOTAL && (
          <button onClick={() => setSubmitted(true)} disabled={!canSubmit}
            style={{ flex: 1, padding: '9px 0', borderRadius: 9, background: canSubmit ? C.red : C.gray, color: canSubmit ? 'white' : C.muted, border: 'none', fontSize: 11, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            Submit feedback ✓
          </button>
        )}
      </div>
    </aside>
  )
}

// ── Dashboard section helpers ─────────────────────────────────────────────────
function SectionHeader({ label, count, accentColor, dot }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      {dot && count > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor, boxShadow: `0 0 6px ${accentColor}80`, flexShrink: 0 }} />}
      <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{label}</h2>
      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, color: count > 0 ? accentColor : C.muted, background: count > 0 ? accentColor + '18' : C.gray, border: `1px solid ${count > 0 ? accentColor + '30' : C.border}` }}>{count}</span>
    </div>
  )
}

function EmptyCard({ icon, sub }) {
  return (
    <div style={{ padding: '18px 22px', background: C.gray, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 11, color: C.muted }}>{sub}</span>
    </div>
  )
}

function CurrentCard({ candidate, onStart }) {
  return (
    <div style={{
      background: isDark ? 'rgba(216,99,80,0.07)' : '#FFFBFB',
      border: `1.5px solid ${C.redL}`,
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: isDark ? '0 4px 24px rgba(216,99,80,0.10)' : '0 4px 24px rgba(216,99,80,0.08)',
    }}>
      {/* Red top stripe */}
      <div style={{ height: 4, background: C.red }} />

      {/* Candidate info */}
      <div style={{ padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Av id={candidate.id} ini={candidate.ini} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 18, color: C.text }}>{candidate.name}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#FCD34D' : '#D97706', background: isDark ? 'rgba(252,211,77,0.14)' : '#FEF3C7', border: `1px solid ${isDark ? 'rgba(252,211,77,0.25)' : '#FDE68A'}`, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Debrief pending</span>
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>{candidate.role} · {candidate.position} · {candidate.dept}</div>
        </div>
        {/* Interview chip — top right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: C.muted }}>{candidate.myDate}</span>
          <span style={{ fontSize: 10, color: C.muted, background: C.gray, border: `1px solid ${C.border}`, padding: '2px 9px', borderRadius: 20 }}>Round {candidate.myRound} · {candidate.myType}</span>
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '12px 20px 16px', borderTop: `1px solid ${isDark ? 'rgba(216,99,80,0.18)' : 'rgba(216,99,80,0.10)'}`, background: isDark ? 'rgba(216,99,80,0.05)' : 'rgba(216,99,80,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 11, color: C.muted, fontStyle: 'italic', lineHeight: 1.5 }}>Open the candidate's CV and fill in your feedback after the interview.</span>
        <button onClick={onStart} style={{ padding: '9px 22px', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Start interview →
        </button>
      </div>
    </div>
  )
}

function UpcomingCard({ interview, hasReminder, onToggleReminder }) {
  return (
    <div style={{ background: isDark ? 'rgba(254,154,12,0.06)' : C.white, border: `1px solid ${isDark ? 'rgba(254,154,12,0.18)' : '#FEF3C7'}`, borderTop: `3px solid ${C.infT}`, borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
          <Av id={interview.id} ini={interview.ini} size={40} />
          <div>
            <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 15, color: C.text, marginBottom: 1 }}>{interview.name}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{interview.role} · {interview.dept}</div>
          </div>
        </div>
        <button onClick={onToggleReminder}
          style={{ background: hasReminder ? C.infBg : 'none', border: `1px solid ${hasReminder ? C.infL : C.border}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 13, color: hasReminder ? C.infT : C.muted, transition: 'all 0.15s' }}
          title={hasReminder ? 'Remove reminder' : 'Set reminder'}>
          🔔
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: C.infT, background: C.infBg, border: `1px solid ${C.infL}`, padding: '4px 12px', borderRadius: 20 }}>
          📅 {interview.date} · {interview.time}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: C.muted, background: C.gray, border: `1px solid ${C.border}`, padding: '4px 11px', borderRadius: 20 }}>
          Round {interview.round} · {interview.type}
        </span>
      </div>
      {hasReminder && (
        <div style={{ fontSize: 10, color: C.infT, fontStyle: 'italic' }}>🔔 Reminder set for this interview</div>
      )}
    </div>
  )
}

function DoneCard({ candidate, onView, T }) {
  const isRejected = candidate.outcome === 'notAdvancing'
  const myF = candidate.allFeedback.find(f => f.isMine)
  const outcomeMap = {
    advancing:    { col: '#16A34A', bg: isDark ? 'rgba(22,101,52,0.14)' : '#F0FDF4', bord: 'rgba(22,101,52,0.22)' },
    offer:        { col: '#16A34A', bg: isDark ? 'rgba(22,101,52,0.14)' : '#F0FDF4', bord: 'rgba(22,101,52,0.22)' },
    notAdvancing: { col: C.muted,   bg: C.gray,                                      bord: C.border              },
    pending:      { col: C.muted,   bg: C.gray,                                      bord: C.border              },
  }
  const os = outcomeMap[candidate.outcome] || outcomeMap.pending

  return (
    <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : C.white, border: `1px solid ${C.border}`, borderLeft: `3px solid ${isRejected ? C.border : '#16A34A'}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, opacity: isRejected ? 0.82 : 1 }}>
      <Av id={candidate.id} ini={candidate.ini} size={38} muted={isRejected} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: isRejected ? C.muted : C.text }}>{candidate.name}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: os.col, background: os.bg, border: `1px solid ${os.bord}`, padding: '2px 9px', borderRadius: 20 }}>
            <OutcomePill outcome={candidate.outcome} T={T} />
          </span>
          {!isRejected && candidate.currentStage && (
            <span style={{ fontSize: 10, color: C.infT, background: C.infBg, padding: '2px 8px', borderRadius: 20, border: `1px solid ${C.infL}` }}>{candidate.currentStage}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: myF ? 5 : 0 }}>
          {candidate.role} · Round {candidate.myRound} · {candidate.myType} · {candidate.myDate}
        </div>
        {myF && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FitPill fit={myF.fit} />
            <span style={{ fontSize: 10, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 280 }}>{myF.txt}</span>
          </div>
        )}
      </div>
      <button onClick={onView}
        style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap', transition: 'all 0.12s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
        {T.viewProfile}
      </button>
    </div>
  )
}

// ── Dashboard home view ───────────────────────────────────────────────────────
function DashboardHome({ onOpenInterview, onViewProfile, T }) {
  const [reminders, setReminders] = useState({})
  const current  = MY_CANDIDATES.filter(c => !c.debriefDone)
  const done     = MY_CANDIDATES.filter(c => c.debriefDone)
  const upcoming = UPCOMING_INTERVIEWS

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', background: isDark ? 'transparent' : '#F8F8F8' }}>
      <style>{`
        @keyframes idOrb1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(28px,-18px) scale(1.06)}75%{transform:translate(-14px,14px) scale(0.95)}}
        @keyframes idOrb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-22px,16px) scale(1.04)}}
      `}</style>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', top: '-100px', right: '-60px', background: isDark ? 'radial-gradient(circle,rgba(216,99,80,0.12) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(216,99,80,0.04) 0%,transparent 65%)', animation: 'idOrb1 13s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', bottom: '-70px', left: '-50px', background: isDark ? 'radial-gradient(circle,rgba(254,154,12,0.10) 0%,transparent 65%)' : 'radial-gradient(circle,rgba(254,154,12,0.03) 0%,transparent 65%)', animation: 'idOrb2 11s ease-in-out infinite' }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ padding: '24px 32px 20px', background: isDark ? C.white : 'rgba(255,255,255,0.90)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 4px' }}>Interviewer</p>
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            {T.greeting(INTERVIEWER.name.split(' ')[0])}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: C.muted, background: C.gray, border: `1px solid ${C.border}`, padding: '3px 11px', borderRadius: 20 }}>
              {T.interviewsDone(MY_CANDIDATES.length)}
            </span>
            {current.length > 0 && (
              <span style={{ fontSize: 11, color: C.red, background: C.redBg, border: `1px solid ${C.redL}`, padding: '3px 11px', borderRadius: 20, fontWeight: 600 }}>
                {T.debriefPending(current.length)}
              </span>
            )}
            {upcoming.length > 0 && (
              <span style={{ fontSize: 11, color: C.infT, background: C.infBg, border: `1px solid ${C.infL}`, padding: '3px 11px', borderRadius: 20 }}>
                {T.upcoming(upcoming.length)}
              </span>
            )}
          </div>
        </header>

        <div style={{ padding: '28px 32px 52px', maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Current */}
          <section>
            <SectionHeader label={T.currentSection} count={current.length} accentColor={C.red} dot />
            {current.length === 0
              ? <EmptyCard icon="✓" sub={T.noCurrentSub} />
              : current.map(c => <CurrentCard key={c.id} candidate={c} onStart={() => onOpenInterview(c)} />)
            }
          </section>

          {/* Upcoming */}
          <section>
            <SectionHeader label={T.upcomingSection} count={upcoming.length} accentColor={C.infT} />
            {upcoming.length === 0
              ? <EmptyCard icon="📅" sub={T.noUpcomingSub} />
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                  {upcoming.map(u => (
                    <UpcomingCard key={u.id} interview={u} hasReminder={!!reminders[u.id]} onToggleReminder={() => setReminders(r => ({ ...r, [u.id]: !r[u.id] }))} />
                  ))}
                </div>
              )
            }
          </section>

          {/* Done */}
          <section>
            <SectionHeader label={T.doneSection} count={done.length} accentColor={C.muted} />
            {done.length === 0
              ? <EmptyCard icon="📋" sub={T.noDoneSub} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {done.map(c => <DoneCard key={c.id} candidate={c} onView={() => onViewProfile(c)} T={T} />)}
                </div>
              )
            }
          </section>

        </div>
      </div>
    </div>
  )
}

// ── Profile side panel (used in profile view) ─────────────────────────────────
function CandidateProfilePanel({ candidate, onNavigate, T }) {
  const [showCV, setShowCV] = useState(false)
  const avPalette = [['#FDDDD7', C.red], ['#FEF3C7', '#D97706'], ['#EDE9FE', '#6D28D9']]
  return (
    <>
    <aside style={{ width: 340, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}`, background: isDark ? 'rgba(216,99,80,0.08)' : C.redBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginBottom: 14 }}>
          <Av id={candidate.id} ini={candidate.ini} size={44} muted={candidate.outcome === 'notAdvancing'} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 1 }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role} · {candidate.exp}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.loc}</div>
          </div>
        </div>
        <ILStagePipeline stage={candidate.currentStage} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Interview feedback</div>
        {candidate.allFeedback.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: C.muted }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 12, marginBottom: 3 }}>{T.noFeedbackYet}</div>
            <div style={{ fontSize: 11 }}>{T.noFeedbackFill}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {candidate.allFeedback.map((f, i) => {
              const [bg, col] = avPalette[i % 3]
              const isMe = f.isMine
              return (
                <div key={i} style={{ background: isMe ? C.redBg : C.gray, borderRadius: 10, padding: '11px 13px', borderLeft: `3px solid ${isMe ? C.red : col}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: isMe ? C.redL : bg, color: isMe ? C.red : col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                        {f.by.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{f.by} {isMe && <span style={{ fontSize: 9, color: C.red }}>· {T.youLabel}</span>}</div>
                        <div style={{ fontSize: 9, color: C.muted }}>{f.byRole} · R{f.round}</div>
                      </div>
                    </div>
                    <FitPill fit={f.fit} />
                  </div>
                  <p style={{ fontSize: 11, color: C.text, lineHeight: 1.65, margin: 0 }}>{f.txt}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div style={{ padding: '12px 18px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={() => setShowCV(true)} style={{ width: '100%', padding: '10px 0', borderRadius: 9, background: C.gray, color: C.text, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          📄 View CV
        </button>
      </div>
    </aside>
    {showCV && <CVModal candidate={candidate} onClose={() => setShowCV(false)} />}
    </>
  )
}

// ── Debriefs section (list + submitted) ───────────────────────────────────────
function SummaryView({ onViewProfile, onFillDebrief, T }) {
  const pending   = MY_CANDIDATES.filter(c => !c.debriefDone)
  const submitted = MY_CANDIDATES.filter(c => c.debriefDone)
  return (
    <div style={{ flex: 1, overflow: 'auto', background: isDark ? C.gray : 'transparent' }}>
      <header style={{ padding: '22px 32px 20px', background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: '0 0 3px' }}>{T.debriefPageTitle}</h1>
        <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{T.debriefPageSub}</p>
      </header>

      <div style={{ padding: '28px 32px 52px', maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {pending.length > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, boxShadow: '0 0 6px rgba(216,99,80,0.45)' }} />}
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{T.pendingSection}</h2>
            {pending.length > 0 && <span style={{ background: '#FFF5F2', color: C.red, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${C.redL}` }}>{pending.length}</span>}
          </div>
          {pending.length === 0 ? (
            <div style={{ padding: '16px 20px', background: C.redBg, borderRadius: 12, border: `1px solid ${C.redL}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✓</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>{T.allDoneTitle}</div>
                <div style={{ fontSize: 11, color: C.red }}>{T.allDoneSub}</div>
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
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{T.round(c.myRound)} · {c.myType} · {c.myDate}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => onViewProfile(c)} style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{T.viewProfile}</button>
                    <button onClick={() => onFillDebrief?.(c)} style={{ padding: '7px 18px', borderRadius: 8, background: C.red, color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{T.fillDebrief}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{T.submittedSection}</h2>
            <span style={{ background: C.redBg, color: C.red, fontSize: 10, fontWeight: 700, padding: '2px 9px', borderRadius: 20, border: `1px solid ${C.redL}` }}>{submitted.length}</span>
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
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: myF ? 5 : 0 }}>
                      {T.round(myF?.round || c.myRound)} · {myF?.type || c.myType} · {myF?.date || c.myDate}
                    </div>
                    {myF && (
                      <>
                        <FitPill fit={myF.fit} />
                        <p style={{ fontSize: 11, color: C.text, lineHeight: 1.6, margin: '5px 0 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{myF.txt}</p>
                      </>
                    )}
                  </div>
                  <button onClick={() => onViewProfile(c)}
                    style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, transition: 'all 0.12s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
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
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [view,     setView]     = useState('list')
  const [selected, setSelected] = useState(null)

  const openActiveInterview = (c) => { setSelected(c); setView('active-interview') }
  const openProfile         = (c) => { setSelected(c); setView('profile') }
  const closeView           = ()  => { setSelected(null); setView('list') }

  // ── Active interview (CV + inline debrief) ─────────────────────────────────
  if (view === 'active-interview' && selected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <header style={{ padding: '10px 22px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button onClick={closeView} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>← Dashboard</button>
          <div style={{ width: 1, height: 18, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Av id={selected.id} ini={selected.ini} size={28} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{selected.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>Round {selected.myRound} · {selected.myType} · {selected.myDate}</div>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#FCD34D' : '#D97706', background: isDark ? 'rgba(252,211,77,0.14)' : '#FEF3C7', border: `1px solid ${isDark ? 'rgba(252,211,77,0.25)' : '#FDE68A'}`, padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
            📋 Pending debrief
          </span>
        </header>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DocumentViewer cv={selected} />
          <InlineDebriefPanel key={selected.id} candidate={selected} onClose={closeView} onDone={closeView} />
        </div>
      </div>
    )
  }

  // ── Full profile view (for done interviews) ────────────────────────────────
  if (view === 'profile' && selected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <header style={{ padding: '12px 22px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button onClick={closeView} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {section === 'debrief' ? T.backToDebrief : '← Dashboard'}
          </button>
          <div style={{ width: 1, height: 18, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            <Av id={selected.id} ini={selected.ini} size={28} muted={selected.outcome === 'notAdvancing'} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{selected.name}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{selected.role} · {selected.position}</div>
            </div>
          </div>
          <OutcomePill outcome={selected.outcome} T={T} />
        </header>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DocumentViewer cv={selected} />
          <CandidateProfilePanel candidate={selected} onNavigate={onNavigate} T={T} />
        </div>
      </div>
    )
  }

  // ── Main layout (App.jsx sidebar handles nav between sections) ───────────
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      {section === 'home' && (
        <DashboardHome onOpenInterview={openActiveInterview} onViewProfile={openProfile} T={T} />
      )}
      {section === 'debrief' && (
        <SummaryView onViewProfile={openProfile} onFillDebrief={openActiveInterview} T={T} />
      )}
    </div>
  )
}
