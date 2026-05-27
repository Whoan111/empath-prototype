// ─────────────────────────────────────────────────────────────────────────────
// PostInterviewQuestionnaire.jsx
// Place in: src/screens/PostInterviewQuestionnaire.jsx
//
// Post-interview debrief — for hiring managers and all interviewers.
// 4 steps: Context → Ratings → Feedback → Recommendation
//
// Changes from v1:
//   • Step 1: date replaces round; type and duration removed
//   • Ratings: "Did not evaluate" option on every criterion
//   • Technical skill moved last and is fully optional
//   • Shorter, friendlier qualitative prompts
//   • "Busy place" mode hint in Step 3
//   • Done state differs: non-HM gets a notification note; HM keeps decision brief
//   • Removed "scores feed into update message" from What happens next
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:   '#C9394A', redH: '#A82D3B', redL: '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted:'#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray: '#F5F4F3', grayB:'#E5E2DF',
  suc: '#059669', sucBg:'#D1FAE5', sucT:'#065F46',
  war: '#D97706', warBg:'#FEF3C7', warT:'#92400E',
  inf: '#2563EB', infBg:'#DBEAFE', infT:'#1E40AF',
}

// ── Mock candidate ────────────────────────────────────────────────────────────
const MOCK_CANDIDATE = {
  id: 1, name: 'Giulia Rossi', ini: 'GR',
  role: 'UX Designer', pos: 'UX Designer',
}

// ── Current user (auto-filled — no selector needed) ──────────────────────────
// In production this comes from the auth context.
const CURRENT_USER = { name: 'Marco T.', role: 'Hiring Manager', ini: 'MT' }

// ── Interview type quick-select ───────────────────────────────────────────────
const INTERVIEW_TYPES = [
  { id: 'meet',      label: 'Getting to know you', emoji: '🤝' },
  { id: 'portfolio', label: 'Portfolio review',    emoji: '📁' },
  { id: 'technical', label: 'Technical',           emoji: '🛠'  },
  { id: 'final',     label: 'Final round',         emoji: '🎯' },
]

// ── Rating criteria ───────────────────────────────────────────────────────────
// Technical is last and optional — any other can be explicitly skipped too.
// value === 0    → not yet answered (blocks progression if required)
// value === -1   → "Did not evaluate" (valid for all, counts as answered)
// value === 1–5  → actual score
const CRITERIA = [
  {
    id: 'communication',
    label: 'Communication & presence',
    desc: 'Did they articulate their ideas clearly and listen well?',
    optional: false,
  },
  {
    id: 'culturalFit',
    label: 'Cultural & team fit',
    desc: 'Would they align with how this team works and what it values?',
    optional: false,
  },
  {
    id: 'growthPotential',
    label: 'Growth potential',
    desc: 'How much room do they have to grow in this role over the next year?',
    optional: false,
  },
  {
    id: 'technicalSkill',
    label: 'Technical / domain skills',
    desc: 'Relevant technical knowledge for this specific role.',
    optional: true, // no technical test? skip freely
  },
]

const RATING_LABELS = {
  1: 'Below expectations',
  2: 'Developing',
  3: 'Meets expectations',
  4: 'Exceeds expectations',
  5: 'Outstanding',
}

// ── Recommendation options ────────────────────────────────────────────────────
const RECOMMENDATIONS = [
  { id: 'strongly-advance', label: 'Strongly advance',           emoji: '⭐', color: C.suc,  bg: C.sucBg,  border: '#BBF7D0' },
  { id: 'advance',          label: 'Advance',                    emoji: '✓',  color: C.suc,  bg: '#F0FDF4', border: '#86EFAC' },
  { id: 'reservations',     label: 'Advance with reservations',  emoji: '△',  color: C.war,  bg: C.warBg,  border: '#FDE68A' },
  { id: 'not-moving',       label: 'Not moving forward',         emoji: '✕',  color: C.red,  bg: '#FEF2F2', border: '#FECACA' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function Av({ id, ini, size = 36 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.31, fontWeight: 600 }}>
      {ini}
    </div>
  )
}

function RequiredDot() {
  return <span style={{ color: C.red, marginLeft: 3, fontSize: 13, lineHeight: 1 }}>*</span>
}

