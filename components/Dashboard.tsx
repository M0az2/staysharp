
import React from 'react';
import { FocusSession, AIAdvice, UserProgress } from '../types';

interface DashboardProps {
  sessions: FocusSession[];
  advice: AIAdvice[];
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, advice, progress }) => {
  const totalFocusTime = sessions.reduce((acc, s) => acc + s.totalDuration, 0);
  
  const avgInterruptions = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + s.interruptions, 0) / sessions.length)
    : 0;

  const leaderboard = [
    { name: "FocusMaster99", points: 12450, level: 13, active: false },
    { name: "ZenUser_Alpha", points: 9800, level: 10, active: false },
    { name: "ADHD_Warrior", points: 8750, level: 9, active: false },
    { name: "You", points: progress.points, level: progress.level, active: true },
    { name: "DeepThinker", points: 4200, level: 5, active: false },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">AI Analytics</h1>
          <p className="text-slate-400 text-sm">Insights into your executive patterns.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="text-right">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Streak</p>
                <p className="text-lg font-bold text-orange-500">{progress.streak} Days 🔥</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 6.723 6.723 0 00-3.433 5.867c0 3.382 2.72 6.13 6.131 6.13s6.13-2.748 6.13-6.13c0-1.393-.465-2.677-1.252-3.71a1 1 0 00-1.543-.117 10.02 10.02 0 01-2.14 1.8c-.523.32-1.012.483-1.482.483-.414 0-.733-.127-.923-.238a1 1 0 01-.131-1.565 14.584 14.584 0 013.315-2.668 1.057 1.057 0 00.363-1.423 10.428 10.428 0 00-2.525-2.607z" /></svg>
            </div>
        </div>
      </header>

      <section className="bg-slate-800/30 p-6 md:p-8 rounded-3xl border border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Minutes Trend</h3>
          <span className="text-[10px] text-emerald-400 font-bold uppercase">+12% vs week</span>
        </div>
        <div className="flex items-end gap-1 md:gap-2 h-24 md:h-32">
          {[12, 18, 15, 22, 30, 25, 35].map((val, i) => (
            <div key={i} className="flex-1 group relative">
              <div 
                className="bg-indigo-500/40 group-hover:bg-indigo-500 transition-all rounded-t-md md:rounded-t-lg"
                style={{ height: `${(val / 40) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-[8px] font-black text-slate-600 uppercase tracking-tighter">
          <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-600/20 to-pink-600/20 p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-indigo-500 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-xl shadow-indigo-500/40 ring-4 ring-white/20">
                {progress.level}
            </div>
            <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-4 gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">Rank: Explorer</h3>
                    <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase">{progress.points % 1000} / 1000 XP to Level {progress.level + 1}</span>
                </div>
                <div className="w-full h-3 md:h-4 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 animate-[shimmer_2s_infinite_linear] transition-all duration-1000"
                        style={{ width: `${(progress.points % 1000) / 10}%` }}
                    />
                </div>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-center sm:text-left">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Focus Time</p>
          <h3 className="text-3xl md:text-4xl font-black text-indigo-400 mt-2">{Math.floor(totalFocusTime / 60)}m</h3>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-center sm:text-left">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Completed</p>
          <h3 className="text-3xl md:text-4xl font-black text-pink-400 mt-2">{progress.completedModules.length}</h3>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 text-center sm:text-left">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Consistency</p>
          <h3 className="text-3xl md:text-4xl font-black text-emerald-400 mt-2">{avgInterruptions < 3 ? 'High' : 'Stable'}</h3>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <section>
                <h2 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-2 uppercase italic">AI Focus Advice</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advice.map((item, idx) => (
                    <div key={idx} className="bg-indigo-900/20 border border-indigo-500/20 p-5 rounded-2xl">
                    <span className="text-[8px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                        {item.category}
                    </span>
                    <h4 className="text-base font-bold mt-2 text-indigo-100 leading-tight">{item.title}</h4>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{item.content}</p>
                    </div>
                ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-black text-white tracking-tight mb-4 uppercase italic">Session History</h2>
                <div className="bg-slate-800/30 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[500px]">
                    <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-[9px] uppercase tracking-widest font-black">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Lapses</th>
                        <th className="px-6 py-4">XP</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {sessions.map(session => (
                        <tr key={session.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-xs font-bold text-slate-100">{session.videoTitle}</td>
                        <td className="px-6 py-4 text-xs text-slate-400">{Math.floor(session.totalDuration / 60)}m</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${session.interruptions > 5 ? 'bg-red-900/40 text-red-300' : 'bg-emerald-900/40 text-emerald-300'}`}>
                            {session.interruptions}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-emerald-400 font-bold">+{session.xp}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </section>
        </div>

        <div className="lg:col-span-1">
            <section className="bg-slate-800/30 rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tight">Leaderboard</h2>
                </div>
                <div className="p-2 space-y-1">
                    {leaderboard.map((user, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${user.active ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-white/5'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                                {idx + 1}
                            </div>
                            <div className="flex-1">
                                <p className={`font-black text-xs ${user.active ? 'text-indigo-400' : 'text-white'}`}>{user.name}</p>
                                <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Level {user.level}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-black text-xs">{user.points}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
