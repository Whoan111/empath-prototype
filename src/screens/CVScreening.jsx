// ─────────────────────────────────────────────────────────────────────────────
// CVScreening.jsx
// Place in: src/screens/CVScreening.jsx
//
// The focused, card-by-card CV review experience.
// Covers three sub-steps internally:
//   1. Screen  — review each card, advance or not moving forward
//   2. Summary — review and adjust all decisions before confirming
//   3. Done    — confirmation + next actions
//
// Props:
//   cvs[]         — array of CV objects (defaults to MOCK_CVS for standalone use)
//   position      — { id, title, dept }
//   manager       — { id, name, ini }
//   onBack()      — navigate back to the import step
//   onNavigate(screen, data?) — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { buildC, THEMES } from '../designSystem'
import { useState, useEffect, useCallback } from 'react'

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    batchProgress:    'Batch progress',
    advancing:        'Advancing',
    notFwd:           'Not fwd',
    remaining:        'Remaining',
    advancingBadge:   '✓ Advancing',
    notFwdBadge:      '✕ Not moving fwd',
    bannerAdvance:    '✓  Moving forward — will appear in the screening pipeline',
    bannerPass:       '✕  Not moving forward — will receive a thoughtful, personalised update',
    skills:           'Skills',
    experience:       'Experience',
    noLinks:          'No additional links provided',
    btnNotFwd:        '✕  Not moving forward',
    btnAdvance:       '✓  Advance to screening',
    backImport:       '← Back to import',
    cvReview:         'CV Review',
    hiringMgr:        'Hiring manager:',
    cvsInBatch:       (n) => `${n} CVs in batch`,
    advancingCount:   (n) => `✓ ${n} advancing`,
    notFwdCount:      (n) => `✕ ${n} not moving fwd`,
    cvOf:             (i, n) => `CV ${i} of ${n}`,
    keyboardHint:     '← → navigate · A advance · X not moving forward',
    quickNote:        (name) => `Quick note about ${name}… only visible to you`,
    prevBtn:          '← Previous',
    reviewAll:        'Review all decisions →',
    cvsLeft:          (n) => `${n} CV${n !== 1 ? 's' : ''} left to review`,
    nextBtn:          'Next →',
    backReview:       '← Back to review',
    reviewDecisions:  'Review your decisions',
    reviewSub:        (pos, mgr) => `${pos} · Manager: ${mgr} · You can still change any decision before confirming.`,
    advancingToScreen:'Advancing to screening',
    candidates:       'candidates',
    notMovingFwd:     'Not moving forward',
    personalUpdate:   'will receive a personalised, empathetic update',
    advancingSection: 'Advancing ✓',
    notMovingSection: 'Not moving forward',
    whatNext:         '✦ What happens next',
    whatNextText:     (a, b) => `Candidates advancing will appear in the ${a} on the dashboard. Candidates not moving forward will be queued for a ${b} — you can craft it from the dashboard or let Empath generate one automatically.`,
    screeningPipeline:'screening pipeline',
    personalisedMsg:  'personalised, growth-oriented message',
    confirmBtn:       'Confirm & add to dashboard →',
    backToReview:     'Back to review',
    changeBtn:        'Change',
    allSet:           'All set, Valentina.',
    allSetSub:        (na, pos, np) => `${na} candidate${na !== 1 ? 's' : ''} added to the ${pos} screening pipeline. ${np} candidate${np !== 1 ? 's' : ''} queued for an empathetic update.`,
    nowInPipeline:    'Now in pipeline',
    goToDashboard:    'Go to Dashboard →',
    craftUpdates:     (n) => `✉ Craft updates for ${n} candidate${n !== 1 ? 's' : ''}`,
  },
  it: {
    batchProgress:    'Avanzamento batch',
    advancing:        'Avanzano',
    notFwd:           'Non avanza',
    remaining:        'Rimanenti',
    advancingBadge:   '✓ Avanzano',
    notFwdBadge:      '✕ Non avanza',
    bannerAdvance:    '✓  Avanza — apparirà nella pipeline di screening',
    bannerPass:       '✕  Non avanza — riceverà un aggiornamento personalizzato ed empatico',
    skills:           'Competenze',
    experience:       'Esperienza',
    noLinks:          'Nessun link aggiuntivo fornito',
    btnNotFwd:        '✕  Non avanza',
    btnAdvance:       '✓  Avanza allo screening',
    backImport:       '← Torna all\'importazione',
    cvReview:         'Revisione CV',
    hiringMgr:        'Responsabile assunzioni:',
    cvsInBatch:       (n) => `${n} CV nel batch`,
    advancingCount:   (n) => `✓ ${n} avanzano`,
    notFwdCount:      (n) => `✕ ${n} non avanzano`,
    cvOf:             (i, n) => `CV ${i} di ${n}`,
    keyboardHint:     '← → naviga · A avanza · X non avanza',
    quickNote:        (name) => `Nota rapida su ${name}… visibile solo a te`,
    prevBtn:          '← Precedente',
    reviewAll:        'Rivedi tutte le decisioni →',
    cvsLeft:          (n) => `${n} CV rimanent${n !== 1 ? 'i' : 'e'} da rivedere`,
    nextBtn:          'Successivo →',
    backReview:       '← Torna alla revisione',
    reviewDecisions:  'Rivedi le tue decisioni',
    reviewSub:        (pos, mgr) => `${pos} · Manager: ${mgr} · Puoi ancora cambiare qualsiasi decisione prima di confermare.`,
    advancingToScreen:'Avanzano allo screening',
    candidates:       'candidati',
    notMovingFwd:     'Non avanzano',
    personalUpdate:   'riceveranno un aggiornamento personalizzato ed empatico',
    advancingSection: 'Avanzano ✓',
    notMovingSection: 'Non avanzano',
    whatNext:         '✦ Cosa succede dopo',
    whatNextText:     (a, b) => `I candidati che avanzano appariranno nel ${a} nella bacheca. I candidati che non avanzano saranno in coda per un ${b} — puoi crearlo dalla bacheca o lasciare che Empath lo generi automaticamente.`,
    screeningPipeline:'pipeline di screening',
    personalisedMsg:  'messaggio personalizzato e orientato alla crescita',
    confirmBtn:       'Conferma e aggiungi alla bacheca →',
    backToReview:     'Torna alla revisione',
    changeBtn:        'Cambia',
    allSet:           'Tutto pronto, Valentina.',
    allSetSub:        (na, pos, np) => `${na} candidat${na !== 1 ? 'i' : 'o'} aggiunt${na !== 1 ? 'i' : 'o'} alla pipeline di screening ${pos}. ${np} candidat${np !== 1 ? 'i' : 'o'} in coda per un aggiornamento empatico.`,
    nowInPipeline:    'Ora in pipeline',
    goToDashboard:    'Vai alla bacheca →',
    craftUpdates:     (n) => `✉ Scrivi aggiornamenti per ${n} candidat${n !== 1 ? 'i' : 'o'}`,
  },
}

