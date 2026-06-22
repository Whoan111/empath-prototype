// ─────────────────────────────────────────────────────────────────────────────
// HiringManagerSummary.jsx  —  Decision Report (hiring manager view)
// Redesigned to match the RecruiterSummary report layout.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)
let isDark = false

const SCREEN_T = {
  en: {
    back:             '← Decision report',
    badge:            'Decision Report',
    applied:          'Applied',
    empath:           '✦ Empath synthesis',
    recommend:        'RECOMMEND',
    feedback:         'Interview feedback',
    rounds:           (n) => `${n} round${n !== 1 ? 's' : ''}`,
    strengths:        'What went well',
    improvements:     'To develop',
    interviewerNote:  'Interviewer note',
    communication:    'Communication',
    culturalFit:      'Cultural fit',
    technicalSkills:  'Technical skills',
    growthPotential:  'Growth potential',
    strongAdvance:    'Strong advance',
    averageFit:       'Average fit',
    notAdvancing:     'Not advancing',
    yourDecision:     'Your decision',
    changeDecision:   'Change decision',
    movingFwd:        '✓ Hire suggested — recruiter will be notified',
    notMovingFwd:     '✕ Rejected — recruiter will be notified',
    anotherRound:     '↺ Another round requested',
    suggestHire:      'Suggest hire',
    requestRound:     '↺ Request another round',
    reject:           'Reject',
    unreject:         'Unreject',
    sendUpdate:       '✉ Send update to candidate',
  },
  it: {
    back:             '← Report decisionale',
    badge:            'Report Decisionale',
    applied:          'Candidato il',
    empath:           '✦ Sintesi Empath',
    recommend:        'RACCOMANDA',
    feedback:         'Feedback colloqui',
    rounds:           (n) => `${n} round${n !== 1 ? 's' : ''}`,
    strengths:        'Cosa è andato bene',
    improvements:     'Da sviluppare',
    interviewerNote:  'Nota intervistatore',
    communication:    'Comunicazione',
    culturalFit:      'Fit culturale',
    technicalSkills:  'Competenze tecniche',
    growthPotential:  'Potenziale di crescita',
    strongAdvance:    'Forte avanzamento',
    averageFit:       'Idoneità media',
    notAdvancing:     'Non avanza',
    yourDecision:     'La tua decisione',
    changeDecision:   'Cambia decisione',
    movingFwd:        '✓ Assunzione suggerita — il recruiter verrà notificato',
    notMovingFwd:     '✕ Rifiutato — il recruiter verrà notificato',
    anotherRound:     '↺ Altro round richiesto',
    suggestHire:      'Suggerisci assunzione',
    requestRound:     '↺ Richiedi altro round',
    reject:           'Rifiuta',
    unreject:         'Annulla rifiuto',
    sendUpdate:       '✉ Invia aggiornamento al candidato',
  },
}


// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CANDIDATE = {
  id: 1, name: 'Giulia Rossi', ini: 'GR',
  role: 'UX Designer', stage: 'Interviews',
  pos: 'UX Designer', email: 'giulia.rossi@gmail.com',
  appliedDate: '10 Apr 2026',
}

// Map 'strong'/'fit'/'not-fit' → percentage for dimension bars
const fitToValue = (fit) => fit === 'strong' ? 90 : fit === 'fit' ? 72 : 45

