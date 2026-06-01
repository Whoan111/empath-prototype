// ─────────────────────────────────────────────────────────────────────────────
// HiringManagerSummary.jsx
// Place in: src/screens/HiringManagerSummary.jsx
//
// Decision brief for the hiring manager: aggregated view of all interview
// feedbacks for a candidate, with an AI synthesis to help make the final call.
//
// Props:
//   candidate    — candidate object (optional, defaults to mock data)
//   onBack()     — navigate back
//   onNavigate() — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const SCREEN_T = {
  en: {
    back:              '← Back',
    applied:           'Applied',
    interviewsDone:    (n) => `${n} interviews completed`,
    recommendAdvance:  (a, t) => `${a} of ${t} recommend advancing`,
    feedbackTitle:     'Interview feedback',
    clickCollapse:     'Click any card to collapse',
    empath:            '✦ Empath synthesis',
    overallScore:      'Overall score / 5.0',
    scoreBreakdown:    'Score breakdown',
    strengths:         'Consistent strengths',
    developAreas:      'Development areas',
    consensus:         'Interviewer consensus',
    recommendation:    '✦ Recommendation',
    advanceRec:        '✓ Advance recommended',
    lowRisk:           'Low risk',
    yourDecision:      'Your decision',
    changeDecision:    'Change decision',
    movingFwd:         '✓ Moving forward — recruiter will be notified',
    notMovingFwd:      '✕ Not moving forward — recruiter will be notified',
    anotherRound:      '↺ Another round requested',
    advance:           '✓ Move forward',
    requestRound:      '↺ Request another round',
    notForward:        '✕ Not moving forward',
    sendUpdate:        '✉ Send update to candidate',
    roundLabel:        (n) => `Round ${n}:`,
    highlights:        'Highlights',
    areasToDevp:       'Areas to develop',
    advancePill:       '✓ Advance',
    passPill:          '✕ Pass',
  },
  it: {
    back:              '← Indietro',
    applied:           'Candidato il',
    interviewsDone:    (n) => `${n} interviste completate`,
    recommendAdvance:  (a, t) => `${a} di ${t} raccomandano di avanzare`,
    feedbackTitle:     'Feedback interviste',
    clickCollapse:     'Clicca su una scheda per ridurla',
    empath:            '✦ Sintesi Empath',
    overallScore:      'Punteggio totale / 5.0',
    scoreBreakdown:    'Dettaglio punteggi',
    strengths:         'Punti di forza costanti',
    developAreas:      'Aree di sviluppo',
    consensus:         'Consenso intervistatori',
    recommendation:    '✦ Raccomandazione',
    advanceRec:        '✓ Avanzamento raccomandato',
    lowRisk:           'Rischio basso',
    yourDecision:      'La tua decisione',
    changeDecision:    'Cambia decisione',
    movingFwd:         '✓ Avanza — il recruiter verrà notificato',
    notMovingFwd:      '✕ Non avanza — il recruiter verrà notificato',
    anotherRound:      '↺ Altro round richiesto',
    advance:           '✓ Avanza',
    requestRound:      '↺ Richiedi altro round',
    notForward:        '✕ Non avanza',
    sendUpdate:        '✉ Invia aggiornamento al candidato',
    roundLabel:        (n) => `Round ${n}:`,
    highlights:        'Punti salienti',
    areasToDevp:       'Aree da sviluppare',
    advancePill:       '✓ Avanza',
    passPill:          '✕ Non avanza',
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:   '#C9394A', redH: '#A82D3B', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CANDIDATE = {
  id: 1, name: 'Giulia Rossi', ini: 'GR',
  role: 'UX Designer', stage: 'Interviews',
  pos: 'UX Designer', email: 'giulia.rossi@gmail.com',
  appliedDate: '10 Apr 2026',
}

// Three interviewers — richer dataset for the decision brief
const MOCK_INTERVIEWS = [
  {
    id: 1, round: 1, type: 'Portfolio & Experience Review',
    interviewer: 'Marco T.', interviewerRole: 'Hiring Manager', avatarIni: 'MT',
    date: '14 May 2026', duration: '60 min',
    overallRating: 4,
    scores: { communication: 5, technicalSkill: 3, culturalFit: 4, growthPotential: 5 },
    summary: 'Strong portfolio and excellent communication skills. Giulia clearly understands user-centred design and can articulate her decisions well. Some gaps in design systems knowledge, but she demonstrates strong motivation to grow.',
    highlights: [
      'Led end-to-end redesign that increased task completion by 34%',
      'Confidently walked through research-led decisions with real data',
      "Asked thoughtful questions about the team's design process",
    ],
    concerns: ['Design systems depth needs development'],
    recommendation: 'advance',
    note: 'I would be comfortable having her join the team. The systems knowledge is teachable — the mindset is not.',
  },
  {
    id: 2, round: 2, type: 'Technical Deep-Dive',
    interviewer: 'Elena C.', interviewerRole: 'Tech Lead', avatarIni: 'EC',
    date: '17 May 2026', duration: '45 min',
    overallRating: 3,
    scores: { communication: 4, technicalSkill: 3, culturalFit: 5, growthPotential: 4 },
    summary: 'Enthusiastic and highly collaborative. Cultural alignment is strong — she would fit in well. Complex problem-solving under pressure could be developed further, but her growth mindset is evident.',
    highlights: [
      'Demonstrated strong empathy for end-users throughout',
      'Responded openly to difficult hypotheticals rather than deflecting',
      'Flagged a potential accessibility issue in the design exercise unprompted',
    ],
    concerns: ['Could develop more structured problem decomposition under pressure'],
    recommendation: 'advance',
    note: 'Culture fit is a clear yes. Technically she needs support on systems but she\'s coachable.',
  },
  {
    id: 3, round: 3, type: 'Values & Leadership Potential',
    interviewer: 'Andrea P.', interviewerRole: 'Design Director', avatarIni: 'AP',
    date: '20 May 2026', duration: '30 min',
    overallRating: 5,
    scores: { communication: 5, technicalSkill: 4, culturalFit: 5, growthPotential: 5 },
    summary: 'Outstanding. Giulia brings a rare combination of strategic thinking and genuine empathy. She speaks about design in terms of people, not just pixels. The team would grow with her.',
    highlights: [
      'Articulated a clear point of view on inclusive design without prompting',
      'Described a situation where she pushed back on stakeholders constructively',
      'Asked about the team\'s design maturity and what growing it would look like',
    ],
    concerns: [],
    recommendation: 'advance',
    note: 'Strong recommend. This is the kind of designer who elevates everyone around them.',
  },
]

// AI synthesis data
const SYNTHESIS = {
  overallScore: 4.0,
  scoredCriteria: [
    { label: 'Communication',    score: 4.7, color: C.suc  },
    { label: 'Technical skill',  score: 3.3, color: C.war  },
    { label: 'Cultural fit',     score: 4.7, color: C.suc  },
    { label: 'Growth potential', score: 4.7, color: C.suc  },
  ],
  strengths: ['User empathy', 'Communication', 'Research depth', 'Cultural alignment', 'Growth mindset'],
  concerns: ['Design systems experience', 'Problem-solving under pressure'],
  recommendation: 'advance',
  rationale: "All three interviewers recommend advancing Giulia. Her communication skills, cultural alignment, and growth mindset are consistently rated as strong. The one area of development — design systems — is framed as coachable by all reviewers, not as a blocker. The Design Director's assessment is particularly encouraging: she brings strategic thinking that elevates the people around her.",
  riskLevel: 'low',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 36 }) {
  const [bg, color] = avColor(id || 1)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function Stars({ rating, max = 5, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ fontSize: size, color: i < rating ? C.red : C.border, lineHeight: 1 }}>★</span>
      ))}
    </span>
  )
}

// ── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, color }) {
  const pct = (score / 5) * 100
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: C.text }}>{label}</span>
        <span style={{ fontWeight: 600, color }}>{score.toFixed(1)}</span>
      </div>
      <div style={{ height: 7, background: C.gray, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

// ── Interviewer avatar cluster ────────────────────────────────────────────────
function AvatarCluster({ interviews }) {
  const colors = ['#FECDD3','#DBEAFE','#D1FAE5']
  const fgColors = [C.red, C.inf, C.suc]
  return (
    <div style={{ display: 'flex' }}>
      {interviews.map((iv, i) => (
        <div
          key={iv.id}
          title={`${iv.interviewer} — ${iv.interviewerRole}`}
          style={{ width: 28, height: 28, borderRadius: '50%', background: colors[i], color: fgColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, zIndex: interviews.length - i }}
        >
          {iv.avatarIni}
        </div>
      ))}
    </div>
  )
}

// ── Interview feedback card ───────────────────────────────────────────────────
function FeedbackCard({ interview, T }) {
  const [open, setOpen] = useState(true)
  const avColors = [['#FECDD3',C.red],['#DBEAFE',C.inf],['#D1FAE5',C.suc]]
  const [bg, color] = avColors[(interview.id - 1) % 3]

  return (
    <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      {/* Card header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '15px 18px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        {/* Interviewer avatar */}
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          {interview.avatarIni}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{interview.interviewer}</span>
            <span style={{ fontSize: 11, color: C.muted }}>· {interview.interviewerRole}</span>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {T.roundLabel(interview.round)} {interview.type} · {interview.date} · {interview.duration}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Stars rating={interview.overallRating} size={13} />
          <span style={{
            background: interview.recommendation === 'advance' ? C.sucBg : '#FEE2E2',
            color: interview.recommendation === 'advance' ? C.sucT : C.red,
            fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
          }}>
            {interview.recommendation === 'advance' ? T.advancePill : T.passPill}
          </span>
          <span style={{ color: C.muted, fontSize: 13, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {/* Card body */}
      {open && (
        <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          {/* Summary */}
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, padding: '11px 13px', background: C.gray, borderRadius: 9, borderLeft: `3px solid ${color}`, margin: '0 0 14px' }}>
            {interview.summary}
          </p>

          {/* Per-criteria scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', marginBottom: 14 }}>
            {Object.entries(interview.scores).map(([key, val]) => {
              const label = key.replace(/([A-Z])/g, ' $1').trim()
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: C.muted, textTransform: 'capitalize' }}>{label}</span>
                  <Stars rating={val} max={5} size={11} />
                </div>
              )
            })}
          </div>

          {/* Highlights */}
          {interview.highlights.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: C.sucT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{T.highlights}</p>
              {interview.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: C.suc, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Concerns */}
          {interview.concerns.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: C.warT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{T.areasToDevp}</p>
              {interview.concerns.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: C.war, fontSize: 12, flexShrink: 0, marginTop: 1 }}>△</span>
                  <span style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interviewer's personal note */}
          {interview.note && (
            <div style={{ background: bg, borderRadius: 9, padding: '10px 13px', borderLeft: `3px solid ${color}` }}>
              <p style={{ fontSize: 10, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                {interview.interviewer}'s note
              </p>
              <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                "{interview.note}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function HiringManagerSummary({ lang = 'en', candidate = MOCK_CANDIDATE, onBack, onNavigate }) {
  const T = SCREEN_T[lang] || SCREEN_T.en
  const [decision, setDecision] = useState(null) // 'advance' | 'pass' | 'another-round'

  const interviews = MOCK_INTERVIEWS
  const advCount   = interviews.filter(i => i.recommendation === 'advance').length

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Left: interview feed ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 28px 40px' }}>
        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          {T.back}
        </button>

        {/* Candidate header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26, padding: '16px 20px', background: C.white, borderRadius: 13, border: `1px solid ${C.border}` }}>
          <Av id={candidate.id} ini={candidate.ini} size={52} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, color: C.text, margin: '0 0 3px' }}>
              {candidate.name}
            </h1>
            <div style={{ fontSize: 13, color: C.muted }}>{candidate.role} · {candidate.pos}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{T.applied} {candidate.appliedDate} · {T.interviewsDone(interviews.length)}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <AvatarCluster interviews={interviews} />
            <span style={{ fontSize: 11, color: C.muted }}>
              {T.recommendAdvance(advCount, interviews.length)}
            </span>
          </div>
        </div>

        {/* Section heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{T.feedbackTitle}</h2>
          <span style={{ fontSize: 11, color: C.muted }}>{T.clickCollapse}</span>
        </div>

        {/* Interview cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {interviews.map(iv => (
            <FeedbackCard key={iv.id} interview={iv} T={T} />
          ))}
        </div>
      </div>

      {/* ── Right: AI synthesis + decision ── */}
      <aside style={{ width: 320, borderLeft: `1px solid ${C.border}`, background: C.white, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 22px' }}>

          {/* Overall score */}
          <div style={{ textAlign: 'center', marginBottom: 24, padding: '20px 16px', background: C.redBg, borderRadius: 13, border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{T.empath}</p>
            <div style={{ fontSize: 48, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>
              {SYNTHESIS.overallScore}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4, marginBottom: 10 }}>{T.overallScore}</div>
            <Stars rating={Math.round(SYNTHESIS.overallScore)} size={18} />
          </div>

          {/* Criteria breakdown */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>{T.scoreBreakdown}</p>
            {SYNTHESIS.scoredCriteria.map(c => (
              <ScoreBar key={c.label} label={c.label} score={c.score} color={c.color} />
            ))}
          </div>

          {/* Strengths */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.sucT, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>{T.strengths}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SYNTHESIS.strengths.map(s => (
                <span key={s} style={{ background: C.sucBg, color: C.sucT, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.warT, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>{T.developAreas}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SYNTHESIS.concerns.map(s => (
                <span key={s} style={{ background: C.warBg, color: C.warT, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Interviewer consensus */}
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{T.consensus}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {interviews.map(iv => {
                const ivColors = [['#FECDD3',C.red],['#DBEAFE',C.inf],['#D1FAE5',C.suc]]
                const [bg, col] = ivColors[(iv.id - 1) % 3]
                return (
                  <div key={iv.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', background: C.gray, borderRadius: 9 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                      {iv.avatarIni}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{iv.interviewer}</div>
                      <div style={{ fontSize: 9, color: C.muted }}>{iv.interviewerRole}</div>
                    </div>
                    <Stars rating={iv.overallRating} max={5} size={10} />
                    <span style={{ background: iv.recommendation === 'advance' ? C.sucBg : '#FEE2E2', color: iv.recommendation === 'advance' ? C.sucT : C.red, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                      {iv.recommendation === 'advance' ? '✓' : '✕'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI rationale */}
          <div style={{ background: C.redBg, borderRadius: 11, padding: '13px 14px', border: `1px solid ${C.border}`, marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>{T.recommendation}</p>
            <p style={{ fontSize: 12, color: C.text, lineHeight: 1.8, margin: 0 }}>
              {SYNTHESIS.rationale}
            </p>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ background: C.sucBg, color: C.sucT, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>
                {T.advanceRec}
              </span>
              <span style={{ fontSize: 11, color: C.muted }}>{T.lowRisk}</span>
            </div>
          </div>
        </div>

        {/* ── Decision panel ── */}
        <div style={{ padding: '16px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 2px' }}>{T.yourDecision}</p>

          {decision ? (
            <div style={{ padding: '14px 16px', borderRadius: 11, background: decision === 'advance' ? C.sucBg : decision === 'pass' ? '#FEF2F2' : C.warBg, border: `1px solid ${decision === 'advance' ? '#BBF7D0' : decision === 'pass' ? '#FECACA' : '#FDE68A'}`, textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: decision === 'advance' ? C.sucT : decision === 'pass' ? C.red : C.warT }}>
                {decision === 'advance' ? T.movingFwd : decision === 'pass' ? T.notMovingFwd : T.anotherRound}
              </div>
              <button onClick={() => setDecision(null)} style={{ marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.muted, fontFamily: 'inherit' }}>
                {T.changeDecision}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setDecision('advance')}
                style={{ padding: '11px 0', borderRadius: 9, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.advance}
              </button>
              <button
                onClick={() => setDecision('another-round')}
                style={{ padding: '11px 0', borderRadius: 9, background: C.warBg, color: C.warT, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.requestRound}
              </button>
              <button
                onClick={() => setDecision('pass')}
                style={{ padding: '11px 0', borderRadius: 9, background: C.gray, color: C.muted, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.notForward}
              </button>
              <button
                onClick={() => onNavigate?.('craft', { candidate })}
                style={{ padding: '9px 0', borderRadius: 9, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.sendUpdate}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
