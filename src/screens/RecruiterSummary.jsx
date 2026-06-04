// ─────────────────────────────────────────────────────────────────────────────
// RecruiterSummary.jsx  —  Interview Report (recruiter view)
// Redesigned as a clean, scannable report card layout.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)

const SCREEN_T = {
  en: {
    back:             '← Interview debriefs',
    badge:            'Interview Report',
    applied:          'Applied',
    contact:          'Contact',
    clickToCopy:      'Click to copy',
    tapToCall:        'Tap to call',
    openProfile:      'Open profile',
    copied:           'Copied!',
    empath:           '✦ Empath debrief',
    recommend:        'RECOMMEND',
    feedback:         'Interview feedback',
    rounds:           (n) => `${n} round${n !== 1 ? 's' : ''}`,
    craftMessage:     (name) => `✉ Craft message for ${name}`,
    fullBrief:        '📊 Full decision report →',
    strongAdvance:    'Strong advance',
    averageFit:       'Average fit',
    notAdvancing:     'Not advancing',
    strengths:        'What went well',
    improvements:     'To develop',
    interviewerNote:  'Interviewer note',
    communication:    'Communication',
    culturalFit:      'Cultural fit',
    technicalSkills:  'Technical skills',
    growthPotential:  'Growth potential',
  },
  it: {
    back:             '← Debrief Colloqui',
    badge:            'Report Colloquio',
    applied:          'Candidato il',
    contact:          'Contatto',
    clickToCopy:      'Clicca per copiare',
    tapToCall:        'Tocca per chiamare',
    openProfile:      'Apri profilo',
    copied:           'Copiato!',
    empath:           '✦ Debrief Empath',
    recommend:        'RACCOMANDA',
    feedback:         'Feedback colloqui',
    rounds:           (n) => `${n} round${n !== 1 ? 's' : ''}`,
    craftMessage:     (name) => `✉ Scrivi messaggio per ${name}`,
    fullBrief:        '📊 Report decisionale completo →',
    strongAdvance:    'Forte avanzamento',
    averageFit:       'Idoneità media',
    notAdvancing:     'Non avanza',
    strengths:        'Cosa è andato bene',
    improvements:     'Da sviluppare',
    interviewerNote:  'Nota intervistatore',
    communication:    'Comunicazione',
    culturalFit:      'Fit culturale',
    technicalSkills:  'Competenze tecniche',
    growthPotential:  'Potenziale di crescita',
  },
}


// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CANDIDATE = {
  id: 1, name: 'Giulia Rossi', ini: 'GR',
  role: 'UX Designer', stage: 'Interviews',
  pos: 'UX Designer',
  email: 'giulia.rossi@gmail.com',
  phone: '+39 333 456 7890',
  linkedin: 'linkedin.com/in/giuliarossi',
  appliedDate: '10 Apr 2026',
}