// ── Voice dictation hook ──────────────────────────────────────────────────────
function useDictation(onResult) {
  const [active,    setActive]    = useState(false)
  const [supported, setSupported] = useState(false)
  const [interim,   setInterim]   = useState('')
  const recRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    setSupported(!!SR)
    return () => { recRef.current?.stop() }
  }, [])

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (const result of e.results) {
        if (result.isFinal) finalText += result[0].transcript + ' '
        else interimText += result[0].transcript
      }
      if (finalText) onResult(finalText.trim())
      setInterim(interimText)
    }
    rec.onend  = () => { setActive(false); setInterim('') }
    rec.onerror = () => { setActive(false); setInterim('') }
    rec.start()
    recRef.current = rec
    setActive(true)
  }, [onResult])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setActive(false)
    setInterim('')
  }, [])

  const toggle = useCallback(() => { active ? stop() : start() }, [active, start, stop])

  return { active, toggle, supported, interim }
}

// ── Dictation field ───────────────────────────────────────────────────────────
function DictationField({ label, value, onChange, placeholder, required, rows = 3, hint }) {
  const handleResult = useCallback((text) => {
    onChange(prev => prev ? prev + ' ' + text : text)
  }, [onChange])

  const { active, toggle, supported, interim } = useDictation(handleResult)
  const isEmpty = !value || value.trim().length < 8

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {label}{required && <RequiredDot />}
          </label>
          {hint && (
            <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0', lineHeight: 1.5 }}>{hint}</p>
          )}
        </div>

        {supported ? (
          <button
            onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 13px', borderRadius: 20, border: 'none',
              background: active ? C.red : C.gray,
              color: active ? 'white' : C.muted,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', flexShrink: 0, marginLeft: 12,
              boxShadow: active ? `0 0 0 4px ${C.redL}` : 'none',
              transition: 'all 0.2s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
            </svg>
            {active ? 'Stop' : 'Dictate'}
            {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite', display: 'inline-block' }} />}
          </button>
        ) : (
          <span style={{ fontSize: 10, color: C.muted, fontStyle: 'italic', marginLeft: 12 }}>Voice unavailable</span>
        )}
      </div>

      {active && interim && (
        <div style={{ marginBottom: 5, padding: '7px 11px', background: C.redBg, borderRadius: 7, border: `1px solid ${C.redL}`, fontSize: 11, color: C.muted, fontStyle: 'italic', lineHeight: 1.6 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.red, display: 'block', marginBottom: 2 }}>🎤 Transcribing…</span>
          {interim}
        </div>
      )}
      {active && (
        <div style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: C.red, fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.red, animation: 'pulse 1s infinite', display: 'inline-block' }} />
          Listening — speak naturally, tap Stop when done
        </div>
      )}

      <textarea
        value={value}
        onChange={e => onChange(() => e.target.value)}
        placeholder={active ? 'Your words will appear here as you speak…' : placeholder}
        rows={rows}
        style={{
          width: '100%', padding: '10px 13px', borderRadius: 9,
          border: `1.5px solid ${active ? C.red : required && isEmpty ? '#FECACA' : C.border}`,
          fontSize: 13, resize: 'vertical', color: C.text, lineHeight: 1.7,
          boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
          background: active ? C.redBg : 'white',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      />
      {required && isEmpty && !active && (
        <p style={{ fontSize: 11, color: '#EF4444', margin: '3px 0 0' }}>Required</p>
      )}
    </div>
  )
}

