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
const C = {
  red:    '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:   '#1C1917', muted: '#78716C', border: '#F0D0D4',
  white:  '#FFFFFF', gray: '#F5F4F3', grayB: '#E5E2DF',
  suc: '#059669', sucBg: '#D1FAE5', sucT: '#065F46',
  war: '#D97706', warBg: '#FEF3C7', warT: '#92400E',
  inf: '#2563EB', infBg: '#DBEAFE', infT: '#1E40AF',
  purp: '#6D28D9', purpBg: '#EDE9FE', purpL: '#DDD8F9',
}

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
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
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
    portfolio: { label: '🎨 Portfolio', bg: C.purpBg, color: C.purp  },
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
              <div style={{ padding: '7px 10px', background: 'white' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#1C1917', marginBottom: 3 }}>{p}</div>
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

// ── Center: Document viewer ───────────────────────────────────────────────────
function DocumentViewer({ cv, docType, onOverrideType, T }) {
  const [zoom, setZoom] = useState(1)
  // Default to portfolio view only if the uploaded file IS a portfolio PDF
  const [viewMode, setViewMode] = useState(docType === 'portfolio' ? 'portfolio' : 'cv')

  const hasPDFPortfolio = docType === 'portfolio'
  const hasURLPortfolio = !hasPDFPortfolio && !!cv.portfolio

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F0EDE9' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px 16px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DocTypeBadge type={viewMode === 'portfolio' ? 'portfolio' : docType === 'unknown' ? 'unknown' : 'cv'} />
          <span style={{ fontSize: 11, color: C.muted }}>{cv.file}</span>
          <span style={{ fontSize: 10, color: C.muted }}>· {cv.pages} page{cv.pages !== 1 ? 's' : ''}</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Unknown type: identify buttons */}
          {docType === 'unknown' && (
            <>
              <span style={{ fontSize: 11, color: C.muted }}>{T.identifyAs}</span>
              <button onClick={() => onOverrideType('cv')}        style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infBg}`, background: C.infBg, color: C.infT, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📄 CV</button>
              <button onClick={() => onOverrideType('portfolio')} style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.purpL}`, background: C.purpBg, color: C.purp, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🎨 Portfolio</button>
            </>
          )}
          {/* Portfolio PDF: toggle between CV view and portfolio view */}
          {hasPDFPortfolio && viewMode === 'portfolio' && (
            <button onClick={() => setViewMode('cv')} style={{ padding: '4px 12px', borderRadius: 7, border: `1px solid ${C.infBg}`, background: C.infBg, color: C.infT, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              📄 {T.backToCV}
            </button>
          )}
          {hasPDFPortfolio && viewMode === 'cv' && (
            <button onClick={() => setViewMode('portfolio')} style={{ padding: '4px 12px', borderRadius: 7, border: `1px solid ${C.purpL}`, background: C.purpBg, color: C.purp, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              🎨 {T.viewPortfolio}
            </button>
          )}
          {/* Portfolio URL: open as link */}
          {hasURLPortfolio && (
            <a href={`https://${cv.portfolio}`} target="_blank" rel="noreferrer"
              style={{ padding: '4px 12px', borderRadius: 7, border: `1px solid ${C.purpL}`, background: C.purpBg, color: C.purp, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              🎨 {cv.portfolio} ↗
            </a>
          )}
        </div>
      </div>

      {/* Document scroll area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', width: `${Math.min(100, 72 * zoom)}%`, minHeight: '100%', padding: '48px 52px', boxShadow: '0 2px 24px rgba(0,0,0,0.10)', borderRadius: 2, boxSizing: 'border-box' }}>
          {docType !== 'unknown' && viewMode === 'cv'        && <CVDocumentMockup cv={cv} />}
          {docType !== 'unknown' && viewMode === 'portfolio' && <PortfolioMockup  cv={cv} />}
          {docType === 'unknown' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, gap: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>📎</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cv.file}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{cv.pages} pages · Could not auto-detect type</div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ padding: '8px 16px', background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontSize: 11, color: C.muted, width: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(1.8, z + 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        <span style={{ width: 1, height: 16, background: C.border }} />
        <button onClick={() => setZoom(1)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{T.reset}</button>
      </div>
    </div>
  )
}

// ── Right: enhanced HM candidate panel ───────────────────────────────────────
function HMCandidatePanel({ candidate, decision, hardVerified, notes, onDecide, onVerifySkill, onSaveNotes, onClose, T }) {
  const [draftNotes, setDraftNotes] = useState(notes || '')
  const [savedFlash, setSavedFlash] = useState(false)

  const handleSave = () => {
    onSaveNotes(candidate.id, draftNotes)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  const allVerified = candidate.hardSkills.length > 0
    && candidate.hardSkills.every((_, i) => hardVerified[i])

  return (
    <aside style={{ width: 348, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

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
        <div style={{ background: '#FFFCF0', borderRadius: 10, padding: '13px 14px', border: `1px solid #FDE68A` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.warT, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {T.recruiterAssessment}
            </div>
            <Stars score={candidate.recruiterScore} size={11} />
          </div>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, margin: '0 0 10px' }}>
            {candidate.recruiterNote}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {candidate.recruiterTags.map(tag => (
              <span key={tag} style={{ fontSize: 9, fontWeight: 600, color: C.warT, background: C.warBg, padding: '2px 7px', borderRadius: 20 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Portfolio link */}
        {candidate.portfolio ? (
          <div style={{ background: C.purpBg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.purpL}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.purp, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              {T.portfolio}
            </div>
            <a
              href={`https://${candidate.portfolio}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.purp, textDecoration: 'none', fontWeight: 600 }}
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
        )}

        {/* Hard skills checklist */}
        {candidate.hardSkills.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {T.hardSkills}
              </div>
              {allVerified && (
                <span style={{ fontSize: 9, fontWeight: 600, color: C.suc, background: C.sucBg, padding: '2px 7px', borderRadius: 20 }}>
                  {T.allVerified}
                </span>
              )}
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 10, lineHeight: 1.5 }}>{T.hardSkillsNote}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {candidate.hardSkills.map((skill, i) => {
                const checked = hardVerified[i] ?? false
                return (
                  <button
                    key={i}
                    onClick={() => onVerifySkill(candidate.id, i, !checked)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8,
                      border: `1.5px solid ${checked ? '#BBF7D0' : C.border}`,
                      background: checked ? C.sucBg : C.white,
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${checked ? C.suc : C.border}`,
                      background: checked ? C.suc : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: 'white', transition: 'all 0.15s',
                    }}>
                      {checked && '✓'}
                    </div>
                    <span style={{ fontSize: 12, color: checked ? C.sucT : C.text, fontWeight: checked ? 600 : 400 }}>
                      {skill.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
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
            style={{ width: '100%', padding: '9px 11px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 11, resize: 'none', height: 76, color: C.text, lineHeight: 1.6, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
          />
          <button
            onClick={handleSave}
            style={{
              marginTop: 6, width: '100%', padding: '7px 0', borderRadius: 8,
              background: savedFlash ? C.sucBg : 'transparent',
              color: savedFlash ? C.sucT : C.muted,
              border: `1px solid ${savedFlash ? '#BBF7D0' : C.border}`,
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
            background: decision === 'accept' ? C.sucBg : '#FEF2F2',
            border: `1px solid ${decision === 'accept' ? '#BBF7D0' : '#FECACA'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: decision === 'accept' ? C.sucT : C.red }}>
                  {decision === 'accept' ? T.acceptedLabel : T.rejectedLabel}
                </div>
                {decision === 'accept' && (
                  <div style={{ fontSize: 10, color: C.suc, marginTop: 2 }}>{T.acceptedSub}</div>
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
              style={{ flex: 1, padding: '11px 0', borderRadius: 9, background: '#FEF2F2', color: C.red, border: '2px solid #FECACA', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
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
function CandidateListPanel({ selectedId, decisions, onSelect, T }) {
  const all        = ASSIGNED_CANDIDATES
  const accepted   = all.filter(c => decisions[c.id] === 'accept').length
  const rejected   = all.filter(c => decisions[c.id] === 'reject').length
  const toReview   = all.length - accepted - rejected

  return (
    <div style={{ width: 232, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Batch stats */}
      <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {T.batchProgress}
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.sucBg, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.suc, lineHeight: 1 }}>{accepted}</div>
            <div style={{ fontSize: 8, color: C.sucT, fontWeight: 600, marginTop: 2 }}>{T.accepted}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: '#FEE2E2', borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.red, lineHeight: 1 }}>{rejected}</div>
            <div style={{ fontSize: 8, color: C.red, fontWeight: 600, marginTop: 2 }}>{T.rejected}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.gray, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.muted, lineHeight: 1 }}>{toReview}</div>
            <div style={{ fontSize: 8, color: C.muted, fontWeight: 600, marginTop: 2 }}>{T.toReview}</div>
          </div>
        </div>
      </div>

      {/* Grouped list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {POSITIONS_HM.map(pos => {
          const posCandidates = all.filter(c => c.positionId === pos.id)
          if (!posCandidates.length) return null
          return (
            <div key={pos.id}>
              {/* Position header */}
              <div style={{ padding: '8px 14px 6px', background: '#F9F7F5', borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pos.dept}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginTop: 1 }}>{pos.title}</div>
                <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>
                  {T.assignedBy(pos.recruiter)} · {T.daysAgo(pos.assignedDaysAgo)}
                </div>
              </div>

              {/* Candidate rows */}
              {posCandidates.map(c => {
                const dec   = decisions[c.id]
                const isSel = c.id === selectedId
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 14px', border: 'none',
                      background: isSel ? '#FFF0F1' : 'transparent',
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: dec === 'accept' ? C.suc : dec === 'reject' ? C.red : C.grayB,
                      }} />
                      {/* Recruiter score dots */}
                      <div style={{ display: 'flex', gap: 1 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i < c.recruiterScore ? C.red : '#E8E4E0' }} />
                        ))}
                      </div>
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
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export default function HMCVReview({ lang = 'en', theme, onBack, onNavigate }) {
  const T = SCREEN_T[lang] || SCREEN_T.en

  const [selectedId,       setSelectedId]       = useState(ASSIGNED_CANDIDATES[0]?.id ?? null)
  const [decisions,        setDecisions]        = useState({})
  // hardVerified: { [candidateId]: { [skillIndex]: boolean } }
  const [hardVerified,     setHardVerified]     = useState({})
  const [savedNotes,       setSavedNotes]       = useState({})
  const [docTypeOverrides, setDocTypeOverrides] = useState({})

  const all          = ASSIGNED_CANDIDATES
  const selected     = all.find(c => c.id === selectedId) ?? null
  const acceptedCount = all.filter(c => decisions[c.id] === 'accept').length
  const rejectedCount = all.filter(c => decisions[c.id] === 'reject').length
  const toReviewCount = all.length - acceptedCount - rejectedCount
  const allDone       = toReviewCount === 0 && all.length > 0

  const effectiveDocType = (c) => docTypeOverrides[c?.id] || c?.docType || 'unknown'

  const handleDecide = (id, value) => {
    setDecisions(d => {
      if (value === null) { const n = { ...d }; delete n[id]; return n }
      return { ...d, [id]: value }
    })
    // Auto-advance to the next unreviewed candidate
    if (value !== null) {
      const unreviewed = all.filter(c => c.id !== id && !decisions[c.id])
      if (unreviewed.length > 0) setTimeout(() => setSelectedId(unreviewed[0].id), 280)
    }
  }

  const handleVerifySkill = (candidateId, skillIdx, value) => {
    setHardVerified(hv => ({
      ...hv,
      [candidateId]: { ...(hv[candidateId] || {}), [skillIdx]: value },
    }))
  }

  const handleSaveNotes = (id, text) => setSavedNotes(n => ({ ...n, [id]: text }))

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
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 18, fontWeight: 400, color: C.text, margin: 0 }}>{T.title}</h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {acceptedCount > 0 && (
            <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
              ✓ {acceptedCount} {T.accepted.toLowerCase()}
            </span>
          )}
          {toReviewCount > 0 && (
            <span style={{ background: C.gray, color: C.muted, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
              {T.subtitle(toReviewCount)}
            </span>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: list */}
        <CandidateListPanel
          selectedId={selectedId}
          decisions={decisions}
          onSelect={setSelectedId}
          T={T}
        />

        {/* Center + right */}
        {allDone ? (
          /* Completion screen */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, background: C.white }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: C.sucBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>✓</div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 8px' }}>{T.allDoneTitle}</h2>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{T.allDoneSub(acceptedCount, rejectedCount)}</p>
            </div>
            <button
              onClick={() => onNavigate?.('hiring-manager')}
              style={{ padding: '12px 32px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {T.goToDashboard}
            </button>
          </div>
        ) : !selected ? (
          /* No selection */
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 13, background: C.gray, flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 32 }}>📋</div>
            <span>{T.selectPrompt}</span>
          </div>
        ) : (
          <>
            <DocumentViewer
              key={selected?.id}
              cv={selected}
              docType={effectiveDocType(selected)}
              onOverrideType={(t) => setDocTypeOverrides(d => ({ ...d, [selected.id]: t }))}
              T={T}
            />
            <HMCandidatePanel
              key={selected.id}
              candidate={selected}
              decision={decisions[selected.id] ?? null}
              hardVerified={hardVerified[selected.id] || {}}
              notes={savedNotes[selected.id] || ''}
              onDecide={handleDecide}
              onVerifySkill={handleVerifySkill}
              onSaveNotes={handleSaveNotes}
              onClose={() => setSelectedId(null)}
              T={T}
            />
          </>
        )}
      </div>
    </div>
  )
}
