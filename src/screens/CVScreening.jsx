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

import { useState, useEffect, useCallback } from 'react'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:   '#C9394A', redH:  '#A82D3B', redL:  '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted: '#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray:  '#F5F4F3', grayB: '#E5E2DF',
  suc: '#059669', sucBg: '#D1FAE5', sucT: '#065F46',
  war: '#D97706', warBg: '#FEF3C7', warT: '#92400E',
  inf: '#2563EB', infBg: '#DBEAFE', infT: '#1E40AF',
}

// ── Mock data (used when no props are passed) ─────────────────────────────────
const MOCK_POSITION = { id: 1, title: 'UX Designer', dept: 'Product Design' }
const MOCK_MANAGER  = { id: 1, name: 'Marco T.', ini: 'MT' }

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

function DecisionBadge({ dec }) {
  if (dec === 'advance') return (
    <span style={{ background: C.sucBg, color: C.sucT, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✓ Advancing</span>
  )
  if (dec === 'pass') return (
    <span style={{ background: '#FEE2E2', color: C.red, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>✕ Not moving fwd</span>
  )
  return null
}

// ── Sub-component: Queue sidebar ──────────────────────────────────────────────
function QueueSidebar({ cvs, currentIdx, decisions, notes, onSelect }) {
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
          Batch progress
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
            { n: advancing, label: 'Advancing',  bg: C.sucBg,   color: C.sucT },
            { n: passing,   label: 'Not fwd',    bg: '#FEE2E2', color: C.red  },
            { n: remaining, label: 'Remaining',  bg: C.gray,    color: C.muted },
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
function CVCard({ cv, decision, animKey }) {
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
          {decision === 'advance'
            ? '✓  Moving forward — will appear in the screening pipeline'
            : '✕  Not moving forward — will receive a thoughtful, personalised update'}
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
            Skills
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

        {/* Experience */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Experience
          </p>
          <div style={{
            padding: '15px 18px', background: C.gray,
            borderRadius: 10, borderLeft: `3px solid ${C.redL}`,
          }}>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, margin: 0 }}>
              {cv.snippet}
            </p>
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
            <span style={{ fontSize: 12, color: C.muted }}>No additional links provided</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-component: Decision buttons ──────────────────────────────────────────
function DecisionButtons({ decision, onDecide }) {
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
        ✕  Not moving forward
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
        ✓  Advance to screening
      </button>
    </div>
  )
}

// ── STEP 1: Screening view ────────────────────────────────────────────────────
function ScreeningView({ cvs, position, manager, decisions, notes, onDecide, onNote, onFinish, onBack }) {
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
          ← Back to import
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {position?.title} — CV Review
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>
            Hiring manager: {manager?.name} · {cvs.length} CVs in batch
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            ✓ {advancing} advancing
          </span>
          <span style={{ background: '#FEE2E2', color: C.red, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            ✕ {passing} not moving fwd
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
              CV {idx + 1} of {cvs.length}
            </span>
            <span style={{ fontSize: 11, color: C.grayB }}>
              ← → navigate · A advance · X not moving forward
            </span>
          </div>

          {/* CV card */}
          <CVCard cv={cv} decision={decisions[cv.id]} animKey={animKey} />

          {/* Quick note */}
          <div style={{ width: '100%', maxWidth: 650 }}>
            <textarea
              value={notes[cv.id] || ''}
              onChange={e => onNote(cv.id, e.target.value)}
              placeholder={`Quick note about ${cv.name}… only visible to you`}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 12, resize: 'none', height: 52,
                color: C.text, lineHeight: 1.6, boxSizing: 'border-box',
                fontFamily: 'inherit', outline: 'none', background: C.white,
              }}
            />
          </div>

          {/* Decision buttons */}
          <DecisionButtons decision={decisions[cv.id]} onDecide={handleDecide} />

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
              ← Previous
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
                Review all decisions →
              </button>
            ) : (
              <span style={{ fontSize: 12, color: C.muted }}>
                {cvs.length - decided} CV{cvs.length - decided !== 1 ? 's' : ''} left to review
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
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STEP 2: Summary view ──────────────────────────────────────────────────────
function SummaryView({ cvs, decisions, notes, position, manager, onBack, onConfirm, onToggle }) {
  const advancing = cvs.filter(c => decisions[c.id] === 'advance')
  const passing   = cvs.filter(c => decisions[c.id] === 'pass')

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', maxWidth: 760, margin: '0 auto', width: '100%' }}>

      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
        ← Back to review
      </button>

      <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        Review your decisions
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 28px', lineHeight: 1.6 }}>
        {position?.title} · Manager: {manager?.name} · You can still change any decision before confirming.
      </p>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
        <div style={{ background: C.sucBg, borderRadius: 13, padding: '18px 22px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.sucT, marginBottom: 4 }}>Advancing to screening</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif' }}>
            {advancing.length}
          </div>
          <div style={{ fontSize: 11, color: C.sucT }}>candidates</div>
        </div>
        <div style={{ background: '#FEF2F2', borderRadius: 13, padding: '18px 22px', border: '1px solid #FECACA' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 4 }}>Not moving forward</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif' }}>
            {passing.length}
          </div>
          <div style={{ fontSize: 11, color: C.red }}>will receive a personalised, empathetic update</div>
        </div>
      </div>

      {/* Advancing list */}
      {advancing.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
            Advancing ✓
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {advancing.map(cv => (
              <SummaryRow key={cv.id} cv={cv} dec="advance" note={notes[cv.id]} onToggle={() => onToggle(cv.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Passing list */}
      {passing.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
            Not moving forward
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {passing.map(cv => (
              <SummaryRow key={cv.id} cv={cv} dec="pass" note={notes[cv.id]} onToggle={() => onToggle(cv.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Empathy note */}
      <div style={{ padding: '14px 18px', borderRadius: 11, background: C.redBg, border: `1px solid ${C.border}`, marginBottom: 26 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 5 }}>✦ What happens next</div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.8, margin: 0 }}>
          Candidates advancing will appear in the <strong style={{ color: C.text }}>screening pipeline</strong> on the dashboard.
          Candidates not moving forward will be queued for a <strong style={{ color: C.text }}>personalised, growth-oriented message</strong> — you can craft it from the dashboard or let Empath generate one automatically.
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
          Confirm & add to dashboard →
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
          Back to review
        </button>
      </div>
    </div>
  )
}

function SummaryRow({ cv, dec, note, onToggle }) {
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
      <DecisionBadge dec={dec} />
      <button
        onClick={onToggle}
        style={{
          padding: '5px 12px', borderRadius: 7,
          border: `1px solid ${C.border}`, background: C.white,
          color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Change
      </button>
    </div>
  )
}

// ── STEP 3: Done view ─────────────────────────────────────────────────────────
function DoneView({ cvs, decisions, position, onGoToDashboard, onCraftMessages }) {
  const advancing = cvs.filter(c => decisions[c.id] === 'advance')
  const passing   = cvs.filter(c => decisions[c.id] === 'pass')

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <div style={{ fontSize: 56, marginBottom: 18 }}>✅</div>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
          All set, Sarah.
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: '0 0 32px' }}>
          <strong style={{ color: C.text }}>{advancing.length} candidate{advancing.length !== 1 ? 's' : ''}</strong> added to the{' '}
          <em>{position?.title}</em> screening pipeline.{' '}
          <strong style={{ color: C.text }}>{passing.length} candidate{passing.length !== 1 ? 's' : ''}</strong> queued for an empathetic update.
        </p>

        {/* Advancing mini-list */}
        {advancing.length > 0 && (
          <div style={{ background: C.sucBg, borderRadius: 12, padding: '14px 16px', marginBottom: 14, textAlign: 'left' }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.sucT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Now in pipeline
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
            Go to Dashboard →
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
              ✉ Craft updates for {passing.length} candidate{passing.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function CVScreening({
  cvs        = MOCK_CVS,
  position   = MOCK_POSITION,
  manager    = MOCK_MANAGER,
  onBack,
  onNavigate,
}) {
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
        />
      )}

      {step === 'done' && (
        <DoneView
          cvs={cvs}
          decisions={decisions}
          position={position}
          onGoToDashboard={() => onNavigate?.('dashboard')}
          onCraftMessages={() => onNavigate?.('craft')}
        />
      )}
    </div>
  )
}
