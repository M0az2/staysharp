
import React, { useState, useRef } from 'react';
import { User, UserProgress, Badge } from '../types';

interface ProfileViewProps {
  user: User;
  progress: UserProgress;
  allBadges: Badge[];
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, progress, allBadges, onUpdateUser, onBack }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    avatar: user.avatar || '',
    phoneNumber: user.phoneNumber || '',
    address: user.address || ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      ...formData
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Badge Quest Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
            
            <button 
              onClick={() => setSelectedBadge(null)}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="mb-8 relative inline-block">
               <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
               <span className="text-7xl block relative animate-bounce">{selectedBadge.icon}</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">{selectedBadge.name}</h3>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 border ${
              progress.badges.includes(selectedBadge.id) 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-slate-800 border-white/5 text-slate-500'
            }`}>
               <div className={`w-1.5 h-1.5 rounded-full ${progress.badges.includes(selectedBadge.id) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
               <span className="text-[10px] font-black uppercase tracking-widest">
                 {progress.badges.includes(selectedBadge.id) ? 'Achievement Unlocked' : 'Quest in Progress'}
               </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left border border-white/5">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">How to Obtain:</p>
               <p className="text-slate-300 text-sm font-medium leading-relaxed">
                 {selectedBadge.description}
               </p>
            </div>

            <button 
              onClick={() => setSelectedBadge(null)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95"
            >
              Close Quest Log
            </button>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={onBack} className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
           <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
           </div>
           Back to Dashboard
        </button>
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">Account Settings</h2>
      </header>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          <section className="bg-slate-900/40 border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              <div 
                className="relative group shrink-0 cursor-pointer"
                onClick={handleAvatarClick}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-[2.2rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <img 
                    src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] border-4 border-slate-900 object-cover relative z-10" 
                    alt="Profile" 
                  />
                  <div className="absolute inset-0 bg-indigo-600/60 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-opacity">Click to Change</div>
              </div>
              <div className="flex-1 w-full space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Avatar Source</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.avatar.startsWith('data:') ? 'Custom Uploaded Image' : formData.avatar}
                      readOnly
                      placeholder="Upload via clicking the icon"
                      className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-6 py-4 text-slate-400 text-xs font-medium cursor-not-allowed"
                    />
                    <button 
                      onClick={handleAvatarClick}
                      className="px-4 bg-indigo-600/20 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600/30 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                <input 
                  disabled
                  type="email" 
                  value={user.email}
                  className="w-full bg-slate-800/20 border border-white/5 rounded-2xl px-6 py-4 text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Address</label>
              <textarea 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium h-24 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
               {isSaved && (
                 <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Saved Successfully!</span>
               )}
               <button 
                 onClick={handleSave}
                 className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
               >
                 Save Changes
               </button>
            </div>
          </section>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
           <section className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-white/5 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-white tracking-tighter italic">Honors</h3>
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase">
                  {progress.badges.length} / {allBadges.length}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {allBadges.map(badge => {
                  const isUnlocked = progress.badges.includes(badge.id);
                  return (
                    <button 
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`relative group flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-500 overflow-hidden text-center outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                        isUnlocked 
                          ? 'bg-white/5 border-white/10 shadow-xl opacity-100 grayscale-0' 
                          : 'bg-slate-950/40 border-white/5 opacity-40 grayscale'
                      }`}
                    >
                      <span className="text-3xl md:text-4xl mb-3 transform transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-1">
                        {badge.icon}
                      </span>
                      <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                        {badge.name}
                      </p>
                      
                      {/* Hover Overlay - Quick Info */}
                      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110 group-hover:scale-100">
                         <h4 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest mb-1">{badge.name}</h4>
                         <p className="text-[8px] md:text-[9px] font-bold text-slate-400 leading-tight uppercase mb-2">
                           {badge.description}
                         </p>
                         <span className="text-[7px] text-indigo-400 font-black uppercase tracking-widest">Click for Details</span>
                      </div>
                    </button>
                  );
                })}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
