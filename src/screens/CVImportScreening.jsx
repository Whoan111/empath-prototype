// ─────────────────────────────────────────────────────────────────────────────
// CVImportScreening.jsx
// Place in: src/screens/CVImportScreening.jsx
//
// Two-step flow:
//   1. Import  — select position, assign manager, upload CVs
//   2. Screen  — review each CV card-by-card, advance or not moving forward
//   3. Summary — review all decisions before confirming
// ─────────────────────────────────────────────────────────────────────────────

import { buildC, THEMES } from '../designSystem'
import { useState, useRef } from 'react'

const SCREEN_T = {
  en: {
    back:         '← Back to Dashboard',
    title:        'Import CVs',
    posLabel:     'Job Position',
    mgrLabel:     'Hiring Manager',
    uploadLabel:  'Upload CVs',
    dropText:     'Drop PDF or Word files here',
    browseText:   'or click to browse...',
    readyText:    (n) => `${n} CVs ready to review`,
    addMore:      'Click to add more files',
    startBtn:     (n) => `Start screening ${n > 0 ? `${n} CVs` : ''} →`,
    needPos:      'Select a position',
    needMgr:      'Assign a manager',
    needCV:       'Upload at least one CV',
  },
  it: {
    back:         '← Indietro alla Bacheca',
    title:        'Importa CV',
    posLabel:     'Posizione Lavorativa',
    mgrLabel:     'Responsabile Assunzioni',
    uploadLabel:  'Carica CV',
    dropText:     'Trascina file PDF o Word qui',
    browseText:   'o clicca per sfogliare...',
    readyText:    (n) => `${n} CV pronti per la revisione`,
    addMore:      'Clicca per aggiungere altri file',
    startBtn:     (n) => `Inizia selezione ${n > 0 ? `${n} CV` : ''} →`,
    needPos:      'Seleziona una posizione',
    needMgr:      'Assegna un responsabile',
    needCV:       'Carica almeno un CV',
  },
}

let C = buildC(THEMES.light)

// ── Data ──────────────────────────────────────────────────────────────────────
const POSITIONS = [
  { id: 1, title: 'UX Designer',       dept: 'Product Design'  },
  { id: 2, title: 'Frontend Engineer', dept: 'Engineering'      },
  { id: 3, title: 'Product Manager',   dept: 'Product'         },
  { id: 4, title: 'Data Analyst',      dept: 'Data & Insights' },
  { id: 5, title: 'Brand Strategist',  dept: 'Marketing'       },
]

const MANAGERS = [
  { id: 1, ini: 'AP', name: 'Andrea P.', dept: 'Product Design'  },
  { id: 2, ini: 'LS', name: 'Laura S.',  dept: 'Engineering'     },
  { id: 3, ini: 'AM', name: 'Andrea M.', dept: 'Product'         },
  { id: 4, ini: 'SE', name: 'Sofia E.',  dept: 'Data & Insights' },
  { id: 5, ini: 'GR', name: 'Giulio R.', dept: 'Marketing'      },
]

