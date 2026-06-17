// ─────────────────────────────────────────────────────────────────────────────
// CVTriage.jsx
// Place in: src/screens/CVTriage.jsx
//
// Ongoing CV triage — review already-imported CVs for any position
// without going through the import flow each time.
//
// Layout:
//   Left (~60%): full document viewer (CV or Portfolio placeholder)
//   Right (~40%): parsed candidate info card + advance / not moving forward
//
// Recruiter-only screen.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

const SCREEN_T = {
  en: {
    // Position picker
    badge:          'CV Triage',
    selectPos:      'Select a position',
    posCount:       (p, c) => `${p} position${p !== 1 ? 's' : ''} · ${c} CVs pending review`,
    addPos:         'New Position',
    openPositions:  'Open Positions',
    noCVs:          'NO CVS',
    pending:        'PENDING',
    startTriage:    'Start triage →',
    close:          'Close position',
    reopen:         'Reopen',
    // Add position modal
    addNewPos:      'New position',
    posTitle:       'Position title',
    department:     'Department',
    createPos:      'Create position',
    cancel:         'Cancel',
    // Triage top bar
    backPositions:  '← Positions',
    // Batch progress
    batchProgress:  'Batch Progress',
    advancing:      'Advancing',
    notFwd:         'Not fwd',
    remaining:      'Remaining',
    // Candidate card
    skills:         'Skills',
    experience:     'Experience',
    education:      'Education',
    links:          'Links',
    notMovingFwd:   '✕ Not moving forward',
    advance:        '✓ Advance',
    undoDecision:   'Undo decision',
    movingToScreen: '✓ Moving to screening',
    notMovingDec:   '✕ Not moving forward',
    // Doc viewer
    identifyAs:     'Identify as:',
    reset:          'Reset',
    viewPortfolio:  'View portfolio',
    backToCV:       '← CV',
    // Completion
    allReviewed:    'All CVs reviewed',
    backToPositions:'← Back to positions',
    allCaughtUp:    "Pre-selection complete.",
    allCaughtUpSub: "Your hiring manager has been notified and will review your pre-selected candidates. Once they've confirmed who to move forward, you'll know exactly who to contact.",
    // Empty position
    noCVsImported:  'No CVs imported for this position yet',
    importCVs:      'Import CVs →',
    noWaiting:      'No CVs waiting right now.',
    noWaitingSub:   "Take a breath. When new applications arrive, they'll show up here.",
    // Batch import inline
    importFor:      (pos) => `Import CVs for ${pos}`,
    dropZone:       'Drop PDF or Word files here',
    dropHint:       'or click to browse · Multiple files supported',
    dropTypes:      'PDF, DOCX — max 10 MB each',
    analysingOf:    (n, tot) => `Analysing ${n} of ${tot} CVs…`,
    fileAnalysed:   'Analysed ✓',
    fileWaiting:    'Waiting…',
  },
  it: {
    // Position picker
    badge:          'Selezione CV',
    selectPos:      'Seleziona una posizione',
    posCount:       (p, c) => `${p} posizion${p !== 1 ? 'i' : 'e'} · ${c} CV in attesa`,
    addPos:         'Nuova Posizione',
    openPositions:  'Posizioni Aperte',
    noCVs:          'NESSUN CV',
    pending:        'IN ATTESA',
    startTriage:    'Inizia selezione →',
    close:          'Chiudi posizione',
    reopen:         'Riapri',
    // Add position modal
    addNewPos:      'Nuova posizione',
    posTitle:       'Titolo posizione',
    department:     'Dipartimento',
    createPos:      'Crea posizione',
    cancel:         'Annulla',
    // Triage top bar
    backPositions:  '← Posizioni',
    // Batch progress
    batchProgress:  'Avanzamento Batch',
    advancing:      'Avanzano',
    notFwd:         'Non avanza',
    remaining:      'Rimanenti',
    // Candidate card
    skills:         'Competenze',
    experience:     'Esperienza',
    education:      'Istruzione',
    links:          'Link',
    notMovingFwd:   '✕ Non avanza',
    advance:        '✓ Avanza',
    undoDecision:   'Annulla decisione',
    movingToScreen: '✓ Passa alla selezione',
    notMovingDec:   '✕ Non avanza',
    // Doc viewer
    identifyAs:     'Identifica come:',
    reset:          'Ripristina',
    viewPortfolio:  'Vedi portfolio',
    backToCV:       '← CV',
    // Completion
    allReviewed:    'Tutti i CV rivisti',
    backToPositions:'← Torna alle posizioni',
    allCaughtUp:    'Pre-selezione completata.',
    allCaughtUpSub: "Il tuo hiring manager è stato notificato e valuterà i candidati pre-selezionati. Quando avrà confermato chi far avanzare, saprai esattamente chi contattare.",
    // Empty position
    noCVsImported:  'Nessun CV importato per questa posizione',
    importCVs:      'Importa CV →',
    noWaiting:      'Nessun CV in attesa.',
    noWaitingSub:   'Prenditi un respiro. Quando arrivano nuove candidature, appariranno qui.',
    // Batch import inline
    importFor:      (pos) => `Importa CV per ${pos}`,
    dropZone:       'Trascina file PDF o Word qui',
    dropHint:       'o clicca per sfogliare · Più file supportati',
    dropTypes:      'PDF, DOCX — max 10 MB ciascuno',
    analysingOf:    (n, tot) => `Analisi di ${n} su ${tot} CV…`,
    fileAnalysed:   'Analizzato ✓',
    fileWaiting:    'In attesa…',
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────

// ── Positions ─────────────────────────────────────────────────────────────────
const INIT_POSITIONS = [
  { id: 1, title: 'UX Designer',       dept: 'Product Design',  count: 8,  openDays: 45 },
  { id: 2, title: 'Frontend Engineer', dept: 'Engineering',     count: 5,  openDays: 31 },
  { id: 3, title: 'Product Manager',   dept: 'Product',         count: 3,  openDays: 18 },
  { id: 4, title: 'Data Analyst',      dept: 'Data & Insights', count: 4,  openDays:  9 },
  { id: 5, title: 'Brand Strategist',  dept: 'Marketing',       count: 2,  openDays: 22 },
]

// ── CV / Portfolio mock data per position ─────────────────────────────────────
// docType: 'cv' | 'portfolio' | 'unknown'
const TRIAGE_DATA = {
  1: [
    {
      id: 1, name: 'Giulia Rossi',    ini: 'GR',
      role: 'UX Designer',       exp: '4 yrs', loc: 'Milan, Italy',
      email: 'giulia.rossi@gmail.com', phone: '+39 333 456 7890',
      edu: 'Politecnico di Milano · MSc Design',
      skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Accessibility'],
      snippet: 'Led end-to-end UX redesign of a B2B SaaS platform, increasing task completion by 34%. Experienced in design sprints and stakeholder alignment.',
      portfolio: 'giuliarossi.com', linkedin: 'linkedin.com/in/giuliarossi',
      file: 'GiuliaRossi_CV.pdf', docType: 'cv', pages: 2,
    },
    {
      id: 2, name: 'Marco Bianchi',   ini: 'MB',
      role: 'Senior UX Designer', exp: '7 yrs', loc: 'Rome, Italy',
      email: 'marco.bianchi@gmail.com', phone: '+39 342 567 8901',
      edu: 'La Sapienza · BA Visual Communication',
      skills: ['Figma', 'UX Strategy', 'Design Leadership', 'Facilitation', 'Service Design'],
      snippet: 'Head of Design at two scale-ups. Built design teams from scratch and shipped products used by 1M+ users.',
      portfolio: 'marcobianchi.design', linkedin: 'linkedin.com/in/marcobianchi',
      file: 'MarcoBianchi_CV.pdf', docType: 'cv', pages: 2,
    },
    {
      id: 3, name: 'Sara Conti',      ini: 'SC',
      role: 'Junior UX Designer', exp: '1 yr',  loc: 'Turin, Italy',
      email: 'sara.conti@gmail.com', phone: '+39 347 678 9012',
      edu: 'Politecnico di Torino · BSc Product Design',
      skills: ['Figma', 'Sketch', 'Wireframing', 'User Testing'],
      snippet: 'Recent graduate with a thesis on inclusive design. Internship at a digital agency focusing on mobile UX.',
      portfolio: null, linkedin: 'linkedin.com/in/saraconti',
      file: 'SaraConti_CV.pdf', docType: 'cv', pages: 1,
    },
    {
      id: 4, name: 'Luca Ferrari',    ini: 'LF',
      role: 'Product Designer',   exp: '5 yrs', loc: 'Florence, Italy',
      email: 'luca.ferrari@gmail.com', phone: '+39 348 789 0123',
      edu: 'NABA · BA Graphic Design',
      skills: ['Figma', 'Product Design', 'User Testing', 'Agile', 'Component Libraries'],
      snippet: 'Designed and shipped consumer features for 500k+ users in fintech. Strong collaborator with engineering and product teams.',
      portfolio: 'lucaferrari.work', linkedin: null,
      file: 'LucaFerrari_CV.pdf', docType: 'cv', pages: 2,
    },
    {
      id: 5, name: 'Andrea Ricci',    ini: 'AR',
      role: 'Product Designer',   exp: '4 yrs', loc: 'Bologna, Italy',
      email: 'andrea.ricci@gmail.com', phone: null,
      edu: 'DAMS · BA Arts & Media',
      skills: ['Figma', 'UX Research', 'Design Thinking', 'Storytelling'],
      snippet: 'Humanist approach to design. Developed empathy-driven processes at a civic tech NGO for 3 years.',
      portfolio: null, linkedin: 'linkedin.com/in/andricci',
      // submitted portfolio doc instead of CV
      file: 'AndreaRicci_Portfolio.pdf', docType: 'portfolio', pages: 18,
    },
    {
      id: 6, name: 'Elena Marino',    ini: 'EM',
      role: 'UX/UI Designer',     exp: '3 yrs', loc: 'Naples, Italy',
      email: 'elena.marino@gmail.com', phone: '+39 351 012 3456',
      edu: 'Federico II · BA Communication Sciences',
      skills: ['Figma', 'Adobe XD', 'Visual Design', 'CSS', 'Motion Design'],
      snippet: 'Balanced UX/UI background with strong visual sensibility. Contributes to open-source design toolkits.',
      portfolio: 'elenamarino.co', linkedin: 'linkedin.com/in/elenamarino',
      file: 'ElenaMarino_CV.pdf', docType: 'cv', pages: 1,
    },
    {
      id: 7, name: 'Davide Russo',    ini: 'DR',
      role: 'Interaction Designer', exp: '2 yrs', loc: 'Genoa, Italy',
      email: 'davide.russo@gmail.com', phone: null,
      edu: 'IED Torino · BA Interaction Design',
      skills: ['Figma', 'Framer', 'Motion Design', 'Prototyping'],
      snippet: 'Specialises in micro-interactions. Freelancing for two startups.',
      portfolio: 'daviderusso.xyz', linkedin: null,
      // file type unclear — user uploaded both?
      file: 'DavideRusso_Work.pdf', docType: 'unknown', pages: 6,
    },
    {
      id: 8, name: 'Chiara Lombardi', ini: 'CL',
      role: 'UX Researcher',      exp: '6 yrs', loc: 'Milan, Italy',
      email: 'chiara.lombardi@gmail.com', phone: '+39 339 234 5678',
      edu: 'Università Cattolica · MA Psychology',
      skills: ['Mixed Methods', 'Usability Testing', 'Survey Design', 'Data Analysis'],
      snippet: 'Deep expertise in mixed-methods research. Reduced support tickets by 40% through research-led redesign.',
      portfolio: null, linkedin: 'linkedin.com/in/chiaralombardi',
      file: 'ChiaraLombardi_CV.pdf', docType: 'cv', pages: 2,
    },
  ],
  2: [
    {
      id: 10, name: 'Thomas Wright',  ini: 'TW',
      role: 'React Developer', exp: '5 yrs', loc: 'London, UK',
      email: 'thomas.wright@gmail.com', phone: '+44 7700 900123',
      edu: 'UCL · BSc Computer Science',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      snippet: 'Full-stack developer with a focus on React. Shipped several consumer-facing products at scale.',
      portfolio: null, linkedin: 'linkedin.com/in/thomaswright',
      file: 'ThomasWright_CV.pdf', docType: 'cv', pages: 2,
    },
    {
      id: 11, name: 'Nina Patel',     ini: 'NP',
      role: 'Frontend Dev', exp: '3 yrs', loc: 'Berlin, Germany',
      email: 'nina.patel@gmail.com', phone: '+49 176 1234 5678',
      edu: 'TU Berlin · MSc Informatics',
      skills: ['Vue.js', 'React', 'CSS', 'Accessibility', 'Performance'],
      snippet: 'Accessibility advocate. Built inclusive component libraries used by 10+ teams.',
      portfolio: 'ninapatel.dev', linkedin: 'linkedin.com/in/ninapatel',
      file: 'NinaPatel_CV.pdf', docType: 'cv', pages: 1,
    },
  ],
  3: [
    {
      id: 20, name: 'Sofia Esposito', ini: 'SE',
      role: 'Senior PM', exp: '8 yrs', loc: 'Milan, Italy',
      email: 'sofia.esposito@gmail.com', phone: '+39 340 123 4567',
      edu: 'Bocconi · MBA',
      skills: ['Product Strategy', 'OKRs', 'Data Analysis', 'Roadmapping', 'Agile'],
      snippet: 'Led 0-to-1 product launches at a fintech unicorn. Comfortable in ambiguous environments.',
      portfolio: null, linkedin: 'linkedin.com/in/sofiaesposito',
      file: 'SofiaEsposito_CV.pdf', docType: 'cv', pages: 3,
    },
  ],
  4: [], 5: [],
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 44 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

// ── Document type badge ────────────────────────────────────────────────────────
function DocTypeBadge({ type }) {
  const map = {
    cv:        { label: '📄 CV',        bg: C.infBg,  color: C.infT  },
    portfolio: { label: '🎨 Portfolio', bg: C.infBg, color: C.infT },
    unknown:   { label: '❓ Unknown',   bg: C.warBg,  color: C.warT  },
  }
  const t = map[type] || map.unknown
  return (
    <span style={{ background: t.bg, color: t.color, fontSize: 11, fontWeight: 600, padding: '4px 11px', borderRadius: 20 }}>
      {t.label}
    </span>
  )
}

// ── CV document placeholder ────────────────────────────────────────────────────
function CVDocumentMockup({ cv }) {
  const Line = ({ w = '100%', h = 7, mb = 5, color = '#E8E4E0' }) => (
    <div style={{ width: w, height: h, background: color, borderRadius: 2, marginBottom: mb }} />
  )
  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: 10, marginTop: 18, paddingBottom: 5, borderBottom: '1px solid #E8E4E0' }}>
      {children}
    </div>
  )

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: C.doc, padding: '0' }}>
      {/* Document header */}
      <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', marginBottom: 3, fontFamily: 'inherit' }}>{cv.name}</div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>{cv.role}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 9, color: '#888' }}>
          {cv.email    && <span>✉ {cv.email}</span>}
          {cv.phone    && <span>📞 {cv.phone}</span>}
          {cv.loc      && <span>📍 {cv.loc}</span>}
          {cv.linkedin && <span>💼 {cv.linkedin}</span>}
        </div>
      </div>

      {/* Experience */}
      <SectionTitle>Professional Experience</SectionTitle>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{cv.role}</span>
          <span style={{ fontSize: 9, color: '#888' }}>2022 – Present</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>TechCorp · {cv.loc}</div>
        <Line w="91%" /><Line w="84%" /><Line w="78%" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Mid Designer</span>
          <span style={{ fontSize: 9, color: '#888' }}>2020 – 2022</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>DesignStudio · Italy</div>
        <Line w="87%" /><Line w="72%" />
      </div>

      {/* Education */}
      <SectionTitle>Education</SectionTitle>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{cv.edu?.split('·')[1]?.trim() || 'Master of Design'}</span>
          <span style={{ fontSize: 9, color: '#888' }}>2016 – 2020</span>
        </div>
        <div style={{ fontSize: 9, color: '#888', marginBottom: 7 }}>{cv.edu?.split('·')[0]?.trim()}</div>
        <Line w="55%" />
      </div>

      {/* Skills */}
      <SectionTitle>Skills</SectionTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {cv.skills?.map(s => (
          <span key={s} style={{ background: '#F5F2EF', border: '1px solid #E0DDD9', borderRadius: 3, padding: '2px 8px', fontSize: 9, color: '#555' }}>{s}</span>
        ))}
      </div>

      {/* Additional content */}
      <SectionTitle>Projects & Highlights</SectionTitle>
      <Line w="94%" /><Line w="88%" /><Line w="76%" /><Line w="82%" /><Line w="68%" />
      <div style={{ marginTop: 12 }} />
      <Line w="90%" /><Line w="83%" /><Line w="71%" />
    </div>
  )
}

