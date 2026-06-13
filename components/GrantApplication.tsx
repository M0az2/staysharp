
import React, { useState } from 'react';

const GrantApplication: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
           <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Application Received</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Thank you for sharing your story. Our team reviews every application manually. You will hear back from us via email within 48-72 hours. Stay focused!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-12">
        <button onClick={() => window.history.back()} className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Plans
        </button>
        <h2 className="text-4xl font-black text-white tracking-tighter">Equity Access Grant</h2>
        <p className="text-slate-400 mt-2 text-lg">We invest in your potential, regardless of your current financial situation.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-800/20 p-10 rounded-[3rem] border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
            <input required type="text" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
            <input required type="email" className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="john@example.com" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tell us about your journey</label>
          <textarea required className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors h-40 resize-none" placeholder="Briefly describe your focus goals and how this grant will help you..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Application Category</label>
          <select className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
            <option>Full-time Student</option>
            <option>Financial Hardship</option>
            <option>Educator / Teacher</option>
            <option>Neurodiversity Support (NGO)</option>
            <option>Other</option>
          </select>
        </div>

        <div className="flex items-center gap-4 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
          <input type="checkbox" required className="w-5 h-5 accent-indigo-500 rounded" />
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            I certify that the information provided is honest. I understand that StaySharp grants are limited and intended for those who truly cannot afford the Pro service.
          </p>
        </div>

        <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all">
          Submit Grant Application
        </button>
      </form>

      <p className="text-center mt-12 text-slate-500 text-xs font-bold uppercase tracking-widest">
        StaySharp Equity Initiative • Focused on Everyone
      </p>
    </div>
  );
};

export default GrantApplication;
