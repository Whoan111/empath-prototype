// ─────────────────────────────────────────────────────────────────────────────
// CraftMessage.jsx
// Place in: src/screens/CraftMessage.jsx
//
// Full two-step crafting flow:
//   Step 1 — Compose:  pick candidate, message type, add optional context
//   Step 2 — Edit:     live preview, tone slider, quick fixes, send / copy
//                      + "Preview as candidate" inbox view toggle
//
// Props:
//   candidate     — pre-selected candidate object (optional)
//   onBack()      — navigate back
//   onNavigate()  — parent navigation handler
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useRef } from 'react'

// ── Translations ──────────────────────────────────────────────────────────────
const SCREEN_T = {
  en: {
    backDash:         '← Back to Dashboard',
    title:            'Craft a message',
    subtitle:         'Select a candidate and message type. Empath will generate a warm, personalised draft you can refine.',
    candidateLabel:   'Candidate',
    selectCandidate:  'Select a candidate…',
    msgTypeLabel:     'Message type',
    contextOptional:  '(optional)',
    contextHint:      'Keep it brief — a note or two. Empath handles tone, empathy, and structure.',
    toneLabel:        'Tone',
    professional:     'Professional',
    personalWarm:     'Personal & Warm',
    empathWill:       '✦ Empath will…',
    empathAutoFill:   (name) => `Auto-fill ${name}'s name, role, and stage`,
    empathAutoFillGeneric: "Auto-fill the candidate's name, role, and current stage",
    empathGenerate:   (tone) => `Generate a ${tone} message tailored to the type`,
    empathContext:    'Weave in any context you provided naturally',
    empathControl:    'Give you full control to edit, refine, and adjust',
    empathPreview:    'Let you preview exactly what the candidate receives',
    generateBtn:      (name) => `Generate message for ${name} →`,
    selectFirst:      'Select a candidate to continue',
    // Edit step
    editInputs:       '← Edit inputs',
    compose:          '✏ Compose',
    candidateView:    '👁 Candidate view',
    toLabel:          'To',
    subjectLabel:     'Subject',
    words:            (n) => `${n} words`,
    resetGenerated:   '↺ Reset to generated',
    toneDesc0:        'Concise and factual. Clear structure, minimal warmth markers.',
    toneDesc1:        'Respectful and clear. Warm but measured language throughout.',
    toneDesc2:        'Warm and human. Empathetic phrasing, personal acknowledgement.',
    toneDesc3:        'Deeply personal. Empathy-first language, genuine and heartfelt.',
    quickAdjLabel:    'Quick adjustments',
    editContextLabel: 'Edit context',
    editContextPh:    'Update the context to regenerate…',
    personal:         'Personal',
    sentMsg:          (name) => `✓ Message sent to ${name}`,
    sendBtn:          '✉ Send via Empath',
    copyBtn:          '📋 Copy to clipboard',
    copiedBtn:        '✓ Copied to clipboard',
    backCompose:      '✏ Back to compose view',
    previewCandidate: '👁 Preview as candidate',
  },
  it: {
    backDash:         '← Torna alla bacheca',
    title:            'Scrivi un messaggio',
    subtitle:         'Seleziona un candidato e il tipo di messaggio. Empath genererà una bozza personalizzata che puoi rifinire.',
    candidateLabel:   'Candidato',
    selectCandidate:  'Seleziona un candidato…',
    msgTypeLabel:     'Tipo di messaggio',
    contextOptional:  '(opzionale)',
    contextHint:      'Sii breve — una nota o due. Empath gestisce il tono, l\'empatia e la struttura.',
    toneLabel:        'Tono',
    professional:     'Professionale',
    personalWarm:     'Personale e caldo',
    empathWill:       '✦ Empath…',
    empathAutoFill:   (name) => `Compilerà automaticamente nome, ruolo e fase di ${name}`,
    empathAutoFillGeneric: 'Compilerà automaticamente il nome, ruolo e fase del candidato',
    empathGenerate:   (tone) => `Genererà un messaggio ${tone} adattato al tipo`,
    empathContext:    'Integrerà naturalmente il contesto fornito',
    empathControl:    'Ti darà il pieno controllo per modificare e rifinire',
    empathPreview:    'Ti permetterà di vedere esattamente cosa riceve il candidato',
    generateBtn:      (name) => `Genera messaggio per ${name} →`,
    selectFirst:      'Seleziona un candidato per continuare',
    // Edit step
    editInputs:       '← Modifica parametri',
    compose:          '✏ Scrivi',
    candidateView:    '👁 Vista candidato',
    toLabel:          'A',
    subjectLabel:     'Oggetto',
    words:            (n) => `${n} parole`,
    resetGenerated:   '↺ Ripristina generato',
    toneDesc0:        'Conciso e oggettivo. Struttura chiara, tono neutro.',
    toneDesc1:        'Rispettoso e chiaro. Caldo ma misurato.',
    toneDesc2:        'Caldo e umano. Formulazione empatica, riconoscimento personale.',
    toneDesc3:        'Profondamente personale. Linguaggio empatico, sincero e sentito.',
    quickAdjLabel:    'Aggiustamenti rapidi',
    editContextLabel: 'Modifica contesto',
    editContextPh:    'Aggiorna il contesto per rigenerare…',
    personal:         'Personale',
    sentMsg:          (name) => `✓ Messaggio inviato a ${name}`,
    sendBtn:          '✉ Invia via Empath',
    copyBtn:          '📋 Copia negli appunti',
    copiedBtn:        '✓ Copiato negli appunti',
    backCompose:      '✏ Torna alla scrittura',
    previewCandidate: '👁 Anteprima come candidato',
  },
}

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  red:   '#C9394A', redH:  '#A82D3B', redL:  '#FECDD3', redBg: '#FFF5F6',
  text:  '#1C1917', muted: '#78716C', border:'#F0D0D4',
  white: '#FFFFFF', gray:  '#F5F4F3', grayB: '#E5E2DF',
  suc: '#059669', sucBg: '#D1FAE5', sucT: '#065F46',
  war: '#D97706', warBg: '#FEF3C7', warT: '#92400E',
  inf: '#2563EB', infBg: '#DBEAFE', infT: '#1E40AF',
}

