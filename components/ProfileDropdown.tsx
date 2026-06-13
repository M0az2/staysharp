
import React from 'react';
import { User, UserProgress } from '../types';

interface ProfileDropdownProps {
  user: User;
  progress: UserProgress;
  onLogout: () => void;
  onViewProfile: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, progress, onLogout, onViewProfile, onClose }) => {
  return (
    <div className="absolute top-full mt-4 right-0 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl z-[100] p-6 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
        <img 
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
          className="w-14 h-14 rounded-full border-2 border-indigo-500 p-0.5 object-cover" 
          alt="Avatar" 
        />
        <div>
          <h4 className="text-white font-black text-lg leading-none">{user.name}</h4>
          <p className="text-slate-500 text-[10px] font-bold mt-1 truncate max-w-[150px]">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total XP</p>
          <p className="text-lg font-black text-indigo-400">{progress.points}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Level</p>
          <p className="text-lg font-black text-emerald-400">{progress.level}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button 
          onClick={() => { onViewProfile(); onClose(); }}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          View Full Profile
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          Logout Account
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
