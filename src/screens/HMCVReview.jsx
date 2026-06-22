// ─────────────────────────────────────────────────────────────────────────────
// HMCVReview.jsx  — Hiring Manager · CV Assignment Review
//
// The recruiter forwards pre-screened CVs here. The hiring manager can:
//   • Review the full CV / portfolio document
//   • Check the recruiter's assessment and score
//   • Tick hard-skill checkboxes as they verify claims from the document
//   • Add private notes
//   • Accept (→ Pre-Call pipeline) or Reject each candidate
//
// Layout (3-panel, mirrors CVTriage):
//   Left  (~232px): Candidate list grouped by position + batch stats
//   Center (flex-1): Document viewer (CV / Portfolio mockup with zoom)
//   Right  (~348px): Enhanced panel — recruiter assessment, hard-skills
//                    checklist, portfolio link, HM notes, Accept / Reject
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    badge:            'CV Review',
    title:            'Assigned CVs',
    subtitle:         (n) => `${n} CV${n !== 1 ? 's' : ''} forwarded for review`,
    back:             '← Back',
    batchProgress:    'Review Progress',
    toReview:         'To review',
    accepted:         'Accepted',
    rejected:         'Rejected',
    recruiterAssessment: "Recruiter's assessment",
    hardSkills:       'Hard skills to verify',
    hardSkillsNote:   'Tick each skill as you confirm it from the document.',
    allVerified:      'All verified ✓',
    portfolio:        'Portfolio',
    viewPortfolio:    'View portfolio',
    backToCV:         '← CV',
    noPortfolio:      'No portfolio submitted',
    yourNotes:        'Your notes',
    notesPrivate:     'Private — visible only to you.',
    saveNotes:        'Save notes',
    savedNotes:       '✓ Saved',
    yourDecision:     'Your decision',
    accept:           '✓ Accept',
    reject:           '✕ Reject',
    acceptedLabel:    '✓ Accepted',
    acceptedSub:      'Moving to Pre-Call stage',
    rejectedLabel:    '✕ Not moving forward',
    undo:             'Undo',
    selectPrompt:     'Select a candidate to begin review',
    allDoneTitle:     'All CVs reviewed',
    allDoneSub:       (a, r) => `${a} accepted · ${r} rejected`,
    goToDashboard:    'Go to My Dashboard →',
    noAssigned:       'No CVs assigned yet',
    noAssignedSub:    'The recruiter will forward pre-screened CVs here after the initial triage.',
    assignedBy:       (name) => `Assigned by ${name}`,
    daysAgo:          (n) => n === 0 ? 'today' : n === 1 ? '1d ago' : `${n}d ago`,
    identifyAs:       'Identify as:',
    reset:            'Reset',
  },
  it: {
    badge:            'Revisione CV',
    title:            'CV Assegnati',
    subtitle:         (n) => `${n} CV inoltrati per la revisione`,
    back:             '← Indietro',
    batchProgress:    'Avanzamento Revisione',
    toReview:         'Da rivedere',
    accepted:         'Accettati',
    rejected:         'Rifiutati',
    recruiterAssessment: 'Valutazione del recruiter',
    hardSkills:       'Competenze tecniche da verificare',
    hardSkillsNote:   'Seleziona ogni competenza mentre la confermi dal documento.',
    allVerified:      'Tutte verificate ✓',
    portfolio:        'Portfolio',
    viewPortfolio:    'Vedi portfolio',
    backToCV:         '← CV',
    noPortfolio:      'Nessun portfolio allegato',
    yourNotes:        'Le tue note',
    notesPrivate:     'Privato — visibile solo a te.',
    saveNotes:        'Salva note',
    savedNotes:       '✓ Salvato',
    yourDecision:     'La tua decisione',
    accept:           '✓ Accetta',
    reject:           '✕ Rifiuta',
    acceptedLabel:    '✓ Accettato',
    acceptedSub:      'Passa alla fase Pre-Colloquio',
    rejectedLabel:    '✕ Non avanza',
    undo:             'Annulla',
    selectPrompt:     'Seleziona un candidato per iniziare la revisione',
    allDoneTitle:     'Tutti i CV rivisti',
    allDoneSub:       (a, r) => `${a} accettati · ${r} rifiutati`,
    goToDashboard:    'Vai alla mia bacheca →',
    noAssigned:       'Nessun CV assegnato ancora',
    noAssignedSub:    'Il recruiter invierà i CV pre-selezionati qui dopo il triage iniziale.',
    assignedBy:       (name) => `Assegnato da ${name}`,
    daysAgo:          (n) => n === 0 ? 'oggi' : n === 1 ? '1g fa' : `${n}g fa`,
    identifyAs:       'Identifica come:',
    reset:            'Ripristina',
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────

// ── Mock data ─────────────────────────────────────────────────────────────────
const POSITIONS_HM = [
  { id: 1, title: 'UX Designer',       dept: 'Product Design', recruiter: 'Valentina O.', assignedDaysAgo: 2 },
  { id: 2, title: 'Frontend Engineer', dept: 'Engineering',    recruiter: 'Valentina O.', assignedDaysAgo: 5 },
  { id: 3, title: 'Product Manager',   dept: 'Product',        recruiter: 'Valentina O.', assignedDaysAgo: 1 },
]

const ASSIGNED_CANDIDATES = [
  // ── UX Designer ──────────────────────────────────────────────────────────
  {
    id: 1, positionId: 1, name: 'Giulia Rossi', ini: 'GR',
    role: 'UX Designer', exp: '4 yrs', loc: 'Milan, Italy',
    email: 'giulia.rossi@gmail.com', phone: '+39 333 456 7890',
    edu: 'Politecnico di Milano · MSc Design',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
    snippet: 'Led end-to-end UX redesign of a B2B SaaS platform, increasing task completion by 34%. Experienced in design sprints and stakeholder alignment.',
    portfolio: 'giuliarossi.com', linkedin: 'linkedin.com/in/giuliarossi',
    file: 'GiuliaRossi_CV.pdf', docType: 'cv', pages: 2,
    recruiterScore: 4,
    recruiterNote: 'Strong communicator with a compelling portfolio. Passed general screening with ease. Needs HM verification on design-systems depth and research methodology.',
    recruiterTags: ['Portfolio ✓', 'Communication ✓', 'Cultural Fit ✓'],
    hardSkills: [
      { label: 'Figma (Advanced)' },
      { label: 'Design Systems Architecture' },
      { label: 'User Research Methods' },
      { label: 'Accessibility (WCAG)' },
    ],
  },
  {
    id: 2, positionId: 1, name: 'Marco Bianchi', ini: 'MB',
    role: 'Senior UX Designer', exp: '7 yrs', loc: 'Rome, Italy',
    email: 'marco.bianchi@gmail.com', phone: '+39 342 567 8901',
    edu: 'La Sapienza · BA Visual Communication',
    skills: ['Figma', 'UX Strategy', 'Design Leadership', 'Facilitation', 'Service Design'],
    snippet: 'Head of Design at two scale-ups. Built design teams from scratch and shipped products used by 1M+ users.',
    portfolio: 'marcobianchi.design', linkedin: 'linkedin.com/in/marcobianchi',
    file: 'MarcoBianchi_CV.pdf', docType: 'cv', pages: 2,
    recruiterScore: 5,
    recruiterNote: 'Top candidate in the batch. Exceptional strategic background and clear leadership. Portfolio is a standout. Very high confidence in advancing.',
    recruiterTags: ['Portfolio ✓✓', 'Leadership ✓', 'Strategy ✓', 'Communication ✓'],
    hardSkills: [
      { label: 'Service Design' },
      { label: 'Design Systems Leadership' },
      { label: 'Facilitation & Workshops' },
    ],
  },
  {
    id: 4, positionId: 1, name: 'Luca Ferrari', ini: 'LF',
    role: 'Product Designer', exp: '5 yrs', loc: 'Florence, Italy',
    email: 'luca.ferrari@gmail.com', phone: '+39 348 789 0123',
    edu: 'NABA · BA Graphic Design',
    skills: ['Figma', 'Product Design', 'User Testing', 'Agile', 'Component Libraries'],
    snippet: 'Designed and shipped consumer features for 500k+ users in fintech. Strong collaborator with engineering and product teams.',
    portfolio: 'lucaferrari.work', linkedin: null,
    file: 'LucaFerrari_CV.pdf', docType: 'cv', pages: 2,
    recruiterScore: 3,
    recruiterNote: 'Solid fintech background. Slightly below senior threshold but shows strong growth. Worth the HM review for potential.',
    recruiterTags: ['Fintech ✓', 'Product Mindset ✓', 'Verify: Seniority Level'],
    hardSkills: [
      { label: 'Component Libraries' },
      { label: 'Agile / Scrum Processes' },
      { label: 'User Testing Methodology' },
    ],
  },
  // ── Frontend Engineer ─────────────────────────────────────────────────────
  {
    id: 10, positionId: 2, name: 'Thomas Wright', ini: 'TW',
    role: 'React Developer', exp: '5 yrs', loc: 'London, UK',
    email: 'thomas.wright@gmail.com', phone: '+44 7700 900123',
    edu: 'UCL · BSc Computer Science',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    snippet: 'Full-stack developer focused on React. Shipped several consumer-facing products at scale.',
    portfolio: null, linkedin: 'linkedin.com/in/thomaswright',
    file: 'ThomasWright_CV.pdf', docType: 'cv', pages: 2,
    recruiterScore: 4,
    recruiterNote: 'Strong React background with clear communication skills. CV claims TypeScript depth — please verify with a practical example or ask about recent projects.',
    recruiterTags: ['React ✓', 'Communication ✓', 'Verify: TypeScript Depth'],
    hardSkills: [
      { label: 'TypeScript (Advanced)' },
      { label: 'GraphQL / API Design' },
      { label: 'Performance Optimisation' },
      { label: 'Accessibility (WCAG)' },
    ],
  },
  {
    id: 11, positionId: 2, name: 'Nina Patel', ini: 'NP',
    role: 'Frontend Dev', exp: '3 yrs', loc: 'Berlin, Germany',
    email: 'nina.patel@gmail.com', phone: '+49 176 1234 5678',
    edu: 'TU Berlin · MSc Informatics',
    skills: ['Vue.js', 'React', 'CSS', 'Accessibility', 'Performance'],
    snippet: 'Accessibility advocate. Built inclusive component libraries used by 10+ teams.',
    portfolio: 'ninapatel.dev', linkedin: 'linkedin.com/in/ninapatel',
    file: 'NinaPatel_CV.pdf', docType: 'cv', pages: 1,
    recruiterScore: 5,
    recruiterNote: 'Standout candidate. Portfolio is excellent and accessibility expertise is directly on-brief. One of the strongest profiles in this entire batch.',
    recruiterTags: ['Accessibility ✓✓', 'Portfolio ✓', 'Component Libraries ✓'],
    hardSkills: [
      { label: 'Vue.js / React Proficiency' },
      { label: 'Accessibility (WCAG 2.2)' },
      { label: 'Component Library Architecture' },
    ],
  },
  // ── Product Manager ───────────────────────────────────────────────────────
  {
    id: 20, positionId: 3, name: 'Sofia Esposito', ini: 'SE',
    role: 'Senior PM', exp: '8 yrs', loc: 'Milan, Italy',
    email: 'sofia.esposito@gmail.com', phone: '+39 340 123 4567',
    edu: 'Bocconi · MBA',
    skills: ['Product Strategy', 'OKRs', 'Data Analysis', 'Roadmapping', 'Agile'],
    snippet: 'Led 0-to-1 product launches at a fintech unicorn. Comfortable operating in ambiguous, fast-moving environments.',
    portfolio: null, linkedin: 'linkedin.com/in/sofiaesposito',
    file: 'SofiaEsposito_CV.pdf', docType: 'cv', pages: 3,
    recruiterScore: 4,
    recruiterNote: 'Impressive fintech pedigree. Very polished in the phone screen. Needs HM assessment on technical depth and cross-functional leadership style.',
    recruiterTags: ['Fintech ✓', 'MBA ✓', 'Communication ✓', 'Verify: Tech Depth'],
    hardSkills: [
      { label: 'Data-driven Product Decisions' },
      { label: 'Technical Stakeholder Management' },
      { label: 'OKR Framework (hands-on)' },
      { label: '0-to-1 Product Experience' },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
function Av({ id, ini, size = 36 }) {
  const [bg, color] = AV_PALETTE[(id - 1) % AV_PALETTE.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function Stars({ score, max = 5, size = 12 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ fontSize: size, color: i < score ? C.red : '#E8E4E0', lineHeight: 1 }}>★</span>
      ))}
    </span>
  )
}

function DocTypeBadge({ type }) {
  const map = {
    cv:        { label: '📄 CV',        bg: C.infBg,  color: C.infT  },
    portfolio: { label: '🎨 Portfolio', bg: C.infBg,  color: C.infT  },
    unknown:   { label: '❓ Unknown',   bg: C.warBg,  color: C.warT  },
  }
  const t = map[type] || map.unknown
  return (
    <span style={{ background: t.bg, color: t.color, fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 20 }}>
      {t.label}
    </span>
  )
}

// ── CV document mockup ────────────────────────────────────────────────────────
function CVDocumentMockup({ cv }) {
  const Line = ({ w = '100%', h = 7, mb = 5 }) => (
    <div style={{ width: w, height: h, background: '#E8E4E0', borderRadius: 2, marginBottom: mb }} />
  )
  const SectionTitle = ({ children }) => (
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
        </div>
      </div>
      <SectionTitle>Professional Experience</SectionTitle>
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
          <span style={{ fontSize: 11, fontWeight: 600 }}>Mid {cv.role?.split(' ')[1] || 'Designer'}</span>
          <span style={{ fontSize: 9, color: '#888' }}>2020 – 2022</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>DesignStudio · Italy</div>
        <Line w="87%" /><Line w="72%" />
      </div>
      <SectionTitle>Education</SectionTitle>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{cv.edu?.split('·')[1]?.trim() || 'Degree'}</span>
          <span style={{ fontSize: 9, color: '#888' }}>2016 – 2020</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>{cv.edu?.split('·')[0]?.trim()}</div>
        <Line w="55%" />
      </div>
      <SectionTitle>Skills</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {cv.skills?.map(s => (
          <span key={s} style={{ background: '#F5F2EF', border: '1px solid #E0DDD9', borderRadius: 3, padding: '2px 8px', fontSize: 9, color: '#555' }}>{s}</span>
        ))}
      </div>
      <SectionTitle>Projects & Highlights</SectionTitle>
      <Line w="94%" /><Line w="88%" /><Line w="76%" /><Line w="82%" /><Line w="68%" />
      <div style={{ marginTop: 12 }} />
      <Line w="90%" /><Line w="83%" /><Line w="71%" />
    </div>
  )
}

// ── Portfolio mockup ──────────────────────────────────────────────────────────
function PortfolioMockup({ cv }) {
  const cols = [['#E8F0FE','#C5D8FD'],['#FCE4EC','#F9B4C8'],['#E8F5E9','#A5D6A7'],['#FFF8E1','#FFE082'],['#EDE7F6','#CE93D8'],['#E3F2FD','#90CAF9']]
  const projects = ['Brand Identity','Web Redesign','App Design','Design System','Illustrations','Motion Work']
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{ marginBottom: 22, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', marginBottom: 3 }}>{cv.name}</div>
        <div style={{ fontSize: 11, color: '#888' }}>{cv.role} · Portfolio · {cv.pages} pages</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {projects.map((p, i) => {
          const [bgl, bgd] = cols[i % cols.length]
          return (
            <div key={i} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #EEE' }}>
              <div style={{ height: 70, background: `linear-gradient(135deg, ${bgl}, ${bgd})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, opacity: 0.6 }}>{'🎨📐📱🖥🎭✏'.split('')[i]}</span>
              </div>
              <div style={{ padding: '7px 10px', background: C.white }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.doc, marginBottom: 3 }}>{p}</div>
                <div style={{ height: 5, background: '#F0F0F0', borderRadius: 2 }} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #E8E4E0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 9 }}>About this work</div>
        {[92, 85, 78, 88, 65].map((w, i) => <div key={i} style={{ height: 6, background: '#E8E4E0', borderRadius: 2, marginBottom: 5, width: `${w}%` }} />)}
      </div>
    </div>
  )
}

// ── Design-role check ────────────────────────────────────────────────────────
const DESIGN_KEYWORDS_HM = ['design', 'ux', 'ui', 'visual', 'interaction', 'creative', 'brand', 'motion', 'art director']
function isDesignRole(role = '') {
  return DESIGN_KEYWORDS_HM.some(k => role.toLowerCase().includes(k))
}

// ── Portfolio URL view — centered link, no document ───────────────────────────
function PortfolioLinkView({ cv }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '48px 40px', background: C.gray }}>
      <div style={{ fontSize: 52 }}>🎨</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Portfolio</div>
        <div style={{ fontSize: 12, color: C.muted }}>{cv.name}'s external portfolio website</div>
      </div>
      <a
        href={`https://${cv.portfolio}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 28px', borderRadius: 12,
          background: C.infBg, color: C.inf,
          border: `1.5px solid ${C.infL}`,
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          boxShadow: '0 2px 14px rgba(254,154,12,0.13)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span>🔗</span>
        <span>{cv.portfolio}</span>
        <span style={{ fontSize: 12, opacity: 0.65 }}>↗</span>
      </a>
      <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', maxWidth: 260, lineHeight: 1.65, margin: 0 }}>
        Opens in a new tab. External link provided by the candidate.
      </p>
    </div>
  )
}

// ── Shared zoom bar ───────────────────────────────────────────────────────────
function ZoomBar({ zoom, setZoom, T }) {
  return (
    <div style={{ padding: '8px 16px', background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <span style={{ fontSize: 11, color: C.muted, width: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
      <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      <span style={{ width: 1, height: 16, background: C.border }} />
      <button onClick={() => setZoom(1)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{T.reset}</button>
    </div>
  )
}

// ── Center: Document viewer ───────────────────────────────────────────────────
function DocumentViewer({ cv, docType, onOverrideType, T, showPortfolio, leaving = false, leavingDir = 'right' }) {
  const [zoom, setZoom] = useState(1)

  const hasPDFPortfolio = docType === 'portfolio'
  const hasURLPortfolio = !hasPDFPortfolio && !!cv.portfolio
  const portfolioAvailable = showPortfolio && (hasPDFPortfolio || hasURLPortfolio)

  const [viewMode, setViewMode] = useState('cv')

  const tabStyle = (active, purple = false) => ({
    padding: '11px 20px',
    border: 'none',
    borderBottom: active ? `2px solid ${purple ? C.inf : C.red}` : '2px solid transparent',
    background: 'none',
    color: active ? (purple ? C.inf : C.text) : C.muted,
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    display: 'flex', alignItems: 'center', gap: 6,
    transition: 'color 0.15s, border-color 0.15s',
    whiteSpace: 'nowrap',
  })

  // Animation applies only to the content area, not the tab bar.
  // Transition is always set so browsers reliably animate when `leaving` flips.
  const contentAnimStyle = {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transform: leaving
      ? leavingDir === 'left' ? 'translateX(-120%)' : 'translateX(120%)'
      : 'translateX(0)',
    opacity: leaving ? 0 : 1,
    transition: 'transform 240ms ease-in, opacity 180ms ease-in',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: isDark ? C.gray : 'transparent' }}>

      {/* ── Tab bar — stays anchored during animation ── */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>

        {/* CV tab */}
        {!hasPDFPortfolio && (
          <button onClick={() => setViewMode('cv')} style={tabStyle(viewMode === 'cv')}>
            <span>📄</span>
            <span>CV</span>
            <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>· {cv.file}</span>
            <span style={{ fontSize: 9, color: C.muted }}>({cv.pages}p)</span>
          </button>
        )}

        {/* Portfolio tab — design roles only */}
        {portfolioAvailable && (
          <button onClick={() => setViewMode('portfolio')} style={tabStyle(viewMode === 'portfolio', true)}>
            <span>🎨</span>
            <span>Portfolio</span>
            {hasPDFPortfolio
              ? <><span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>· {cv.file}</span><span style={{ fontSize: 9, color: C.muted }}>({cv.pages}p)</span></>
              : <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>· {cv.portfolio}</span>
            }
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Unknown-type identify buttons */}
        {docType === 'unknown' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px' }}>
            <span style={{ fontSize: 10, color: C.muted }}>{T.identifyAs}</span>
            <button onClick={() => onOverrideType('cv')}        style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infBg}`,  background: C.infBg,  color: C.infT,  fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📄 CV</button>
            <button onClick={() => onOverrideType('portfolio')} style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infL}`, background: C.infBg, color: C.infT, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🎨 Portfolio</button>
          </div>
        )}
      </div>

      {/* ── Animated content area (tab bar above stays fixed) ── */}
      <div style={contentAnimStyle}>

        {/* ── CV view ── */}
        {viewMode === 'cv' && (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '28px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'white', width: `${Math.min(100, 72 * zoom)}%`, minHeight: '100%', padding: '48px 52px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', borderRadius: 2, boxSizing: 'border-box' }}>
                {docType !== 'unknown' && <CVDocumentMockup cv={cv} />}
                {docType === 'unknown' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 48 }}>📎</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cv.file}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{cv.pages} pages · Could not auto-detect type</div>
                  </div>
                )}
              </div>
            </div>
            <ZoomBar zoom={zoom} setZoom={setZoom} T={T} />
          </>
        )}

        {/* ── Portfolio PDF view ── */}
        {viewMode === 'portfolio' && hasPDFPortfolio && (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: '28px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'white', width: `${Math.min(100, 72 * zoom)}%`, minHeight: '100%', padding: '48px 52px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', borderRadius: 2, boxSizing: 'border-box' }}>
                <PortfolioMockup cv={cv} />
              </div>
            </div>
            <ZoomBar zoom={zoom} setZoom={setZoom} T={T} />
          </>
        )}

        {/* ── Portfolio URL view ── */}
        {viewMode === 'portfolio' && hasURLPortfolio && (
          <PortfolioLinkView cv={cv} />
        )}

      </div>
    </div>
  )
}

// ── Right: enhanced HM candidate panel ───────────────────────────────────────
function HMCandidatePanel({ candidate, decision, notes, onDecide, onSaveNotes, onClose, T, leaving = false }) {
  const [draftNotes, setDraftNotes] = useState(notes || '')
  const [savedFlash, setSavedFlash] = useState(false)

  const handleSave = () => {
    onSaveNotes(candidate.id, draftNotes)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  return (
    <aside style={{ width: 348, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden', opacity: leaving ? 0 : 1, transition: 'opacity 180ms ease-in' }}>

      {/* ── Candidate header ── */}
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}`, background: C.redBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <Av id={candidate.id} ini={candidate.ini} size={46} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{candidate.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.exp} · {candidate.loc}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 20, lineHeight: 1, padding: 0, alignSelf: 'flex-start' }}>×</button>
        </div>
        {/* Top skills chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {candidate.skills?.slice(0, 4).map(s => (
            <span key={s} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 10, color: C.text }}>{s}</span>
          ))}
          {candidate.skills?.length > 4 && (
            <span style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '2px 9px', fontSize: 10, color: C.muted }}>+{candidate.skills.length - 4}</span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Recruiter's assessment */}
        <div style={{ background: C.redBg, borderRadius: 10, padding: '13px 14px', border: `1px solid ${C.redL}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            {T.recruiterAssessment}
          </div>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, margin: '0 0 10px' }}>
            {candidate.recruiterNote}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {candidate.recruiterTags.map(tag => (
              <span key={tag} style={{ fontSize: 9, fontWeight: 600, color: C.red, background: C.redBg, padding: '2px 7px', borderRadius: 20 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Portfolio link — design roles only */}
        {isDesignRole(candidate.role) && (
          candidate.portfolio ? (
            <div style={{ background: C.infBg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.infL}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.infT, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                {T.portfolio}
              </div>
              <a
                href={`https://${candidate.portfolio}`}
                target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.inf, textDecoration: 'none', fontWeight: 600 }}
              >
                <span>🎨</span>
                <span style={{ flex: 1 }}>{candidate.portfolio}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>↗</span>
              </a>
            </div>
          ) : (
            <div style={{ background: C.gray, borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
                {T.portfolio}
              </div>
              <span style={{ fontSize: 12, color: C.muted }}>{T.noPortfolio}</span>
            </div>
          )
        )}

        {/* HM notes */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
            {T.yourNotes}
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>{T.notesPrivate}</div>
          <textarea
            value={draftNotes}
            onChange={e => setDraftNotes(e.target.value)}
            placeholder={`Your thoughts on ${candidate.name.split(' ')[0]}…`}
            style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 11, resize: 'none', height: 76, color: C.text, background: C.white, lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
          />
          <button
            onClick={handleSave}
            style={{
              marginTop: 6, width: '100%', padding: '7px 0', borderRadius: 8,
              background: savedFlash ? C.navBg : 'transparent',
              color: savedFlash ? C.navT : C.muted,
              border: `1px solid ${savedFlash ? C.navL : C.border}`,
              fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {savedFlash ? T.savedNotes : T.saveNotes}
          </button>
        </div>
      </div>

      {/* ── Decision footer ── */}
      <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          {T.yourDecision}
        </div>
        {decision ? (
          <div style={{
            padding: '12px 14px', borderRadius: 9,
            background: decision === 'accept' ? C.redBg : 'rgba(254,154,12,0.08)',
            border: `1px solid ${decision === 'accept' ? C.redL : '#FDE68A'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: decision === 'accept' ? C.red : '#B45309' }}>
                  {decision === 'accept' ? T.acceptedLabel : T.rejectedLabel}
                </div>
                {decision === 'accept' && (
                  <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>{T.acceptedSub}</div>
                )}
              </div>
              <button
                onClick={() => onDecide(candidate.id, null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.muted, fontFamily: 'inherit' }}
              >
                {T.undo}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onDecide(candidate.id, 'reject')}
              style={{ flex: 1, padding: '11px 0', borderRadius: 9, background: 'rgba(254,154,12,0.08)', color: '#B45309', border: '2px solid #FDE68A', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {T.reject}
            </button>
            <button
              onClick={() => onDecide(candidate.id, 'accept')}
              style={{ flex: 1, padding: '11px 0', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {T.accept}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Left: candidate list panel ────────────────────────────────────────────────
function CandidateListPanel({ selectedId, decisions, onSelect, activePosId, T }) {
  const [collapsed, setCollapsed] = useState({})
  const all      = ASSIGNED_CANDIDATES
  const accepted = all.filter(c => decisions[c.id] === 'accept').length
  const rejected = all.filter(c => decisions[c.id] === 'reject').length
  const toReview = all.length - accepted - rejected

  return (
    <div style={{ width: 232, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Batch stats */}
      <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {T.batchProgress}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.gray, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.muted, lineHeight: 1 }}>{toReview}</div>
            <div style={{ fontSize: 8, color: C.muted, fontWeight: 600, marginTop: 2 }}>{T.toReview}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: 'rgba(254,154,12,0.08)', borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#B45309', lineHeight: 1 }}>{rejected}</div>
            <div style={{ fontSize: 8, color: '#B45309', fontWeight: 600, marginTop: 2 }}>{T.rejected}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.redBg, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.red, lineHeight: 1 }}>{accepted}</div>
            <div style={{ fontSize: 8, color: C.red, fontWeight: 600, marginTop: 2 }}>{T.accepted}</div>
          </div>
        </div>
      </div>

      {/* Grouped list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {POSITIONS_HM.map(pos => {
          const posCandidates = all.filter(c => c.positionId === pos.id)
          if (!posCandidates.length) return null
          const posUnreviewed = posCandidates.filter(c => !decisions[c.id]).length
          const isCollapsedPos = !!collapsed[pos.id]
          const isActivePos    = pos.id === activePosId
          return (
            <div key={pos.id}>
              {/* Position header — collapsible */}
              <button
                onClick={() => setCollapsed(s => ({ ...s, [pos.id]: !s[pos.id] }))}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '8px 14px 6px',
                  background: isActivePos ? C.redBg : C.gray,
                  borderBottom: `1px solid ${C.border}`,
                  borderTop: `1px solid ${C.border}`,
                  borderLeft: 'none', borderRight: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'flex-start', gap: 7,
                }}
              >
                {/* Collapse arrow */}
                <span style={{
                  fontSize: 11, color: C.muted, flexShrink: 0, lineHeight: 1,
                  display: 'inline-block', marginTop: 3,
                  transform: isCollapsedPos ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s',
                }}>▾</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: isActivePos ? C.red : C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pos.dept}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    {posUnreviewed > 0 && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, boxShadow: '0 0 6px rgba(216,99,80,0.4)', flexShrink: 0 }} />
                    )}
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pos.title}</div>
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>
                    {T.assignedBy(pos.recruiter)} · {T.daysAgo(pos.assignedDaysAgo)}
                  </div>
                </div>
              </button>

              {/* Candidate rows */}
              {!isCollapsedPos && posCandidates.map(c => {
                const dec   = decisions[c.id]
                const isSel = c.id === selectedId
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', border: 'none',
                      background: isSel ? C.redBg : 'transparent',
                      borderLeft: `3px solid ${isSel ? C.red : 'transparent'}`,
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s',
                    }}
                  >
                    <Av id={c.id} ini={c.ini} size={30} />
                    <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: isSel ? 600 : 400, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 9, color: C.muted }}>{c.role}</div>
                    </div>
                    {/* Status indicator */}
                    <div style={{ flexShrink: 0 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: dec === 'accept' ? C.red : dec === 'reject' ? '#D97706' : C.grayB,
                      }} />
                    </div>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export  (idx-based — same pattern as CVTriage, no stacking bug)
// ─────────────────────────────────────────────────────────────────────────────
export default function HMCVReview({ lang = 'en', theme, onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en

  const [idx,              setIdx]              = useState(0)
  const [decisions,        setDecisions]        = useState({})
  const [savedNotes,       setSavedNotes]       = useState({})
  const [docTypeOverrides, setDocTypeOverrides] = useState({})
  const [leaving,          setLeaving]          = useState(false)   // true while exit animation is running
  const [leavingDir,       setLeavingDir]       = useState('right') // 'left' = rejected, 'right' = accepted
  const [activePosId,      setActivePosId]      = useState(POSITIONS_HM[0]?.id)

  // Scope triage to ONE position at a time — mirrors CVTriage architecture
  const cvList = ASSIGNED_CANDIDATES.filter(c => c.positionId === activePosId)
  const cv     = idx >= 0 && idx < cvList.length ? cvList[idx] : null

  const goTo = (i) => setIdx(i)

  const handleDecide = (id, value) => {
    if (leaving) return

    if (value === null) {
      // Undo — no animation needed
      setDecisions(d => { const n = { ...d }; delete n[id]; return n })
      return
    }

    // Record decision immediately (right panel confirms before document slides away)
    const updated = { ...decisions, [id]: value }
    setDecisions(updated)

    // Compute next undecided index within current position only
    let nextIdx = cvList.findIndex((c, i) => i > idx && !updated[c.id])
    if (nextIdx === -1) nextIdx = cvList.findIndex(c => !updated[c.id])

    // Kick off 250 ms slide-out (rejected → left, accepted → right)
    setLeavingDir(value === 'reject' ? 'left' : 'right')
    setLeaving(true)
    setTimeout(() => {
      if (nextIdx !== -1) goTo(nextIdx)
      setLeaving(false)
    }, 250)
  }

  const handleSaveNotes    = (id, text) => setSavedNotes(n => ({ ...n, [id]: text }))
  const handleOverrideType = (id, t)    => setDocTypeOverrides(o => ({ ...o, [id]: t }))
  const handleSelectById   = (id)       => {
    const cand = ASSIGNED_CANDIDATES.find(c => c.id === id)
    if (!cand) return
    if (cand.positionId !== activePosId) {
      // Switching to a different position — recompute list for the new position
      const newList = ASSIGNED_CANDIDATES.filter(c => c.positionId === cand.positionId)
      const i = newList.findIndex(c => c.id === id)
      setActivePosId(cand.positionId)
      setIdx(i !== -1 ? i : 0)
    } else {
      const i = cvList.findIndex(c => c.id === id)
      if (i !== -1) setIdx(i)
    }
  }

  // Stats scoped to current position for allDone / progress counter
  const acceptedCount = cvList.filter(c => decisions[c.id] === 'accept').length
  const rejectedCount = cvList.filter(c => decisions[c.id] === 'reject').length
  const toReviewCount = cvList.length - acceptedCount - rejectedCount
  const allDone       = toReviewCount === 0 && cvList.length > 0 && !leaving

  const effectiveDocType = (c) => docTypeOverrides[c?.id] || c?.docType || 'unknown'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <header style={{ padding: '14px 24px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
          {T.back}
        </button>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{T.badge}</div>
          <h1 style={{ fontFamily: 'quincy-cf, serif', fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{T.title}</h1>
        </div>

        {/* Progress counter */}
        {cvList.length > 0 && (
          <>
            <div style={{ width: 1, height: 20, background: C.border }} />
            <span style={{ fontSize: 12, color: C.muted }}>{cv ? idx + 1 : 0} / {cvList.length}</span>
          </>
        )}

      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left panel is always visible so user can switch positions */}
        <CandidateListPanel
          selectedId={cv?.id ?? null}
          decisions={decisions}
          onSelect={handleSelectById}
          activePosId={activePosId}
          T={T}
        />

        {allDone ? (
          /* Completion screen for current position — left panel stays for switching */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: isDark ? C.gray : 'transparent' }}>
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
              <circle cx="44" cy="44" r="42" fill="rgba(27,36,97,0.07)"/>
              <circle cx="44" cy="44" r="30" fill="rgba(27,36,97,0.13)"/>
              <polyline points="27,44 37,54 61,30" stroke="#1B2461" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'quincy-cf, serif', fontSize: 26, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{T.allDoneTitle}</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{T.allDoneSub(acceptedCount, rejectedCount)}</p>
            </div>
            <button
              onClick={() => onNavigate?.('hiring-manager')}
              style={{ padding: '12px 32px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {T.goToDashboard}
            </button>
          </div>
        ) : (
          /* Document + right panel — only the document content slides */
          cv && (
            <>
              <DocumentViewer
                key={cv.id}
                cv={cv}
                docType={effectiveDocType(cv)}
                onOverrideType={(t) => handleOverrideType(cv.id, t)}
                T={T}
                showPortfolio={isDesignRole(cv?.role)}
                leaving={leaving}
                leavingDir={leavingDir}
              />
              <HMCandidatePanel
                key={cv.id}
                candidate={cv}
                decision={decisions[cv.id] ?? null}
                notes={savedNotes[cv.id] || ''}
                onDecide={handleDecide}
                onSaveNotes={handleSaveNotes}
                onClose={() => setIdx(-1)}
                T={T}
                leaving={leaving}
              />
            </>
          )
        )}
      </div>


    </div>
  )
}