// ── Candidate pool ────────────────────────────────────────────────────────────
const ALL_CANDIDATES = [
  { id:1,  name:'Giulia Rossi',    ini:'GR', role:'UX Designer',          stage:'Interviews',       pos:'UX Designer'       },
  { id:2,  name:'Marco Bianchi',   ini:'MB', role:'Senior UX Designer',   stage:'Preliminary Call', pos:'UX Designer'       },
  { id:3,  name:'Sara Conti',      ini:'SC', role:'Junior UX Designer',   stage:'Screening',        pos:'UX Designer'       },
  { id:4,  name:'Luca Ferrari',    ini:'LF', role:'Product Designer',     stage:'Interviews',       pos:'UX Designer'       },
  { id:5,  name:'Elena Marino',    ini:'EM', role:'UX / UI Designer',     stage:'Screening',        pos:'UX Designer'       },
  { id:6,  name:'Andrea Ricci',    ini:'AR', role:'Product Designer',     stage:'Preliminary Call', pos:'UX Designer'       },
  { id:7,  name:'Chiara Lombardi', ini:'CL', role:'UX Researcher',        stage:'Interviews',       pos:'UX Designer'       },
  { id:8,  name:'Thomas Wright',   ini:'TW', role:'React Developer',      stage:'Screening',        pos:'Frontend Engineer' },
  { id:9,  name:'Nina Patel',      ini:'NP', role:'Frontend Dev',         stage:'Screening',        pos:'Frontend Engineer' },
  { id:10, name:'David Kim',       ini:'DK', role:'UI Engineer',          stage:'Preliminary Call', pos:'Frontend Engineer' },
  { id:11, name:'Sofia Esposito',  ini:'SE', role:'Senior PM',            stage:'Preliminary Call', pos:'Product Manager'   },
  { id:12, name:'James Liu',       ini:'JL', role:'Data Scientist',       stage:'Screening',        pos:'Data Analyst'      },
  { id:13, name:'Valentina Greco', ini:'VG', role:'Senior Brand Strat.', stage:'Offer',            pos:'Brand Strategist'  },
]

