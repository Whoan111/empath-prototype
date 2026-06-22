// ─────────────────────────────────────────────────────────────────────────────
// designSystem.js — Single source of truth for all theming & translations
//
// EmPath brand palette:
//   Primary   #D86350  (terracotta)
//   Secondary #FE9A0C  (amber)
//   Text      #384146 / #858B8F / #A1B2BB
//   BG        #FDF8F3  (warm cream)   gradient #FFEFE0 → #FDF8F3
//   Navy      #1B2461  (pipeline stages only)
//   Typography: Quincy CF (titles) · Galano Grotesque (body)
//
// Pipeline stages use a monochromatic progression:
//   Screening → gray (neutral / unknown)
//   Pre-Call  → light navy
//   Interviews→ medium navy
//   Decision  → deep navy
//   Offer     → primary terracotta (arrived — celebrate)
// ─────────────────────────────────────────────────────────────────────────────

// ── Stage palette — same concept, two modes ───────────────────────────────────
export const STAGE_TOKENS = {
  dark: {
    Screening:  { dot:'#6B7280', bg:'rgba(107,114,128,0.14)', header:'rgba(107,114,128,0.22)', accent:'rgba(200,200,210,0.55)', text:'rgba(255,255,255,0.38)' },
    'Pre-Call': { dot:'#4F6BDB', bg:'rgba(79,107,219,0.16)',  header:'rgba(79,107,219,0.24)',  accent:'rgba(140,165,255,0.75)', text:'rgba(140,165,255,0.75)' },
    Interviews: { dot:'#2E46B4', bg:'rgba(46,70,180,0.24)',   header:'rgba(46,70,180,0.34)',   accent:'rgba(120,148,255,0.88)', text:'rgba(120,148,255,0.88)' },
    Decision:   { dot:'#1B2461', bg:'rgba(27,36,97,0.36)',    header:'rgba(27,36,97,0.5)',     accent:'rgba(100,128,255,0.95)', text:'rgba(100,128,255,0.95)' },
    Offer:      { dot:'#D86350', bg:'rgba(216,99,80,0.20)',    header:'rgba(216,99,80,0.28)',    accent:'#D86350',               text:'rgba(255,140,120,0.95)' },
  },
  light: {
    Screening:  { dot:'#9CA3AF', bg:'rgba(156,163,175,0.1)',  header:'rgba(156,163,175,0.18)', accent:'#9CA3AF', text:'#9CA3AF' },
    'Pre-Call': { dot:'#4F6BDB', bg:'rgba(79,107,219,0.09)',  header:'rgba(79,107,219,0.16)',  accent:'#4F6BDB', text:'#4F6BDB' },
    Interviews: { dot:'#2A3590', bg:'rgba(42,53,144,0.13)',   header:'rgba(42,53,144,0.22)',   accent:'#2A3590', text:'#2A3590' },
    Decision:   { dot:'#1B2461', bg:'rgba(27,36,97,0.18)',    header:'rgba(27,36,97,0.28)',    accent:'#1B2461', text:'#1B2461' },
    Offer:      { dot:'#D86350', bg:'rgba(216,99,80,0.09)',    header:'rgba(216,99,80,0.16)',    accent:'#D86350', text:'#D86350' },
  },
}