// ── Star rating with "Did not evaluate" ───────────────────────────────────────
function StarRating({ value, onChange, criterion }) {
  const [hover, setHover] = useState(0)

  const isSkipped  = value === -1
  const display    = isSkipped ? 0 : (hover || value)
  const hasAnswer  = value > 0 || value === -1

  const starColor = display >= 4 ? C.suc : display >= 3 ? C.war : C.red

  const borderColor = !hasAnswer && !criterion.optional
    ? '#FECACA'
    : hasAnswer
      ? (isSkipped ? C.grayB : (value >= 4 ? '#BBF7D0' : value >= 3 ? '#FDE68A' : C.redL))
      : C.border

  return (
    <div style={{
      background: C.white, borderRadius: 12,
      border: `2px solid ${borderColor}`,
      padding: '15px 18px',
      opacity: isSkipped ? 0.6 : 1,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 9 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 6 }}>
            {criterion.label}
            {!criterion.optional && !isSkipped && <RequiredDot />}
            {criterion.optional && (
              <span style={{ fontSize: 10, fontWeight: 400, color: C.muted, background: C.gray, padding: '1px 7px', borderRadius: 10 }}>Optional</span>
            )}
          </div>
          {!isSkipped && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{criterion.desc}</div>
          )}
        </div>

        {/* Status badge */}
        {isSkipped ? (
          <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, background: C.gray, padding: '3px 9px', borderRadius: 20, flexShrink: 0, marginLeft: 10 }}>
            Skipped
          </span>
        ) : value > 0 ? (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, flexShrink: 0, marginLeft: 10,
            background: value >= 4 ? C.sucBg : value >= 3 ? C.warBg : '#FEE2E2',
            color: value >= 4 ? C.sucT : value >= 3 ? C.warT : C.red,
          }}>
            {RATING_LABELS[value]}
          </span>
        ) : !criterion.optional ? (
          <span style={{ fontSize: 10, color: '#EF4444', flexShrink: 0, marginLeft: 10, fontWeight: 500 }}>Required</span>
        ) : null}
      </div>

      {isSkipped ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: C.muted }}>Did not evaluate this characteristic</span>
          <button onClick={() => onChange(0)} style={{ fontSize: 11, color: C.inf, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
            Undo
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
          {/* Stars */}
          <div style={{ display: 'flex', gap: 4, marginRight: 16 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => onChange(n === value ? 0 : n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                style={{
                  fontSize: 28, background: 'none', border: 'none', cursor: 'pointer',
                  color: n <= display ? starColor : C.border,
                  lineHeight: 1, padding: '2px 3px',
                  transform: n <= display ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.1s',
                }}
              >★</button>
            ))}
          </div>

          {/* Did not evaluate link */}
          <button
            onClick={() => { onChange(-1); setHover(0) }}
            style={{
              fontSize: 11, color: C.muted, background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
              padding: '4px 11px', whiteSpace: 'nowrap', marginTop: 2,
              transition: 'all 0.15s',
            }}
          >
            Did not evaluate
          </button>
        </div>
      )}
    </div>
  )
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ step, steps }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 30 }}>
      {steps.map((s, i) => {
        const done    = i < step
        const current = i === step
        return (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: done ? C.red : current ? C.white : C.gray,
                border: `2px solid ${done ? C.red : current ? C.red : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: done ? 'white' : current ? C.red : C.muted,
                boxShadow: current ? `0 0 0 4px ${C.redBg}` : 'none',
                marginBottom: 5, flexShrink: 0, transition: 'all 0.2s',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10, fontWeight: current ? 600 : 400, color: current ? C.red : C.muted, textAlign: 'center', lineHeight: 1.3 }}>
                {s}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ height: 2, flex: 1, background: i < step ? C.red : C.border, marginTop: -20, transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Context
// ─────────────────────────────────────────────────────────────────────────────
function StepContext({ candidate, context, onChange, onNext, currentUser }) {
  const valid = !!context.interviewDate

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        Before you begin
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>
        Just the date and you are good to go.
      </p>

      {/* Candidate + auto-filled interviewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 26 }}>
        <div style={{ background: C.redBg, borderRadius: 11, border: `1px solid ${C.border}`, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Av id={candidate.id} ini={candidate.ini} size={38} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Candidate</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
          </div>
        </div>

        <div style={{ background: C.gray, borderRadius: 11, border: `1px solid ${C.border}`, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.redL, color: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {currentUser.ini}
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Interviewer</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{currentUser.role}</div>
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: 26 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 7 }}>
          Date of interview<RequiredDot />
        </label>
        <input
          type="date"
          value={context.interviewDate || ''}
          onChange={e => onChange('interviewDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 9,
            border: `1.5px solid ${context.interviewDate ? C.red : C.border}`,
            fontSize: 14, color: context.interviewDate ? C.text : C.muted,
            background: 'white', cursor: 'pointer', fontFamily: 'inherit',
            boxSizing: 'border-box', outline: 'none', maxWidth: 260,
          }}
        />
        <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
          Filling this in right after the interview leads to sharper, more useful feedback.
        </p>
      </div>

      {/* Interview type — optional quick-select */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          Interview type <span style={{ fontWeight: 400, color: C.muted }}>(optional)</span>
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {INTERVIEW_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => onChange('interviewType', context.interviewType === t.id ? '' : t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px', borderRadius: 22, cursor: 'pointer',
                border: `2px solid ${context.interviewType === t.id ? C.red : C.border}`,
                background: context.interviewType === t.id ? C.redBg : C.white,
                fontFamily: 'inherit', transition: 'all 0.13s',
              }}
            >
              <span style={{ fontSize: 15 }}>{t.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: context.interviewType === t.id ? 600 : 400, color: context.interviewType === t.id ? C.red : C.text }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        style={{ padding: '11px 26px', borderRadius: 10, background: valid ? C.red : C.grayB, color: valid ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: valid ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}
      >
        Continue →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Ratings
// ─────────────────────────────────────────────────────────────────────────────
function StepRatings({ candidate, ratings, onChange, onNext, onBack }) {
  // Required criteria need a score (1-5) OR explicit skip (-1). 0 = not yet answered.
  const requiredAnswered = CRITERIA
    .filter(c => !c.optional)
    .every(c => ratings[c.id] !== 0 && ratings[c.id] !== undefined)

  const ratedCount = CRITERIA.filter(c => ratings[c.id] > 0).length
  const avgScore = ratedCount > 0
    ? (CRITERIA.filter(c => ratings[c.id] > 0).reduce((s, c) => s + ratings[c.id], 0) / ratedCount).toFixed(1)
    : null

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        How did they perform?
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 10px', lineHeight: 1.6 }}>
        Rate what you covered. If you did not evaluate a criterion, tap <strong style={{ color: C.text }}>Did not evaluate</strong> — that is a valid answer.
      </p>
      <p style={{ color: C.muted, fontSize: 12, margin: '0 0 22px', lineHeight: 1.5, padding: '9px 13px', background: C.redBg, borderRadius: 8, border: `1px solid ${C.border}` }}>
        Technical skills are <strong style={{ color: C.text }}>optional</strong> — skip if there was no technical component to your interview.
      </p>

      {/* Live average */}
      {avgScore && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.redBg, borderRadius: 10, padding: '11px 16px', marginBottom: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{avgScore}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>Your average so far</div>
            <div style={{ fontSize: 10, color: C.muted }}>Across {ratedCount} rated criterion</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
        {CRITERIA.map(c => (
          <StarRating
            key={c.id}
            criterion={c}
            value={ratings[c.id] !== undefined ? ratings[c.id] : 0}
            onChange={(val) => onChange(c.id, val)}
          />
        ))}
      </div>

      {!requiredAnswered && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, padding: '9px 13px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
          <span style={{ fontSize: 13 }}>⚠</span>
          <span style={{ fontSize: 12, color: C.red }}>
            {CRITERIA.filter(c => !c.optional && (!ratings[c.id] || ratings[c.id] === 0)).map(c => c.label).join(' · ')} — rate or tap "Did not evaluate"
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
        <button onClick={onNext} disabled={!requiredAnswered} style={{ padding: '11px 26px', borderRadius: 10, background: requiredAnswered ? C.red : C.grayB, color: requiredAnswered ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: requiredAnswered ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Qualitative feedback
// ─────────────────────────────────────────────────────────────────────────────
function StepFeedback({ candidate, feedback, onChange, onNext, onBack }) {
  const strengthsValid = feedback.strengths && feedback.strengths.trim().length >= 8
  const developValid   = feedback.development && feedback.development.trim().length >= 8
  const canProceed     = strengthsValid && developValid

  const makeHandler = (field) => (updater) =>
    onChange(field, typeof updater === 'function' ? updater(feedback[field] || '') : updater)

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
        Your observations
      </h2>

      {/* Candidate-centred framing */}
      <div style={{ background: C.redBg, borderRadius: 10, padding: '12px 15px', border: `1px solid ${C.border}`, marginBottom: 22 }}>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
          Candidates appreciate specific, growth-oriented feedback more than you might expect — a few honest, concrete sentences can genuinely make a difference, even when the answer is no.
        </p>
      </div>

      {/* How to fill this in */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 22, padding: '10px 14px', background: C.white, borderRadius: 9, border: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💬</span>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>Tap Dictate</strong> to speak your thoughts — ideal right after the interview while everything is fresh. Or type and paste your notes directly. Either works.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <DictationField
          label="What did they do well?"
          value={feedback.strengths || ''}
          onChange={makeHandler('strengths')}
          placeholder="A specific moment or quality — e.g. Walked through a complex decision with real clarity. Responded to pushback without deflecting."
          required
          rows={3}
          hint="Specific beats general — a real example is worth ten adjectives"
        />

        <DictationField
          label="What could they develop further?"
          value={feedback.development || ''}
          onChange={makeHandler('development')}
          placeholder="Frame it as growth — e.g. Stakeholder communication: tended to default to technical depth when a simpler framing would land better."
          required
          rows={3}
          hint="Growth-oriented and honest — this is what candidates remember and use"
        />

        <DictationField
          label="Anything else worth noting?"
          value={feedback.standout || ''}
          onChange={makeHandler('standout')}
          placeholder="Optional — a standout moment, a concern, or anything the decision makers should know…"
          required={false}
          rows={2}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
        <button onClick={onNext} disabled={!canProceed} style={{ padding: '11px 26px', borderRadius: 10, background: canProceed ? C.red : C.grayB, color: canProceed ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: canProceed ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Recommendation
// ─────────────────────────────────────────────────────────────────────────────
function StepRecommendation({ candidate, recommendation, notes, isHM, onChangeRec, onChangeNotes, onSubmit, onBack }) {
  const canSubmit = !!recommendation

  const makeHandler = () => (updater) =>
    onChangeNotes(typeof updater === 'function' ? updater(notes || '') : updater)

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        Your recommendation
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 26px', lineHeight: 1.6 }}>
        Be direct — ambiguity slows the process for everyone, including the candidate.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 }}>
        {RECOMMENDATIONS.map(rec => (
          <button
            key={rec.id}
            onClick={() => onChangeRec(rec.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '14px 18px', borderRadius: 11, cursor: 'pointer',
              border: `2px solid ${recommendation === rec.id ? rec.color : C.border}`,
              background: recommendation === rec.id ? rec.bg : C.white,
              textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 22, flexShrink: 0, width: 28, textAlign: 'center' }}>{rec.emoji}</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: recommendation === rec.id ? 700 : 400, color: recommendation === rec.id ? rec.color : C.text }}>
              {rec.label}
            </span>
            {recommendation === rec.id && (
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: rec.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 700, flexShrink: 0 }}>✓</div>
            )}
          </button>
        ))}
      </div>

      <DictationField
        label="Additional context"
        value={notes || ''}
        onChange={makeHandler()}
        placeholder="Logistics, red flags, compensation expectations, or a standout concern — optional but useful…"
        required={false}
        rows={3}
        hint="Seen by the hiring manager and recruiter only"
      />

      {/* What happens next — tailored to role */}
      {canSubmit && (
        <div style={{ margin: '22px 0', padding: '13px 16px', background: C.redBg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>✦ What happens next</p>
          <ul style={{ margin: 0, paddingLeft: 15, fontSize: 12, color: C.muted, lineHeight: 2.1 }}>
            <li>Your feedback is saved to {candidate.name.split(' ')[0]}'s profile</li>
            {isHM
              ? <li>As hiring manager, you can view the full decision brief across all interviewers</li>
              : <li>You will be notified when a decision for {candidate.name.split(' ')[0]} has been made</li>
            }
            <li>Your observations help shape a growth-oriented, honest update for the candidate</li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
        <button onClick={onSubmit} disabled={!canSubmit} style={{ padding: '11px 30px', borderRadius: 10, background: canSubmit ? C.red : C.grayB, color: canSubmit ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          Submit feedback ✓
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Done state — differs for HM vs other interviewers
// ─────────────────────────────────────────────────────────────────────────────
function DoneState({ candidate, recommendation, ratings, isHM, onNavigate }) {
  const rec      = RECOMMENDATIONS.find(r => r.id === recommendation)
  const ratedCriteria = CRITERIA.filter(c => ratings[c.id] > 0)
  const avg      = ratedCriteria.length > 0
    ? (ratedCriteria.reduce((s, c) => s + ratings[c.id], 0) / ratedCriteria.length).toFixed(1)
    : null

  return (
    <div style={{ textAlign: 'center', padding: '40px 32px', animation: 'stepIn 0.3s ease' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
        Feedback submitted
      </h2>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, margin: '0 0 28px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
        Your input for <strong style={{ color: C.text }}>{candidate.name}</strong> has been saved and will inform the decision brief and any candidate updates.
      </p>

      {/* Score + recommendation card */}
      <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '18px 22px', marginBottom: 22, maxWidth: 400, margin: '0 auto 22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 13 }}>
          <Av id={candidate.id} ini={candidate.ini} size={38} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {avg && (
            <div style={{ flex: 1, textAlign: 'center', background: C.redBg, borderRadius: 8, padding: '9px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif' }}>{avg}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>AVG SCORE</div>
            </div>
          )}
          <div style={{ flex: 2, background: rec?.bg, borderRadius: 8, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 18 }}>{rec?.emoji}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: rec?.color }}>{rec?.label}</div>
              <div style={{ fontSize: 9, color: C.muted }}>Your recommendation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific message */}
      {isHM ? (
        <div style={{ background: C.sucBg, borderRadius: 11, padding: '14px 18px', marginBottom: 22, maxWidth: 400, margin: '0 auto 22px', border: '1px solid #BBF7D0', textAlign: 'left' }}>
          <p style={{ fontSize: 12, color: C.sucT, margin: 0, lineHeight: 1.7 }}>
            As hiring manager, you can now view the consolidated decision brief across all interviewers and make your final call.
          </p>
        </div>
      ) : (
        <div style={{ background: C.infBg, borderRadius: 11, padding: '14px 18px', marginBottom: 22, maxWidth: 400, margin: '0 auto 22px', border: `1px solid #BFDBFE`, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.infT, marginBottom: 4 }}>
            🔔 You will be notified when a decision is made
          </p>
          <p style={{ fontSize: 12, color: C.infT, margin: 0, lineHeight: 1.7 }}>
            Thank you for taking the time — your feedback makes the decision better and the candidate update more meaningful.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 11, justifyContent: 'center', flexWrap: 'wrap' }}>
        {isHM && (
          <button onClick={() => onNavigate?.('hiring-summary')} style={{ padding: '10px 20px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            📊 View decision brief
          </button>
        )}
        <button onClick={() => onNavigate?.('hiring-manager')} style={{ padding: '10px 20px', borderRadius: 10, background: C.white, color: C.text, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ← Back to dashboard
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function PostInterviewQuestionnaire({ candidate = MOCK_CANDIDATE, isHM = true, onBack, onNavigate }) {
  const [step, setStep] = useState(0)

  const [context,        setContext]        = useState({ interviewDate: '', interviewType: '' })
  const [ratings,        setRatings]        = useState({})
  const [feedback,       setFeedback]       = useState({ strengths: '', development: '', standout: '' })
  const [recommendation, setRecommendation] = useState(null)
  const [notes,          setNotes]          = useState('')

  const updateContext  = (key, val) => setContext(c => ({ ...c, [key]: val }))
  const updateRating   = (key, val) => setRatings(r => ({ ...r, [key]: val }))
  const updateFeedback = (key, val) => setFeedback(f => ({ ...f, [key]: val }))

  const STEPS = ['Context', 'Ratings', 'Feedback', 'Recommendation']

  if (step === 4) return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
      <style>{`
        @keyframes stepIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.15);} }
      `}</style>
      <DoneState candidate={candidate} recommendation={recommendation} ratings={ratings} isHM={isHM} onNavigate={onNavigate} />
    </div>
  )

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
      <style>{`
        @keyframes stepIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.15);} }
      `}</style>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 36px 56px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
          ← Back
        </button>

        <div style={{ marginBottom: 26 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Post-interview debrief</p>
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 3px' }}>{candidate.name}</h1>
          <p style={{ color: C.muted, fontSize: 12, margin: 0 }}>{candidate.role} · {candidate.pos}</p>
        </div>

        <StepBar step={step} steps={STEPS} />

        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: '30px 34px', boxShadow: '0 2px 20px rgba(201,57,74,0.04)' }}>
          {step === 0 && (
            <StepContext
              candidate={candidate}
              context={context}
              onChange={updateContext}
              onNext={() => setStep(1)}
              currentUser={CURRENT_USER}
            />
          )}
          {step === 1 && (
            <StepRatings candidate={candidate} ratings={ratings} onChange={updateRating} onNext={() => setStep(2)} onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <StepFeedback candidate={candidate} feedback={feedback} onChange={updateFeedback} onNext={() => setStep(3)} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <StepRecommendation
              candidate={candidate}
              recommendation={recommendation}
              notes={notes}
              isHM={isHM}
              onChangeRec={setRecommendation}
              onChangeNotes={setNotes}
              onSubmit={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: C.muted }}>
          Step {step + 1} of {STEPS.length} · Fields marked <span style={{ color: C.red }}>*</span> are required
        </div>
      </div>
    </div>
  )
}
