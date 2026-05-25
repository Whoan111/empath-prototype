import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Undo2,
  RefreshCw,
  Sliders,
  Layers
} from 'lucide-react';

// Mock Candidate Data based on the service mapping workflow
const INITIAL_CANDIDATES = [
  {
    id: "c1",
    name: "Giulia Rossi",
    email: "giulia.rossi@gmail.com",
    role: "Digital Product Designer",
    phase: "Screening", // Tracking phases: Screening, Preliminary Call, Interviews
    status: "action_needed",
    matchScore: 92,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    docs: ["CV_Giulia_Rossi.pdf", "Portfolio_2026.pdf"],
    feedback: [
      { interviewer: "Tech Lead", note: "Strong core design foundations. Portfolio layout is highly polished." },
      { interviewer: "Product Manager", note: "Good systems thinking, but need to verify experience with complex business dashboards." }
    ]
  },
  {
    id: "c2",
    name: "Noah Cooper",
    email: "n.cooper@techgrowth.io",
    role: "Senior UI/UX Engineer",
    phase: "Preliminary Call",
    status: "completed",
    matchScore: 87,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    docs: ["Noah_Cooper_Resume.pdf"],
    feedback: [
      { interviewer: "HR Recruiter", note: "Great cultural alignment. Clear communicator regarding team collaboration styles." }
    ]
  },
  {
    id: "c3",
    name: "Elena Rostova",
    email: "e.rostova@designstudio.com",
    role: "Service Designer",
    phase: "Interviews",
    status: "rejected",
    matchScore: 64,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    docs: ["Rostova_CV.pdf", "Case_Studies.pdf"],
    feedback: [
      { interviewer: "Design Director", note: "Brilliant strategic insight, but the execution focus doesn't align with our current structural requirements." }
    ]
  }
];