const MOCK_INTERVIEWS = [
  {
    id: 1, round: 1, type: 'Portfolio Review',
    interviewer: 'Andrea P.', interviewerRole: 'Hiring Manager',
    date: '14 May 2026', fit: 'strongly-advance',
    positives: [
      'Strong end-to-end portfolio with clear design thinking process',
      'Outstanding ability to align stakeholders and communicate decisions',
    ],
    improvements: [
      'Design systems depth could be stronger for the seniority level',
    ],
    note: 'Candidate led 3 major product redesigns independently. Very comfortable discussing trade-offs and navigating ambiguity.',
    dimensions: { communication: 92, culturalFit: 88, technicalSkills: 74, growthPotential: 95 },
  },
  {
    id: 2, round: 2, type: 'Technical Deep-Dive',
    interviewer: 'Elena C.', interviewerRole: 'Tech Lead',
    date: '17 May 2026', fit: 'advance',
    positives: [
      'Highly collaborative — great cultural alignment with the team',
      'Clear growth mindset; actively seeks feedback and applies it',
    ],
    improvements: [
      'Complex problem-solving under pressure needs further sharpening',
      'Component architecture knowledge below expectation for the role',
    ],
    note: 'Strong candidate overall. Coachable gap in large-scale design system work. Potential is clear.',
    dimensions: { communication: 85, culturalFit: 90, technicalSkills: 68, growthPotential: 88 },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],
  ['#FEF3C7','#D97706'],
  ['#EDE9FE','#6D28D9'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 40 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function FitPill({ fit, T }) {
  if (fit === 'strongly-advance') return (
    <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>★ {T.strongAdvance}</span>
  )
  if (fit === 'advance') return (
    <span style={{ background: 'rgba(37,99,235,0.10)', color: '#1E40AF', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>◎ {T.averageFit}</span>
  )
  return (
    <span style={{ background: '#FEE2E2', color: C.red, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>✕ {T.notAdvancing}</span>
  )
}

// ── Mini dimension bar ─────────────────────────────────────────────────────────
function DimBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 10, color: C.muted, whiteSpace: 'nowrap', width: 120, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: C.grayB, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, width: 28, textAlign: 'right', flexShrink: 0 }}>{value}</span>
    </div>
  )
}

// ── Interview report card ─────────────────────────────────────────────────────
function InterviewCard({ interview, T }) {
  const borderColor = interview.fit === 'strongly-advance' ? '#2563EB'
                    : interview.fit === 'advance'          ? '#3B82F6'
                    : C.red
  const dimColor    = interview.fit === 'strongly-advance' ? '#2563EB'
                    : interview.fit === 'advance'          ? '#3B82F6'
                    : C.red
  const avColors = [['#FECDD3', C.red], ['#FEF3C7', '#D97706'], ['#EDE9FE', '#6D28D9']]
  const [avBg, avCol] = avColors[(interview.id - 1) % 3]
  const dims = interview.dimensions

  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${borderColor}`,
      borderRadius: 13,
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: C.gray, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: avBg, color: avCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
          {interview.interviewer.split(' ').map(w => w[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
            {interview.interviewer}
            <span style={{ fontWeight: 400, color: C.muted, marginLeft: 6 }}>· {interview.interviewerRole}</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
            Round {interview.round} · {interview.type} · {interview.date}
          </div>
        </div>
        <FitPill fit={interview.fit} T={T} />
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Strengths — red tone */}
        <div style={{ background: '#FFF1F2', borderRadius: 9, padding: '10px 13px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#9F1239', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
            ✓ {T.strengths}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {interview.positives.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#C9394A', fontSize: 11, marginTop: 1, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 12, color: C.text, lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements — blue tone */}
        <div style={{ background: '#EFF6FF', borderRadius: 9, padding: '10px 13px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>
            ⚠ {T.improvements}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {interview.improvements.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: '#2563EB', fontSize: 11, marginTop: 1, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 12, color: C.text, lineHeight: 1.55 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{ background: C.gray, borderRadius: 9, padding: '10px 13px', borderLeft: `3px solid ${C.grayB}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
            ℹ {T.interviewerNote}
          </div>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: 0 }}>{interview.note}</p>
        </div>

        {/* Dimension bars */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <DimBar label={T.communication}    value={dims.communication}    color={dimColor} />
          <DimBar label={T.culturalFit}      value={dims.culturalFit}      color={dimColor} />
          <DimBar label={T.technicalSkills}  value={dims.technicalSkills}  color={dimColor} />
          <DimBar label={T.growthPotential}  value={dims.growthPotential}  color={dimColor} />
        </div>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function RecruiterSummary({ theme, lang = 'en', candidate = MOCK_CANDIDATE, onBack, onNavigate }) {
  C = buildC(theme)

  const T = SCREEN_T[lang] || SCREEN_T.en
  const [copiedEmail, setCopiedEmail] = useState(false)

  const interviews  = MOCK_INTERVIEWS
  const advCount    = interviews.filter(i => i.fit !== 'not-advancing').length
  const overallFit  = interviews.every(i => i.fit === 'strongly-advance') ? 'strongly-advance'
                    : interviews.some(i => i.fit === 'strongly-advance' || i.fit === 'advance') ? 'advance'
                    : 'not-advancing'

  const copyEmail = () => {
    navigator.clipboard?.writeText(candidate.email).catch(() => {})
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'transparent' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 36px 48px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          {T.back}
        </button>

        {/* ── Report header card ── */}
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(201,57,74,0.05)' }}>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${C.red}, #F87171)` }} />
          <div style={{ padding: '20px 24px 18px' }}>

            {/* Top row: identity */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
              <Av id={candidate.id} ini={candidate.ini} size={52} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 4px' }}>{T.badge}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                  <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: C.text, margin: 0 }}>
                    {candidate.name}
                  </h1>
                  <FitPill fit={overallFit} T={T} />
                </div>
                <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>
                  {candidate.role} · {candidate.pos} · {T.applied} {candidate.appliedDate}
                </p>
              </div>
            </div>

            {/* Contact chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                onClick={copyEmail}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: copiedEmail ? C.sucBg : C.gray, border: `1px solid ${copiedEmail ? '#BBF7D0' : C.border}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                <span style={{ fontSize: 12 }}>✉</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: copiedEmail ? C.sucT : C.text }}>{copiedEmail ? T.copied : candidate.email}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{T.clickToCopy}</div>
                </div>
              </button>

              <a href={`tel:${candidate.phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: C.gray, border: `1px solid ${C.border}`, textDecoration: 'none' }}
              >
                <span style={{ fontSize: 12 }}>📞</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{candidate.phone}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{T.tapToCall}</div>
                </div>
              </a>

              <a href={`https://${candidate.linkedin}`} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: C.infBg, border: '1px solid #BFDBFE', textDecoration: 'none' }}
              >
                <span style={{ fontSize: 12 }}>💼</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.infT }}>LinkedIn</div>
                  <div style={{ fontSize: 9, color: C.infT }}>{T.openProfile}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ── Empath AI snapshot ── */}
        <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>{T.empath}</p>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.75, margin: 0 }}>
              {advCount === interviews.length
                ? `All ${interviews.length} interviewers recommend advancing ${candidate.name.split(' ')[0]}. Strong portfolio, excellent cultural fit, and a clear growth mindset. One development area — design systems — was framed constructively by both reviewers.`
                : `Mixed signals across ${interviews.length} interviews. One interviewer recommends advancing, one has reservations. Worth a direct conversation before the final decision.`
              }
            </p>
          </div>
          <div style={{ background: C.infBg, borderRadius: 10, padding: '10px 14px', textAlign: 'center', border: `1px solid ${C.infL}`, flexShrink: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.inf, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{advCount}/{interviews.length}</div>
            <div style={{ fontSize: 9, color: C.infT, fontWeight: 700, marginTop: 3, letterSpacing: '0.05em' }}>{T.recommend}</div>
          </div>
        </div>

        {/* ── Interview cards ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            {T.feedback} · {T.rounds(interviews.length)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: interviews.length > 1 ? '1fr 1fr' : '1fr', gap: 14 }}>
            {interviews.map(iv => (
              <InterviewCard key={iv.id} interview={iv} T={T} />
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate?.('craft', { candidate, from: 'recruiter-summary' })}
            style={{ padding: '11px 22px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {T.craftMessage(candidate.name.split(' ')[0])}
          </button>
        </div>

      </div>
    </div>
  )
}
