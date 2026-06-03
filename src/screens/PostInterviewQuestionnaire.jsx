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
//   • Done state differs: non-HM gets a notification note; HM keeps decision summary
//   • Removed "scores feed into update message" from What happens next
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react'
import { buildC, THEMES } from '../designSystem'
let C = buildC(THEMES.light)

const SCREEN_T = {
  en: {
    back:             '← Back',
    badge:            'Interview Debrief',
    stepOf:           (s, t) => `Step ${s} of ${t} · Fields marked`,
    required:         'are required',
    steps:            ['Context', 'Ratings', 'Feedback'],
    // Step 1
    step1Title:       'Before you begin',
    step1Sub:         'Just the date and you are good to go.',
    candidate:        'Candidate',
    interviewer:      'Interviewer',
    dateLabel:        'Date of interview',
    dateTip:          'Filling this in right after the interview leads to sharper, more useful feedback.',
    typeLabel:        'Interview type',
    typeOptional:     '(optional)',
    continueBtn:      'Continue →',
    // Step 2
    step2Title:       'How did they fit?',
    step2Sub:         (bold) => `Assess what you covered. If you did not evaluate a criterion, tap ${bold} — that is a valid answer.`,
    step2Bold:        'Did not evaluate',
    step2Tech:        'Technical skills are',
    step2TechBold:    'optional',
    step2TechSub:     '— skip if there was no technical component to your interview.',
    fitSoFar:         'Your assessment so far',
    strongFitCount:   (n) => `${n} strong fit`,
    fitCount:         (n) => `${n} fit`,
    fitRequired:      (labels) => `${labels} — assess or tap "Did not evaluate"`,
    strongFit:        'Strong fit',
    fit:              'Fit',
    notFit:           'Not fit',
    backBtn:          '← Back',
    // Step 3
    step3Title:       'Your observations',
    step3Framing:     "Candidates appreciate specific, growth-oriented feedback more than you might expect — a few honest, concrete sentences can genuinely make a difference, even when the answer is no.",
    step3Hint:        'Tap Dictate',
    step3HintText:    ' to speak your thoughts — ideal right after the interview while everything is fresh. Or type and paste your notes directly. Either works.',
    strengthsLabel:   'What did they do well?',
    strengthsHint:    'Specific beats general — a real example is worth ten adjectives',
    developLabel:     'What could they develop further?',
    developHint:      'Growth-oriented and honest — this is what candidates remember and use',
    standoutLabel:    'Anything else worth noting?',
    // Step 4
    step4Title:       'Your recommendation',
    step4Sub:         'Be direct — ambiguity slows the process for everyone, including the candidate.',
    notesLabel:       'Additional context',
    notesHint:        'Seen by the hiring manager and recruiter only',
    whatNext:         '✦ What happens next',
    submitBtn:        'Submit feedback ✓',
    // Done
    doneTitle:        'Debrief submitted',
    doneSub:          (name) => `Your input for ${name} has been saved and will inform the decision debrief and any candidate updates.`,
    yourRec:          'Your recommendation',
    hmMessage:        'As hiring manager, you can now view the consolidated decision debrief across all interviewers and make your final call.',
    notifyTitle:      '🔔 You will be notified when a decision is made',
    notifyText:       'Thank you for taking the time — your input makes the decision better and the candidate update more meaningful.',
    viewBrief:        '📊 View decision report',
    backSummaries:    '← Interview debriefs',
    backDashboard:    '← My dashboard',
    // Misc
    skipped:          'Skipped',
    didNotEval:       'Did not evaluate',
    didNotEvalDesc:   'Did not evaluate this characteristic',
    undoBtn:          'Undo',
    requiredText:     'Required',
    optional:         'Optional',
    stopDictate:      'Stop',
    dictate:          'Dictate',
    transcribing:     '🎤 Transcribing…',
    listening:        'Listening — speak naturally, tap Stop when done',
    voiceUnavail:     'Voice unavailable',
    resetGenerated:   '↺ Reset to generated',
    wordCount:        (n) => `${n} words`,
  },
  it: {
    back:             '← Indietro',
    badge:            'Debrief colloquio',
    stepOf:           (s, t) => `Passaggio ${s} di ${t} · I campi con`,
    required:         'sono obbligatori',
    steps:            ['Contesto', 'Valutazioni', 'Feedback'],
    // Step 1
    step1Title:       'Prima di iniziare',
    step1Sub:         'Solo la data e sei pronto.',
    candidate:        'Candidato',
    interviewer:      'Intervistatore',
    dateLabel:        'Data del colloquio',
    dateTip:          'Compilare subito dopo il colloquio porta a feedback più nitidi e utili.',
    typeLabel:        'Tipo di colloquio',
    typeOptional:     '(opzionale)',
    continueBtn:      'Continua →',
    // Step 2
    step2Title:       'Come si è adattato?',
    step2Sub:         (bold) => `Valuta ciò che hai esaminato. Se non hai valutato un criterio, tocca ${bold} — è una risposta valida.`,
    step2Bold:        'Non valutato',
    step2Tech:        'Le competenze tecniche sono',
    step2TechBold:    'opzionali',
    step2TechSub:     '— salta se non c\'era una componente tecnica.',
    fitSoFar:         'La tua valutazione finora',
    strongFitCount:   (n) => `${n} fortemente idoneo`,
    fitCount:         (n) => `${n} idoneo`,
    fitRequired:      (labels) => `${labels} — valuta o tocca "Non valutato"`,
    strongFit:        'Fortemente idoneo',
    fit:              'Idoneo',
    notFit:           'Non idoneo',
    backBtn:          '← Indietro',
    // Step 3
    step3Title:       'Le tue osservazioni',
    step3Framing:     "I candidati apprezzano il feedback specifico e orientato alla crescita più di quanto ti aspetti — poche frasi oneste e concrete possono fare la differenza.",
    step3Hint:        'Tocca Ditta',
    step3HintText:    ' per parlare — ideale subito dopo il colloquio. O scrivi direttamente le tue note.',
    strengthsLabel:   'Cosa ha fatto bene?',
    strengthsHint:    'Lo specifico vale più del generico — un esempio reale vale dieci aggettivi',
    developLabel:     'Cosa potrebbe migliorare?',
    developHint:      'Orientato alla crescita e onesto — questo è ciò che i candidati ricordano',
    standoutLabel:    'Qualcos\'altro da segnalare?',
    // Step 4
    step4Title:       'La tua raccomandazione',
    step4Sub:         'Sii diretto — l\'ambiguità rallenta il processo per tutti, incluso il candidato.',
    notesLabel:       'Contesto aggiuntivo',
    notesHint:        'Visibile solo al responsabile assunzioni e al recruiter',
    whatNext:         '✦ Cosa succede dopo',
    submitBtn:        'Invia feedback ✓',
    // Done
    doneTitle:        'Debrief inviato',
    doneSub:          (name) => `Il tuo contributo per ${name} è stato salvato e informerà il debrief decisionale.`,
    yourRec:          'La tua raccomandazione',
    hmMessage:        'Come responsabile assunzioni, puoi ora visualizzare il debrief decisionale consolidato e prendere la decisione finale.',
    notifyTitle:      '🔔 Sarai notificato quando verrà presa una decisione',
    notifyText:       'Grazie per il tuo tempo — il tuo contributo rende la decisione migliore e l\'aggiornamento al candidato più significativo.',
    viewBrief:        '📊 Visualizza report decisionale',
    backSummaries:    '← Debrief colloqui',
    backDashboard:    '← La mia bacheca',
    // Misc
    skipped:          'Saltato',
    didNotEval:       'Non valutato',
    didNotEvalDesc:   'Non ho valutato questa caratteristica',
    undoBtn:          'Annulla',
    requiredText:     'Obbligatorio',
    optional:         'Opzionale',
    stopDictate:      'Stop',
    dictate:          'Ditta',
    transcribing:     '🎤 Trascrizione…',
    listening:        'In ascolto — parla normalmente, tocca Stop quando hai finito',
    voiceUnavail:     'Voce non disponibile',
    resetGenerated:   '↺ Ripristina generato',
    wordCount:        (n) => `${n} parole`,
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────

// ── Mock candidate ────────────────────────────────────────────────────────────
const MOCK_CANDIDATE = {
  id: 1, name: 'Giulia Rossi', ini: 'GR',
  role: 'UX Designer', pos: 'UX Designer',
}

// ── Current user — defined per-role inside the component ─────────────────────

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

// Fit levels: null = not yet answered, -1 = did not evaluate, 'strong' | 'fit' | 'not-fit'
const FIT_CONFIG = {
  strong:   { label: 'Strong fit',  color: C.suc, bg: C.sucBg,  border: '#BBF7D0' },
  fit:      { label: 'Fit',         color: C.war, bg: C.warBg,  border: '#FDE68A' },
  'not-fit':{ label: 'Not fit',     color: C.red, bg: '#FEF2F2',border: '#FECACA' },
}

// ── Recommendation options ────────────────────────────────────────────────────
const RECOMMENDATIONS = [
  { id: 'strongly-advance', label: 'Strong advance',             emoji: '⭐', color: C.suc,  bg: C.sucBg,  border: '#BBF7D0' },
  { id: 'advance',          label: 'Average fit',                emoji: '◎',  color: C.war,  bg: C.warBg,  border: '#FDE68A' },
  { id: 'reservations',     label: 'Fit with reservations',      emoji: '△',  color: C.war,  bg: '#FFFBEB', border: '#FDE68A' },
  { id: 'not-moving',       label: 'Not advancing',              emoji: '✕',  color: C.red,  bg: '#FEF2F2', border: '#FECACA' },
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
function DictationField({ label, value, onChange, placeholder, required, rows = 3, hint, T }) {
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
            {active ? (T ? T.stopDictate : 'Stop') : (T ? T.dictate : 'Dictate')}
            {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite', display: 'inline-block' }} />}
          </button>
        ) : (
          <span style={{ fontSize: 10, color: C.muted, fontStyle: 'italic', marginLeft: 12 }}>{T ? T.voiceUnavail : 'Voice unavailable'}</span>
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
          {T ? T.listening : 'Listening — speak naturally, tap Stop when done'}
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
          background: active ? C.redBg : C.white,
          transition: 'border-color 0.2s, background 0.2s',
        }}
      />
      {required && isEmpty && !active && (
        <p style={{ fontSize: 11, color: '#EF4444', margin: '3px 0 0' }}>{T ? T.requiredText : 'Required'}</p>
      )}
    </div>
  )
}

// ── Fit rating — Strong fit / Fit / Not fit / Did not evaluate ────────────────
function FitRating({ value, onChange, criterion, T }) {
  // value: null = unanswered, -1 = did not evaluate, 'strong' | 'fit' | 'not-fit'
  const isSkipped = value === -1
  const hasAnswer = value !== null && value !== undefined && value !== 0
  const cfg       = value && value !== -1 ? FIT_CONFIG[value] : null

  const borderColor = !hasAnswer && !criterion.optional
    ? '#FECACA'
    : cfg ? cfg.border
    : isSkipped ? C.grayB
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
              <span style={{ fontSize: 10, fontWeight: 400, color: C.muted, background: C.gray, padding: '1px 7px', borderRadius: 10 }}>{T ? T.optional : 'Optional'}</span>
            )}
          </div>
          {!isSkipped && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{criterion.desc}</div>
          )}
        </div>
        {/* Status badge */}
        {isSkipped ? (
          <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, background: C.gray, padding: '3px 9px', borderRadius: 20, flexShrink: 0, marginLeft: 10 }}>
            {T ? T.skipped : 'Skipped'}
          </span>
        ) : cfg ? (
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, flexShrink: 0, marginLeft: 10, background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
        ) : !criterion.optional ? (
          <span style={{ fontSize: 10, color: '#EF4444', flexShrink: 0, marginLeft: 10, fontWeight: 500 }}>{T ? T.requiredText : 'Required'}</span>
        ) : null}
      </div>

      {isSkipped ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: C.muted }}>{T ? T.didNotEvalDesc : 'Did not evaluate this characteristic'}</span>
          <button onClick={() => onChange(null)} style={{ fontSize: 11, color: C.inf, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
            {T ? T.undoBtn : 'Undo'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Fit level buttons */}
          {['strong', 'fit', 'not-fit'].map(level => {
            const lcfg = FIT_CONFIG[level]
            const isSelected = value === level
            const fitBg = level === 'strong' ? C.sucBg : level === 'fit' ? C.warBg : C.redBg
            return (
              <button
                key={level}
                onClick={() => onChange(isSelected ? null : level)}
                style={{
                  padding: '7px 16px', borderRadius: 22, cursor: 'pointer',
                  border: `2px solid ${isSelected ? lcfg.color : C.border}`,
                  background: isSelected ? fitBg : C.white,
                  color: isSelected ? lcfg.color : C.muted,
                  fontSize: 12, fontWeight: isSelected ? 700 : 400,
                  fontFamily: 'inherit', transition: 'all 0.13s',
                }}
              >
                {level === 'strong' ? (T?.strongFit || 'Strong fit') : level === 'fit' ? (T?.fit || 'Fit') : (T?.notFit || 'Not fit')}
              </button>
            )
          })}
          {/* Did not evaluate */}
          <button
            onClick={() => onChange(-1)}
            style={{
              fontSize: 11, color: C.muted, background: 'none', border: `1px solid ${C.border}`,
              borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
              padding: '4px 11px', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {T ? T.didNotEval : 'Did not evaluate'}
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
function StepContext({ candidate, context, onChange, onNext, currentUser, T }) {
  const valid = !!context.interviewDate

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.step1Title}
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>
        {T.step1Sub}
      </p>

      {/* Candidate + auto-filled interviewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 26 }}>
        <div style={{ background: C.redBg, borderRadius: 11, border: `1px solid ${C.border}`, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Av id={candidate.id} ini={candidate.ini} size={38} />
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{T.candidate}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
          </div>
        </div>

        <div style={{ background: C.gray, borderRadius: 11, border: `1px solid ${C.border}`, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: C.redL, color: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {currentUser.ini}
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{T.interviewer}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{currentUser.role}</div>
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: 26 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 7 }}>
          {T.dateLabel}<RequiredDot />
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
            background: C.white, cursor: 'pointer', fontFamily: 'inherit',
            boxSizing: 'border-box', outline: 'none', maxWidth: 260,
          }}
        />
        <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
          {T.dateTip}
        </p>
      </div>

      {/* Interview type — optional quick-select */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          {T.typeLabel} <span style={{ fontWeight: 400, color: C.muted }}>{T.typeOptional}</span>
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
        {T.continueBtn}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Fit Assessment
// ─────────────────────────────────────────────────────────────────────────────
function StepRatings({ candidate, ratings, onChange, onNext, onBack, T }) {
  // Required criteria need a fit level OR explicit skip (-1). null = not yet answered.
  const requiredAnswered = CRITERIA
    .filter(c => !c.optional)
    .every(c => ratings[c.id] !== null && ratings[c.id] !== undefined)

  const assessedCount  = CRITERIA.filter(c => ratings[c.id] && ratings[c.id] !== -1).length
  const strongCount    = CRITERIA.filter(c => ratings[c.id] === 'strong').length
  const fitCount       = CRITERIA.filter(c => ratings[c.id] === 'fit').length

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.step2Title}
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 10px', lineHeight: 1.6 }}>
        {T.step2Sub(<strong style={{ color: C.text }}>{T.step2Bold}</strong>)}
      </p>
      <p style={{ color: C.muted, fontSize: 12, margin: '0 0 22px', lineHeight: 1.5, padding: '9px 13px', background: C.redBg, borderRadius: 8, border: `1px solid ${C.border}` }}>
        {T.step2Tech} <strong style={{ color: C.text }}>{T.step2TechBold}</strong>{T.step2TechSub}
      </p>

      {/* Live assessment summary */}
      {assessedCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.redBg, borderRadius: 10, padding: '11px 16px', marginBottom: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.red, fontFamily: 'DM Serif Display, serif', lineHeight: 1 }}>{assessedCount}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{T.fitSoFar}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
              {strongCount > 0 && <span style={{ color: C.sucT, fontWeight: 600, marginRight: 8 }}>★ {T.strongFitCount(strongCount)}</span>}
              {fitCount > 0 && <span style={{ color: C.warT, fontWeight: 600 }}>◎ {T.fitCount(fitCount)}</span>}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
        {CRITERIA.map(c => (
          <FitRating
            key={c.id}
            criterion={c}
            value={ratings[c.id] !== undefined ? ratings[c.id] : null}
            onChange={(val) => onChange(c.id, val)}
            T={T}
          />
        ))}
      </div>

      {!requiredAnswered && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, padding: '9px 13px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
          <span style={{ fontSize: 13 }}>⚠</span>
          <span style={{ fontSize: 12, color: C.red }}>
            {T.fitRequired(CRITERIA.filter(c => !c.optional && (!ratings[c.id])).map(c => c.label).join(' · '))}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{T.backBtn}</button>
        <button onClick={onNext} disabled={!requiredAnswered} style={{ padding: '11px 26px', borderRadius: 10, background: requiredAnswered ? C.red : C.grayB, color: requiredAnswered ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: requiredAnswered ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          {T.continueBtn}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Qualitative feedback (final step — submit from here)
// ─────────────────────────────────────────────────────────────────────────────
function StepFeedback({ candidate, feedback, onChange, onSubmit, onBack, isHM, T }) {
  const strengthsValid = feedback.strengths && feedback.strengths.trim().length >= 8
  const developValid   = feedback.development && feedback.development.trim().length >= 8
  const canSubmit      = strengthsValid && developValid

  const makeHandler = (field) => (updater) =>
    onChange(field, typeof updater === 'function' ? updater(feedback[field] || '') : updater)

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
        {T.step3Title}
      </h2>

      {/* Candidate-centred framing */}
      <div style={{ background: C.redBg, borderRadius: 10, padding: '12px 15px', border: `1px solid ${C.border}`, marginBottom: 22 }}>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
          {T.step3Framing}
        </p>
      </div>

      {/* How to fill this in */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 22, padding: '10px 14px', background: C.white, borderRadius: 9, border: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💬</span>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: C.text }}>{T.step3Hint}</strong>{T.step3HintText}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <DictationField
          label={T.strengthsLabel}
          value={feedback.strengths || ''}
          onChange={makeHandler('strengths')}
          placeholder="A specific moment or quality — e.g. Walked through a complex decision with real clarity. Responded to pushback without deflecting."
          required
          rows={3}
          hint={T.strengthsHint}
          T={T}
        />

        <DictationField
          label={T.developLabel}
          value={feedback.development || ''}
          onChange={makeHandler('development')}
          placeholder="Frame it as growth — e.g. Stakeholder communication: tended to default to technical depth when a simpler framing would land better."
          required
          rows={3}
          hint={T.developHint}
          T={T}
        />

        <DictationField
          label={T.standoutLabel}
          value={feedback.standout || ''}
          onChange={makeHandler('standout')}
          placeholder="Optional — a standout moment, a concern, or anything the decision makers should know…"
          required={false}
          rows={2}
          T={T}
        />
      </div>

      {/* What happens next — shown once required fields are filled */}
      {canSubmit && (
        <div style={{ margin: '26px 0 0', padding: '14px 16px', background: C.redBg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, margin: '0 0 8px' }}>{T.whatNext}</p>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: C.muted, lineHeight: 2.1 }}>
            <li>Your feedback is saved to {candidate.name.split(' ')[0]}'s profile</li>
            {isHM
              ? <li>As hiring manager, you can view the full decision report across all interviewers</li>
              : <li>You will be notified when a decision for {candidate.name.split(' ')[0]} has been made</li>
            }
            <li>Your observations help shape a growth-oriented, honest update for the candidate</li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{T.backBtn}</button>
        <button onClick={onSubmit} disabled={!canSubmit} style={{ padding: '11px 30px', borderRadius: 10, background: canSubmit ? C.red : C.grayB, color: canSubmit ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          {T.submitBtn}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Recommendation
// ─────────────────────────────────────────────────────────────────────────────
function StepRecommendation({ candidate, recommendation, notes, isHM, onChangeRec, onChangeNotes, onSubmit, onBack, T }) {
  const canSubmit = !!recommendation

  const makeHandler = () => (updater) =>
    onChangeNotes(typeof updater === 'function' ? updater(notes || '') : updater)

  return (
    <div style={{ animation: 'stepIn 0.2s ease' }}>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.step4Title}
      </h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 26px', lineHeight: 1.6 }}>
        {T.step4Sub}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 26 }}>
        {RECOMMENDATIONS.map(rec => {
          const recBg = { 'strongly-advance': C.sucBg, 'advance': C.warBg, 'reservations': C.warBg, 'not-moving': C.redBg }
          return (
          <button
            key={rec.id}
            onClick={() => onChangeRec(rec.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '14px 18px', borderRadius: 11, cursor: 'pointer',
              border: `2px solid ${recommendation === rec.id ? rec.color : C.border}`,
              background: recommendation === rec.id ? recBg[rec.id] : C.white,
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
        )})}
      </div>

      <DictationField
        label={T.notesLabel}
        value={notes || ''}
        onChange={makeHandler()}
        placeholder="Logistics, red flags, compensation expectations, or a standout concern — optional but useful…"
        required={false}
        rows={3}
        hint={T.notesHint}
        T={T}
      />

      {/* What happens next — tailored to role */}
      {canSubmit && (
        <div style={{ margin: '22px 0', padding: '13px 16px', background: C.redBg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7 }}>{T.whatNext}</p>
          <ul style={{ margin: 0, paddingLeft: 15, fontSize: 12, color: C.muted, lineHeight: 2.1 }}>
            <li>Your feedback is saved to {candidate.name.split(' ')[0]}'s profile</li>
            {isHM
              ? <li>As hiring manager, you can view the full decision debrief across all interviewers</li>
              : <li>You will be notified when a decision for {candidate.name.split(' ')[0]} has been made</li>
            }
            <li>Your observations help shape a growth-oriented, honest update for the candidate</li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: 10, background: 'transparent', color: C.muted, border: `1.5px solid ${C.border}`, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{T.backBtn}</button>
        <button onClick={onSubmit} disabled={!canSubmit} style={{ padding: '11px 30px', borderRadius: 10, background: canSubmit ? C.red : C.grayB, color: canSubmit ? 'white' : C.muted, border: 'none', fontSize: 14, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.15s' }}>
          {T.submitBtn}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Done state — differs for HM vs other interviewers
// ─────────────────────────────────────────────────────────────────────────────
function DoneState({ candidate, isHM, summariesScreen, homeScreen, onNavigate, T }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 32px', animation: 'stepIn 0.3s ease' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
      <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, fontWeight: 400, color: C.text, margin: '0 0 10px' }}>
        {T.doneTitle}
      </h2>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, margin: '0 0 28px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
        {T.doneSub(candidate.name)}
      </p>

      {/* Candidate card */}
      <div style={{ background: C.white, borderRadius: 13, border: `1px solid ${C.border}`, padding: '16px 20px', maxWidth: 400, margin: '0 auto 22px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Av id={candidate.id} ini={candidate.ini} size={42} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{candidate.name}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{candidate.role}</div>
        </div>
      </div>

      {/* Role-specific message */}
      {isHM ? (
        <div style={{ background: C.sucBg, borderRadius: 11, padding: '14px 18px', maxWidth: 400, margin: '0 auto 22px', border: '1px solid #BBF7D0', textAlign: 'left' }}>
          <p style={{ fontSize: 12, color: C.sucT, margin: 0, lineHeight: 1.7 }}>
            {T.hmMessage}
          </p>
        </div>
      ) : (
        <div style={{ background: C.infBg, borderRadius: 11, padding: '14px 18px', maxWidth: 400, margin: '0 auto 22px', border: `1px solid #BFDBFE`, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.infT, marginBottom: 4 }}>
            {T.notifyTitle}
          </p>
          <p style={{ fontSize: 12, color: C.infT, margin: 0, lineHeight: 1.7 }}>
            {T.notifyText}
          </p>
        </div>
      )}

      {/* Navigation — Interview summaries + My dashboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <button
          onClick={() => onNavigate?.(summariesScreen)}
          style={{ padding: '11px 28px', borderRadius: 10, background: C.red, color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: 280 }}
        >
          {T.backSummaries}
        </button>
        <button
          onClick={() => onNavigate?.(homeScreen)}
          style={{ padding: '10px 28px', borderRadius: 10, background: C.white, color: C.text, border: `1.5px solid ${C.border}`, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: 280 }}
        >
          {T.backDashboard}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Root export
// ─────────────────────────────────────────────────────────────────────────────
export default function PostInterviewQuestionnaire({ theme, lang = 'en', candidate = MOCK_CANDIDATE, isHM = true, summariesScreen = 'debrief-list', homeScreen = 'hiring-manager', onBack, onNavigate }) {
  C = buildC(theme)

  const T = SCREEN_T[lang] || SCREEN_T.en

  // Current user — derived from role so the debrief form shows the right name
  const currentUser = isHM
    ? { name: 'Andrea P.', role: 'Hiring Manager', ini: 'AP' }
    : { name: 'Alessandro S.', role: 'Senior UX Designer', ini: 'AL' }

  const [step, setStep] = useState(0)

  const [context,  setContext]  = useState({ interviewDate: '', interviewType: '' })
  const [ratings,  setRatings]  = useState({})
  const [feedback, setFeedback] = useState({ strengths: '', development: '', standout: '' })

  const updateContext  = (key, val) => setContext(c => ({ ...c, [key]: val }))
  const updateRating   = (key, val) => setRatings(r => ({ ...r, [key]: val }))
  const updateFeedback = (key, val) => setFeedback(f => ({ ...f, [key]: val }))

  const STEPS = T.steps

  // Done state
  if (step === 3) return (
    <div style={{ flex: 1, overflow: 'auto', background: C.redBg }}>
      <style>{`
        @keyframes stepIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(1.15);} }
      `}</style>
      <DoneState candidate={candidate} isHM={isHM} summariesScreen={summariesScreen} homeScreen={homeScreen} onNavigate={onNavigate} T={T} />
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
          {T.back}
        </button>

        <div style={{ marginBottom: 26 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{T.badge}</p>
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
              currentUser={currentUser}
              T={T}
            />
          )}
          {step === 1 && (
            <StepRatings candidate={candidate} ratings={ratings} onChange={updateRating} onNext={() => setStep(2)} onBack={() => setStep(0)} T={T} />
          )}
          {step === 2 && (
            <StepFeedback
              candidate={candidate}
              feedback={feedback}
              onChange={updateFeedback}
              onSubmit={() => setStep(3)}
              onBack={() => setStep(1)}
              isHM={isHM}
              T={T}
            />
          )}
        </div>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: C.muted }}>
          {T.stepOf(step + 1, STEPS.length)} <span style={{ color: C.red }}>*</span> {T.required}
        </div>
      </div>
    </div>
  )
}
