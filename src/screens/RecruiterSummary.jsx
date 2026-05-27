// ─────────────────────────────────────────────────────────────────────────────
// RecruiterSummary.jsx  —  Interview summary for the recruiter
// Place in: src/screens/RecruiterSummary.jsx
//
// Shows the recruiter what interviewers observed about a candidate,
// so they can reach out informed. Stripped down: just what matters.
//   • Contact info (quick access before calling)
//   • Empath AI snapshot
//   • Interview feedback (condensed, collapsible)
//   • Actions
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const C = {
  red:   '#C9394A', redL: '#FECDD3', redBg: '#FFF5F6',
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
  pos: 'UX Designer',
  email: 'giulia.rossi@gmail.com',
  phone: '+39 333 456 7890',
  linkedin: 'linkedin.com/in/giuliarossi',
  appliedDate: '10 Apr 2026',
  lastContact: '17 May 2026',
}

const MOCK_INTERVIEWS = [
  {
    id: 1, round: 1, type: 'Portfolio Review',
    interviewer: 'Marco T.', interviewerRole: 'Hiring Manager',
    date: '14 May 2026', score: 4,
    summary: 'Strong portfolio and excellent communication. Clear learning drive despite some design-systems gaps. Would be comfortable having her on the team.',
    recommendation: 'advance',
  },
  {
    id: 2, round: 2, type: 'Technical Deep-Dive',
    interviewer: 'Elena C.', interviewerRole: 'Tech Lead',
    date: '17 May 2026', score: 3,
    summary: 'Enthusiastic and highly collaborative. Cultural fit is strong. Complex problem-solving under pressure could be sharpened — but the growth mindset is clearly there.',
    recommendation: 'advance',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
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

function Stars({ score, max = 5, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ fontSize: size, color: i < score ? C.red : C.border, lineHeight: 1 }}>★</span>
      ))}
    </span>
  )
}

// ── Condensed interview card ───────────────────────────────────────────────────
function InterviewCard({ interview, expanded, onToggle }) {
  const avColors = [['#FECDD3', C.red], ['#DBEAFE', C.inf], ['#D1FAE5', C.suc]]
  const [bg, col] = avColors[(interview.id - 1) % 3]

  return (
    <div style={{ background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '13px 18px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
          {interview.interviewer.split(' ').map(w => w[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
            {interview.interviewer}
            <span style={{ fontWeight: 400, color: C.muted, marginLeft: 6 }}>· {interview.interviewerRole}</span>
          </div>
          <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{interview.type} · {interview.date}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Stars score={interview.score} size={12} />
          <span style={{ background: interview.recommendation === 'advance' ? C.sucBg : '#FEE2E2', color: interview.recommendation === 'advance' ? C.sucT : C.red, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
            {interview.recommendation === 'advance' ? '✓ Advance' : '✕ Pass'}
          </span>
          <span style={{ color: C.muted, fontSize: 12, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 18px 15px', borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, margin: 0, padding: '11px 14px', background: C.gray, borderRadius: 8, borderLeft: `3px solid ${col}` }}>
            {interview.summary}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function RecruiterSummary({ candidate = MOCK_CANDIDATE, onBack, onNavigate }) {
  const [expandedInterview, setExpandedInterview] = useState(null)
  const [copiedEmail, setCopiedEmail]             = useState(false)

  const interviews = MOCK_INTERVIEWS
  const advCount   = interviews.filter(i => i.recommendation === 'advance').length
  const avgScore   = (interviews.reduce((s, i) => s + i.score, 0) / interviews.length).toFixed(1)

  const copyEmail = () => {
    navigator.clipboard?.writeText(candidate.email).catch(() => {})
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 36px 48px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          ← Interview summaries
        </button>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Interview summary</p>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 3px' }}>
              {candidate.name}
            </h1>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>
              {candidate.role} · {candidate.pos} · Applied {candidate.appliedDate}
            </p>
          </div>
          <Av id={candidate.id} ini={candidate.ini} size={52} />
        </div>

        {/* ── Contact info ── */}
        <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Contact</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>

            {/* Email */}
            <button
              onClick={copyEmail}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9, background: copiedEmail ? C.sucBg : C.gray, border: `1px solid ${copiedEmail ? '#BBF7D0' : C.border}`, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <span style={{ fontSize: 14 }}>✉</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: copiedEmail ? C.sucT : C.text }}>{copiedEmail ? 'Copied!' : candidate.email}</div>
                <div style={{ fontSize: 9, color: C.muted }}>Click to copy</div>
              </div>
            </button>

            {/* Phone */}
            <a
              href={`tel:${candidate.phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9, background: C.gray, border: `1px solid ${C.border}`, textDecoration: 'none' }}
            >
              <span style={{ fontSize: 14 }}>📞</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{candidate.phone}</div>
                <div style={{ fontSize: 9, color: C.muted }}>Tap to call</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={`https://${candidate.linkedin}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 9, background: C.infBg, border: `1px solid #BFDBFE`, textDecoration: 'none' }}
            >
              <span style={{ fontSize: 14 }}>💼</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.infT }}>LinkedIn</div>
                <div style={{ fontSize: 9, color: C.infT }}>Open profile</div>
              </div>
            </a>
          </div>
        </div>

        {/* ── AI snapshot ── */}
        <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>✦ Empath summary</p>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, margin: 0 }}>
              {advCount === interviews.length
                ? `All ${interviews.length} interviewers recommend advancing ${candidate.name.split(' ')[0]}. Strong portfolio, excellent cultural fit, and a clear growth mindset. One development area — design systems — was framed constructively by both reviewers.`
                : `Mixed signals across ${interviews.length} interviews. One interviewer recommends advancing, one has reservations. Worth a direct conversation before the final decision.`
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <div style={{ textAlign: 'center', background: C.redBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{avgScore}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 600, marginTop: 3 }}>AVG SCORE</div>
            </div>
            <div style={{ textAlign: 'center', background: C.sucBg, borderRadius: 9, padding: '10px 14px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.suc, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{advCount}/{interviews.length}</div>
              <div style={{ fontSize: 9, color: C.sucT, fontWeight: 600, marginTop: 3 }}>RECOMMEND</div>
            </div>
          </div>
        </div>

        {/* ── Interview feedback ── */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
            Interview feedback · {interviews.length} round{interviews.length !== 1 ? 's' : ''}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {interviews.map(iv => (
              <InterviewCard
                key={iv.id}
                interview={iv}
                expanded={expandedInterview === iv.id}
                onToggle={() => setExpandedInterview(expandedInterview === iv.id ? null : iv.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate?.('craft', { candidate })}
            style={{ padding: '11px 22px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ✉ Craft message for {candidate.name.split(' ')[0]}
          </button>
          <button
            onClick={() => onNavigate?.('hiring-summary', { candidate })}
            style={{ padding: '11px 20px', borderRadius: 10, background: C.white, color: C.text, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            📊 Full decision brief →
          </button>
        </div>
      </div>
    </div>
  )
}