// ── Message type config ───────────────────────────────────────────────────────
const MSG_TYPES = [
  {
    id: 'rejection',
    label: 'Not moving forward',
    emoji: '💌',
    desc: 'Warm, growth-oriented closure',
    color: C.red, bg: '#FEF2F2',
    contextLabel: 'Specific contextual information',
    contextPlaceholder: 'e.g. Showed real potential — encourage them to reapply in 6 months once they build more system design experience…',
    subject: (name) => `Your application to Publicis Sapient — ${name}`,
  },
  {
    id: 'screening-call',
    label: 'Screening call invite',
    emoji: '📞',
    desc: 'Invite to a first conversation',
    color: C.inf, bg: C.infBg,
    contextLabel: 'Scheduling details or availability',
    contextPlaceholder: 'e.g. 30-min call, available Mon–Wed afternoons next week, Google Meet…',
    subject: (name) => `Next step — screening call invitation`,
  },
  {
    id: 'interview-invite',
    label: 'Interview invitation',
    emoji: '📅',
    desc: 'Formal next-stage interview invite',
    color: C.war, bg: C.warBg,
    contextLabel: 'Interview format, date, interviewers',
    contextPlaceholder: 'e.g. 1-hr panel with the design team, 15 June on Zoom, Andrea P. and Elena C. will join…',
    subject: (name) => `Interview invitation — ${name}`,
  },
  {
    id: 'status-update',
    label: 'Status update',
    emoji: '📬',
    desc: 'Keep them informed mid-process',
    color: '#0891B2', bg: '#ECFEFF',
    contextLabel: 'What to share about their current status',
    contextPlaceholder: 'e.g. Still in final review, decision expected by end of next week…',
    subject: () => `Update on your application`,
  },
  {
    id: 'still-deciding',
    label: 'Still deciding',
    emoji: '⏳',
    desc: 'Empathetic update on a delay',
    color: C.muted, bg: C.gray,
    contextLabel: 'Reason for delay and any timeline',
    contextPlaceholder: 'e.g. Final decision delayed by two weeks due to internal restructuring — we have not forgotten about you…',
    subject: () => `A quick update on your application`,
  },
  {
    id: 'offer',
    label: 'Offer extended',
    emoji: '🎉',
    desc: 'Share the exciting news',
    color: C.suc, bg: C.sucBg,
    contextLabel: 'Offer details and next steps',
    contextPlaceholder: 'e.g. Start date 1 Sep, will send full written offer by Friday, next step is a call to walk through the package…',
    subject: (name) => `Offer — we would love you to join us`,
  },
  {
    id: 'custom',
    label: 'Other…',
    emoji: '+',
    desc: 'Define your own message type',
    color: C.muted, bg: C.gray,
    contextLabel: 'What this message is about',
    contextPlaceholder: 'Describe the purpose of this message and any key points to include…',
    subject: () => `Message from Publicis Sapient`,
    isCustom: true,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const AV_PALETTE = [
  ['#FECDD3','#C9394A'],['#DBEAFE','#2563EB'],['#D1FAE5','#059669'],
  ['#FEF3C7','#D97706'],['#EDE9FE','#6D28D9'],['#FCE7F3','#BE185D'],
  ['#FEF9C3','#CA8A04'],['#DCFCE7','#16A34A'],
]
const avColor = (id) => AV_PALETTE[(id - 1) % AV_PALETTE.length]

function toneWord(t, T) {
  if (t <= 25) return T ? T.professional : 'Professional'
  if (t <= 55) return 'Balanced'
  if (t <= 80) return 'Warm'
  return T ? T.personalWarm : 'Personal & Warm'
}

// ── Message generator ─────────────────────────────────────────────────────────
// All messages are generated client-side from templates that adapt to tone.
// In production you would call the Anthropic API here.
function generateMessage({ candidate, typeId, context, tone }) {
  const name  = candidate?.name  || '[Name]'
  const role  = candidate?.role  || '[Role]'
  const stage = candidate?.stage || ''
  const warm  = tone >= 60
  const prof  = tone <= 35

  const hi = warm
    ? `Dear ${name},\n\nI hope this message finds you well!`
    : `Dear ${name},`

  const closing = warm
    ? `\n\nWith warm regards,\n\nValentina O.\nTalent Acquisition · Publicis Sapient`
    : `\n\nBest regards,\n\nValentina O.\nTalent Acquisition · Publicis Sapient`

  const contextBlock = context ? `\n\n${context}` : ''

  switch (typeId) {
    case 'rejection':
      return [
        hi,
        `\n\nThank you sincerely for the time and energy you invested in your application for the ${role} position at Publicis Sapient.`,
        warm
          ? `\n\nAfter careful and thorough consideration, we have made the difficult decision to move forward with another candidate whose background more closely aligns with what we need at this moment. Please know this was genuinely not easy — your application stood out, and you brought real thoughtfulness to every stage of the process.`
          : `\n\nAfter careful consideration, we have decided to move forward with another candidate whose experience more closely aligns with our current requirements.`,
        contextBlock,
        warm
          ? `\n\nWe truly hope this is not the last time our paths cross. We would encourage you to keep an eye on future opportunities at Publicis Sapient — the right role may well come along.`
          : `\n\nWe wish you every success in your search.`,
        closing,
      ].join('')

    case 'screening-call':
      return [
        hi,
        `\n\nThank you for applying for the ${role} position at Publicis Sapient. We have reviewed your application and ${warm ? 'we would love to learn more about you and share a little about what we are building' : 'we would like to invite you for a screening call'}.`,
        contextBlock || `\n\nPlease let us know your availability and we will coordinate from our side.`,
        warm
          ? `\n\nWe are looking forward to the conversation!`
          : `\n\nWe look forward to speaking with you.`,
        closing,
      ].join('')

    case 'interview-invite':
      return [
        hi,
        warm
          ? `\n\nWe have some great news — we would love to invite you to the next stage of the process for the ${role} position: a formal interview with our team.`
          : `\n\nFollowing our initial review, we would like to invite you to an interview for the ${role} position.`,
        contextBlock || `\n\nPlease confirm your availability and we will share all the details shortly.`,
        warm
          ? `\n\nWe are genuinely excited to continue this conversation and learn more about you.`
          : `\n\nWe look forward to meeting you.`,
        closing,
      ].join('')

    case 'status-update':
      return [
        hi,
        `\n\nI wanted to reach out with a quick update on your application for the ${role} role at Publicis Sapient.`,
        contextBlock || `\n\nOur team is currently in the final stages of reviewing all candidates, and we are working to reach a decision as efficiently as possible. I appreciate your patience throughout this process.`,
        warm
          ? `\n\nThank you again for the thoughtful approach you have brought to every step — it has not gone unnoticed.`
          : `\n\nThank you for your continued patience and interest.`,
        closing,
      ].join('')

    case 'still-deciding':
      return [
        hi,
        warm
          ? `\n\nI wanted to reach out personally to let you know that we are still in the process of finalising our decision for the ${role} position.`
          : `\n\nI am writing to let you know that a decision for the ${role} role has not yet been finalised.`,
        contextBlock || (warm
          ? `\n\nWe recognise that waiting can be difficult, and we genuinely appreciate your patience. We are working as carefully as we can and will be in touch as soon as we have clarity to share.`
          : `\n\nWe will be in touch as soon as a decision has been made.`),
        warm
          ? `\n\nYour interest in Publicis Sapient means a great deal to us.`
          : '',
        closing,
      ].join('')

    case 'offer':
      return [
        hi,
        warm
          ? `\n\nI have absolutely wonderful news — we would love for you to join us as ${role} at Publicis Sapient!`
          : `\n\nFollowing your interviews, we are pleased to offer you the position of ${role} at Publicis Sapient.`,
        contextBlock || `\n\nWe will be in touch shortly with the full written offer. Please do not hesitate to reach out if you have any questions in the meantime.`,
        warm
          ? `\n\nWe are truly excited about the prospect of working together and look forward to welcoming you to the team.`
          : `\n\nWe look forward to welcoming you to the team.`,
        closing,
      ].join('')

    default:
      return `${hi}\n\n${context || `I am writing regarding your application for the ${role} position.`}${closing}`
  }
}

// ── Shared atoms ──────────────────────────────────────────────────────────────
function Av({ id, ini, size = 36 }) {
  const [bg, color] = avColor(id)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.31, fontWeight: 600,
    }}>
      {ini}
    </div>
  )
}

