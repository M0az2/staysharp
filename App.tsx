
import React, { useState, useEffect, useCallback } from 'react';
import { FocusSession, AIAdvice, AppState, UserProgress, Module, User, Language, Badge } from './types';
import EyeTracker from './components/EyeTracker';
import VideoPlayer from './components/VideoPlayer';
import Dashboard from './components/Dashboard';
import Coach from './components/Coach';
import AdaptiveModules from './components/AdaptiveModules';
import Pricing from './components/Pricing';
import GrantApplication from './components/GrantApplication';
import Auth from './components/Auth';
import ProfileDropdown from './components/ProfileDropdown';
import ProfileView from './components/ProfileView';
import { getFocusAdvice } from './services/geminiService';
import GamifiedStats from './components/GamifiedStats';
import { translations } from './translations';

const BADGE_DEFINITIONS: Badge[] = [
  { id: 'level-2', name: 'Explorer', icon: '🚀', unlocked: false, description: 'Reach Level 2 to unlock your journey.' },
  { id: 'focus-100', name: 'Focus Monk', icon: '🧘', unlocked: false, description: 'Complete 100 minutes of deep focus.' },
  { id: 'streak-3', name: 'Consistent', icon: '🔥', unlocked: false, description: 'Maintain a 3-day focus streak.' },
  { id: 'tech-master', name: 'Tech Lead', icon: '💻', unlocked: false, description: 'Complete 3 Technical modules.' },
  { id: 'med-expert', name: 'Medical Specialist', icon: '🧠', unlocked: false, description: 'Complete 2 Medicine modules.' },
  { id: 'marathon', name: 'Deep Diver', icon: '⚓', unlocked: false, description: 'Complete a session longer than 30 minutes.' },
  { id: 'early-bird', name: 'Early Bird', icon: '☀️', unlocked: false, description: 'Complete a session before 8 AM.' },
  { id: 'elite', name: 'Elite Focus', icon: '💎', unlocked: false, description: 'Reach Level 10.' },
];