// ── Full theme tokens ─────────────────────────────────────────────────────────
export const THEMES = {
  dark: {
    // Backgrounds
    bg:         '#07070F',
    bgPanel:    'rgba(12,12,22,0.92)',
    surface:    'rgba(255,255,255,0.04)',
    surfaceHov: 'rgba(255,255,255,0.08)',
    // Borders
    border:     'rgba(255,255,255,0.09)',
    borderBrt:  'rgba(255,255,255,0.18)',
    // Brand
    red:        '#D86350',
    redGlow:    'rgba(216,99,80,0.2)',
    redDim:     'rgba(216,99,80,0.12)',
    secondary:  '#FE9A0C',
    navy:       '#1B2461',
    navyGlow:   'rgba(27,36,97,0.35)',
    navyDim:    'rgba(27,36,97,0.22)',
    cream:      '#FDF8F3',
    // Text hierarchy
    text:       'rgba(255,255,255,0.92)',
    textMid:    'rgba(255,255,255,0.52)',
    textDim:    'rgba(255,255,255,0.28)',
    textFaint:  'rgba(255,255,255,0.1)',
    // Inverted for light surfaces
    onRed:      '#FFFFFF',
    onNavy:     '#FFFFFF',
    // Sidebar
    sidebarBg:  'rgba(7,7,15,0.94)',
    // Card glass
    cardBg:     'rgba(255,255,255,0.04)',
    cardBgHov:  'rgba(255,255,255,0.075)',
    blur:       'blur(20px)',
  },
  light: {
    bg:         '#FDF8F3',
    bgPanel:    'rgba(253,248,243,0.94)',
    surface:    'rgba(255,255,255,0.82)',
    surfaceHov: 'rgba(255,255,255,0.96)',
    border:     'rgba(0,0,0,0.08)',
    borderBrt:  'rgba(0,0,0,0.16)',
    red:        '#D86350',
    redGlow:    'rgba(216,99,80,0.14)',
    redDim:     'rgba(216,99,80,0.07)',
    secondary:  '#FE9A0C',
    navy:       '#1B2461',
    navyGlow:   'rgba(27,36,97,0.12)',
    navyDim:    'rgba(27,36,97,0.07)',
    cream:      '#FDF8F3',
    text:       '#384146',
    textMid:    '#858B8F',
    textDim:    '#A1B2BB',
    textFaint:  'rgba(0,0,0,0.06)',
    onRed:      '#FFFFFF',
    onNavy:     '#FFFFFF',
    sidebarBg:  'rgba(253,248,243,0.96)',
    cardBg:     'rgba(255,255,255,0.88)',
    cardBgHov:  'rgba(255,255,255,1)',
    blur:       'blur(20px)',
  },
}