const MOCK_INTERVIEWS = [
  {
    id: 1, round: 1, type: 'Portfolio & Experience Review',
    interviewer: 'Andrea P.', interviewerRole: 'Hiring Manager', avatarIni: 'AP',
    date: '14 May 2026', fit: 'strongly-advance',
    positives: [
      'Led end-to-end redesign that increased task completion by 34%',
      'Confidently walked through research-led decisions with real data',
      'Asked thoughtful questions about the design process',
    ],
    improvements: ['Design systems depth needs development'],
    note: 'I would be comfortable having her join the team. The systems knowledge is teachable — the mindset is not.',
    dimensions: { communication: 90, culturalFit: 88, technicalSkills: 72, growthPotential: 92 },
  },
  {
    id: 2, round: 2, type: 'Technical Deep-Dive',
    interviewer: 'Elena C.', interviewerRole: 'Tech Lead', avatarIni: 'EC',
    date: '17 May 2026', fit: 'advance',
    positives: [
      'Demonstrated strong empathy for end-users throughout',
      'Responded openly to difficult hypotheticals rather than deflecting',
      'Flagged a potential accessibility issue in the design exercise unprompted',
    ],
    improvements: ['Could develop more structured problem decomposition under pressure'],
    note: 'Culture fit is a clear yes. Technically she needs support on systems but she\'s coachable.',
    dimensions: { communication: 84, culturalFit: 91, technicalSkills: 68, growthPotential: 85 },
  },
  {
    id: 3, round: 3, type: 'Values & Leadership Potential',
    interviewer: 'Andrea P.', interviewerRole: 'Design Director', avatarIni: 'AP',
    date: '20 May 2026', fit: 'strongly-advance',
    positives: [
      'Articulated a clear point of view on inclusive design without prompting',
      'Described a situation where she pushed back on stakeholders constructively',
      'Asked about the team\'s design maturity and what growing it would look like',
    ],
    improvements: [],
    note: 'Strong recommend. This is the kind of designer who elevates everyone around them.',
    dimensions: { communication: 95, culturalFit: 94, technicalSkills: 86, growthPotential: 97 },
  },
]