const MOCK_CVS = [
  {
    id: 1, name: 'Giulia Rossi',    ini: 'GR', role: 'UX Designer',         exp: '4 yrs',
    loc: 'Milan, Italy',    edu: 'Politecnico di Milano · MSc Design',
    email: 'giulia.rossi@gmail.com',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    snippet: 'Led end-to-end UX redesign of a B2B SaaS platform, increasing task completion by 34%. Experienced in facilitation, stakeholder alignment, and design sprints.',
    portfolio: true,  linkedin: true,  file: 'GiuliaRossi_CV.pdf',
  },
  {
    id: 2, name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',  exp: '7 yrs',
    loc: 'Rome, Italy',     edu: 'La Sapienza · BA Visual Communication',
    email: 'marco.bianchi@gmail.com',
    skills: ['Figma', 'UX Strategy', 'Design Leadership', 'Facilitation', 'Service Design'],
    snippet: 'Head of Design at two scale-ups. Built design teams from scratch, established design ops, and shipped products used by over 1M users.',
    portfolio: true,  linkedin: true,  file: 'MarcoBianchi_CV.pdf',
  },
  {
    id: 3, name: 'Sara Conti',      ini: 'SC', role: 'Junior UX Designer',  exp: '1 yr',
    loc: 'Turin, Italy',    edu: 'Politecnico di Torino · BSc Product Design',
    email: 'sara.conti@gmail.com',
    skills: ['Figma', 'Sketch', 'Wireframing', 'User Testing'],
    snippet: 'Recent graduate with a thesis on inclusive design. Internship at a digital agency focusing on mobile UX. Eager to grow in a collaborative team.',
    portfolio: false, linkedin: true,  file: 'SaraConti_CV.pdf',
  },
  {
    id: 4, name: 'Luca Ferrari',    ini: 'LF', role: 'Product Designer',    exp: '5 yrs',
    loc: 'Florence, Italy', edu: 'NABA · BA Graphic Design',
    email: 'luca.ferrari@gmail.com',
    skills: ['Figma', 'Product Design', 'User Testing', 'Agile', 'Component Libraries'],
    snippet: 'Designed and shipped consumer features for 500k+ users in fintech. Strong collaborator with engineering and product. Mentor at local design communities.',
    portfolio: true,  linkedin: false, file: 'LucaFerrari_CV.pdf',
  },
  {
    id: 5, name: 'Elena Marino',    ini: 'EM', role: 'UX / UI Designer',    exp: '3 yrs',
    loc: 'Naples, Italy',   edu: 'Federico II · BA Communication Sciences',
    email: 'elena.marino@gmail.com',
    skills: ['Figma', 'Adobe XD', 'Visual Design', 'CSS', 'Motion Design'],
    snippet: 'Balanced UX/UI background with a strong visual sensibility. Worked across e-commerce and editorial projects. Contributes to open-source design toolkits.',
    portfolio: true,  linkedin: true,  file: 'ElinaMarino_CV.pdf',
  },
  {
    id: 6, name: 'Andrea Ricci',    ini: 'AR', role: 'Product Designer',    exp: '4 yrs',
    loc: 'Bologna, Italy',  edu: 'DAMS · BA Arts & Media',
    email: 'andrea.ricci@gmail.com',
    skills: ['Figma', 'UX Research', 'Design Thinking', 'Storytelling', 'Service Design'],
    snippet: 'Humanist approach to design — roots in social sciences. Developed empathy-driven design processes at a civic tech NGO for 3 years.',
    portfolio: false, linkedin: true,  file: 'AndreaRicci_CV.pdf',
  },
  {
    id: 7, name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',       exp: '6 yrs',
    loc: 'Milan, Italy',    edu: 'Università Cattolica · MA Psychology',
    email: 'chiara.lombardi@gmail.com',
    skills: ['Mixed Methods Research', 'Usability Testing', 'Survey Design', 'Data Analysis'],
    snippet: 'Deep expertise in mixed-methods research. Published work on cognitive load in complex UIs. Reduced support tickets by 40% through research-led redesign.',
    portfolio: false, linkedin: true,  file: 'ChiaraLombardi_CV.pdf',
  },
  {
    id: 8, name: 'Davide Russo',    ini: 'DR', role: 'Interaction Designer', exp: '2 yrs',
    loc: 'Genoa, Italy',    edu: 'IED Torino · BA Interaction Design',
    email: 'davide.russo@gmail.com',
    skills: ['Figma', 'Framer', 'Motion Design', 'Prototyping', 'Design Tokens'],
    snippet: 'Specialises in micro-interactions and motion design. Created interactive prototypes that cut stakeholder review time by 50%. Currently freelancing for two startups.',
    portfolio: true,  linkedin: false, file: 'DavideRusso_CV.pdf',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  [C.redL,   C.red],
  [C.infBg,  C.inf],
  [C.sucBg,  C.suc],
  [C.warBg,  C.war],
  ['#EDE9FE', '#6D28D9'],
  ['#FCE7F3', '#BE185D'],
  ['#FEF9C3', '#CA8A04'],
  ['#DCFCE7', '#16A34A'],
]
const avatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length]

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Avatar({ id, ini, size = 52 }) {
  const [bg, color] = avatarColor(id)
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

// Small manager avatar (square-ish)
function ManagerChip({ mgr, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '10px 14px', borderRadius: 10,
        border: `2px solid ${selected ? C.red : C.border}`,
        background: selected ? C.redBg : C.white,
        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: selected ? C.redL : C.gray,
        color: selected ? C.red : C.muted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, flexShrink: 0,
      }}>
        {mgr.ini}
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? C.red : C.text }}>
          {mgr.name}
        </div>
        <div style={{ fontSize: 10, color: C.muted }}>{mgr.dept}</div>
      </div>
    </button>
  )
}