// ── Translations ──────────────────────────────────────────────────────────────
export const TRANSLATIONS = {
  en: {
    // Greetings
    greeting:        (h) => h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening',
    // Dashboard
    dashboardBadge:  'Recruiter Dashboard',
    openPositions:   'Open Positions',
    totalCandidates: 'Total Candidates',
    inInterviews:    'In Interviews',
    offerStage:      'Offer Stage',
    avgDaysOpen:     'Avg Days Open',
    viewBoard:       'View board →',
    importCVsBtn:    '📂 Import CVs',
    openDays:        (n) => `${n}d open`,
    activeCount:     (n) => `${n} active`,
    candidatesLabel: 'CANDIDATES',
    pendingLabel:    'PENDING',
    unsolicited:     'Unsolicited',
    spontaneousLine1:'Spontaneous',
    spontaneousLine2:'Applications',
    reviewBtn:       'Review →',
    spontaneousDesc: 'Review candidates who applied without a specific open role.',
    deptTags:        ['Design','Eng.','Product','Other'],
    // Sidebar nav
    navDashboard:    'Dashboard',
    navImport:       'Import CVs',
    navTriage:       'CV Triage',
    navNotSuitable:  'Not Suitable',
    navCraft:        'Craft Message',
    navSummaries:    'Interview Debriefs',
    navInsights:     'AI Insights',
    navHmCVReview:   'CV Review',
    navMyDashboard:  'My Dashboard',
    navInterviewerHome:   'My Interviews',
    navInterviewerDebrief:'Interview Debrief',
    navDecisionBriefs:'Decision Report',
    navDebriefs:     'Interview Debriefs',
    recruiterRole:   'Recruiter',
    hmRole:          'Hiring Manager',
    switchView:      'Switch view',
    boardLabel:      'Board',
    // Kanban
    stage_Screening:  'Screening',
    stage_PreCall:    'Pre-Call',
    stage_Interviews: 'Interviews',
    stage_Decision:   'Decision',
    stage_Offer:      'Offer',
    noCandidates:    'No candidates',
    moveCandidate:   'Move candidate?',
    cancel:          'Cancel',
    moveTo:          (s) => `Move to ${s}`,
    celebrationMsg:  (n, stage) => `${n} moves to ${stage || 'Interviews'}! 🎉`,
    urgencyFresh:    '● Fresh',
    urgencyStale:    '● Getting stale',
    urgencyOverdue:  '● Overdue — reach out now',
    urgencyNote:     '· Capsule fades as time passes in each stage',
    today:           'Today',
    daysAgo:         (n) => n === 1 ? '1d ago' : `${n}d ago`,
    sendMessage:     'Send message',
    stageNext:       (s) => `${s} →`,
    backBtn:         '← Back',
    totalLabel:      (n) => `${n} candidates total`,
    // AI Insights
    insightsBadge:   'Recruiter · Q2 2026',
    insightsTitle:   'AI Insights',
    insightsSub:     'Tap any card to explore the data in depth',
    updatedToday:    'Updated today',
    insightLabel:    '✦ Empath insight',
    breakdownLabel:  'Breakdown',
    recruiterOnly:   'Data aggregated across all positions · Recruiter-only',
    // Language / theme labels
    darkMode:        'Dark',
    lightMode:       'Light',
  },

  it: {
    greeting:        (h) => h < 12 ? 'Buongiorno' : h < 18 ? 'Buon pomeriggio' : 'Buonasera',
    dashboardBadge:  'Bacheca Reclutatore',
    openPositions:   'Posizioni Aperte',
    totalCandidates: 'Candidati Totali',
    inInterviews:    'In Colloquio',
    offerStage:      'Fase Offerta',
    avgDaysOpen:     'Gg. Medi Aperti',
    viewBoard:       'Vedi lavagna →',
    importCVsBtn:    '📂 Importa CV',
    openDays:        (n) => `${n}gg aperti`,
    activeCount:     (n) => `${n} attivi`,
    candidatesLabel: 'CANDIDATI',
    pendingLabel:    'IN ATTESA',
    unsolicited:     'Non Richiesta',
    spontaneousLine1:'Candidature',
    spontaneousLine2:'Spontanee',
    reviewBtn:       'Revisiona →',
    spontaneousDesc: 'Rivedi i candidati che si sono candidati senza un ruolo specifico.',
    deptTags:        ['Design','Ing.','Prodotto','Altro'],
    navDashboard:    'Bacheca',
    navImport:       'Importa CV',
    navTriage:       'Selezione CV',
    navNotSuitable:  'Non Idoneo',
    navCraft:        'Scrivi Messaggio',
    navSummaries:    'Debrief Colloqui',
    navInsights:     'Analisi AI',
    navHmCVReview:   'Revisione CV',
    navMyDashboard:  'La Mia Bacheca',
    navInterviewerHome:   'I Miei Colloqui',
    navInterviewerDebrief:'Debrief Colloqui',
    navDecisionBriefs:'Report Decisionale',
    navDebriefs:     'Debrief Colloqui',
    recruiterRole:   'Reclutatore',
    hmRole:          'Responsabile Assunzioni',
    switchView:      'Cambia vista',
    boardLabel:      'Lavagna',
    stage_Screening:  'Selezione',
    stage_PreCall:    'Pre-Chiamata',
    stage_Interviews: 'Colloqui',
    stage_Decision:   'Decisione',
    stage_Offer:      'Offerta',
    noCandidates:    'Nessun candidato',
    moveCandidate:   'Sposta candidato?',
    cancel:          'Annulla',
    moveTo:          (s) => `Sposta a ${s}`,
    celebrationMsg:  (n, stage) => `${n} passa a ${stage || 'Colloqui'}! 🎉`,
    urgencyFresh:    '● Recente',
    urgencyStale:    '● In scadenza',
    urgencyOverdue:  '● In ritardo — contatta ora',
    urgencyNote:     '· La capsula si affievolisce col passare del tempo',
    today:           'Oggi',
    daysAgo:         (n) => n === 1 ? '1g fa' : `${n}g fa`,
    sendMessage:     'Invia messaggio',
    stageNext:       (s) => `${s} →`,
    backBtn:         '← Indietro',
    totalLabel:      (n) => `${n} candidati totali`,
    insightsBadge:   'Reclutatore · Q2 2026',
    insightsTitle:   'Analisi AI',
    insightsSub:     'Tocca una scheda per approfondire i dati',
    updatedToday:    'Aggiornato oggi',
    insightLabel:    '✦ Analisi Empath',
    breakdownLabel:  'Ripartizione',
    recruiterOnly:   'Dati aggregati per tutte le posizioni · Solo reclutatori',
    darkMode:        'Scuro',
    lightMode:       'Chiaro',
  },
}