const FocusLogo = ({ className = "w-8 h-8 md:w-10 md:h-10" }) => (
  <div className={`${className} bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform relative overflow-hidden`}>
    <svg className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-2m0-14V3m9 9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636" />
    </svg>
    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('staySharpUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeState, setActiveState] = useState<AppState>(AppState.HOME);
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice[]>([]);
  const [isFocused, setIsFocused] = useState(true);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('staySharpProgress');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      streak: 0,
      lastSessionDate: null,
      totalFocusMinutes: 0,
      completedModules: [],
      badges: []
    };
  });

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  useEffect(() => {
    localStorage.setItem('staySharpProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('staySharpUser', JSON.stringify(user));
    setActiveState(AppState.HOME);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('staySharpUser', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('staySharpUser');
    setActiveState(AppState.HOME);
    setIsProfileOpen(false);
  };

  const checkAndUnlockBadges = (updatedProgress: UserProgress) => {
    const newBadges = [...updatedProgress.badges];
    let changed = false;

    if (updatedProgress.level >= 2 && !newBadges.includes('level-2')) {
      newBadges.push('level-2');
      changed = true;
    }
    if (updatedProgress.totalFocusMinutes >= 100 && !newBadges.includes('focus-100')) {
      newBadges.push('focus-100');
      changed = true;
    }
    if (updatedProgress.streak >= 3 && !newBadges.includes('streak-3')) {
      newBadges.push('streak-3');
      changed = true;
    }
    if (updatedProgress.level >= 10 && !newBadges.includes('elite')) {
      newBadges.push('elite');
      changed = true;
    }

    if (changed) {
      return { ...updatedProgress, badges: newBadges };
    }
    return updatedProgress;
  };

  const startModuleFlow = (m: Module) => {
    if (!currentUser) {
      setActiveState(AppState.AUTH);
      return;
    }
    setSelectedModule(m);
    setActiveState(AppState.CALIBRATION);
  };

  const launchFocusSession = () => {
    if (!selectedModule) return;
    const newSession: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: Date.now(),
      interruptions: 0,
      totalDuration: 0,
      videoTitle: selectedModule.title,
      xp: 0
    };
    setCurrentSession(newSession);
    setActiveState(AppState.FOCUS_MODE);
    setShowCompletion(false);
  };

  const handleVideoComplete = async () => {
    if (!selectedModule || !currentSession) return;
    
    const xp = selectedModule.xpReward;
    setEarnedXP(xp);
    setShowCompletion(true);

    const finalDuration = Math.floor((Date.now() - currentSession.startTime) / 1000);
    const completedSession: FocusSession = { 
      ...currentSession, 
      endTime: Date.now(), 
      totalDuration: finalDuration,
      xp: xp 
    };
    
    setSessions(prev => [completedSession, ...prev]);
    
    const today = new Date().toISOString().split('T')[0];
    setUserProgress(prev => {
      let newStreak = prev.streak;
      if (prev.lastSessionDate !== today) {
        newStreak = (prev.lastSessionDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) ? prev.streak + 1 : 1;
      }
      const newProgress = {
        ...prev,
        points: prev.points + xp,
        level: Math.floor((prev.points + xp) / 1000) + 1,
        streak: newStreak,
        lastSessionDate: today,
        totalFocusMinutes: prev.totalFocusMinutes + Math.floor(finalDuration / 60),
        completedModules: [...new Set([...prev.completedModules, selectedModule.id])]
      };
      return checkAndUnlockBadges(newProgress);
    });

    const advice = await getFocusAdvice(completedSession.interruptions, Math.ceil(finalDuration / 60));
    setAiAdvice(advice);
  };

  const closeCompletionModal = () => {
    setShowCompletion(false);
    setCurrentSession(null);
    setSelectedModule(null);
    setActiveState(AppState.MODULES);
  };

  const endFocusSession = async () => {
    if (!currentSession) return;
    const finalDuration = Math.floor((Date.now() - currentSession.startTime) / 1000);
    const partialXP = finalDuration;
    const completedSession: FocusSession = { 
      ...currentSession, 
      endTime: Date.now(), 
      totalDuration: finalDuration,
      xp: partialXP 
    };
    
    setSessions(prev => [completedSession, ...prev]);
    
    setUserProgress(prev => {
      const newProgress = {
        ...prev,
        points: prev.points + partialXP,
        level: Math.floor((prev.points + partialXP) / 1000) + 1,
      };
      return checkAndUnlockBadges(newProgress);
    });
    
    setActiveState(AppState.DASHBOARD);
    const advice = await getFocusAdvice(completedSession.interruptions, Math.ceil(finalDuration / 60));
    setAiAdvice(advice);
    setCurrentSession(null);
    setSelectedModule(null);
  };

  const handleInterruption = useCallback(() => {
    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, interruptions: prev.interruptions + 1 } : null);
    }
  }, [currentSession]);

  return (
    <div className={`min-h-screen flex flex-col bg-[#0f172a] selection:bg-indigo-500 selection:text-white ${isRtl ? 'font-arabic' : ''}`}>
      {showCompletion && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 bg-[length:200%_100%] animate-shimmer"></div>
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
               <svg className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic mb-2">Focus Mastered</h2>
            <p className="text-slate-400 font-medium mb-8">You successfully completed the training session.</p>
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 md:p-8 mb-10">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rewards Earned</p>
               <h3 className="text-4xl md:text-5xl font-black text-indigo-400 tracking-tighter">+{earnedXP} <span className="text-lg uppercase text-indigo-300/50">XP</span></h3>
            </div>
            <button 
              onClick={closeCompletionModal}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95"
            >
              Continue to Academy
            </button>
          </div>
        </div>
      )}

      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0" onClick={() => {setActiveState(AppState.HOME); setIsProfileOpen(false);}}>
                <FocusLogo />
                <span className="text-lg md:text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StaySharp</span>
              </div>
              <div className="hidden lg:flex items-center gap-6">
                <button onClick={() => {setActiveState(AppState.HOME); setIsProfileOpen(false);}} className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeState === AppState.HOME ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}>{t.home}</button>
                <button onClick={() => {setActiveState(AppState.MODULES); setIsProfileOpen(false);}} className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeState === AppState.MODULES ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}>{t.academy}</button>
                <button onClick={() => {setActiveState(AppState.PRICING); setIsProfileOpen(false);}} className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeState === AppState.PRICING ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}>{t.plans}</button>
                {currentUser && (
                  <>
                    <button onClick={() => {setActiveState(AppState.DASHBOARD); setIsProfileOpen(false);}} className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeState === AppState.DASHBOARD ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}>{t.stats}</button>
                    <button onClick={() => {setActiveState(AppState.COACH); setIsProfileOpen(false);}} className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeState === AppState.COACH ? 'text-indigo-400' : 'text-slate-500 hover:text-white'}`}>{t.coach}</button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 relative">
              <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase hover:bg-white/10 transition-colors">{lang === 'en' ? 'AR' : 'EN'}</button>
              {currentUser ? (
                <>
                  <div className="hidden sm:block">
                    <GamifiedStats progress={userProgress} />
                  </div>
                  <div className={`flex items-center gap-2 md:gap-4 border-white/10 ${isRtl ? 'md:border-r md:pr-6' : 'md:border-l md:pl-6'}`}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="relative group transition-transform active:scale-95"
                    >
                      <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`} alt="Profile" className={`w-8 h-8 md:w-10 md:h-10 rounded-full border p-0.5 transition-all object-cover ${isProfileOpen ? 'border-indigo-400 ring-4 ring-indigo-500/10' : 'border-indigo-500/50 group-hover:border-indigo-400'}`} />
                    </button>
                    
                    {isProfileOpen && (
                      <ProfileDropdown 
                        user={currentUser} 
                        progress={userProgress} 
                        onLogout={handleLogout}
                        onViewProfile={() => setActiveState(AppState.PROFILE)}
                        onClose={() => setIsProfileOpen(false)}
                      />
                    )}
                  </div>
                </>
              ) : (
                <button onClick={() => setActiveState(AppState.AUTH)} className="px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95">{t.signIn}</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-x-hidden">
        {activeState === AppState.HOME && (
          <div className="max-w-4xl mx-auto text-center py-8 md:py-16 animate-in fade-in zoom-in duration-700">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 md:mb-8">
               <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               <span className="text-indigo-400 font-black tracking-[0.2em] uppercase text-[8px] md:text-[10px]">Biometric OS Active</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter">
              {t.heroTitle.split(' ').map((w,i) => i === 3 ? <span key={i} className="text-indigo-500 italic"> {w} </span> : w + ' ')}
            </h1>
            <p className="text-base md:text-xl text-slate-400 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-medium">{t.heroSub}</p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <button onClick={() => setActiveState(AppState.MODULES)} className="bg-white text-slate-900 px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-indigo-50 transition-all shadow-2xl">{t.browse}</button>
              <button onClick={() => setActiveState(AppState.AUTH)} className="bg-slate-800/50 backdrop-blur-xl text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-slate-700 transition-all border border-white/10">{t.getStarted}</button>
            </div>
          </div>
        )}

        {activeState === AppState.PROFILE && currentUser && (
          <ProfileView 
            user={currentUser} 
            progress={userProgress} 
            allBadges={BADGE_DEFINITIONS} 
            onUpdateUser={handleUpdateUser}
            onBack={() => setActiveState(AppState.DASHBOARD)}
          />
        )}

        {activeState === AppState.CALIBRATION && (
          <div className="max-w-2xl mx-auto text-center py-10 md:py-20 animate-in fade-in duration-500">
             <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">{t.calibration}</h2>
             <p className="text-slate-400 mb-8 md:mb-12 text-sm md:text-base">{t.calibrateMsg}</p>
             <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-10 md:mb-12 relative">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-4 rounded-full overflow-hidden border border-white/10">
                   <EyeTracker isActive={true} onStatusChange={() => {}} />
                </div>
             </div>
             <button onClick={launchFocusSession} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl md:rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95">{t.startSession}</button>
          </div>
        )}

        {activeState === AppState.FOCUS_MODE && selectedModule && (
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto">
            <div className="lg:col-span-3 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                    <span className="text-indigo-400 font-black tracking-[0.2em] uppercase text-[10px]">Live Session</span>
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter mt-1">{selectedModule.title}</h2>
                 </div>
                 <button onClick={endFocusSession} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-2xl font-black uppercase text-[10px] tracking-widest">{t.exitFocus}</button>
              </div>
              <VideoPlayer url={selectedModule.videoUrl} isFocused={isFocused} onInterruption={handleInterruption} onEnded={handleVideoComplete} />
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 aspect-square max-w-xs mx-auto lg:max-w-none">
                <EyeTracker isActive={true} onStatusChange={setIsFocused} />
              </div>
            </div>
          </div>
        )}

        {activeState === AppState.AUTH && <Auth onLogin={handleLogin} />}
        {activeState === AppState.MODULES && <AdaptiveModules onStart={startModuleFlow} completedIds={userProgress.completedModules} />}
        {activeState === AppState.PRICING && <Pricing onSelectGrant={() => setActiveState(AppState.GRANTS)} />}
        {activeState === AppState.GRANTS && <GrantApplication />}
        {activeState === AppState.DASHBOARD && currentUser && <Dashboard sessions={sessions} advice={aiAdvice} progress={userProgress} />}
        {activeState === AppState.COACH && currentUser && <Coach />}
      </main>
    </div>
  );
};

export default App;