export default function App() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState("c1");
  const [searchQuery, setSearchQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("All");
  
  // Rejection notice automation states
  const [generatedNotice, setGeneratedNotice] = useState("");
  const [isCrafting, setIsCrafting] = useState(false);
  const [toneSetting, setToneSetting] = useState("empathetic");

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  // AI Rejection Crafting Engine
  const handleAiRefinement = () => {
    setIsCrafting(true);
    setTimeout(() => {
      let noticeText = "";
      if (toneSetting === "empathetic") {
        noticeText = `Dear ${selectedCandidate.name},\n\nThank you so much for taking the time to share your journey and portfolio with our team during the ${selectedCandidate.phase} stage. \n\nOur design collective deeply appreciated your approach to user advocacy. While we were highly impressed by your credentials, we have decided to advance with candidates whose current technical focus aligns more precisely with our heavy backend analytics dashboard requirements.\n\nWe would love to keep your profile active in our talent network for upcoming service architecture tracks. Wishing you the absolute best.\n\nWarmly,\nTalent Architecture Team`;
      } else {
        noticeText = `Hello ${selectedCandidate.name},\n\nThank you for your application for the ${selectedCandidate.role} position. Following our review of your profile during the ${selectedCandidate.phase} evaluation, we regret to inform you that we are moving forward with other applicants at this time.\n\nWe appreciate your interest in our platform and wish you success in your future endeavors.\n\nBest regards,\nRecruitment Operations`;
      }
      setGeneratedNotice(noticeText);
      setIsCrafting(false);
    }, 600);
  };

  // Phase workflow mutation
  const handleAdvancePhase = (candidateId, currentPhase) => {
    const phases = ["Screening", "Preliminary Call", "Interviews"];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, phase: nextPhase, status: "action_needed" } : c
      ));
    }
  };

  // Filtering Logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = phaseFilter === "All" || c.phase === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      
      {/* Platform Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Empath</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Platform Protocol Workspace</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
            {["All", "Screening", "Preliminary Call", "Interviews"].map((p) => (
              <button
                key={p}
                onClick={() => setPhaseFilter(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  phaseFilter === p 
                    ? "bg-slate-800 text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Framework Dashboard Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Recruiter Candidate Ledger */}
        <aside className="w-80 border-r border-slate-800 bg-slate-900/20 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800/60 bg-slate-900/10">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search candidates, positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-900 overflow-y-auto flex-1">
            {filteredCandidates.map((candidate) => {
              const isSelected = candidate.id === selectedCandidateId;
              return (
                <div 
                  key={candidate.id}
                  onClick={() => {
                    setSelectedCandidateId(candidate.id);
                    setGeneratedNotice(""); // Clear notice cache when switching candidates
                  }}
                  className={`p-4 flex gap-3 cursor-pointer transition-all relative ${
                    isSelected ? 'bg-slate-900/80 border-l-2 border-indigo-500' : 'hover:bg-slate-900/30'
                  }`}
                >
                  <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{candidate.name}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        candidate.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        candidate.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {candidate.matchScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{candidate.role}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Sliders className="h-3 w-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 font-medium">{candidate.phase}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredCandidates.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">No candidates match criteria.</div>
            )}
          </div>
        </aside>

        {/* RIGHT ACTION WORKSPACE: Interactive Operations */}
        <main className="flex-1 bg-slate-950 flex flex-col overflow-y-auto p-6 space-y-6">
          
          {/* STEP PROGRESS VISUALIZER (Phase Milestone Roadmap) */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Progress Track</span>
              <span className="text-xs text-slate-500">Current Phase: <strong className="text-indigo-400">{selectedCandidate.phase}</strong></span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 relative">
              {["Screening", "Preliminary Call", "Interviews"].map((phase, idx, arr) => {
                const isCurrent = selectedCandidate.phase === phase;
                const isPast = arr.indexOf(selectedCandidate.phase) > idx;
                
                return (
                  <div key={phase} className="relative flex flex-col items-center">
                    <div className={`w-full h-1.5 rounded-full transition-all ${
                      isPast ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 
                      isCurrent ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'
                    }`} />
                    <div className="flex items-center gap-1.5 mt-3">
                      {isPast ? <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> : 
                       isCurrent ? <Clock className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" /> : 
                       <AlertCircle className="h-3.5 w-3.5 text-slate-600" />}
                      <span className={`text-xs font-semibold ${isCurrent ? 'text-indigo-400' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                        {phase}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TWO COLUMN INTERACTION LAYER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CANDIDATE PROFILE & CONSOLIDATED FEEDBACK LEDGER */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Profile Card View */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center text-center">
                <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-500/20 mb-3" />
                <h3 className="text-sm font-bold text-slate-100">{selectedCandidate.name}</h3>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{selectedCandidate.role}</p>
                <p className="text-[11px] text-slate-500 mt-1">{selectedCandidate.email}</p>
                
                <div className="w-full border-t border-slate-800/60 my-4 pt-4 flex justify-around">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Fit Index</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block">{selectedCandidate.matchScore}%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Review Logs</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block">{selectedCandidate.feedback.length} Verified</span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-left font-bold">Attached Materials</span>
                  {selectedCandidate.docs.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <div className="flex items-center gap-2 truncate text-slate-300">
                        <FileText className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">{doc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholder Feedback Ledger */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consolidated Feedback Ledger</span>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {selectedCandidate.feedback.map((f, idx) => (
                    <div key={idx} className="text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-900/50 space-y-1">
                      <span className="font-bold text-indigo-300 text-[10px]">{f.interviewer}:</span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{f.note}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* AI AUTO-CRAFTING NOTICE ENGINE */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Automated Notice Crafting Module</span>
                </div>
                
                {/* Tone Controller Selection */}
                <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px]">
                  <button 
                    onClick={() => setToneSetting("empathetic")} 
                    className={`px-2 py-1 rounded-md font-medium transition-all ${toneSetting === 'empathetic' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Empathetic
                  </button>
                  <button 
                    onClick={() => setToneSetting("direct")} 
                    className={`px-2 py-1 rounded-md font-medium transition-all ${toneSetting === 'direct' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    Direct
                  </button>
                </div>
              </div>

              {/* Dynamic Generation Sandbox Terminal */}
              <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col min-h-[280px]">
                {generatedNotice ? (
                  <textarea
                    value={generatedNotice}
                    onChange={(e) => setGeneratedNotice(e.target.value)}
                    className="w-full flex-1 bg-transparent text-xs text-slate-300 leading-relaxed resize-none focus:outline-none"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="bg-slate-900 p-3 rounded-full border border-slate-800 text-slate-500">
                      <Sparkles className="h-5 w-5 text-purple-400/70" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400">Notice Sandbox Empty</p>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs">Select parameters above and run the synthesis model to auto-compile text tailored to stakeholder evaluation notes.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Control Panel Footer */}
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
                <button
                  onClick={handleAiRefinement}
                  disabled={isCrafting}
                  className="bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-950/20 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isCrafting ? 'animate-spin' : ''}`} />
                  {generatedNotice ? "Regenerate Content" : "Draft Rejection Notice"}
                </button>

                <div className="flex items-center gap-2">
                  {selectedCandidate.phase !== "Interviews" && (
                    <button
                      onClick={() => handleAdvancePhase(selectedCandidate.id, selectedCandidate.phase)}
                      className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
                    >
                      Advance Phase
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      alert(`Notice safely dispatched to ${selectedCandidate.email}`);
                      setGeneratedNotice("");
                    }}
                    disabled={!generatedNotice}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-indigo-500/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Notice
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