export const STAGES = ['Screening', 'Pre-Call', 'Interviews', 'Decision', 'Offer']

// ── Shared screen color palette — call once at the top of each screen component ─
// Maps the global theme tokens onto the `C` naming convention every screen uses.
// Semantic colours (suc/war/inf/purp) are darkened slightly in dark mode so they
// stay readable as chip backgrounds without blowing out on a near-black surface.
export function buildC(theme) {
  const dk = theme.text?.startsWith('rgba(255') // true in dark mode
  return {
    // Brand
    red:    theme.red,
    redL:   dk ? 'rgba(216,99,80,0.22)'          : '#FDDDD7',
    redBg:  dk ? 'rgba(216,99,80,0.1)'           : '#FFF5F2',
    secondary: theme.secondary || '#FE9A0C',
    // Text
    text:   theme.text,
    muted:  theme.textMid,
    // Surfaces  (C.white = panel / card bg, NOT literal white)
    white:  dk ? theme.cardBg                   : '#FFFFFF',
    gray:   dk ? theme.surface                  : '#F5F4F3',
    grayB:  dk ? theme.borderBrt               : '#E5E2DF',
    // Borders
    border: theme.border,
    // Success
    suc:    '#059669',
    sucBg:  dk ? 'rgba(5,150,105,0.15)'         : '#D1FAE5',
    sucT:   dk ? '#6EE7B7'                      : '#065F46',
    sucBorder: dk ? 'rgba(5,150,105,0.3)'       : '#BBF7D0',
    // Warning
    war:    '#D97706',
    warBg:  dk ? 'rgba(217,119,6,0.15)'         : '#FEF3C7',
    warT:   dk ? '#FCD34D'                      : '#92400E',
    warBorder: dk ? 'rgba(217,119,6,0.3)'       : '#FDE68A',
    // Info (amber — no blue in EmPath palette)
    inf:    '#D97706',
    infBg:  dk ? 'rgba(254,154,12,0.15)'        : '#FEF3C7',
    infT:   dk ? '#FE9A0C'                      : '#B45309',
    infL:   dk ? 'rgba(254,154,12,0.3)'         : '#FDE68A',
    // Purple
    purp:   '#6D28D9',
    purpBg: dk ? 'rgba(109,40,217,0.15)'        : '#EDE9FE',
    purpL:  dk ? 'rgba(109,40,217,0.28)'        : '#DDD8F9',
    // Navy aliases (pipeline stages only)
    navy:   theme.navy,
    navyBg: dk ? 'rgba(27,36,97,0.22)'          : 'rgba(27,36,97,0.06)',
    navyB:  dk ? 'rgba(27,36,97,0.4)'           : 'rgba(27,36,97,0.13)',
    // Advance semantic (terracotta — primary action)
    nav:    dk ? 'rgba(255,140,120,0.95)'        : '#D86350',
    navBg:  dk ? 'rgba(216,99,80,0.18)'          : 'rgba(216,99,80,0.09)',
    navT:   dk ? 'rgba(255,140,120,0.95)'        : '#C05340',
    navL:   dk ? 'rgba(216,99,80,0.35)'          : 'rgba(216,99,80,0.22)',
    // HM accent (amber — no blue in EmPath palette)
    hmBg:     dk ? 'rgba(254,154,12,0.10)'      : '#FFFBF0',
    hmBorder: dk ? 'rgba(254,154,12,0.22)'      : '#FDE68A',
    // Hover surface (slightly brighter than white/gray)
    surfaceHov: dk ? 'rgba(255,255,255,0.08)'      : 'rgba(0,0,0,0.04)',
    // Document text (stays dark — it's on a white paper mockup)
    doc:    '#1C1917',
  }
}