let C = buildC(THEMES.light)

// ── Mock data (used when no props are passed) ─────────────────────────────────
const MOCK_POSITION = { id: 1, title: 'UX Designer', dept: 'Product Design' }
const MOCK_MANAGER  = { id: 1, name: 'Andrea P.', ini: 'AP' }

const MOCK_CVS = [
  {
    id: 1, name: 'Giulia Rossi',    ini: 'GR', role: 'UX Designer',          exp: '4 yrs',
    loc: 'Milan, Italy',    edu: 'Politecnico di Milano · MSc Design',
    email: 'giulia.rossi@gmail.com',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    snippet: 'Led end-to-end UX redesign of a B2B SaaS platform, increasing task completion by 34%. Experienced in facilitation, stakeholder alignment, and design sprints.',
    portfolio: true,  linkedin: true,  file: 'GiuliaRossi_CV.pdf',
  },
  {
    id: 2, name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',   exp: '7 yrs',
    loc: 'Rome, Italy',     edu: 'La Sapienza · BA Visual Communication',
    email: 'marco.bianchi@gmail.com',
    skills: ['Figma', 'UX Strategy', 'Design Leadership', 'Facilitation', 'Service Design'],
    snippet: 'Head of Design at two scale-ups. Built design teams from scratch, established design ops, and shipped products used by over 1M users.',
    portfolio: true,  linkedin: true,  file: 'MarcoBianchi_CV.pdf',
  },
  {
    id: 3, name: 'Sara Conti',      ini: 'SC', role: 'Junior UX Designer',   exp: '1 yr',
    loc: 'Turin, Italy',    edu: 'Politecnico di Torino · BSc Product Design',
    email: 'sara.conti@gmail.com',
    skills: ['Figma', 'Sketch', 'Wireframing', 'User Testing'],
    snippet: 'Recent graduate with a thesis on inclusive design. Internship at a digital agency focusing on mobile UX. Eager to grow in a collaborative team.',
    portfolio: false, linkedin: true,  file: 'SaraConti_CV.pdf',
  },
  {
    id: 4, name: 'Luca Ferrari',    ini: 'LF', role: 'Product Designer',     exp: '5 yrs',
    loc: 'Florence, Italy', edu: 'NABA · BA Graphic Design',
    email: 'luca.ferrari@gmail.com',
    skills: ['Figma', 'Product Design', 'User Testing', 'Agile', 'Component Libraries'],
    snippet: 'Designed and shipped consumer features for 500k+ users in fintech. Strong collaborator with engineering and product. Mentor at local design communities.',
    portfolio: true,  linkedin: false, file: 'LucaFerrari_CV.pdf',
  },
  {
    id: 5, name: 'Elena Marino',    ini: 'EM', role: 'UX / UI Designer',     exp: '3 yrs',
    loc: 'Naples, Italy',   edu: 'Federico II · BA Communication Sciences',
    email: 'elena.marino@gmail.com',
    skills: ['Figma', 'Adobe XD', 'Visual Design', 'CSS', 'Motion Design'],
    snippet: 'Balanced UX/UI background with a strong visual sensibility. Worked across e-commerce and editorial projects. Contributes to open-source design toolkits.',
    portfolio: true,  linkedin: true,  file: 'ElenaMarino_CV.pdf',
  },
  {
    id: 6, name: 'Andrea Ricci',    ini: 'AR', role: 'Product Designer',     exp: '4 yrs',
    loc: 'Bologna, Italy',  edu: 'DAMS · BA Arts & Media',
    email: 'andrea.ricci@gmail.com',
    skills: ['Figma', 'UX Research', 'Design Thinking', 'Storytelling', 'Service Design'],
    snippet: 'Humanist approach to design — roots in social sciences. Developed empathy-driven processes at a civic tech NGO for 3 years.',
    portfolio: false, linkedin: true,  file: 'AndreaRicci_CV.pdf',
  },
  {
    id: 7, name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',        exp: '6 yrs',
    loc: 'Milan, Italy',    edu: 'Università Cattolica · MA Psychology',
    email: 'chiara.lombardi@gmail.com',
    skills: ['Mixed Methods', 'Usability Testing', 'Survey Design', 'Data Analysis'],
    snippet: 'Deep expertise in mixed-methods research. Published work on cognitive load in complex UIs. Reduced support tickets by 40% through research-led redesign.',
    portfolio: false, linkedin: true,  file: 'ChiaraLombardi_CV.pdf',
  },
  {
    id: 8, name: 'Davide Russo',    ini: 'DR', role: 'Interaction Designer',  exp: '2 yrs',
    loc: 'Genoa, Italy',    edu: 'IED Torino · BA Interaction Design',
    email: 'davide.russo@gmail.com',
    skills: ['Figma', 'Framer', 'Motion Design', 'Prototyping', 'Design Tokens'],
    snippet: 'Specialises in micro-interactions and motion design. Created interactive prototypes that cut stakeholder review time by 50%. Freelancing for two startups.',
    portfolio: true,  linkedin: false, file: 'DavideRusso_CV.pdf',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  ['#FECDD3','#C9394A'], ['#DBEAFE','#2563EB'], ['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'], ['#EDE9FE','#6D28D9'], ['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'], ['#DCFCE7','#16A34A'],
]
const avColor = (id) => AVATAR_PALETTE[(id - 1) % AVATAR_PALETTE.length]

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Av({ id, ini, size = 48 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.31, fontWeight: 600,
    }}>
      {ini}
    </div>
  )
}

