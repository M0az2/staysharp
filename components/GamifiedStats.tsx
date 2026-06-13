
import React from 'react';
import { UserProgress } from '../types';

interface GamifiedStatsProps {
  progress: UserProgress;
}

const GamifiedStats: React.FC<GamifiedStatsProps> = ({ progress }) => {
  const pointsToNextLevel = (progress.level * 1000);
  const currentLevelXP = progress.points % 1000;
  const progressPercent = (currentLevelXP / 1000) * 100;

  return (
    <div className="flex items-center gap-4 px-4 py-1 bg-slate-800/50 rounded-full border border-white/5">
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Level {progress.level}</span>
          <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <span className="text-[10px] text-indigo-300 font-mono font-bold">{progress.points} XP</span>
      </div>
      
      <div className="h-6 w-[1px] bg-white/10" />
      
      <div className="flex items-center gap-1.5">
        <span className="text-orange-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 6.723 6.723 0 00-3.433 5.867c0 3.382 2.72 6.13 6.131 6.13s6.13-2.748 6.13-6.13c0-1.393-.465-2.677-1.252-3.71a1 1 0 00-1.543-.117 10.02 10.02 0 01-2.14 1.8c-.523.32-1.012.483-1.482.483-.414 0-.733-.127-.923-.238a1 1 0 01-.131-1.565 14.584 14.584 0 013.315-2.668 1.057 1.057 0 00.363-1.423 10.428 10.428 0 00-2.525-2.607z" clipRule="evenodd" />
          </svg>
        </span>
        <span className="text-sm font-bold text-white">{progress.streak}</span>
      </div>
    </div>
  );
};

export default GamifiedStats;
