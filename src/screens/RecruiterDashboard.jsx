// ─────────────────────────────────────────────────────────────────────────────
// RecruiterDashboard.jsx
// Drop into src/screens/RecruiterDashboard.jsx
// Fonts: add to index.css →
//   @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:    '#C9394A',
  redL:   '#FECDD3',
  redBg:  '#FFF5F6',
  text:   '#1C1917',
  muted:  '#78716C',
  border: '#F0D0D4',
  white:  '#FFFFFF',
  gray:   '#F5F4F3',
  grayB:  '#E5E2DF',
  suc:    '#059669', sucBg: '#D1FAE5', sucT: '#065F46',
  war:    '#D97706', warBg: '#FEF3C7', warT: '#92400E',
  inf:    '#2563EB', infBg: '#DBEAFE', infT: '#1E40AF',
}

// ── Mock data ─────────────────────────────────────────────────────────────────
export const POSITIONS = [
  { id: 1, title: 'UX Designer',        dept: 'Product Design',  total: 28, stage: 'Interviews',       urgent: 3, since: 'Mar 12', mgr: 'Marco T.' },
  { id: 2, title: 'Frontend Engineer',  dept: 'Engineering',     total: 45, stage: 'Screening',        urgent: 7, since: 'Apr 2',  mgr: 'Laura S.' },
  { id: 3, title: 'Product Manager',    dept: 'Product',         total: 19, stage: 'Preliminary Call', urgent: 1, since: 'Apr 28', mgr: 'Andrea M.' },
  { id: 4, title: 'Data Analyst',       dept: 'Data & Insights', total: 33, stage: 'Screening',        urgent: 5, since: 'May 5',  mgr: 'Sofia E.' },
  { id: 5, title: 'Brand Strategist',   dept: 'Marketing',       total: 12, stage: 'Offer',            urgent: 0, since: 'May 15', mgr: 'Giulio R.' },
]

export const PIPELINE = ['Screening', 'Preliminary Call', 'Interviews', 'Offer']

export const CANDIDATES = {
  1: [
    {
      id: 1, name: 'Giulia Rossi',    ini: 'GR', role: 'Mid UX Designer',
      stage: 'Interviews', last: 8, status: 'pre-selected',
      fb: [
        { by: 'Marco T.',  role: 'Hiring Manager', date: '3d ago',  txt: 'Strong portfolio and communication. Clear learning drive despite some design-systems gaps.', score: 4 },
        { by: 'Elena C.',  role: 'Tech Lead',       date: '5d ago',  txt: 'Enthusiastic and collaborative. Cultural fit is strong. Could sharpen complex problem-solving.', score: 3 },
      ],
    },
    {
      id: 2, name: 'Marco Bianchi',   ini: 'MB', role: 'Senior UX Designer',
      stage: 'Preliminary Call', last: 3, status: 'pre-selected',
      fb: [
        { by: 'Marco T.', role: 'Hiring Manager', date: '4d ago', txt: 'Excellent strategic thinking. Leads with empathy — exactly what the team needs at this stage.', score: 5 },
      ],
    },
    { id: 3, name: 'Sara Conti',      ini: 'SC', role: 'Junior UX Designer',  stage: 'Screening',        last: 1,  status: 'in-review',    fb: [] },
    {
      id: 4, name: 'Luca Ferrari',    ini: 'LF', role: 'Mid UX Designer',
      stage: 'Interviews', last: 12, status: 'pre-selected',
      fb: [
        { by: 'Andrea P.', role: 'Design Director', date: '12d ago', txt: 'Solid fundamentals. Needs coaching on stakeholder communication. Worth progressing.', score: 3 },
      ],
    },
    { id: 5, name: 'Elena Marino',    ini: 'EM', role: 'UX/UI Designer',      stage: 'Screening',        last: 0,  status: 'in-review',    fb: [] },
    { id: 6, name: 'Andrea Ricci',    ini: 'AR', role: 'Product Designer',    stage: 'Preliminary Call', last: 5,  status: 'considering',  fb: [] },
    {
      id: 7, name: 'Chiara Lombardi', ini: 'CL', role: 'UX Researcher',
      stage: 'Interviews', last: 14, status: 'pre-selected',
      fb: [
        { by: 'Marco T.', role: 'Hiring Manager', date: '14d ago', txt: 'Outstanding research depth. Would complement the team beautifully.', score: 5 },
      ],
    },
  ],
  2: [
    { id: 8,  name: 'Thomas Wright',   ini: 'TW', role: 'React Developer',  stage: 'Screening',        last: 2, status: 'in-review',   fb: [] },
    { id: 9,  name: 'Nina Patel',      ini: 'NP', role: 'Frontend Dev',     stage: 'Screening',        last: 6, status: 'in-review',   fb: [] },
    {
      id: 10, name: 'David Kim',       ini: 'DK', role: 'UI Engineer',
      stage: 'Preliminary Call', last: 9, status: 'pre-selected',
      fb: [{ by: 'Laura S.', role: 'Eng. Manager', date: '9d ago', txt: 'Strong TypeScript and React skills. Good communicator. Recommend advancing.', score: 4 }],
    },
  ],
  3: [{ id: 11, name: 'Sofia Esposito',  ini: 'SE', role: 'Senior PM',                stage: 'Preliminary Call', last: 4, status: 'pre-selected', fb: [] }],
  4: [{ id: 12, name: 'James Liu',        ini: 'JL', role: 'Data Scientist',           stage: 'Screening',        last: 7, status: 'in-review',   fb: [] }],
  5: [{
    id: 13, name: 'Valentina Greco', ini: 'VG', role: 'Senior Brand Strategist',
    stage: 'Offer', last: 1, status: 'pre-selected',
    fb: [{ by: 'Giulio R.', role: 'CMO', date: '5d ago', txt: 'Exceptional candidate. Creative vision aligns perfectly with our brand direction.', score: 5 }],
  }],
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  [C.redL, C.red],
  [C.infBg, C.inf],
  [C.sucBg, C.suc],
  [C.warBg, C.war],
  ['#EDE9FE', '#6D28D9'],
  ['#FCE7F3', '#BE185D'],
]
const avatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length]