function DecisionBadge({ dec, T }) {
  if (dec === 'advance') return (
    <span style={{ background: C.sucBg, color: C.sucT, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{T.advancingBadge}</span>
  )
  if (dec === 'pass') return (
    <span style={{ background: '#FEE2E2', color: C.red, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{T.notFwdBadge}</span>
  )
  return null
}

// ── Sub-component: Queue sidebar ──────────────────────────────────────────────
function QueueSidebar({ cvs, currentIdx, decisions, notes, onSelect, T }) {
  const advancing = Object.values(decisions).filter(d => d === 'advance').length
  const passing   = Object.values(decisions).filter(d => d === 'pass').length
  const remaining = cvs.length - Object.keys(decisions).length

  return (
    <aside style={{
      width: 252,
      background: C.white,
      borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
    }}>
      {/* Stats panel */}
      <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
          {T.batchProgress}
        </p>

        {/* Bar */}
        <div style={{ height: 5, background: C.gray, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%',
            width: `${(Object.keys(decisions).length / cvs.length) * 100}%`,
            background: C.red, borderRadius: 4, transition: 'width 0.35s ease',
          }} />
        </div>

        {/* Stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { n: advancing, label: T.advancing, bg: C.sucBg,   color: C.sucT },
            { n: passing,   label: T.notFwd,    bg: '#FEE2E2', color: C.red  },
            { n: remaining, label: T.remaining, bg: C.gray,    color: C.muted },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 7, padding: '7px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'DM Serif Display, serif' }}>{s.n}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: s.color, lineHeight: 1.2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CV list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {cvs.map((cv, i) => {
          const dec    = decisions[cv.id]
          const isCurr = i === currentIdx
          const hasNote= !!notes[cv.id]

          return (
            <button
              key={cv.id}
              onClick={() => onSelect(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '10px 14px',
                border: 'none', cursor: 'pointer',
                background: isCurr ? C.redBg : C.white,
                borderLeft: `3px solid ${isCurr ? C.red : 'transparent'}`,
                borderBottom: `1px solid ${C.border}`,
                textAlign: 'left', fontFamily: 'inherit',
                transition: 'background 0.1s',
              }}
            >
              {/* Avatar */}
              <Av id={cv.id} ini={cv.ini} size={30} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: isCurr ? 600 : 400,
                  color: isCurr ? C.red : C.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {cv.name}
                </div>
                <div style={{ fontSize: 10, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cv.role} · {cv.exp}
                </div>
              </div>

              {/* Decision indicator */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {dec === 'advance' && <span style={{ fontSize: 15, color: C.suc, lineHeight: 1 }}>✓</span>}
                {dec === 'pass'    && <span style={{ fontSize: 15, color: C.red, lineHeight: 1 }}>✕</span>}
                {!dec && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isCurr ? C.red : C.grayB,
                    display: 'inline-block',
                  }} />
                )}
                {hasNote && <span style={{ fontSize: 9, color: C.muted }}>📝</span>}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

// ── Sub-component: CV card ────────────────────────────────────────────────────
function CVCard({ cv, decision, animKey, T }) {
  return (
    <div
      key={animKey}
      style={{
        width: '100%', maxWidth: 650,
        background: C.white, borderRadius: 16,
        border: `1.5px solid ${
          decision === 'advance' ? '#86EFAC'
          : decision === 'pass'  ? '#FCA5A5'
          : C.border
        }`,
        overflow: 'hidden',
        boxShadow: '0 2px 24px rgba(201,57,74,0.05)',
        transition: 'border-color 0.3s',
        animation: 'cardIn 0.22s ease',
      }}
    >
      {/* Decision banner */}
      {decision && (
        <div style={{
          padding: '9px 28px', textAlign: 'center',
          fontSize: 12, fontWeight: 600,
          background: decision === 'advance' ? C.sucBg : '#FEE2E2',
          color:      decision === 'advance' ? C.sucT  : C.red,
          borderBottom: `1px solid ${decision === 'advance' ? '#BBF7D0' : '#FECACA'}`,
        }}>
          {decision === 'advance' ? T.bannerAdvance : T.bannerPass}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '26px 32px 20px', background: C.redBg, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          <Av id={cv.id} ini={cv.ini} size={64} />

          <div style={{ flex: 1 }}>
            <h2 style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 22, fontWeight: 400, color: C.text,
              margin: '0 0 4px',
            }}>
              {cv.name}
            </h2>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 11 }}>
              {cv.role} · <span style={{ color: C.text, fontWeight: 500 }}>{cv.exp}</span> experience
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 20, rowGap: 4 }}>
              <span style={{ fontSize: 12, color: C.muted }}>📍 {cv.loc}</span>
              <span style={{ fontSize: 12, color: C.muted }}>🎓 {cv.edu}</span>
              <span style={{ fontSize: 12, color: C.muted }}>✉ {cv.email}</span>
            </div>
          </div>

          {/* File badge */}
          <div style={{
            fontSize: 11, color: C.muted, flexShrink: 0,
            background: C.white, padding: '5px 10px',
            borderRadius: 7, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            📄 {cv.file}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '22px 32px 26px' }}>

        {/* Skills */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            {T.skills}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {cv.skills.map(s => (
              <span key={s} style={{
                background: C.redBg, color: C.red,
                padding: '5px 13px', borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                border: `1px solid ${C.redL}`,
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 9 }}>
          {cv.portfolio && (
            <span style={{ fontSize: 12, color: C.inf, background: C.infBg, padding: '5px 12px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
              🌐 Portfolio
            </span>
          )}
          {cv.linkedin && (
            <span style={{ fontSize: 12, color: C.inf, background: C.infBg, padding: '5px 12px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
              💼 LinkedIn
            </span>
          )}
          {!cv.portfolio && !cv.linkedin && (
            <span style={{ fontSize: 12, color: C.muted }}>{T.noLinks}</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-component: Decision buttons ──────────────────────────────────────────
function DecisionButtons({ decision, onDecide, T }) {
  return (
    <div style={{ display: 'flex', gap: 14, width: '100%', maxWidth: 650 }}>
      <button
        onClick={() => onDecide('pass')}
        style={{
          flex: 1, padding: '15px 0', borderRadius: 11,
          background: decision === 'pass' ? '#FEE2E2' : C.gray,
          color:      decision === 'pass' ? C.red     : C.muted,
          border: `2px solid ${decision === 'pass' ? '#FECACA' : C.grayB}`,
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 0.18s',
        }}
      >
        {T.btnNotFwd}
      </button>
      <button
        onClick={() => onDecide('advance')}
        style={{
          flex: 1, padding: '15px 0', borderRadius: 11,
          background: decision === 'advance' ? C.suc : C.red,
          color: 'white', border: 'none',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'background 0.18s',
        }}
      >
        {T.btnAdvance}
      </button>
    </div>
  )
}

// ── STEP 1: Screening view ────────────────────────────────────────────────────
function ScreeningView({ cvs, position, manager, decisions, notes, onDecide, onNote, onFinish, onBack, T }) {
  const [idx,     setIdx]     = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const cv       = cvs[idx]
  const decided  = Object.keys(decisions).length
  const allDone  = decided === cvs.length
  const advancing = Object.values(decisions).filter(d => d === 'advance').length
  const passing   = Object.values(decisions).filter(d => d === 'pass').length

  const goTo = useCallback((newIdx) => {
    setIdx(newIdx)
    setAnimKey(k => k + 1)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft'  && idx > 0)               goTo(idx - 1)
      if (e.key === 'ArrowRight' && idx < cvs.length - 1)  goTo(idx + 1)
      if (e.key === 'a' || e.key === 'A') onDecide(cv.id, 'advance')
      if (e.key === 'x' || e.key === 'X') onDecide(cv.id, 'pass')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [idx, cv.id, cvs.length, goTo, onDecide])

  const handleDecide = (choice) => {
    const wasUndecided = !decisions[cv.id]
    onDecide(cv.id, choice)
    if (wasUndecided && idx < cvs.length - 1) {
      setTimeout(() => goTo(idx + 1), 320)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{
        padding: '13px 24px',
        background: C.white, borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
          {T.backImport}
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {position?.title} — {T.cvReview}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>
            {T.hiringMgr} {manager?.name} · {T.cvsInBatch(cvs.length)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            {T.advancingCount(advancing)}
          </span>
          <span style={{ background: '#FEE2E2', color: C.red, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            {T.notFwdCount(passing)}
          </span>
        </div>
      </div>

      {/* ── Thin progress bar ── */}
      <div style={{ height: 3, background: C.gray, flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${(decided / cvs.length) * 100}%`,
          background: C.red, transition: 'width 0.35s ease',
        }} />
      </div>

      {/* ── Body: sidebar + card area ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        <QueueSidebar
          cvs={cvs}
          currentIdx={idx}
          decisions={decisions}
          notes={notes}
          onSelect={goTo}
          T={T}
        />

        {/* ── Card area ── */}
        <div style={{
          flex: 1, overflow: 'auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 32px 28px', gap: 16,
        }}>

          {/* CV position label + keyboard hint */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 650 }}>
            <span style={{ fontSize: 12, color: C.muted }}>
              {T.cvOf(idx + 1, cvs.length)}
            </span>
            <span style={{ fontSize: 11, color: C.grayB }}>
              {T.keyboardHint}
            </span>
          </div>

          {/* CV card */}
          <CVCard cv={cv} decision={decisions[cv.id]} animKey={animKey} T={T} />

          {/* Quick note */}
          <div style={{ width: '100%', maxWidth: 650 }}>
            <textarea
              value={notes[cv.id] || ''}
              onChange={e => onNote(cv.id, e.target.value)}
              placeholder={T.quickNote(cv.name)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 12, resize: 'none', height: 52,
                color: C.text, lineHeight: 1.6, boxSizing: 'border-box',
                fontFamily: 'inherit', outline: 'none', background: C.white,
              }}
            />
          </div>

          {/* Decision buttons */}
          <DecisionButtons decision={decisions[cv.id]} onDecide={handleDecide} T={T} />

          {/* Bottom navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 650 }}>
            <button
              onClick={() => { if (idx > 0) goTo(idx - 1) }}
              disabled={idx === 0}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit',
                border: `1px solid ${idx === 0 ? C.gray : C.border}`,
                background: C.white, color: idx === 0 ? C.grayB : C.text,
                cursor: idx === 0 ? 'default' : 'pointer',
              }}
            >
              {T.prevBtn}
            </button>

            {allDone ? (
              <button
                onClick={onFinish}
                style={{
                  padding: '10px 26px', borderRadius: 9,
                  background: C.suc, color: 'white', border: 'none',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {T.reviewAll}
              </button>
            ) : (
              <span style={{ fontSize: 12, color: C.muted }}>
                {T.cvsLeft(cvs.length - decided)}
              </span>
            )}

            <button
              onClick={() => { if (idx < cvs.length - 1) goTo(idx + 1) }}
              disabled={idx === cvs.length - 1}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit',
                border: `1px solid ${idx === cvs.length - 1 ? C.gray : C.border}`,
                background: C.white, color: idx === cvs.length - 1 ? C.grayB : C.text,
                cursor: idx === cvs.length - 1 ? 'default' : 'pointer',
              }}
            >
              {T.nextBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STEP 2: Summary view ──────────────────────────────────────────────────────
function SummaryView({ cvs, decisions, notes, position, manager, onBack, onConfirm, onToggle, T }) {
  const advancing = cvs.filter(c => decisions[c.id] === 'advance')
  const passing   = cvs.filter(c => decisions[c.id] === 'pass')

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', maxWidth: 760, margin: '0 auto', width: '100%' }}>

      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
        {T.backReview}
      </button>

      <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.reviewDecisions}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 28px', lineHeight: 1.6 }}>
        {T.reviewSub(position?.title, manager?.name)}
      </p>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
        <div style={{ background: C.sucBg, borderRadius: 13, padding: '18px 22px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.sucT, marginBottom: 4 }}>{T.advancingToScreen}</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif' }}>
            {advancing.length}
          </div>
          <div style={{ fontSize: 11, color: C.sucT }}>{T.candidates}</div>
        </div>
        <div style={{ background: '#FEF2F2', borderRadius: 13, padding: '18px 22px', border: '1px solid #FECACA' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 4 }}>{T.notMovingFwd}</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif' }}>
            {passing.length}
          </div>
          <div style={{ fontSize: 11, color: C.red }}>{T.personalUpdate}</div>
        </div>
      </div>

      {/* Advancing list */}
      {advancing.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
            {T.advancingSection}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {advancing.map(cv => (
              <SummaryRow key={cv.id} cv={cv} dec="advance" note={notes[cv.id]} onToggle={() => onToggle(cv.id)} T={T} />
            ))}
          </div>
        </div>
      )}

      {/* Passing list */}
      {passing.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
            {T.notMovingSection}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {passing.map(cv => (
              <SummaryRow key={cv.id} cv={cv} dec="pass" note={notes[cv.id]} onToggle={() => onToggle(cv.id)} T={T} />
            ))}
          </div>
        </div>
      )}

      {/* Empathy note */}
      <div style={{ padding: '14px 18px', borderRadius: 11, background: C.redBg, border: `1px solid ${C.border}`, marginBottom: 26 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 5 }}>{T.whatNext}</div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, margin: 0 }}>
          {T.whatNextText(T.screeningPipeline, T.personalisedMsg)}
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onConfirm}
          style={{
            padding: '12px 30px', borderRadius: 10,
            background: C.red, color: 'white', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {T.confirmBtn}
        </button>
        <button
          onClick={onBack}
          style={{
            padding: '12px 20px', borderRadius: 10,
            background: 'transparent', color: C.muted,
            border: `1.5px solid ${C.border}`,
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {T.backToReview}
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ cv, dec, note, onToggle, T }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 13,
      padding: '12px 16px', borderRadius: 11,
      background: C.white, border: `1px solid ${C.border}`,
    }}>
      <Av id={cv.id} ini={cv.ini} size={36} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{cv.name}</div>
        <div style={{ fontSize: 11, color: C.muted }}>{cv.role} · {cv.exp}</div>
        {note && (
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontStyle: 'italic' }}>
            📝 {note}
          </div>
        )}
      </div>
      <DecisionBadge dec={dec} T={T} />
      <button
        onClick={onToggle}
        style={{
          padding: '5px 12px', borderRadius: 7,
          border: `1px solid ${C.border}`, background: C.white,
          color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {T.changeBtn}
      </button>
    </div>
  )
}

// ── STEP 3: Done view ─────────────────────────────────────────────────────────
function DoneView({ cvs, decisions, position, onGoToDashboard, onCraftMessages, T }) {
  const advancing = cvs.filter(c => decisions[c.id] === 'advance')
  const passing   = cvs.filter(c => decisions[c.id] === 'pass')

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 18 }}>✅</div>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
          {T.allSet}
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: '0 0 32px' }}>
          {T.allSetSub(advancing.length, position?.title, passing.length)}
        </p>

        {/* Advancing mini-list */}
        {advancing.length > 0 && (
          <div style={{ background: C.sucBg, borderRadius: 12, padding: '14px 16px', marginBottom: 14, textAlign: 'left' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.sucT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              {T.nowInPipeline}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {advancing.map(cv => (
                <div key={cv.id} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'white', borderRadius: 20, padding: '4px 12px 4px 4px', border: '1px solid #BBF7D0' }}>
                  <Av id={cv.id} ini={cv.ini} size={22} />
                  <span style={{ fontSize: 12, color: C.sucT, fontWeight: 500 }}>{cv.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <button
            onClick={onGoToDashboard}
            style={{
              padding: '13px 0', borderRadius: 11,
              background: C.red, color: 'white', border: 'none',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {T.goToDashboard}
          </button>
          {passing.length > 0 && (
            <button
              onClick={onCraftMessages}
              style={{
                padding: '13px 0', borderRadius: 11,
                background: C.white, color: C.red,
                border: `1.5px solid ${C.red}`,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {T.craftUpdates(passing.length)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function CVScreening({
  lang       = 'en',
  theme      = THEMES.light,
  cvs        = MOCK_CVS,
  position   = MOCK_POSITION,
  manager    = MOCK_MANAGER,
  onBack,
  onNavigate,
}) {
  C = buildC(theme)
  const T = SCREEN_T[lang] || SCREEN_T.en
  // Sub-step: 'screen' | 'summary' | 'done'
  const [step,      setStep]      = useState('screen')
  const [decisions, setDecisions] = useState({})
  const [notes,     setNotes]     = useState({})

  const handleDecide = useCallback((cvId, choice) => {
    setDecisions(prev => ({ ...prev, [cvId]: choice }))
  }, [])

  const handleNote = useCallback((cvId, text) => {
    setNotes(prev => ({ ...prev, [cvId]: text }))
  }, [])

  const handleToggle = (cvId) => {
    setDecisions(prev => ({
      ...prev,
      [cvId]: prev[cvId] === 'advance' ? 'pass' : 'advance',
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {step === 'screen' && (
        <ScreeningView
          cvs={cvs}
          position={position}
          manager={manager}
          decisions={decisions}
          notes={notes}
          onDecide={handleDecide}
          onNote={handleNote}
          onFinish={() => setStep('summary')}
          onBack={onBack}
          T={T}
        />
      )}

      {step === 'summary' && (
        <SummaryView
          cvs={cvs}
          decisions={decisions}
          notes={notes}
          position={position}
          manager={manager}
          onBack={() => setStep('screen')}
          onConfirm={() => setStep('done')}
          onToggle={handleToggle}
          T={T}
        />
      )}

      {step === 'done' && (
        <DoneView
          cvs={cvs}
          decisions={decisions}
          position={position}
          onGoToDashboard={() => onNavigate?.('dashboard')}
          onCraftMessages={() => onNavigate?.('craft')}
          T={T}
        />
      )}
    </div>
  )
}