// ── STEP 1 — Import ───────────────────────────────────────────────────────────
function ImportStep({ onNavigate, onBack, T, initialPosId = null, initialMgrId = null, positions = POSITIONS }) {
  const [posId,    setPosId]    = useState(initialPosId)
  const [mgrId,    setMgrId]    = useState(initialMgrId)
  const [dragging, setDragging] = useState(false)
  const [files,    setFiles]    = useState([])

  const simulatedFiles = [
    { name: 'GiuliaRossi_CV.pdf',    size: '1.2 MB' },
    { name: 'MarcoBianchi_CV.pdf',   size: '890 KB' },
    { name: 'SaraConti_CV.pdf',      size: '760 KB' },
    { name: 'LucaFerrari_CV.pdf',    size: '1.5 MB' },
    { name: 'ElenaMarino_CV.pdf',    size: '980 KB' },
    { name: 'AndreaRicci_CV.pdf',    size: '1.1 MB' },
    { name: 'ChiaraLombardi_CV.pdf', size: '2.1 MB' },
    { name: 'DavideRusso_CV.pdf',    size: '1.4 MB' },
  ]

  const handleDrop = () => {
    setFiles(simulatedFiles)
    setDragging(false)
  }

  const canProceed = posId && mgrId && files.length > 0

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', maxWidth: 780, margin: '0 auto', width: '100%' }}>

      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
        {T.back}
      </button>

      {/* Page title */}
      <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 14, margin: '0 0 36px', lineHeight: 1.6 }}>
        Select a position, assign a hiring manager, then upload the CVs to review.
      </p>

      {/* ── Section 1: Position ── */}
      <div style={{ marginBottom: 30 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {T.posLabel}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {positions.map(p => (
            <button
              key={p.id}
              onClick={() => setPosId(p.id)}
              style={{
                padding: '9px 18px', borderRadius: 10,
                border: `2px solid ${posId === p.id ? C.red : C.border}`,
                background: posId === p.id ? C.redBg : C.white,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: posId === p.id ? 600 : 400, color: posId === p.id ? C.red : C.text }}>
                {p.title}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>{p.dept}</div>
            </button>
          ))}
          <button style={{
            padding: '9px 18px', borderRadius: 10,
            border: `2px dashed ${C.border}`,
            background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
            color: C.muted, fontSize: 13,
          }}>
            New position
          </button>
        </div>
      </div>

      {/* ── Section 2: Manager ── */}
      <div style={{ marginBottom: 30 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {T.mgrLabel}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
          {MANAGERS.map(m => (
            <ManagerChip
              key={m.id}
              mgr={m}
              selected={mgrId === m.id}
              onClick={() => setMgrId(m.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Section 3: Upload ── */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {T.uploadLabel}
        </label>

        {/* Drop zone */}
        <div
          onClick={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); handleDrop(); }}
          style={{
            border: `2px dashed ${dragging ? C.red : files.length > 0 ? C.red : C.border}`,
            borderRadius: 14, padding: '40px 28px', textAlign: 'center',
            background: dragging ? C.redBg : files.length > 0 ? C.redBg : C.white,
            cursor: 'pointer', transition: 'all 0.2s', marginBottom: 14,
          }}
        >
          {files.length > 0 ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                {T.readyText(files.length)}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {T.addMore}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>
                {T.dropText}
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                {T.browseText} · Multiple files supported<br />
                <span style={{ fontSize: 11 }}>PDF, DOCX — max 10 MB each</span>
              </div>
            </>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {files.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 14px', borderRadius: 9,
                background: C.white, border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{f.size}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, fi) => fi !== i)); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 16, lineHeight: 1, padding: '0 4px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
        <button
          onClick={() => {
            if (!canProceed) return
            const position = positions.find(p => p.id === Number(posId))
            // Go directly to CV Triage for the selected position
            onNavigate('triage', { position })
          }}
          style={{
            padding: '12px 28px', borderRadius: 10,
            background: canProceed ? C.red : C.grayB,
            color: canProceed ? 'white' : C.muted,
            border: 'none', fontSize: 14, fontWeight: 600,
            cursor: canProceed ? 'pointer' : 'default', fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          {T.startBtn(files.length)}
        </button>
        {!canProceed && (
          <span style={{ fontSize: 12, color: C.muted }}>
            {!posId ? T.needPos : !mgrId ? T.needMgr : T.needCV}
          </span>
        )}
      </div>
    </div>
  )
}

// ── STEP 2 — Screen CVs ───────────────────────────────────────────────────────
function ScreenStep({ config, onFinish, onBack }) {
  const [idx,       setIdx]       = useState(0)
  const [decisions, setDecisions] = useState({}) // id → 'advance' | 'pass'
  const [animKey,   setAnimKey]   = useState(0)  // triggers re-mount for fade

  const cv       = MOCK_CVS[idx]
  const total    = MOCK_CVS.length
  const advanced = Object.values(decisions).filter(d => d === 'advance').length
  const passed   = Object.values(decisions).filter(d => d === 'pass').length
  const decided  = advanced + passed

  const pos = POSITIONS.find(p => p.id === config.posId)
  const mgr = MANAGERS.find(m => m.id === config.mgrId)

  const decide = (choice) => {
    setDecisions(prev => ({ ...prev, [cv.id]: choice }))
    // Auto-advance to next undecided CV after a short delay
    setTimeout(() => {
      const next = MOCK_CVS.findIndex((c, i) => i > idx && !decisions[c.id])
      if (next !== -1) {
        setIdx(next)
        setAnimKey(k => k + 1)
      }
    }, 280)
  }

  const goTo = (newIdx) => {
    setIdx(newIdx)
    setAnimKey(k => k + 1)
  }

  const decision = decisions[cv.id]
  const allDecided = decided === total

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{
        padding: '14px 28px',
        background: C.white, borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
          ← Back to import
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{pos?.title} — CV Review</div>
          <div style={{ fontSize: 11, color: C.muted }}>Manager: {mgr?.name}</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ background: C.sucBg,   color: C.sucT, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            ✓ {advanced} advancing
          </span>
          <span style={{ background: '#FEE2E2', color: C.red,  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
            ✕ {passed} not moving forward
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ padding: '0 28px', background: C.white, borderBottom: `1px solid ${C.border}`, paddingBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, margin: '10px 0 6px' }}>
          <span>CV {idx + 1} of {total}</span>
          <span>{decided} of {total} decided</span>
        </div>
        {/* Overall progress dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {MOCK_CVS.map((c, i) => {
            const d = decisions[c.id]
            const isCurr = i === idx
            return (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                title={c.name}
                style={{
                  flex: 1, height: 5, borderRadius: 3, border: 'none',
                  cursor: 'pointer', padding: 0,
                  background: d === 'advance'
                    ? C.suc
                    : d === 'pass'
                    ? '#FCA5A5'
                    : isCurr
                    ? C.red
                    : C.border,
                  transform: isCurr ? 'scaleY(1.6)' : 'scaleY(1)',
                  transition: 'all 0.2s',
                }}
              />
            )
          })}
        </div>
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', padding: '32px 28px', gap: 24, justifyContent: 'center' }}>

        {/* CV card */}
        <div
          key={animKey}
          style={{
            width: '100%', maxWidth: 620,
            background: C.white, borderRadius: 16,
            border: `1px solid ${decision === 'advance' ? C.suc : decision === 'pass' ? '#FCA5A5' : C.border}`,
            overflow: 'hidden',
            boxShadow: decision ? 'none' : '0 2px 16px rgba(201,57,74,0.06)',
            transition: 'border-color 0.25s',
            animation: 'cvFadeIn 0.22s ease',
          }}
        >
          {/* Decision banner */}
          {decision && (
            <div style={{
              padding: '10px 24px', textAlign: 'center',
              fontSize: 12, fontWeight: 600,
              background: decision === 'advance' ? C.sucBg : '#FEE2E2',
              color: decision === 'advance' ? C.sucT : C.red,
              borderBottom: `1px solid ${decision === 'advance' ? '#BBF7D0' : '#FECACA'}`,
            }}>
              {decision === 'advance'
                ? '✓ Moving forward to screening'
                : '✕ Not moving forward — will be archived with care'}
            </div>
          )}

          {/* Card header */}
          <div style={{ padding: '28px 32px 22px', background: C.redBg, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
              <Avatar id={cv.id} ini={cv.ini} size={60} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: '0 0 3px' }}>
                  {cv.name}
                </h2>
                <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>
                  {cv.role} · {cv.exp} experience
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <span style={{ fontSize: 12, color: C.muted }}>📍 {cv.loc}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>🎓 {cv.edu}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>✉ {cv.email}</span>
                </div>
              </div>

              {/* File tag */}
              <div style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, background: C.white, padding: '5px 10px', borderRadius: 7, border: `1px solid ${C.border}` }}>
                📄 {cv.file}
              </div>
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: '22px 32px' }}>

            {/* Skills */}
            <div style={{ marginBottom: 20 }}>
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

            {/* Experience snippet */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                Experience
              </p>
              <div style={{ padding: '14px 16px', background: C.gray, borderRadius: 10, borderLeft: `3px solid ${C.redL}` }}>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>{cv.snippet}</p>
              </div>
            </div>

            {/* Links row */}
            <div style={{ display: 'flex', gap: 10 }}>
              {cv.portfolio && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.inf, background: C.infBg, padding: '5px 12px', borderRadius: 7 }}>
                  🌐 Portfolio
                </span>
              )}
              {cv.linkedin && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.inf, background: C.infBg, padding: '5px 12px', borderRadius: 7 }}>
                  💼 LinkedIn
                </span>
              )}
              {!cv.portfolio && !cv.linkedin && (
                <span style={{ fontSize: 12, color: C.muted }}>No additional links provided</span>
              )}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ padding: '18px 32px 28px', display: 'flex', gap: 14, borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={() => decide('pass')}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 11,
                background: decision === 'pass' ? '#FEE2E2' : C.gray,
                color: decision === 'pass' ? C.red : C.muted,
                border: `2px solid ${decision === 'pass' ? '#FECACA' : C.grayB}`,
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              ✕  Not moving forward
            </button>
            <button
              onClick={() => decide('advance')}
              style={{
                flex: 1, padding: '14px 0', borderRadius: 11,
                background: decision === 'advance' ? C.suc : C.red,
                color: 'white',
                border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              ✓  Advance to screening
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div style={{
        padding: '14px 28px',
        background: C.white, borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <button
          onClick={() => { if (idx > 0) goTo(idx - 1) }}
          disabled={idx === 0}
          style={{
            padding: '8px 18px', borderRadius: 8,
            border: `1px solid ${idx === 0 ? C.gray : C.border}`,
            background: 'white', color: idx === 0 ? C.grayB : C.text,
            fontSize: 12, cursor: idx === 0 ? 'default' : 'pointer', fontFamily: 'inherit',
          }}
        >
          ← Previous
        </button>

        {allDecided ? (
          <button
            onClick={() => onFinish(decisions)}
            style={{
              padding: '10px 24px', borderRadius: 9,
              background: C.suc, color: 'white', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Review decisions →
          </button>
        ) : (
          <span style={{ fontSize: 12, color: C.muted }}>
            {total - decided} CV{total - decided !== 1 ? 's' : ''} left to review
          </span>
        )}

        <button
          onClick={() => { if (idx < total - 1) goTo(idx + 1) }}
          disabled={idx === total - 1}
          style={{
            padding: '8px 18px', borderRadius: 8,
            border: `1px solid ${idx === total - 1 ? C.gray : C.border}`,
            background: 'white', color: idx === total - 1 ? C.grayB : C.text,
            fontSize: 12, cursor: idx === total - 1 ? 'default' : 'pointer', fontFamily: 'inherit',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

// ── STEP 3 — Summary ─────────────────────────────────────────────────────────
function SummaryStep({ decisions, config, onConfirm, onBack }) {
  const [localDec, setLocalDec] = useState({ ...decisions })

  const pos      = POSITIONS.find(p => p.id === config.posId)
  const mgr      = MANAGERS.find(m => m.id === config.mgrId)
  const advancing = MOCK_CVS.filter(c => localDec[c.id] === 'advance')
  const passing   = MOCK_CVS.filter(c => localDec[c.id] === 'pass')

  const toggle = (id) => {
    setLocalDec(prev => ({
      ...prev,
      [id]: prev[id] === 'advance' ? 'pass' : 'advance',
    }))
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px', maxWidth: 740, margin: '0 auto', width: '100%' }}>

      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
        ← Back to review
      </button>

      <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        Review your decisions
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 28px', lineHeight: 1.6 }}>
        {pos?.title} · Manager: {mgr?.name} · You can still change any decision before confirming.
      </p>

      {/* Summary counts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        <div style={{ background: C.sucBg, borderRadius: 12, padding: '16px 20px', border: '1px solid #BBF7D0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.sucT, marginBottom: 3 }}>Advancing to screening</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif' }}>
            {advancing.length}
          </div>
          <div style={{ fontSize: 11, color: C.sucT }}>candidates</div>
        </div>
        <div style={{ background: '#FEF2F2', borderRadius: 12, padding: '16px 20px', border: '1px solid #FECACA' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 3 }}>Not moving forward</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif' }}>
            {passing.length}
          </div>
          <div style={{ fontSize: 11, color: C.red }}>candidates — will receive an empathetic update</div>
        </div>
      </div>

      {/* Advancing list */}
      {advancing.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Advancing ✓
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {advancing.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', borderRadius: 10,
                background: C.white, border: `1px solid ${C.border}`,
              }}>
                <Avatar id={c.id} ini={c.ini} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{c.role} · {c.exp}</div>
                </div>
                <span style={{ background: C.sucBg, color: C.sucT, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  Advancing
                </span>
                <button
                  onClick={() => toggle(c.id)}
                  style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'white', color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Change
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passing list */}
      {passing.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Not moving forward
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {passing.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', borderRadius: 10,
                background: C.white, border: `1px solid ${C.border}`,
              }}>
                <Avatar id={c.id} ini={c.ini} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{c.role} · {c.exp}</div>
                </div>
                <span style={{ background: '#FEF2F2', color: C.red, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                  Not moving forward
                </span>
                <button
                  onClick={() => toggle(c.id)}
                  style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${C.border}`, background: 'white', color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Change
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empathy note */}
      <div style={{
        padding: '14px 18px', borderRadius: 11,
        background: C.redBg, border: `1px solid ${C.border}`,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 5 }}>✦ What happens next</div>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, margin: 0 }}>
          Candidates advancing will be added to the <strong style={{ color: C.text }}>screening stage</strong> in your dashboard.
          Candidates not moving forward will receive a <strong style={{ color: C.text }}>thoughtful, personalised message</strong> — you can craft it from the dashboard or let Empath auto-generate one.
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 11 }}>
        <button
          onClick={() => onConfirm(localDec)}
          style={{
            padding: '12px 28px', borderRadius: 10,
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

// ── STEP 4 — Done ─────────────────────────────────────────────────────────────
function DoneStep({ decisions, config, onGoToDashboard }) {
  const pos      = POSITIONS.find(p => p.id === config.posId)
  const advancing = MOCK_CVS.filter(c => decisions[c.id] === 'advance')
  const passing   = MOCK_CVS.filter(c => decisions[c.id] === 'pass')

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 8px' }}>
          All set, Valentina.
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, margin: '0 0 28px' }}>
          <strong style={{ color: C.text }}>{advancing.length} candidates</strong> have been added to the {pos?.title} screening pipeline.{' '}
          <strong style={{ color: C.text }}>{passing.length} candidates</strong> are queued for an empathetic update.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onGoToDashboard}
            style={{ padding: '12px 0', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Go to Dashboard →
          </button>
          <button
            style={{ padding: '12px 0', borderRadius: 10, background: C.white, color: C.red, border: `1.5px solid ${C.red}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ✉ Craft messages for {passing.length} candidates
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Root export ───────────────────────────────────────────────────────────────
// Props:
//   onBack()            — navigate back to the recruiter dashboard
//   onNavigate(screen, data?) — navigate to another screen
export default function CVImportScreening({ lang = 'en', theme = THEMES.light, initialPosition = null, extraPositions = [], onBack, onNavigate }) {
  C = buildC(theme)
  const T = SCREEN_T[lang] || SCREEN_T.en
  const allPositions = [...POSITIONS, ...extraPositions]
  const initialMgrId = initialPosition
    ? (MANAGERS.find(m => m.dept === initialPosition.dept)?.id ?? null)
    : null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <ImportStep
        onBack={onBack}
        onNavigate={onNavigate}
        T={T}
        initialPosId={initialPosition?.id ?? null}
        initialMgrId={initialMgrId}
        positions={allPositions}
      />
    </div>
  )
}
