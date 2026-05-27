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

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
  doc: '#1C1917', // document text colour
}

// ── Positions ─────────────────────────────────────────────────────────────────
const INIT_POSITIONS = [
  { id: 1, title: 'UX Designer',       dept: 'Product Design',  count: 8 },
  { id: 2, title: 'Frontend Engineer', dept: 'Engineering',     count: 5 },
  { id: 3, title: 'Product Manager',   dept: 'Product',         count: 3 },
  { id: 4, title: 'Data Analyst',      dept: 'Data & Insights', count: 4 },
  { id: 5, title: 'Brand Strategist',  dept: 'Marketing',       count: 2 },
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
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
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
    portfolio: { label: '🎨 Portfolio', bg: '#EDE9FE', color: '#6D28D9' },
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

// ── Left panel: document viewer ───────────────────────────────────────────────
function DocumentViewer({ cv, docType, onOverrideType }) {
  const [zoom, setZoom] = useState(1)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F0EDE9' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px 16px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DocTypeBadge type={docType} />
          <span style={{ fontSize: 11, color: C.muted }}>{cv.file}</span>
          <span style={{ fontSize: 10, color: C.muted }}>· {cv.pages} page{cv.pages !== 1 ? 's' : ''}</span>
        </div>

        {/* Manual type override */}
        {docType === 'unknown' && (
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, marginRight: 4 }}>Identify as:</span>
            <button onClick={() => onOverrideType('cv')}        style={{ padding: '3px 10px', borderRadius: 7, border: `1px solid ${C.infBg}`,    background: C.infBg,    color: C.infT,    fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📄 CV</button>
            <button onClick={() => onOverrideType('portfolio')} style={{ padding: '3px 10px', borderRadius: 7, border: '1px solid #DDD8F9',        background: '#EDE7F6', color: '#6D28D9', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🎨 Portfolio</button>
          </div>
        )}
        {docType !== 'unknown' && (
          <button onClick={() => onOverrideType(docType === 'cv' ? 'portfolio' : 'cv')}
            style={{ fontSize: 10, color: C.muted, background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, padding: '3px 9px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {docType === 'cv' ? 'Mark as Portfolio' : 'Mark as CV'}
          </button>
        )}
      </div>

      {/* Document scroll area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'white',
          width: `${Math.min(100, 72 * zoom)}%`,
          minHeight: '100%',
          padding: '48px 52px',
          boxShadow: '0 2px 24px rgba(0,0,0,0.10)',
          borderRadius: 2,
          boxSizing: 'border-box',
        }}>
          {docType === 'cv'        && <CVDocumentMockup cv={cv} />}
          {docType === 'portfolio' && <PortfolioMockup  cv={cv} />}
          {docType === 'unknown'   && <UnknownDocMockup cv={cv} />}
        </div>
      </div>

      {/* Zoom controls */}
      <div style={{ padding: '8px 16px', background: C.white, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={() => setZoom(z => Math.max(0.6, z - 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontSize: 11, color: C.muted, width: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(1.6, z + 0.1))} style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        <span style={{ width: 1, height: 16, background: C.border }} />
        <button onClick={() => setZoom(1)} style={{ fontSize: 10, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
      </div>
    </div>
  )
}

// ── Right panel: candidate info card + decisions ──────────────────────────────
function CandidateCard({ cv, docType, decision, onDecide }) {
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
            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cv.skills.map(s => (
                <span key={s} style={{ background: C.redBg, color: C.red, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, border: `1px solid ${C.redL}` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience snippet */}
        {cv.snippet && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>Experience</p>
            <div style={{ padding: '11px 13px', background: C.gray, borderRadius: 9, borderLeft: `3px solid ${C.redL}` }}>
              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, margin: 0 }}>{cv.snippet}</p>
            </div>
          </div>
        )}

        {/* Education */}
        {cv.edu && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Education</p>
            <p style={{ fontSize: 12, color: C.text, margin: 0 }}>{cv.edu}</p>
          </div>
        )}

        {/* Links */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>Links</p>
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
              <a href={`https://${cv.portfolio}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6D28D9', textDecoration: 'none', padding: '7px 11px', background: '#EDE7F6', borderRadius: 8 }}>
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
            <div style={{ padding: '11px 14px', borderRadius: 9, textAlign: 'center', background: decision === 'advance' ? C.sucBg : '#FEF2F2', border: `1px solid ${decision === 'advance' ? '#BBF7D0' : '#FECACA'}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: decision === 'advance' ? C.sucT : C.red }}>
                {decision === 'advance' ? '✓ Moving to screening' : '✕ Not moving forward'}
              </span>
            </div>
            <button onClick={() => onDecide(null)} style={{ fontSize: 11, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
              Undo decision
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onDecide('pass')} style={{ flex: 1, padding: '11px 0', borderRadius: 10, background: '#FEF2F2', color: C.red, border: '2px solid #FECACA', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✕ Not moving forward
            </button>
            <button onClick={() => onDecide('advance')} style={{ flex: 1, padding: '11px 0', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✓ Advance
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Add position modal ────────────────────────────────────────────────────────
function AddPositionModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [dept,  setDept]  = useState('')

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: C.white, borderRadius: 14, padding: '28px 32px', width: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
        <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 20px' }}>Add new position</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Position title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Senior Data Scientist"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>Department</label>
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
            Create position
          </button>
          <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 9, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function CVTriage({ onBack, onNavigate }) {
  const [positions,     setPositions]     = useState(INIT_POSITIONS)
  const [activePosId,   setActivePosId]   = useState(1)
  const [idx,           setIdx]           = useState(0)
  const [decisions,     setDecisions]     = useState({})       // id → 'advance' | 'pass'
  const [docTypeOverrides, setDocTypeOverrides] = useState({}) // id → 'cv' | 'portfolio'
  const [showAddPos,    setShowAddPos]     = useState(false)

  const cvList   = TRIAGE_DATA[activePosId] || []
  const cv       = cvList[idx]
  const total    = cvList.length
  const decided  = cvList.filter(c => decisions[c.id]).length
  const advancing = cvList.filter(c => decisions[c.id] === 'advance').length
  const passing   = cvList.filter(c => decisions[c.id] === 'pass').length

  const effectiveDocType = (c) => docTypeOverrides[c?.id] || c?.docType || 'unknown'

  const goTo = (newIdx) => setIdx(Math.max(0, Math.min(total - 1, newIdx)))

  const handleDecide = (choice) => {
    if (!cv) return
    setDecisions(d => choice === null
      ? (() => { const n = { ...d }; delete n[cv.id]; return n })()
      : { ...d, [cv.id]: choice }
    )
    // Auto-advance to next undecided
    if (choice !== null) {
      const nextUndecided = cvList.findIndex((c, i) => i > idx && !decisions[c.id])
      if (nextUndecided !== -1) setTimeout(() => goTo(nextUndecided), 300)
    }
  }

  const handleAddPosition = (title, dept) => {
    const newPos = { id: Date.now(), title, dept, count: 0 }
    setPositions(p => [...p, newPos])
    setActivePosId(newPos.id)
    setIdx(0)
    setShowAddPos(false)
  }

  const handleSelectPosition = (id) => {
    setActivePosId(id)
    setIdx(0)
  }

  if (!cv && total === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>←</button>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 19, fontWeight: 400, color: C.text, margin: 0 }}>CV Triage</h1>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, color: C.muted }}>
          <div style={{ fontSize: 36 }}>📂</div>
          <p style={{ fontSize: 14, margin: 0 }}>No CVs imported for this position yet</p>
          <button onClick={() => onNavigate?.('import')} style={{ padding: '8px 18px', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Import CVs →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{ padding: '12px 20px', background: C.white, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>←</button>
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 18, fontWeight: 400, color: C.text, margin: 0 }}>CV Triage</h1>
          <span style={{ width: 1, height: 18, background: C.border }} />
          {/* Position pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {positions.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPosition(p.id)}
                style={{
                  padding: '5px 13px', borderRadius: 20, cursor: 'pointer',
                  border: `2px solid ${activePosId === p.id ? C.red : C.border}`,
                  background: activePosId === p.id ? C.red : C.white,
                  color: activePosId === p.id ? 'white' : C.muted,
                  fontSize: 11, fontWeight: activePosId === p.id ? 600 : 400,
                  fontFamily: 'inherit', transition: 'all 0.13s',
                }}
              >
                {p.title}
              </button>
            ))}
            <button
              onClick={() => setShowAddPos(true)}
              style={{ padding: '5px 13px', borderRadius: 20, border: `2px dashed ${C.border}`, background: 'transparent', color: C.muted, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + Position
            </button>
          </div>
        </div>

        {/* Stats + nav */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {advancing > 0 && <span style={{ background: C.sucBg, color: C.sucT, fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✓ {advancing} advancing</span>}
          {passing   > 0 && <span style={{ background: '#FEE2E2', color: C.red,  fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>✕ {passing} not moving fwd</span>}
          <span style={{ fontSize: 12, color: C.muted }}>{idx + 1} / {total}</span>
          <button onClick={() => goTo(idx - 1)} disabled={idx === 0}             style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${idx === 0 ? C.gray : C.border}`, background: C.white, cursor: idx === 0 ? 'default' : 'pointer', fontSize: 13, color: idx === 0 ? C.grayB : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={() => goTo(idx + 1)} disabled={idx === total - 1}     style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${idx === total - 1 ? C.gray : C.border}`, background: C.white, cursor: idx === total - 1 ? 'default' : 'pointer', fontSize: 13, color: idx === total - 1 ? C.grayB : C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      </div>

      {/* ── Progress strip ── */}
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
                background: dec === 'advance' ? C.suc : dec === 'pass' ? '#FCA5A5' : curr ? C.red : C.border,
                transform: curr ? 'scaleY(2)' : 'scaleY(1)', transition: 'all 0.15s',
              }}
            />
          )
        })}
      </div>

      {/* ── Main: document left + card right ── */}
      {cv && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DocumentViewer
            cv={cv}
            docType={effectiveDocType(cv)}
            onOverrideType={(t) => setDocTypeOverrides(d => ({ ...d, [cv.id]: t }))}
          />
          <CandidateCard
            cv={cv}
            docType={effectiveDocType(cv)}
            decision={decisions[cv.id]}
            onDecide={handleDecide}
          />
        </div>
      )}

      {/* Add position modal */}
      {showAddPos && (
        <AddPositionModal onAdd={handleAddPosition} onClose={() => setShowAddPos(false)} />
      )}
    </div>
  )
}
