// ─────────────────────────────────────────────────────────────────────────────
// designSystem.js — Single source of truth for all theming & translations
//
// 3-color palette: #E90130 red · #1B2461 navy · #FAFAF8 cream
// Plus black (#07070F) and grays.
// NO other hues anywhere on the platform.
//
// Pipeline stages use a monochromatic progression:
//   Screening → gray (neutral / unknown)
//   Pre-Call  → light navy
//   Interviews→ medium navy
//   Decision  → deep navy
//   Offer     → red (arrived — celebrate)
// ─────────────────────────────────────────────────────────────────────────────

// ── Stage palette — same concept, two modes ───────────────────────────────────
export const STAGE_TOKENS = {
  dark: {
    Screening:  { dot:'#6B7280', bg:'rgba(107,114,128,0.14)', header:'rgba(107,114,128,0.22)', accent:'rgba(200,200,210,0.55)', text:'rgba(255,255,255,0.38)' },
    'Pre-Call': { dot:'#4F6BDB', bg:'rgba(79,107,219,0.16)',  header:'rgba(79,107,219,0.24)',  accent:'rgba(140,165,255,0.75)', text:'rgba(140,165,255,0.75)' },
    Interviews: { dot:'#2E46B4', bg:'rgba(46,70,180,0.24)',   header:'rgba(46,70,180,0.34)',   accent:'rgba(120,148,255,0.88)', text:'rgba(120,148,255,0.88)' },
    Decision:   { dot:'#1B2461', bg:'rgba(27,36,97,0.36)',    header:'rgba(27,36,97,0.5)',     accent:'rgba(100,128,255,0.95)', text:'rgba(100,128,255,0.95)' },
    Offer:      { dot:'#E90130', bg:'rgba(233,1,48,0.20)',    header:'rgba(233,1,48,0.28)',    accent:'#E90130',               text:'rgba(255,80,110,0.95)' },
  },
  light: {
    Screening:  { dot:'#9CA3AF', bg:'rgba(156,163,175,0.1)',  header:'rgba(156,163,175,0.18)', accent:'#9CA3AF', text:'#9CA3AF' },
    'Pre-Call': { dot:'#4F6BDB', bg:'rgba(79,107,219,0.09)',  header:'rgba(79,107,219,0.16)',  accent:'#4F6BDB', text:'#4F6BDB' },
    Interviews: { dot:'#2A3590', bg:'rgba(42,53,144,0.13)',   header:'rgba(42,53,144,0.22)',   accent:'#2A3590', text:'#2A3590' },
    Decision:   { dot:'#1B2461', bg:'rgba(27,36,97,0.18)',    header:'rgba(27,36,97,0.28)',    accent:'#1B2461', text:'#1B2461' },
    Offer:      { dot:'#E90130', bg:'rgba(233,1,48,0.09)',    header:'rgba(233,1,48,0.16)',    accent:'#E90130', text:'#E90130' },
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
    red:        '#E90130',
    redGlow:    'rgba(233,1,48,0.2)',
    redDim:     'rgba(233,1,48,0.12)',
    navy:       '#1B2461',
    navyGlow:   'rgba(27,36,97,0.35)',
    navyDim:    'rgba(27,36,97,0.22)',
    cream:      '#FAFAF8',
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
    bg:         '#FAFAF8',
    bgPanel:    'rgba(250,250,248,0.94)',
    surface:    'rgba(255,255,255,0.82)',
    surfaceHov: 'rgba(255,255,255,0.96)',
    border:     'rgba(0,0,0,0.08)',
    borderBrt:  'rgba(0,0,0,0.16)',
    red:        '#E90130',
    redGlow:    'rgba(233,1,48,0.14)',
    redDim:     'rgba(233,1,48,0.07)',
    navy:       '#1B2461',
    navyGlow:   'rgba(27,36,97,0.12)',
    navyDim:    'rgba(27,36,97,0.07)',
    cream:      '#FAFAF8',
    text:       '#0A0A14',
    textMid:    '#555566',
    textDim:    '#9999AA',
    textFaint:  'rgba(0,0,0,0.06)',
    onRed:      '#FFFFFF',
    onNavy:     '#FFFFFF',
    sidebarBg:  'rgba(255,255,255,0.92)',
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
    navSummaries:    'Interview Summaries',
    navInsights:     'AI Insights',
    navHmCVReview:   'CV Review',
    navMyDashboard:  'My Dashboard',
    navInterviewerHome:   'My Interviews',
    navInterviewerDebrief:'Interview Debrief',
    navDecisionBriefs:'Decision Summaries',
    navDebriefs:     'Interview Summaries',
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
    celebrationMsg:  (n) => `${n} moves to Interviews! 🎉`,
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
    navSummaries:    'Sommari Colloqui',
    navInsights:     'Analisi AI',
    navHmCVReview:   'Revisione CV',
    navMyDashboard:  'La Mia Bacheca',
    navInterviewerHome:   'I Miei Colloqui',
    navInterviewerDebrief:'Debrief Colloqui',
    navDecisionBriefs:'Sommari Decisioni',
    navDebriefs:     'Sommari Colloqui',
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
    celebrationMsg:  (n) => `${n} passa ai Colloqui! 🎉`,
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