const SYNTHESIS_RATIONALE = "All three interviewers recommend advancing Giulia. Her communication skills, cultural alignment, and growth mindset are consistently assessed as strong fits. The one development area — design systems — is framed as coachable by all reviewers, not as a blocker. The Design Director's assessment is particularly encouraging: she brings strategic thinking that elevates the people around her."

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FDDDD7','#D86350'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 40 }) {
  const [bg, color] = avColor(id || 1)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function FitPill({ fit, T }) {
  if (fit === 'strongly-advance') return (
    <span style={{ background: isDark ? 'rgba(216,99,80,0.24)' : '#D86350', color: isDark ? 'rgba(255,140,120,0.95)' : '#FFFFFF', border: isDark ? '1px solid rgba(216,99,80,0.40)' : 'none', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>★ {T.strongAdvance}</span>
  )
  if (fit === 'advance') return (
    <span style={{ background: isDark ? 'rgba(254,154,12,0.20)' : '#FEF3C7', color: isDark ? '#FE9A0C' : '#B45309', border: isDark ? '1px solid rgba(254,154,12,0.25)' : 'none', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>◎ {T.averageFit}</span>
  )
  return (
    <span style={{ background: '#FFF5F2', color: C.red, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>✕ {T.notAdvancing}</span>
  )
}

const valueToFit = (v) =>
  v >= 80 ? { label: 'Strong fit', color: isDark ? 'rgba(255,140,120,0.95)' : '#FFFFFF', bg: isDark ? 'rgba(216,99,80,0.24)' : '#D86350', border: isDark ? '1px solid rgba(216,99,80,0.40)' : 'none' }
: v >= 60 ? { label: 'Fit',        color: isDark ? '#FE9A0C' : '#B45309', bg: isDark ? 'rgba(254,154,12,0.20)' : '#FEF3C7', border: isDark ? '1px solid rgba(254,154,12,0.25)' : 'none' }
:           { label: 'Not fit',    color: '#D86350', bg: '#FFF5F2', border: 'none' }

function DimBar({ label, value }) {
  const fit = valueToFit(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 10, color: C.muted, whiteSpace: 'nowrap', width: 120, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: C.grayB, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: fit.color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 600, color: fit.color, background: fit.bg, border: fit.border, padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>{fit.label}</span>
    </div>
  )
}

// ── Interview report card ─────────────────────────────────────────────────────
function InterviewCard({ interview, T }) {
  const borderColor = interview.fit === 'strongly-advance' ? '#D86350'
                    : interview.fit === 'advance'          ? '#C98A14'
                    : C.red
  const dimColor    = borderColor
  const avColors = [['#FDDDD7', C.red], ['#FEF3C7', '#D97706'], ['#EDE9FE', '#6D28D9']]
  const [avBg, avCol] = avColors[(interview.id - 1) % 3]
  const dims = interview.dimensions

  return (
    <div style={{
      background: isDark ? C.white : 'rgba(255,255,255,0.94)',
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Fit stripe */}
      <div style={{ height: 3, background: borderColor }} />

      {/* Header row */}
      <div style={{ padding: '11px 14px', borderBottom: `1px solid ${C.border}` }}>
        {/* Top line: avatar + name + score + pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: avBg, color: avCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
            {interview.avatarIni}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {interview.interviewer}
              <span style={{ fontWeight: 400, color: C.muted, marginLeft: 5, fontSize: 10 }}>· {interview.interviewerRole}</span>
            </div>
          </div>
          <FitPill fit={interview.fit} T={T} />
        </div>
        {/* Bottom line: round · type · date */}
        <div style={{ fontSize: 10, color: C.muted, paddingLeft: 37, display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
          <span style={{ whiteSpace: 'nowrap' }}>Round {interview.round}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{interview.type}</span>
          <span style={{ color: C.border, flexShrink: 0 }}>·</span>
          <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{interview.date}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Quoted note */}
        {interview.note && (
          <p style={{ fontSize: 12, color: isDark ? C.text : '#374151', lineHeight: 1.65, margin: 0, fontStyle: 'italic', borderLeft: `3px solid ${borderColor}`, paddingLeft: 12, paddingTop: 2, paddingBottom: 2 }}>
            "{interview.note}"
          </p>
        )}

        {/* Strengths + Improvements side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: isDark ? 'rgba(216,99,80,0.14)' : '#FFF5F2', borderRadius: 9, padding: '10px 13px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#FDDDD7' : '#C05340', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
              ✓ {T.strengths}
            </div>
            {interview.positives.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ color: '#D86350', fontSize: 10, marginTop: 2, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 11, color: isDark ? C.text : '#374151', lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          {interview.improvements.length > 0 && (
            <div style={{ background: isDark ? 'rgba(254,154,12,0.18)' : '#FEF3C7', borderRadius: 9, padding: '10px 13px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#FDE68A' : '#B45309', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
                ⚠ {T.improvements}
              </div>
              {interview.improvements.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 4 }}>
                  <span style={{ color: '#D97706', fontSize: 10, marginTop: 2, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 11, color: isDark ? C.text : '#374151', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dimension bars — compact */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
          {[
            { label: T.communication,   value: dims.communication   },
            { label: T.culturalFit,     value: dims.culturalFit     },
            { label: T.technicalSkills, value: dims.technicalSkills },
            { label: T.growthPotential, value: dims.growthPotential },
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: 20, padding: '3px 10px 3px 8px' }}>
              <div style={{ width: 22, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${d.value}%`, height: '100%', background: borderColor, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 9, color: C.muted, whiteSpace: 'nowrap' }}>{d.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: borderColor }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Candidate profile panel (simplified) ──────────────────────────────────────
function HMSProfilePanel({ candidate, overallFit, T, onClose }) {
  return (
    <aside style={{ width: 300, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${C.border}`, background: C.redBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <Av id={candidate.id} ini={candidate.ini} size={52} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 2 }}>{candidate.name}</div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{candidate.role}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.redBg, border: `1px solid ${C.redL}`, borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: C.red, letterSpacing: '0.05em' }}>
          {candidate.pos}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Overall fit */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Overall fit</div>
          <FitPill fit={overallFit} T={T} />
        </div>

        {/* Applied */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Applied</div>
          <div style={{ fontSize: 13, color: C.text }}>{candidate.appliedDate}</div>
        </div>

        {/* Stage */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>Current stage</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', background: C.gray, border: `1px solid ${C.border}`, borderRadius: 20, padding: '5px 13px', fontSize: 11, color: C.text, fontWeight: 500 }}>
            {candidate.stage}
          </span>
        </div>

        {/* Email */}
        {candidate.email && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Email</div>
            <div style={{ fontSize: 12, color: C.infT, wordBreak: 'break-all' }}>{candidate.email}</div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function HiringManagerSummary({ theme, lang = 'en', candidate = MOCK_CANDIDATE, onBack, onNavigate }) {
  C = buildC(theme)
  isDark = theme === THEMES.dark

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [decision,     setDecision]     = useState(null)
  const [showProfile,  setShowProfile]  = useState(false)

  const interviews = MOCK_INTERVIEWS
  const advCount   = interviews.filter(i => i.fit !== 'not-advancing').length
  const overallFit = interviews.every(i => i.fit === 'strongly-advance') ? 'strongly-advance'
                   : interviews.some(i => i.fit === 'strongly-advance') ? 'strongly-advance'
                   : 'advance'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: isDark ? 'transparent' : '#F8F8F8' }}>
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 36px 48px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          {T.back}
        </button>

        {/* ── Report header card ── */}
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(216,99,80,0.05)' }}>
          <div style={{ height: 4, background: C.grayB }} />
          <div style={{ padding: '20px 24px 18px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {/* Clickable avatar */}
            <button onClick={() => setShowProfile(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0, flexShrink: 0 }}>
              <Av id={candidate.id} ini={candidate.ini} size={52} />
            </button>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 4px' }}>{T.badge}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                {/* Clickable name */}
                <button onClick={() => setShowProfile(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'quincy-cf, serif', fontSize: 24, fontWeight: 700, color: C.text }}>
                  {candidate.name}
                </button>
                <FitPill fit={overallFit} T={T} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                <span style={{ background: isDark ? 'rgba(107,130,144,0.16)' : 'rgba(107,130,144,0.10)', color: isDark ? '#94A3B8' : '#6B8290', border: `1px solid ${isDark ? 'rgba(107,130,144,0.28)' : 'rgba(107,130,144,0.22)'}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, pointerEvents: 'none', userSelect: 'none' }}>{candidate.role}</span>
                <span style={{ color: C.muted, fontSize: 12 }}>{T.applied} {candidate.appliedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Empath AI snapshot ── */}
        <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>{T.empath}</p>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.75, margin: 0 }}>{SYNTHESIS_RATIONALE}</p>
          </div>
          <div style={{ background: C.infBg, borderRadius: 10, padding: '10px 14px', textAlign: 'center', border: `1px solid ${C.infL}`, flexShrink: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.inf, fontFamily: 'quincy-cf, serif', lineHeight: 1 }}>{advCount}/{interviews.length}</div>
            <div style={{ fontSize: 9, color: C.infT, fontWeight: 700, marginTop: 3, letterSpacing: '0.05em' }}>{T.recommend}</div>
          </div>
        </div>

        {/* ── Decision panel ── */}
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px 24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(216,99,80,0.04)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>{T.yourDecision}</p>

          {decision ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 11,
              background: decision === 'advance' ? C.redBg : decision === 'pass' ? C.infBg : C.gray,
              border: `1px solid ${decision === 'advance' ? C.redL : decision === 'pass' ? C.infL : C.grayB}` }}>
              <div style={{ fontSize: 14, fontWeight: 600,
                color: decision === 'advance' ? C.red : decision === 'pass' ? C.infT : C.muted }}>
                {decision === 'advance' ? T.movingFwd : decision === 'pass' ? T.notMovingFwd : T.anotherRound}
              </div>
              <button onClick={() => setDecision(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: C.muted, fontFamily: 'inherit', padding: '4px 8px' }}>
                {decision === 'pass' ? T.unreject : T.changeDecision}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setDecision('advance')}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: isDark ? 'rgba(216,99,80,0.18)' : '#FFF5F2', color: C.red, border: `1px solid ${isDark ? 'rgba(216,99,80,0.30)' : 'rgba(216,99,80,0.20)'}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.suggestHire}
              </button>
              <button
                onClick={() => setDecision('another-round')}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: C.gray, color: C.muted, border: `1px solid ${C.grayB}`, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.requestRound}
              </button>
              <button
                onClick={() => setDecision('pass')}
                style={{ flex: 1, padding: '12px 0', borderRadius: 10, background: C.infBg, color: C.infT, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {T.reject}
              </button>
            </div>
          )}
        </div>

        {/* ── Interview cards ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {T.feedback} · {T.rounds(interviews.length)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {interviews.map(iv => (
              <InterviewCard key={iv.id} interview={iv} T={T} />
            ))}
          </div>
        </div>

      </div>
    </div>
    </div>
    {/* Right profile panel */}
    {showProfile && (
      <HMSProfilePanel
        candidate={candidate}
        overallFit={overallFit}
        T={T}
        onClose={() => setShowProfile(false)}
      />
    )}
    </div>
  )
}