// ── Dictation button — uses Web Speech API when available ─────────────────────
function DictateButton({ onDictate }) {
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef(null)

  const toggle = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition

    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }

    if (SR) {
      const r = new SR()
      r.continuous       = true
      r.interimResults   = false
      r.lang             = 'en-US'
      r.onresult = (e) => {
        const text = Array.from(e.results).map(res => res[0].transcript).join(' ')
        onDictate(' ' + text)
      }
      r.onend  = () => setRecording(false)
      r.onerror = () => setRecording(false)
      recognitionRef.current = r
      r.start()
      setRecording(true)
    } else {
      // Fallback simulation for browsers without Speech API
      setRecording(true)
      setTimeout(() => {
        onDictate(' Candidate showed strong potential in design systems thinking and collaborative problem-solving.')
        setRecording(false)
      }, 1800)
    }
  }

  return (
    <button
      onClick={toggle}
      title={recording ? 'Stop dictation' : 'Dictate context'}
      style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: recording ? '#FEE2E2' : C.gray,
        border: `1.5px solid ${recording ? C.red : C.border}`,
        color: recording ? C.red : C.muted,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        animation: recording ? 'pulse 1.4s ease-in-out infinite' : 'none',
      }}
    >
      {recording
        ? <span style={{ width: 9, height: 9, borderRadius: 2, background: C.red, display: 'block' }} />
        : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        )
      }
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Compose
// ─────────────────────────────────────────────────────────────────────────────
function ComposeStep({ initialCandidate, onGenerate, onBack, backLabel, T }) {
  const [candidate, setCandidate] = useState(initialCandidate || null)
  const [typeId,    setTypeId]    = useState('rejection')
  const [context,   setContext]   = useState('')
  const tone = 72   // fixed warm tone — slider removed

  const msgType    = MSG_TYPES.find(t => t.id === typeId)
  const canGenerate = !!candidate

  const handleGenerate = () => {
    if (!canGenerate) return
    onGenerate({ candidate, typeId, context, tone })
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '30px 36px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, marginBottom: 26, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
        {backLabel || T.backDash}
      </button>

      {/* Title */}
      <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
        {T.title}
      </h1>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 32px', lineHeight: 1.6 }}>
        {T.subtitle}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Candidate picker */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
              {T.candidateLabel}
            </label>

            {candidate ? (
              /* Selected candidate card */
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderRadius: 11, border: `2px solid ${C.red}`, background: C.redBg }}>
                <Av id={candidate.id} ini={candidate.ini} size={40} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{candidate.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{candidate.role} · {candidate.stage}</div>
                </div>
                <button
                  onClick={() => setCandidate(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 18, lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </div>
            ) : (
              /* Dropdown picker */
              <div style={{ position: 'relative' }}>
                <select
                  onChange={e => {
                    const c = ALL_CANDIDATES.find(c => c.id === Number(e.target.value))
                    setCandidate(c || null)
                  }}
                  defaultValue=""
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: `1.5px solid ${C.border}`, fontSize: 13,
                    color: C.text, background: C.white, cursor: 'pointer',
                    fontFamily: 'inherit', appearance: 'none',
                  }}
                >
                  <option value="" disabled>{T.selectCandidate}</option>
                  {ALL_CANDIDATES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.role} ({c.stage})
                    </option>
                  ))}
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', fontSize: 12 }}>▾</span>
              </div>
            )}
          </div>

          {/* Message types */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 11 }}>
              {T.msgTypeLabel}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {MSG_TYPES.map(t => (
                t.isCustom ? (
                  /* "+ Other" add button */
                  <button
                    key={t.id}
                    onClick={() => { setTypeId(t.id); setContext('') }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
                      border: `2px dashed ${typeId === t.id ? C.muted : C.border}`,
                      background: typeId === t.id ? C.gray : 'transparent',
                      textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: typeId === t.id ? C.muted : C.grayB, color: typeId === t.id ? 'white' : C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, flexShrink: 0, lineHeight: 1 }}>+</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>{t.label}</span>
                  </button>
                ) : (
                  <button
                    key={t.id}
                    onClick={() => { setTypeId(t.id); setContext('') }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${typeId === t.id ? t.color : C.border}`,
                      background: typeId === t.id ? t.bg : C.white,
                      textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: typeId === t.id ? 600 : 400, color: typeId === t.id ? t.color : C.text }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>{t.desc}</div>
                    </div>
                    {typeId === t.id && (
                      <span style={{ fontSize: 14, color: t.color, flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Context input with dictation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {msgType?.contextLabel || 'Additional context'}
                <span style={{ fontWeight: 400, color: C.muted, textTransform: 'none', letterSpacing: 0, fontSize: 11, marginLeft: 6 }}>{T.contextOptional}</span>
              </label>
              <DictateButton onDictate={text => setContext(c => c + text)} />
            </div>
            <p style={{ fontSize: 11, color: C.muted, margin: '0 0 9px', lineHeight: 1.6 }}>
              {T.contextHint}
            </p>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder={msgType?.contextPlaceholder || 'Any details to include…'}
              style={{
                width: '100%', padding: '11px 13px', borderRadius: 10,
                border: `1.5px solid ${C.border}`, fontSize: 12, resize: 'none',
                height: 120, color: C.text, lineHeight: 1.7,
                boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
              }}
            />
          </div>

          {/* Empath will… */}
          <div style={{ background: C.redBg, borderRadius: 11, border: `1px solid ${C.border}`, padding: '14px 16px', flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 9 }}>{T.empathWill}</p>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: C.muted, lineHeight: 2.1 }}>
              {candidate && <li>{T.empathAutoFill(candidate.name)}</li>}
              {!candidate && <li>{T.empathAutoFillGeneric}</li>}
              <li>{T.empathContext}</li>
              <li>{T.empathControl}</li>
              <li>{T.empathPreview}</li>
            </ul>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            style={{
              padding: '14px 0', borderRadius: 11,
              background: canGenerate ? C.red : C.grayB,
              color: canGenerate ? 'white' : C.muted,
              border: 'none', fontSize: 14, fontWeight: 600,
              cursor: canGenerate ? 'pointer' : 'default',
              fontFamily: 'inherit', transition: 'background 0.15s',
            }}
          >
            {canGenerate
              ? T.generateBtn(candidate.name.split(' ')[0])
              : T.selectFirst}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Edit & Preview
// ─────────────────────────────────────────────────────────────────────────────

// Candidate inbox mock — shows what the email looks like on their side
function CandidateInboxView({ candidate, subject, message }) {
  const senderInitial = 'SR'
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ flex: 1, display: 'flex', gap: 0, background: C.gray, overflow: 'hidden', borderRadius: 11, border: `1px solid ${C.border}` }}>

      {/* Gmail-style sidebar list */}
      <div style={{ width: 240, background: '#F6F8FC', borderRight: `1px solid #E0E7EF`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #E0E7EF' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#444', marginBottom: 8 }}>Inbox</div>
        </div>
        {/* Highlighted email item */}
        <div style={{ margin: '6px', borderRadius: 8, background: '#D3E3FD', padding: '10px 12px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1C1917' }}>Publicis Sapient</span>
            <span style={{ fontSize: 10, color: '#444' }}>{today}</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1C1917', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {subject}
          </div>
          <div style={{ fontSize: 10, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {message.split('\n').find(l => l.trim().length > 10) || ''}
          </div>
        </div>
        {/* Faded other emails */}
        {['LinkedIn Job Alert', 'Notion – Your weekly…', 'Figma Community'].map((s, i) => (
          <div key={i} style={{ margin: '2px 6px', borderRadius: 8, padding: '9px 12px', opacity: 0.45 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#1C1917' }}>{s}</span>
              <span style={{ fontSize: 10, color: '#999' }}>{i === 0 ? 'Yesterday' : `${i + 2}d ago`}</span>
            </div>
            <div style={{ fontSize: 10, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {'— — — — — — — — —'.slice(0, 20 + i * 4)}
            </div>
          </div>
        ))}
      </div>

      {/* Email open view */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px', background: C.white }}>
        {/* Email header */}
        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1C1917', margin: '0 0 16px', lineHeight: 1.4 }}>{subject}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 600, flexShrink: 0 }}>
            {senderInitial}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>Valentina O. </span>
                <span style={{ fontSize: 11, color: '#888' }}>&lt;valentina.o@publicissapient.com&gt;</span>
              </div>
              <span style={{ fontSize: 11, color: '#888' }}>{today}, {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              to {candidate?.name || 'candidate'} &lt;{candidate?.name?.toLowerCase().replace(' ', '.') || 'candidate'}@gmail.com&gt;
            </div>
          </div>
        </div>

        {/* Email body */}
        <div style={{ fontSize: 13, color: '#1C1917', lineHeight: 1.85, whiteSpace: 'pre-wrap', borderTop: '1px solid #E8EAED', paddingTop: 18 }}>
          {message}
        </div>

        {/* Company footer */}
        <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid #E8EAED', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, background: C.red, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>♥</div>
            <span style={{ fontSize: 13, fontFamily: 'DM Serif Display, Georgia, serif', color: '#1C1917' }}>Publicis Sapient</span>
          </div>
          <p style={{ fontSize: 10, color: '#999', margin: 0, lineHeight: 1.6 }}>
            You received this message because you applied for a position at Publicis Sapient.<br />
            This email was crafted with care using Empath.
          </p>
        </div>
      </div>
    </div>
  )
}

function EditStep({ candidate, typeId, context: initContext, tone: initTone, onBack, onNavigate, T }) {
  const msgType = MSG_TYPES.find(t => t.id === typeId) || MSG_TYPES[0]

  const [tone,       setTone]       = useState(initTone)
  const [context,    setContext]    = useState(initContext)
  const [inboxView,  setInboxView]  = useState(false)
  const [copied,     setCopied]     = useState(false)
  const [sent,       setSent]       = useState(false)
  const [activeQuick,setActiveQuick]= useState(null)

  // Regenerate message whenever tone or context changes
  const generatedBody = useMemo(() => generateMessage({
    candidate, typeId, context, tone,
  }), [tone, context, typeId, candidate])

  const [editedBody, setEditedBody] = useState(generatedBody)

  // Keep editedBody in sync when generated changes, unless user has edited it
  const [userEdited, setUserEdited] = useState(false)
  const currentBody = userEdited ? editedBody : generatedBody

  const subject = msgType.subject(candidate?.name || '')

  const QUICK_FIXES = [
    { id: 'shorter',   label: 'Make it shorter',       action: (msg) => msg.split('\n\n').filter((_, i) => i !== 2).join('\n\n') },
    { id: 'feedback',  label: 'Add specific feedback',  action: (msg) => msg + '\n\nDuring the process, we particularly appreciated your [specific quality]. This is something that will serve you well in future roles.' },
    { id: 'warmth',    label: 'More warmth',            action: () => { setTone(t => Math.min(100, t + 20)); return null } },
    { id: 'formal',    label: 'More formal',            action: () => { setTone(t => Math.max(0, t - 20)); return null } },
    { id: 'reapply',   label: 'Encourage to reapply',   action: (msg) => msg.replace(closing => closing, (closing) => `\n\nWe would genuinely love to see your application again in the future — please do keep an eye on our openings.` + closing) },
    { id: 'timeline',  label: 'Add timeline hint',      action: (msg) => msg + '\n\n[Add timeline details here — e.g. decision by end of next week]' },
  ]

  const applyQuickFix = (fix) => {
    setActiveQuick(fix.id)
    const result = fix.action(currentBody)
    if (result !== null) {
      setEditedBody(result)
      setUserEdited(true)
    }
    setTimeout(() => setActiveQuick(null), 600)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentBody).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleSend = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,57,74,0.4)}50%{box-shadow:0 0 0 5px rgba(201,57,74,0)}}`}</style>

      {/* ── Top bar ── */}
      <div style={{
        padding: '13px 28px', background: C.white,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
          {T.editInputs}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Candidate chip */}
          {candidate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.redBg, border: `1px solid ${C.border}`, padding: '5px 12px 5px 6px', borderRadius: 20 }}>
              <Av id={candidate.id} ini={candidate.ini} size={22} />
              <span style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{candidate.name}</span>
            </div>
          )}
          {/* Type chip */}
          <span style={{ background: msgType.bg, color: msgType.color, fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 20 }}>
            {msgType.emoji} {msgType.label}
          </span>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, background: C.gray, borderRadius: 8, padding: 3 }}>
          {[{ id: false, label: T.compose }, { id: true, label: T.candidateView }].map(v => (
            <button
              key={String(v.id)}
              onClick={() => setInboxView(v.id)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 11, fontFamily: 'inherit',
                background: inboxView === v.id ? C.white : 'transparent',
                color: inboxView === v.id ? C.text : C.muted,
                fontWeight: inboxView === v.id ? 600 : 400,
                boxShadow: inboxView === v.id ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left: email preview / inbox ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '22px 24px', gap: 12, overflow: 'hidden' }}>

          {inboxView ? (
            <CandidateInboxView
              candidate={candidate}
              subject={subject}
              message={currentBody}
            />
          ) : (
            /* Compose / edit view */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              {/* Email meta header */}
              <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, background: C.gray, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted, width: 48, flexShrink: 0 }}>{T.toLabel}</span>
                  <span style={{ fontSize: 12, color: C.text, fontWeight: 500 }}>
                    {candidate
                      ? `${candidate.name} <${candidate.name.toLowerCase().replace(' ', '.')}@gmail.com>`
                      : '[Select a candidate]'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted, width: 48, flexShrink: 0 }}>{T.subjectLabel}</span>
                  <span style={{ fontSize: 12, color: C.text }}>{subject}</span>
                </div>
              </div>

              {/* Editable body */}
              <textarea
                value={currentBody}
                onChange={e => { setEditedBody(e.target.value); setUserEdited(true) }}
                style={{
                  flex: 1, padding: '20px', border: 'none', outline: 'none',
                  fontSize: 13, fontFamily: 'inherit', color: C.text,
                  lineHeight: 1.85, resize: 'none', background: C.white,
                }}
              />

              {/* Word count */}
              <div style={{ padding: '8px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.muted }}>
                <span>{T.words(currentBody.split(/\s+/).filter(Boolean).length)}</span>
                {userEdited && (
                  <button
                    onClick={() => { setUserEdited(false); setEditedBody(generatedBody) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 10, fontFamily: 'inherit' }}
                  >
                    {T.resetGenerated}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: controls ── */}
        <div style={{
          width: 290, borderLeft: `1px solid ${C.border}`,
          background: C.white, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 12px' }}>

            {/* Quick fixes */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                {T.quickAdjLabel}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_FIXES.map(fix => (
                  <button
                    key={fix.id}
                    onClick={() => applyQuickFix(fix)}
                    style={{
                      padding: '8px 11px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${activeQuick === fix.id ? C.red : C.border}`,
                      background: activeQuick === fix.id ? C.redBg : C.white,
                      color: activeQuick === fix.id ? C.red : C.text,
                      fontSize: 12, textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    {activeQuick === fix.id ? '✓ ' : '+ '}{fix.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Context edit */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                {T.editContextLabel}
              </p>
              <textarea
                value={context}
                onChange={e => { setContext(e.target.value); setUserEdited(false) }}
                placeholder={T.editContextPh}
                style={{
                  width: '100%', padding: '9px 11px', borderRadius: 8,
                  border: `1.5px solid ${C.border}`, fontSize: 11, resize: 'none',
                  height: 68, color: C.text, lineHeight: 1.6,
                  boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Send actions — fixed at bottom */}
          <div style={{ padding: '14px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {sent ? (
              <div style={{ padding: '12px 0', background: C.sucBg, borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 600, color: C.sucT }}>
                {T.sentMsg(candidate?.name?.split(' ')[0] || 'candidate')}
              </div>
            ) : (
              <>
                <button
                  onClick={handleSend}
                  style={{
                    padding: '11px 0', borderRadius: 9, background: C.red, color: 'white',
                    border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {T.sendBtn}
                </button>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '11px 0', borderRadius: 9,
                    background: copied ? C.sucBg : C.gray,
                    color: copied ? C.sucT : C.muted,
                    border: `1px solid ${copied ? '#BBF7D0' : C.grayB}`,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? T.copiedBtn : T.copyBtn}
                </button>
              </>
            )}
            <button
              onClick={() => setInboxView(v => !v)}
              style={{
                padding: '9px 0', borderRadius: 9, background: 'transparent',
                color: C.muted, border: `1px solid ${C.border}`,
                fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {inboxView ? T.backCompose : T.previewCandidate}
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
const BACK_LABELS = {
  'not-suitable':   '← Not suitable',
  'dashboard':      '← Back to Dashboard',
  'recruiter-summary': '← Interview report',
  'interview-summaries': '← Interview debriefs',
  'hiring-manager': '← Dashboard',
  'hiring-summary': '← Decision report',
}

export default function CraftMessage({ lang = 'en', candidate = null, from = 'dashboard', onBack, onNavigate }) {
  const T = SCREEN_T[lang] || SCREEN_T.en
  const backLabel = BACK_LABELS[from] || '← Back'
  const [step,  setStep]  = useState('compose')
  const [draft, setDraft] = useState(null)

  const handleGenerate = (config) => {
    setDraft(config)
    setStep('edit')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {step === 'compose' && (
        <ComposeStep
          initialCandidate={candidate}
          onBack={onBack}
          backLabel={backLabel}
          onGenerate={handleGenerate}
          T={T}
        />
      )}
      {step === 'edit' && draft && (
        <EditStep
          {...draft}
          onBack={() => setStep('compose')}
          onNavigate={onNavigate}
          T={T}
        />
      )}
    </div>
  )
}