// ── Portfolio document placeholder ────────────────────────────────────────────
function PortfolioMockup({ cv }) {
  const projectColors = [
    ['#E8F0FE','#C5D8FD'], ['#FCE4EC','#F9B4C8'],
    ['#E8F5E9','#A5D6A7'], ['#FFF8E1','#FFE082'],
    ['#EDE7F6','#CE93D8'], ['#E3F2FD','#90CAF9'],
  ]
  const projects = [
    'Brand Identity', 'Web Redesign', 'App Design',
    'Design System', 'Illustrations', 'Motion Work',
  ]

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Portfolio header */}
      <div style={{ marginBottom: 22, paddingBottom: 14, borderBottom: '2px solid #1C1917' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1C1917', marginBottom: 3 }}>{cv.name}</div>
        <div style={{ fontSize: 11, color: '#888' }}>{cv.role} · Portfolio · {cv.pages} pages</div>
      </div>

      {/* Project grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {projects.map((p, i) => {
          const [bgLight, bgDark] = projectColors[i % projectColors.length]
          return (
            <div key={i} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid #EEE' }}>
              {/* Image area */}
              <div style={{ height: 70, background: `linear-gradient(135deg, ${bgLight}, ${bgDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, opacity: 0.6 }}>{'🎨📐📱🖥🎭✏'.split('')[i]}</span>
              </div>
              {/* Caption */}
              <div style={{ padding: '7px 10px', background: 'white' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#1C1917', marginBottom: 3 }}>{p}</div>
                <div style={{ height: 5, background: '#F0F0F0', borderRadius: 2 }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* About section */}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #E8E4E0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 9 }}>About this work</div>
        {[92, 85, 78, 88, 65].map((w, i) => (
          <div key={i} style={{ height: 6, background: '#E8E4E0', borderRadius: 2, marginBottom: 5, width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

// ── Unknown doc placeholder ───────────────────────────────────────────────────
function UnknownDocMockup({ cv }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>📎</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{cv.file}</div>
        <div style={{ fontSize: 12, color: C.muted }}>{cv.pages} pages · Could not auto-detect type</div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, maxWidth: 280, lineHeight: 1.6 }}>
        This document does not clearly match a CV or portfolio format. Please review it and identify it manually below.
      </div>
    </div>
  )
}

// ── Design-role check — only designers get a Portfolio tab ───────────────────
const DESIGN_KEYWORDS = ['design', 'ux', 'ui', 'visual', 'interaction', 'creative', 'brand', 'motion', 'art director']
function isDesignRole(role = '') {
  const lower = role.toLowerCase()
  return DESIGN_KEYWORDS.some(k => lower.includes(k))
}

// ── Portfolio link view (URL portfolio — no document) ─────────────────────────
function PortfolioLinkView({ cv }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '48px 40px', background: isDark ? C.gray : 'transparent' }}>
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
          background: '#EDE9FE', color: '#6D28D9',
          border: '1.5px solid #DDD8F9',
          fontSize: 14, fontWeight: 600, textDecoration: 'none',
          boxShadow: '0 2px 14px rgba(109,40,217,0.13)',
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

// ── Shared zoom footer ─────────────────────────────────────────────────────────
function ZoomBar({ zoom, setZoom, T }) {
  return (
    <div style={{ padding: '8px 16px', background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
      <span style={{ fontSize: 11, color: C.muted, width: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
      <button onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      <span style={{ width: 1, height: 16, background: C.border }} />
      <button onClick={() => setZoom(1)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{T.reset}</button>
    </div>
  )
}

// ── Left panel: document viewer ───────────────────────────────────────────────
function DocumentViewer({ cv, docType, onOverrideType, T, showPortfolio, leaving = false, leavingDir = 'right' }) {
  const [zoom, setZoom] = useState(1)

  // Is the uploaded *file* itself a portfolio PDF?
  const hasPDFPortfolio = docType === 'portfolio'
  // Does the candidate have a separate portfolio URL? (only relevant for non-design if somehow set — showPortfolio gates rendering)
  const hasURLPortfolio = !hasPDFPortfolio && !!cv.portfolio

  // Show Portfolio tab only when the role is a design role AND there's something to show
  const portfolioAvailable = showPortfolio && (hasPDFPortfolio || hasURLPortfolio)

  // Default view: portfolio if the uploaded file IS a portfolio (no CV to show)
  const [viewMode, setViewMode] = useState('cv')

  // Tab style helper
  const tabStyle = (active, _unused = false) => ({
    padding: '11px 20px',
    border: 'none',
    borderBottom: active ? `2px solid ${C.red}` : '2px solid transparent',
    background: 'none',
    color: active ? C.text : C.muted,
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

        {/* CV tab — always present (unless file IS a portfolio PDF and there's no CV) */}
        {!hasPDFPortfolio && (
          <button onClick={() => setViewMode('cv')} style={tabStyle(viewMode === 'cv')}>
            <span>📄</span>
            <span>CV</span>
            <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>· {cv.file}</span>
            <span style={{ fontSize: 9, color: C.muted }}>({cv.pages}p)</span>
          </button>
        )}

        {/* Portfolio tab — design roles only, when portfolio exists */}
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

        {/* Unknown-type identify buttons (right side of tab bar) */}
        {docType === 'unknown' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px' }}>
            <span style={{ fontSize: 10, color: C.muted }}>{T.identifyAs}</span>
            <button onClick={() => onOverrideType('cv')}        style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infBg}`,  background: C.infBg,  color: C.infT,    fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📄 CV</button>
            <button onClick={() => onOverrideType('portfolio')} style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infBg}`, background: C.infBg, color: C.infT, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🎨 Portfolio</button>
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
                {docType === 'unknown' && <UnknownDocMockup cv={cv} />}
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

        {/* ── Portfolio URL view — centered link, no document ── */}
        {viewMode === 'portfolio' && hasURLPortfolio && (
          <PortfolioLinkView cv={cv} />
        )}

      </div>
    </div>
  )
}

// ── Right panel: candidate info card + decisions ──────────────────────────────
function CandidateCard({ cv, docType, decision, onDecide, T }) {
  const isPortfolio = docType === 'portfolio'

  return (
    <div style={{ width: 320, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>

      {/* Candidate header */}
      <div style={{ padding: '20px 20px 16px', background: C.redBg, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <Av id={cv.id} ini={cv.ini} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>{cv.name}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{cv.role}</div>
          </div>
        </div>

        {/* Key facts row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cv.exp && (
            <span style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, color: C.text, display: 'flex', alignItems: 'center', gap: 5 }}>
              🕐 {cv.exp}
            </span>
          )}
          {cv.loc && (
            <span style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '3px 10px', fontSize: 11, color: C.text, display: 'flex', alignItems: 'center', gap: 5 }}>
              📍 {cv.loc}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>{T.skills}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cv.skills.map(s => (
                <span key={s} style={{ background: C.redBg, color: C.red, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, border: `1px solid ${C.redL}` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cv.edu && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{T.education}</p>
            <p style={{ fontSize: 12, color: C.text, margin: 0 }}>{cv.edu}</p>
          </div>
        )}

        {/* Links */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>{T.links}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {cv.email && (
              <a href={`mailto:${cv.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.text, textDecoration: 'none', padding: '7px 11px', background: C.gray, borderRadius: 8 }}>
                <span>✉</span> {cv.email}
              </a>
            )}
            {cv.phone && (
              <a href={`tel:${cv.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.text, textDecoration: 'none', padding: '7px 11px', background: C.gray, borderRadius: 8 }}>
                <span>📞</span> {cv.phone}
              </a>
            )}
            {cv.portfolio && (
              <a href={`https://${cv.portfolio}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.infT, textDecoration: 'none', padding: '7px 11px', background: C.infBg, borderRadius: 8 }}>
                <span>🎨</span> {cv.portfolio}
              </a>
            )}
            {cv.linkedin && (
              <a href={`https://${cv.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.infT, textDecoration: 'none', padding: '7px 11px', background: C.infBg, borderRadius: 8 }}>
                <span>💼</span> {cv.linkedin}
              </a>
            )}
            {!cv.email && !cv.phone && !cv.portfolio && !cv.linkedin && (
              <span style={{ fontSize: 12, color: C.muted }}>No links found in document</span>
            )}
          </div>
        </div>

        {/* Portfolio note */}
        {isPortfolio && (
          <div style={{ padding: '10px 13px', background: '#EDE7F6', borderRadius: 9, border: '1px solid #DDD8F9', marginBottom: 10 }}>
            <p style={{ fontSize: 11, color: '#6D28D9', margin: 0, lineHeight: 1.6 }}>
              <strong>Portfolio submitted.</strong> This document shows their work but may not include full employment history. Consider requesting a CV if you need it.
            </p>
          </div>
        )}
      </div>

      {/* Decision footer */}
      <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        {decision ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ padding: '11px 14px', borderRadius: 9, textAlign: 'center', background: decision === 'advance' ? C.redBg : C.infBg, border: `1px solid ${decision === 'advance' ? C.redL : C.infL}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: decision === 'advance' ? C.red : C.infT }}>
                {decision === 'advance' ? T.movingToScreen : T.notMovingDec}
              </span>
            </div>
            <button onClick={() => onDecide(null)} style={{ fontSize: 11, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
              {T.undoDecision}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onDecide('pass')} style={{ flex: 1, padding: '11px 0', borderRadius: 10, background: C.infBg, color: C.infT, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.notMovingFwd}
            </button>
            <button onClick={() => onDecide('advance')} style={{ flex: 1, padding: '11px 0', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {T.advance}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add position modal ────────────────────────────────────────────────────────
function AddPositionModal({ onAdd, onClose, T }) {
  const [title, setTitle] = useState('')
  const [dept,  setDept]  = useState('')

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.white, borderRadius: 14, padding: '28px 32px', width: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 20px' }}>{T.addNewPos}</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>{T.posTitle}</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Senior Data Scientist"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>{T.department}</label>
          <input
            value={dept}
            onChange={e => setDept(e.target.value)}
            placeholder="e.g. Data & Insights"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => { if (title) onAdd(title, dept) }}
            disabled={!title}
            style={{ flex: 1, padding: '10px 0', borderRadius: 9, background: title ? C.red : C.grayB, color: title ? 'white' : C.muted, border: 'none', fontSize: 13, fontWeight: 600, cursor: title ? 'pointer' : 'default', fontFamily: 'inherit' }}
          >
            {T.createPos}
          </button>
          <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 9, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            {T.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Left candidates list panel ─────────────────────────────────────────────────
function CandidateListPanel({ cvList, currentIdx, decisions, onSelect, advancing, passing, T }) {
  const remaining = cvList.filter(c => !decisions[c.id]).length
  return (
    <div style={{ width: 232, flexShrink: 0, background: C.white, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Batch progress */}
      <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{T.batchProgress}</div>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.gray, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.muted, lineHeight: 1 }}>{remaining}</div>
            <div style={{ fontSize: 8, color: C.muted, fontWeight: 600, marginTop: 2 }}>{T.remaining}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: 'rgba(37,99,235,0.08)', borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1E40AF', lineHeight: 1 }}>{passing}</div>
            <div style={{ fontSize: 8, color: '#1E40AF', fontWeight: 600, marginTop: 2 }}>{T.notFwd}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '7px 4px', background: C.redBg, borderRadius: 8 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.red, lineHeight: 1 }}>{advancing}</div>
            <div style={{ fontSize: 8, color: C.red, fontWeight: 600, marginTop: 2 }}>{T.advancing}</div>
          </div>
        </div>
      </div>
      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {cvList.map((c, i) => {
          const dec = decisions[c.id]
          const curr = i === currentIdx
          return (
            <button
              key={c.id}
              onClick={() => onSelect(i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '10px 13px', border: 'none',
                background: curr ? C.redBg : 'transparent',
                borderLeft: `3px solid ${curr ? C.red : 'transparent'}`,
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'background 0.12s',
              }}
            >
              <Av id={c.id} ini={c.ini} size={30} />
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: curr ? 600 : 400, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>{c.role} · {c.exp}</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: dec === 'advance' ? C.red : dec === 'pass' ? '#2563EB' : C.grayB,
              }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Triage completion screen ───────────────────────────────────────────────────
function CompletionScreen({ advancing, passing, onBackToPicker, T }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, background: C.white, padding: '0 64px' }}>

      {/* Illustration — layered circles with checkmark */}
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="44" cy="44" r="42" fill="rgba(27,36,97,0.07)"/>
        <circle cx="44" cy="44" r="30" fill="rgba(27,36,97,0.12)"/>
        <polyline points="27,44 37,54 61,30" stroke="#1B2461" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 12px', lineHeight: 1.2 }}>
          {T.allCaughtUp}
        </h2>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 18px', lineHeight: 1.8 }}>
          {T.allCaughtUpSub}
        </p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
          <span style={{ color: C.nav, fontWeight: 600 }}>{advancing} {T.advancing.toLowerCase()}</span>
          {' · '}
          <span style={{ color: C.red, fontWeight: 600 }}>{passing} {T.notFwd.toLowerCase()}</span>
        </p>
      </div>

      <button
        onClick={onBackToPicker}
        style={{ padding: '11px 28px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        {T.backToPositions}
      </button>
    </div>
  )
}

// ── Position picker card (same visual style as RecruiterDashboard) ─────────────
function TriagePositionCard({ pos, th, pending, closed, onOpen, onOpenCloseModal, onReopen, T }) {
  const [hov, setHov] = useState(false)
  const isEmpty = pending === 0
  const isClosed = !!closed

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => { if (!isClosed) onOpen(pos.id) }}
      style={{
        background: hov ? th.cardBgHov : th.cardBg,
        backdropFilter: th.blur, WebkitBackdropFilter: th.blur,
        border: `1px solid ${hov ? th.borderBrt : th.border}`,
        borderTop: `2.5px solid ${isClosed ? th.border : hov ? th.red : (isEmpty ? th.border : th.red + '66')}`,
        borderRadius: '0.75rem',
        padding: '20px 22px 18px',
        display: 'flex', flexDirection: 'column', gap: 16,
        transition: 'all 0.18s ease',
        opacity: isClosed ? 0.45 : isEmpty ? 0.62 : 1,
        cursor: !isClosed ? 'pointer' : 'default',
        boxShadow: hov && !isClosed
          ? `0 0 0 1px ${th.redGlow}, 0 8px 28px rgba(0,0,0,0.18)`
          : `0 2px 10px rgba(0,0,0,0.08)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            {!isEmpty && !isClosed && (
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: th.red, boxShadow: `0 0 6px ${th.redGlow}`, flexShrink: 0 }} />
            )}
            <div style={{ fontSize: 9, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pos.dept}</div>
            {isClosed && (
              closed?.reason === 'hired'
                ? <span style={{ fontSize: 9, fontWeight: 700, color: '#1B2461', background: 'rgba(27,36,97,0.09)', border: '1px solid rgba(27,36,97,0.22)', padding: '1px 7px', borderRadius: 20, letterSpacing: '0.06em' }}>✓ Filled</span>
                : <span style={{ fontSize: 9, fontWeight: 700, color: th.textDim, background: th.surface, border: `1px solid ${th.border}`, padding: '1px 7px', borderRadius: 20, letterSpacing: '0.06em' }}>🔍 No match</span>
            )}
          </div>
          <h2
            style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 21, fontWeight: 400, color: th.text, margin: 0, lineHeight: 1.2 }}
          >{pos.title}</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, fontWeight: 400, color: (isEmpty || isClosed) ? th.textDim : th.text, lineHeight: 1 }}>{pending}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: th.textDim, marginTop: 2, letterSpacing: '0.08em' }}>
            {isEmpty ? T.noCVs : T.pending}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: th.textDim }}>📅 {pos.openDays}d open</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isClosed && !isEmpty && (
            <span style={{ fontSize: 11, fontWeight: 600, color: hov ? th.red : th.textDim, transition: 'color 0.15s', letterSpacing: '0.02em' }}>
              {T.startTriage}
            </span>
          )}
          <button
            onClick={e => { e.stopPropagation(); isClosed ? onReopen(pos.id) : onOpenCloseModal(pos.id) }}
            title={isClosed ? 'Reopen position' : 'Close position'}
            style={{
              fontSize: 10,
              fontWeight: isClosed ? 400 : 600,
              color: isClosed ? th.textDim : 'white',
              background: isClosed ? 'transparent' : th.red,
              border: isClosed ? `1px solid ${th.border}` : 'none',
              borderRadius: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.13s',
            }}
          >
            {isClosed ? T.reopen : T.close}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Inline batch-import panel (replaces navigation to CVImportScreening) ──────
const IMPORT_FILES = [
  { name: 'GiuliaRossi_CV.pdf',    size: '1.2 MB' },
  { name: 'MarcoBianchi_CV.pdf',   size: '890 KB' },
  { name: 'SaraConti_CV.pdf',      size: '760 KB' },
  { name: 'LucaFerrari_CV.pdf',    size: '1.5 MB' },
  { name: 'AndreaRicci_CV.pdf',    size: '1.1 MB' },
  { name: 'ElenaMarino_CV.pdf',    size: '980 KB' },
  { name: 'DavideRusso_CV.pdf',    size: '1.4 MB' },
  { name: 'ChiaraLombardi_CV.pdf', size: '2.1 MB' },
]

function InlineBatchImport({ posTitle, onComplete, T }) {
  const [phase,    setPhase]    = useState('drop')  // 'drop' | 'loading'
  const [progress, setProgress] = useState(0)
  const [loaded,   setLoaded]   = useState(0)
  const total = IMPORT_FILES.length

  const startImport = () => {
    if (phase !== 'drop') return
    setPhase('loading')
    let prog = 0
    const timer = setInterval(() => {
      prog += 7
      const capped = Math.min(100, prog)
      setProgress(capped)
      setLoaded(Math.round((capped / 100) * total))
      if (capped >= 100) {
        clearInterval(timer)
        // Use position 1's CVs as mock imported data
        setTimeout(() => onComplete(TRIAGE_DATA[1]), 350)
      }
    }, 80)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.white, padding: '32px 40px' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            {T.badge}
          </div>
          <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: 0 }}>
            {T.importFor(posTitle)}
          </h2>
        </div>

        {/* Drop zone */}
        {phase === 'drop' && (
          <div
            onClick={startImport}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); startImport() }}
            style={{
              border: `2px dashed ${C.border}`,
              borderRadius: 14, padding: '52px 28px',
              textAlign: 'center', cursor: 'pointer',
              background: C.gray, transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.background = C.redBg }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.gray }}
          >
            <div style={{ fontSize: 44, marginBottom: 14 }}>📂</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>
              {T.dropZone}
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              {T.dropHint}<br />
              <span style={{ fontSize: 11 }}>{T.dropTypes}</span>
            </div>
          </div>
        )}

        {/* Loading phase */}
        {phase === 'loading' && (
          <div>
            {/* Progress bar + label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.muted, marginBottom: 8 }}>
              <span>{T.analysingOf(loaded, total)}</span>
              <span style={{ fontWeight: 600, color: C.red }}>{progress}%</span>
            </div>
            <div style={{ background: C.gray, borderRadius: 6, height: 6, marginBottom: 22, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: C.red, borderRadius: 6, width: `${progress}%`, transition: 'width 0.08s linear' }} />
            </div>

            {/* File list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {IMPORT_FILES.map((f, i) => {
                const done = i < loaded
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '9px 14px', borderRadius: 9,
                      background: C.white,
                      border: `1px solid ${done ? C.border : C.border}`,
                      opacity: done ? 1 : 0.38,
                      transition: 'opacity 0.25s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{f.name}</div>
                      <div style={{ fontSize: 10, color: done ? C.nav : C.muted }}>
                        {done ? T.fileAnalysed : T.fileWaiting}
                      </div>
                    </div>
                    {done && <span style={{ fontSize: 13, color: C.nav, fontWeight: 700 }}>✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Confetti shapes for celebration ──────────────────────────────────────────
const CONFETTI_SHAPES = [
  { color:'#D86350', x:8,  delay:0,    size:9,  circle:false, rotate:45  },
  { color:'#1B2461', x:18, delay:0.12, size:6,  circle:true,  rotate:0   },
  { color:'#D86350', x:30, delay:0.06, size:10, circle:false, rotate:-30 },
  { color:'#FBBF24', x:42, delay:0.18, size:7,  circle:true,  rotate:0   },
  { color:'#1B2461', x:54, delay:0.03, size:9,  circle:false, rotate:60  },
  { color:'#D86350', x:65, delay:0.15, size:6,  circle:true,  rotate:0   },
  { color:'#FBBF24', x:76, delay:0.09, size:8,  circle:false, rotate:-45 },
  { color:'#1B2461', x:88, delay:0.21, size:7,  circle:true,  rotate:0   },
  { color:'#D86350', x:12, delay:0.28, size:5,  circle:false, rotate:30  },
  { color:'#FBBF24', x:50, delay:0.33, size:8,  circle:true,  rotate:0   },
  { color:'#1B2461', x:72, delay:0.24, size:6,  circle:false, rotate:-60 },
  { color:'#D86350', x:36, delay:0.38, size:7,  circle:true,  rotate:0   },
  { color:'#FBBF24', x:92, delay:0.16, size:5,  circle:false, rotate:20  },
]

// ── Close position modal (choose reason → celebrate or silently close) ────────
function TriageCloseModal({ pos, th, onConfirm, onCancel }) {
  const [phase, setPhase] = useState('choose')

  const choose = (reason) => {
    if (reason === 'hired') setPhase('celebrate')
    else onConfirm('no-match')
  }

  if (phase === 'choose') {
    return (
      <div
        onClick={onCancel}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.42)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(6px)' }}
      >
        <style>{`@keyframes triageModalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div
          onClick={e => e.stopPropagation()}
          style={{ background: th.cardBg, borderRadius:'0.875rem', padding:'28px 30px', width:450, border:`1px solid ${th.borderBrt}`, boxShadow:'0 28px 72px rgba(0,0,0,0.2)', animation:'triageModalIn 0.22s ease' }}
        >
          <div style={{ fontSize:26, marginBottom:10 }}>🔒</div>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:21, color:th.text, marginBottom:8 }}>
            Close this position?
          </div>
          <p style={{ fontSize:13, color:th.textDim, lineHeight:1.65, margin:'0 0 22px' }}>
            <strong style={{ color:th.text }}>{pos.title}</strong> will be moved to the archive.
            No new candidates will be accepted. You can reopen it at any time.
          </p>

          <div style={{ fontSize:10, fontWeight:700, color:th.textDim, textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:10 }}>
            Why are you closing it?
          </div>

          <button
            onClick={() => choose('hired')}
            style={{ width:'100%', padding:'15px 16px', borderRadius:11, marginBottom:9, border:`2px solid ${th.red}44`, background:`${th.red}0D`, cursor:'pointer', fontFamily:'inherit', textAlign:'left', display:'flex', alignItems:'center', gap:13, transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=`${th.red}99`; e.currentTarget.style.background=`${th.red}1A` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=`${th.red}44`; e.currentTarget.style.background=`${th.red}0D` }}
          >
            <span style={{ fontSize:22, flexShrink:0 }}>🎯</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:th.red, marginBottom:3 }}>We found the right candidate</div>
              <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.5 }}>The position has been filled — great work.</div>
            </div>
          </button>

          <button
            onClick={() => choose('no-match')}
            style={{ width:'100%', padding:'15px 16px', borderRadius:11, marginBottom:22, border:`1px solid ${th.border}`, background:th.surface, cursor:'pointer', fontFamily:'inherit', textAlign:'left', display:'flex', alignItems:'center', gap:13, transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=th.borderBrt; e.currentTarget.style.background=th.surfaceHov }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=th.border; e.currentTarget.style.background=th.surface }}
          >
            <span style={{ fontSize:22, flexShrink:0 }}>🔍</span>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:th.textMid, marginBottom:3 }}>We didn't find anyone for now</div>
              <div style={{ fontSize:11, color:th.textDim, lineHeight:1.5 }}>Archived · You can revisit this in the closed positions below.</div>
            </div>
          </button>

          <button
            onClick={onCancel}
            style={{ width:'100%', padding:'10px', borderRadius:9, border:`1px solid ${th.border}`, background:'transparent', color:th.textMid, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Celebrate phase
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:300, backdropFilter:'blur(8px)' }}>
      <style>{`
        @keyframes triageConfettiPop{0%{transform:translateY(0) rotate(0deg) scale(1);opacity:0}12%{opacity:1}100%{transform:translateY(-180px) rotate(540deg) scale(0.3);opacity:0}}
        @keyframes triageCelebrateIn{0%{opacity:0;transform:scale(0.88) translateY(12px)}65%{transform:scale(1.02) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes triageTrophyBounce{0%{transform:scale(0) rotate(-15deg)}55%{transform:scale(1.25) rotate(8deg)}75%{transform:scale(0.92) rotate(-3deg)}100%{transform:scale(1) rotate(0deg)}}
        @keyframes triageShimmer{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>
      <div style={{ position:'relative', width:480 }}>
        {CONFETTI_SHAPES.map((s, i) => (
          <div key={i} style={{ position:'absolute', left:`${s.x}%`, bottom:'38%', width:s.size, height:s.size, background:s.color, borderRadius:s.circle?'50%':'2px', transform:`rotate(${s.rotate}deg)`, animation:`triageConfettiPop 1.6s cubic-bezier(0.25,0.46,0.45,0.94) ${s.delay}s both`, zIndex:10, pointerEvents:'none' }} />
        ))}
        <div style={{ background:th.cardBg, borderRadius:'1.1rem', padding:'40px 34px 32px', border:`1px solid ${th.borderBrt}`, boxShadow:'0 36px 90px rgba(0,0,0,0.24)', animation:'triageCelebrateIn 0.4s cubic-bezier(0.22,0.61,0.36,1) both', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% -10%, rgba(216,99,80,0.08) 0%, transparent 62%)', pointerEvents:'none', animation:'triageShimmer 2.5s ease-in-out infinite' }} />
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg, rgba(5,150,105,0.15) 0%, rgba(5,150,105,0.06) 100%)', border:'2px solid rgba(5,150,105,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 22px', animation:'triageTrophyBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.15s both' }}>
            <span style={{ fontSize:34 }}>🏆</span>
          </div>
          <div style={{ fontFamily:'DM Serif Display, serif', fontSize:28, color:th.text, marginBottom:10, lineHeight:1.2, letterSpacing:'-0.01em' }}>
            Position filled!
          </div>
          <p style={{ fontSize:14, color:th.textMid, lineHeight:1.75, margin:'0 0 6px' }}>
            You found the right person for <strong style={{ color:th.text }}>{pos.title}</strong>.
          </p>
          <p style={{ fontSize:13, color:th.textDim, lineHeight:1.75, margin:'0 0 28px', maxWidth:340, marginLeft:'auto', marginRight:'auto' }}>
            Great work bringing the right talent to the team — this is what it's all about.
          </p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:'5px 16px', marginBottom:26, fontSize:11, color:th.textDim }}>
            <span style={{ color:'#1B2461', fontWeight:700 }}>✓</span>
            Position closed · Reopen anytime
          </div>
          <div>
            <button
              onClick={() => onConfirm('hired')}
              style={{ padding:'13px 36px', borderRadius:10, background:th.red, color:'white', border:'none', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', boxShadow:`0 0 28px ${th.redGlow}`, transition:'transform 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
            >
              Done →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function CVTriage({ theme, themeMode, lang = 'en', onBack, onNavigate, initialPosition, extraCandidates }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const th = theme || { cardBg:'#fff', cardBgHov:'#f9f9f9', border:'#e5e5e5', borderBrt:'#ccc', textDim:'#999', textMid:'#555', text:'#111', red:'#C9394A', redGlow:'rgba(216,99,80,0.2)', blur:'blur(0px)', surface:'#F5F4F3', surfaceHov:'#EEECE9' }
  const T = SCREEN_T[lang] || SCREEN_T.en

  const [positions, setPositions] = useState(() => {
    const base = INIT_POSITIONS.map(p => {
      // Bump the count for the initial position if extraCandidates were injected
      if (extraCandidates?.length && initialPosition?.id === p.id) {
        return { ...p, count: p.count + extraCandidates.length }
      }
      return p
    })
    if (initialPosition && !base.find(p => p.id === initialPosition.id)) {
      return [...base, {
        id: initialPosition.id, title: initialPosition.title,
        dept: initialPosition.dept || '', count: extraCandidates?.length || 0, openDays: initialPosition.openDays || 0,
      }]
    }
    return base
  })
  const [activePosId, setActivePosId] = useState(() => initialPosition?.id ?? null)   // null = position picker
  const [idx,              setIdx]              = useState(0)
  const [decisions,        setDecisions]        = useState({})
  const [docTypeOverrides, setDocTypeOverrides] = useState({})
  const [showAddPos,       setShowAddPos]       = useState(false)
  const [closedPositions,  setClosedPositions]  = useState({})   // id → { reason: 'hired' | 'no-match' }
  const [closePending,     setClosePending]     = useState(null) // position id waiting for close reason
  // Batch import state — importedCVs stores mock CVs for any position that went through inline import
  // Pre-populate with any candidates injected from the Kanban "Add candidates" flow
  const [importedCVs,  setImportedCVs]  = useState(() =>
    extraCandidates?.length && initialPosition?.id
      ? { [initialPosition.id]: extraCandidates }
      : {}
  )
  // Auto-open the importer if CVTriage was opened with a new position that has no CVs
  // (skip if we already have extraCandidates to show)
  const [showImporter, setShowImporter] = useState(() =>
    initialPosition != null && !(TRIAGE_DATA[initialPosition.id]?.length > 0) && !(extraCandidates?.length > 0)
  )
  const [leaving,    setLeaving]    = useState(false)    // true while card exit-animation is running
  const [leavingDir, setLeavingDir] = useState('right')  // 'left' = rejected, 'right' = advanced

  const confirmClose = (reason) => {
    setClosedPositions(s => ({ ...s, [closePending]: { reason } }))
    setClosePending(null)
  }
  const reopenPosition = (id) => setClosedPositions(s => { const n = { ...s }; delete n[id]; return n })

  const activePos = positions.find(p => p.id === activePosId)
  // Merge TRIAGE_DATA + any imported (inline or from Kanban) for the active position
  const cvList    = [
    ...(TRIAGE_DATA[activePosId] || []),
    ...(importedCVs[activePosId] || []),
  ]
  const cv        = cvList[idx]
  const total     = cvList.length
  const decided   = cvList.filter(c => decisions[c.id]).length
  const advancing = cvList.filter(c => decisions[c.id] === 'advance').length
  const passing   = cvList.filter(c => decisions[c.id] === 'pass').length

  const effectiveDocType = (c) => docTypeOverrides[c?.id] || c?.docType || 'unknown'
  const goTo = (newIdx) => setIdx(Math.max(0, Math.min(total - 1, newIdx)))

  const handleDecide = (choice) => {
    if (!cv || leaving) return

    if (choice === null) {
      // Undo — no animation needed
      setDecisions(d => { const n = { ...d }; delete n[cv.id]; return n })
      return
    }

    // Record decision immediately (footer confirms before the card slides away)
    setDecisions(d => ({ ...d, [cv.id]: choice }))

    // Compute next undecided index before state updates
    const updated = { ...decisions, [cv.id]: choice }
    let nextIdx = cvList.findIndex((c, i) => i > idx && !updated[c.id])
    if (nextIdx === -1) nextIdx = cvList.findIndex(c => !updated[c.id])

    // Kick off 250 ms slide-out (rejected → left, advanced → right)
    setLeavingDir(choice === 'pass' ? 'left' : 'right')
    setLeaving(true)
    setTimeout(() => {
      if (nextIdx !== -1) goTo(nextIdx)
      setLeaving(false)
    }, 250)
  }

  const handleAddPosition = (title, dept) => {
    const newPos = { id: Date.now(), title, dept, count: 0, openDays: 0 }
    setPositions(p => [...p, newPos])
    setActivePosId(newPos.id)
    setIdx(0)
    setShowAddPos(false)
  }

  const handleOpenPosition = (id) => {
    setActivePosId(id)
    setIdx(0)
    // Always land on the warm empty state first; user taps "Import CVs" if they want to import
    setShowImporter(false)
  }

  const handleBackToPicker = () => {
    setActivePosId(null)
    setIdx(0)
  }

  // ── POSITION PICKER VIEW ──────────────────────────────────────────────────
  if (activePosId === null) {
    return (
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 32px 56px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: th.red, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>
                {T.badge}
              </p>
              <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 30, fontWeight: 400, color: th.text, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {T.selectPos}
              </h1>
              <p style={{ fontSize: 13, color: th.textDim, margin: 0 }}>
                {T.posCount(positions.length, positions.reduce((s, p) => s + (TRIAGE_DATA[p.id]?.length || 0), 0))}
              </p>
            </div>
            <button
              onClick={() => setShowAddPos(true)}
              style={{ padding: '10px 20px', borderRadius: '0.75rem', background: th.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em', boxShadow: `0 0 20px ${th.redGlow}` }}
            >
              {T.addPos}
            </button>
          </div>

          {/* Section divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: th.textDim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{T.openPositions}</span>
            <div style={{ flex: 1, height: 1, background: th.border }} />
          </div>

          {/* Position cards — same 3-column grid as dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {positions.map(pos => (
              <TriagePositionCard
                key={pos.id}
                pos={pos}
                th={th}
                pending={TRIAGE_DATA[pos.id]?.length || 0}
                closed={closedPositions[pos.id] || null}
                onOpen={handleOpenPosition}
                onOpenCloseModal={(id) => setClosePending(id)}
                onReopen={reopenPosition}
                T={T}
              />
            ))}
          </div>

        </div>

        {showAddPos && (
          <AddPositionModal onAdd={handleAddPosition} onClose={() => setShowAddPos(false)} T={T} />
        )}

        {closePending !== null && (() => {
          const pos = positions.find(p => p.id === closePending)
          return pos ? (
            <TriageCloseModal
              pos={pos}
              th={th}
              onConfirm={confirmClose}
              onCancel={() => setClosePending(null)}
            />
          ) : null
        })()}
      </div>
    )
  }

  // ── TRIAGE VIEW ───────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ padding: '12px 20px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={handleBackToPicker}
            style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {T.backPositions}
          </button>
          <span style={{ width: 1, height: 18, background: C.border }} />
          <div>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{activePos?.dept}</div>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 17, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2 }}>
              {activePos?.title || 'CV Triage'}
            </h1>
          </div>
        </div>

        {/* Stats + nav */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {advancing > 0 && <span style={{ background: C.navBg, color: C.navT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✓ {advancing} {T.advancing.toLowerCase()}</span>}
          {passing   > 0 && <span style={{ background: C.redBg, color: C.red, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✕ {passing} {T.notFwd.toLowerCase()}</span>}
          <span style={{ fontSize: 12, color: C.muted }}>{total > 0 ? `${idx + 1} / ${total}` : '0 CVs'}</span>
          <button onClick={() => goTo(idx - 1)} disabled={idx === 0}           style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${idx === 0 ? C.gray : C.border}`, background: C.white, cursor: idx === 0 ? 'default' : 'pointer', fontSize: 13, color: idx === 0 ? C.grayB : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => goTo(idx + 1)} disabled={idx === total - 1}   style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${idx === total - 1 ? C.gray : C.border}`, background: C.white, cursor: idx === total - 1 ? 'default' : 'pointer', fontSize: 13, color: idx === total - 1 ? C.grayB : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      </div>

      {/* Progress strip */}
      {total > 0 && (
        <>
          <div style={{ height: 3, background: C.gray, flexShrink: 0 }}>
            <div style={{ height: '100%', width: `${(decided / total) * 100}%`, background: C.red, transition: 'width 0.3s' }} />
          </div>
          <div style={{ padding: '4px 20px', background: C.white, display: 'flex', gap: 3, flexShrink: 0 }}>
            {cvList.map((c, i) => {
              const dec  = decisions[c.id]
              const curr = i === idx
              return (
                <button
                  key={c.id}
                  onClick={() => goTo(i)}
                  title={c.name}
                  style={{
                    flex: 1, height: 4, borderRadius: 2, border: 'none', cursor: 'pointer', padding: 0,
                    background: dec === 'advance' ? C.nav : dec === 'pass' ? '#FCA5A5' : curr ? C.red : C.border,
                    transform: curr ? 'scaleY(2)' : 'scaleY(1)', transition: 'all 0.15s',
                  }}
                />
              )
            })}
          </div>
        </>
      )}


      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: candidates list — only shown when there are CVs */}
        {total > 0 && (
          <CandidateListPanel
            cvList={cvList}
            currentIdx={idx}
            decisions={decisions}
            onSelect={goTo}
            advancing={advancing}
            passing={passing}
            T={T}
          />
        )}

        {/* All decided → completion screen (held back until exit animation finishes) */}
        {total > 0 && decided === total && !leaving && (
          <CompletionScreen
            advancing={advancing}
            passing={passing}
            onBackToPicker={handleBackToPicker}
            T={T}
          />
        )}

        {/* Still reviewing — only the document content slides; tab bar stays anchored */}
        {cv && !(decided === total && !leaving) && (
          <>
            <DocumentViewer
              key={cv?.id}
              cv={cv}
              docType={effectiveDocType(cv)}
              onOverrideType={(t) => setDocTypeOverrides(d => ({ ...d, [cv.id]: t }))}
              T={T}
              showPortfolio={isDesignRole(cv?.role)}
              leaving={leaving}
              leavingDir={leavingDir}
            />
            <CandidateCard
              cv={cv}
              docType={effectiveDocType(cv)}
              decision={decisions[cv.id]}
              onDecide={handleDecide}
              T={T}
            />
          </>
        )}

        {/* Empty position — show inline importer or empty placeholder */}
        {total === 0 && showImporter && (
          <InlineBatchImport
            posTitle={activePos?.title || ''}
            onComplete={(cvs) => {
              setImportedCVs(d => ({ ...d, [activePosId]: cvs }))
              setShowImporter(false)
            }}
            T={T}
          />
        )}
        {total === 0 && !showImporter && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, background: C.white, padding: '0 64px' }}>

            {/* Illustration — inbox tray with a quiet document floating above */}
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="44" cy="44" r="42" fill="#F5F4F3"/>
              {/* Inbox tray */}
              <rect x="16" y="52" width="56" height="20" rx="5" fill="white" stroke="#E5E2DF" strokeWidth="1.5"/>
              <path d="M16 62h16l4 7h16l4-7h16" stroke="#D5CFC9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Floating document */}
              <rect x="28" y="18" width="32" height="26" rx="4" fill="white" stroke="#E0DDD9" strokeWidth="1.5"/>
              <line x1="34" y1="27" x2="54" y2="27" stroke="#ECEAE7" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="34" y1="33" x2="54" y2="33" stroke="#ECEAE7" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="34" y1="39" x2="46" y2="39" stroke="#ECEAE7" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Three dots — suggesting items on the way */}
              <circle cx="38" cy="50" r="2" fill="#D5CFC9"/>
              <circle cx="44" cy="50" r="2" fill="#D5CFC9"/>
              <circle cx="50" cy="50" r="2" fill="#D5CFC9"/>
            </svg>

            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 12px', lineHeight: 1.2 }}>
                {T.noWaiting}
              </h2>
              <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.8 }}>
                {T.noWaitingSub}
              </p>
            </div>

            <button
              onClick={() => setShowImporter(true)}
              style={{ padding: '10px 24px', borderRadius: 9, background: 'transparent', color: C.red, border: `1.5px solid ${C.red}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {T.importCVs}
            </button>
          </div>
        )}
      </div>

      {showAddPos && (
        <AddPositionModal onAdd={handleAddPosition} onClose={() => setShowAddPos(false)} T={T} />
      )}
    </div>
  )
}