function getUrgency(days) {
  if (days >= 7)  return { label: `${days}d ago`, color: C.red, bg: '#FEE2E2' }
  if (days >= 3)  return { label: `${days}d ago`, color: C.war, bg: C.warBg }
  if (days === 0) return { label: 'Today',        color: C.suc, bg: C.sucBg }
  return                 { label: `${days}d ago`, color: C.suc, bg: C.sucBg }
}

function getStagePill(stage) {
  const map = {
    'Screening':        { bg: '#F3F4F6', color: '#374151' },
    'Preliminary Call': { bg: C.infBg,  color: C.infT },
    'Interviews':       { bg: C.warBg,  color: C.warT },
    'Offer':            { bg: C.sucBg,  color: C.sucT },
  }
  return map[stage] || { bg: '#F3F4F6', color: '#374151' }
}

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Avatar({ id, ini, size = 36 }) {
  const [bg, color] = avatarColor(id)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 600, flexShrink: 0,
    }}>
      {ini}
    </div>
  )
}

function Pill({ children, bg, color }) {
  return (
    <span style={{
      background: bg, color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

// ── Candidate profile panel ───────────────────────────────────────────────────
function CandidatePanel({ candidate, onClose, onCraft }) {
  const [tab,  setTab]  = useState('Feedback')
  const [note, setNote] = useState('')

  const stageIdx = PIPELINE.indexOf(candidate.stage)

  return (
    <aside style={{
      width: 320, background: C.white,
      borderLeft: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      {/* ── Header ── */}
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
            <Avatar id={candidate.id} ini={candidate.ini} size={44} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{candidate.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
              <div style={{ fontSize: 11, color: C.muted }}>
                {candidate.name.toLowerCase().replace(' ', '.') + '@gmail.com'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 22, lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
        </div>

        {/* Pipeline timeline */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {PIPELINE.map((s, i) => {
            const past = i <= stageIdx
            const curr = i === stageIdx
            return (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < PIPELINE.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 7, left: '50%', width: '100%', height: 2,
                    background: i < stageIdx ? C.red : C.border, zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 14, height: 14, borderRadius: 3,
                  transform: 'rotate(45deg)',
                  background: curr ? C.red : past ? C.redL : C.gray,
                  border: `2px solid ${curr ? C.red : past ? C.redL : C.border}`,
                  zIndex: 1, marginBottom: 5,
                  boxShadow: curr ? `0 0 0 3px ${C.redBg}` : 'none',
                }} />
                <div style={{
                  fontSize: 8, textAlign: 'center', lineHeight: 1.2,
                  color: curr ? C.red : C.muted,
                  fontWeight: curr ? 600 : 400,
                }}>
                  {s === 'Preliminary Call' ? 'Pre-Call' : s}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {['Feedback', 'History', 'Docs'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '10px 0',
              border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.red : C.muted,
              borderBottom: `2px solid ${tab === t ? C.red : 'transparent'}`,
              fontFamily: 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px' }}>

        {/* Feedback tab */}
        {tab === 'Feedback' && (
          <>
            {candidate.fb.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: C.muted }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>📋</div>
                <div style={{ fontSize: 13 }}>No feedback yet</div>
                <div style={{ fontSize: 11, marginTop: 3 }}>Appears after interviews</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 16 }}>
                {candidate.fb.map((f, i) => (
                  <div key={i} style={{ background: C.redBg, borderRadius: 10, padding: '11px 13px', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{f.by}</span>
                        <span style={{ fontSize: 10, color: C.muted, marginLeft: 5 }}>{f.role}</span>
                      </div>
                      <span style={{ fontSize: 10, color: C.muted }}>{f.date}</span>
                    </div>
                    <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: 0 }}>{f.txt}</p>
                    <div style={{ marginTop: 7, display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ fontSize: 12, color: s <= f.score ? C.red : C.border }}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Internal note */}
            <div style={{ marginTop: 6 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
                Internal note
              </p>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for the team..."
                style={{
                  width: '100%', padding: '9px 11px', borderRadius: 8,
                  border: `1.5px solid ${C.border}`, fontSize: 12, resize: 'none',
                  height: 70, color: C.text, lineHeight: 1.6,
                  boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button style={{
                marginTop: 6, padding: '6px 14px', borderRadius: 7,
                background: C.red, color: 'white', border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Post
              </button>
            </div>
          </>
        )}

        {/* History tab */}
        {tab === 'History' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { ev: 'Message sent',      det: 'Interview invitation',          d: '3d ago',  ic: '✉' },
              { ev: 'Stage moved',       det: 'Pre-Call → Interviews',         d: '5d ago',  ic: '→' },
              { ev: 'Message sent',      det: 'Preliminary call confirmation', d: '8d ago',  ic: '✉' },
              { ev: 'Added to position', det: 'UX Designer',                   d: '12d ago', ic: '+' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: 14, position: 'relative' }}>
                {i < 3 && (
                  <div style={{ position: 'absolute', left: 13, top: 26, bottom: 0, width: 1, background: C.border }} />
                )}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: C.redBg, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: C.red, flexShrink: 0,
                }}>
                  {h.ic}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{h.ev}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{h.det}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{h.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Docs tab */}
        {tab === 'Docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { name: `Resume_${candidate.name.replace(' ', '')}.pdf`, size: '1.2 MB' },
              { name: 'Portfolio_2026.pdf', size: '4.8 MB' },
            ].map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 13px', borderRadius: 8,
                border: `1px solid ${C.border}`, background: C.white,
              }}>
                <span style={{ fontSize: 20 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{d.name}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{d.size}</div>
                </div>
                <span style={{ fontSize: 12, color: C.red, cursor: 'pointer' }}>↓</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer actions ── */}
      <div style={{ padding: '13px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
        <button
          onClick={() => onCraft(candidate)}
          style={{
            flex: 1, padding: '9px 0', borderRadius: 8,
            background: C.red, color: 'white', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ✉ Craft Message
        </button>
        <button style={{
          padding: '9px 13px', borderRadius: 8,
          background: C.gray, color: C.muted, border: 'none',
          fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          → Move
        </button>
      </div>
    </aside>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
// Props:
//   onNavigate(screen, candidate?) — called when user clicks "Import CVs" or "✉ Message"
export default function RecruiterDashboard({ onNavigate }) {
  const [activePos,          setActivePos]          = useState(1)
  const [selectedCandidate,  setSelectedCandidate]  = useState(null)
  const [stageFilter,        setStageFilter]        = useState('All')
  const [sortBy,             setSortBy]             = useState('urgency')

  const position = POSITIONS.find(p => p.id === activePos)
  const allCands = CANDIDATES[activePos] || []

  const filtered = allCands
    .filter(c => stageFilter === 'All' || c.stage === stageFilter)
    .sort((a, b) => sortBy === 'urgency'
      ? b.last - a.last
      : a.name.localeCompare(b.name)
    )

  const handleSelectPosition = (id) => {
    setActivePos(id)
    setSelectedCandidate(null)
    setStageFilter('All')
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Main column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{
          padding: '20px 28px',
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: 21,
              fontFamily: 'DM Serif Display, Georgia, serif',
              color: C.text, fontWeight: 400,
            }}>
              Good morning, Sarah ☀️
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>
              Monday, 25 May 2026 · 5 open positions
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: '#FEE2E2', color: C.red, fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 20 }}>
              ● 16 need follow-up
            </span>
            <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 20 }}>
              8 messages sent today
            </span>
            <button
              onClick={() => onNavigate?.('import')}
              style={{
                padding: '8px 15px', borderRadius: 8,
                background: C.red, color: 'white', border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              + Import CVs
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Position cards ── */}
          <section>
            <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Open Positions
            </p>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {POSITIONS.map(p => {
                const s      = getStagePill(p.stage)
                const active = activePos === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPosition(p.id)}
                    style={{
                      minWidth: 175, padding: '14px 16px', borderRadius: 12,
                      border: `2px solid ${active ? C.red : C.border}`,
                      background: active ? C.redBg : C.white,
                      cursor: 'pointer', textAlign: 'left', flexShrink: 0,
                      transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 11 }}>{p.dept}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: active ? C.red : C.text, fontFamily: 'DM Serif Display, serif' }}>
                          {p.total}
                        </div>
                        <div style={{ fontSize: 10, color: C.muted }}>applicants</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>
                          {p.stage === 'Preliminary Call' ? 'Pre-Call' : p.stage}
                        </span>
                        {p.urgent > 0 && (
                          <div style={{ fontSize: 10, color: C.red, fontWeight: 600, marginTop: 3 }}>
                            ⚑ {p.urgent} urgent
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Candidate list ── */}
          {position && (
            <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

              {/* Section header + filters */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.text }}>{position.title}</h2>
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: C.muted }}>
                    Manager: {position.mgr} · Open since {position.since} · {allCands.length} applicants
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Stage filter pills */}
                  <div style={{ display: 'flex', gap: 2, background: C.gray, borderRadius: 8, padding: 3 }}>
                    {['All', 'Screening', 'Pre-Call', 'Interviews', 'Offer'].map(label => {
                      const val = label === 'Pre-Call' ? 'Preliminary Call' : label
                      const active = stageFilter === val
                      return (
                        <button
                          key={label}
                          onClick={() => setStageFilter(val)}
                          style={{
                            padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                            fontSize: 11, fontFamily: 'inherit',
                            background: active ? C.white : 'transparent',
                            color: active ? C.text : C.muted,
                            fontWeight: active ? 600 : 400,
                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
                          }}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{
                      padding: '5px 9px', borderRadius: 8,
                      border: `1px solid ${C.border}`,
                      fontSize: 11, color: C.text, background: C.white,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    <option value="urgency">↑ Urgency</option>
                    <option value="name">A–Z Name</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>

                {/* Column headers */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 0.9fr 1fr 115px',
                  padding: '10px 22px',
                  background: C.gray,
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  {['Candidate', 'Stage', 'Last contact', 'Status', 'Actions'].map(h => (
                    <span key={h} style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {h}
                    </span>
                  ))}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                  <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>
                    No candidates in this stage
                  </div>
                )}

                {/* Rows */}
                {filtered.map((c, i) => {
                  const u     = getUrgency(c.last)
                  const s     = getStagePill(c.stage)
                  const isSel = selectedCandidate?.id === c.id

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(isSel ? null : c)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.2fr 0.9fr 1fr 115px',
                        alignItems: 'center',
                        padding: '12px 22px',
                        borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                        background: isSel ? C.redBg : C.white,
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                    >
                      {/* Candidate */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <Avatar id={c.id} ini={c.ini} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{c.role}</div>
                        </div>
                      </div>

                      {/* Stage */}
                      <Pill bg={s.bg} color={s.color}>
                        {c.stage === 'Preliminary Call' ? 'Pre-Call' : c.stage}
                      </Pill>

                      {/* Last contact urgency */}
                      <Pill bg={u.bg} color={u.color}>{u.label}</Pill>

                      {/* Status */}
                      <span style={{ fontSize: 11, color: C.muted, textTransform: 'capitalize' }}>
                        {c.status.replace('-', ' ')}
                      </span>

                      {/* Actions — stop propagation so row click doesn't fire */}
                      <div onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onNavigate?.('craft', c)}
                          style={{
                            padding: '5px 11px', borderRadius: 7,
                            border: `1.5px solid ${C.red}`,
                            background: C.white, color: C.red,
                            fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          ✉ Message
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ── Candidate profile panel ── */}
      {selectedCandidate && (
        <CandidatePanel
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onCraft={(c) => onNavigate?.('craft', c)}
        />
      )}
    </div>
  )
}
