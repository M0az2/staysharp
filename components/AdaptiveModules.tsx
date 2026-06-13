
import React, { useState, useMemo } from 'react';
import { Module } from '../types';

const allModules: Module[] = [
  // --- Technical ---
  { 
    id: 'tech-1', 
    title: 'Full-Stack Web Architecture', 
    description: 'Master the principles of scalable web systems, from databases to modern front-end frameworks.', 
    xpReward: 1200, 
    duration: '0:52', 
    difficulty: 'Advanced', 
    category: 'Technical',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  },
  { 
    id: 'tech-2', 
    title: 'Python for Data Science', 
    description: 'Learn how to analyze large datasets and build predictive models using industry-standard libraries.', 
    xpReward: 900, 
    duration: '0:10', 
    difficulty: 'Intermediate', 
    category: 'Technical',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  
  // --- Medicine ---
  { 
    id: 'med-1', 
    title: 'Neuroanatomy & Cognitive Function', 
    description: 'A deep dive into the human brain structures and how they coordinate complex focus and attention.', 
    xpReward: 1500, 
    duration: '0:15', 
    difficulty: 'Advanced', 
    category: 'Medicine',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  { 
    id: 'med-2', 
    title: 'Pharmacology Fundamentals', 
    description: 'Understanding drug interactions and biological mechanisms within the human body.', 
    xpReward: 1100, 
    duration: '0:52', 
    difficulty: 'Intermediate', 
    category: 'Medicine',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
  },

  // --- Non-Tech ---
  { 
    id: 'non-1', 
    title: 'Strategic Business Leadership', 
    description: 'Develop executive-level decision-making skills and learn to lead high-performance teams.', 
    xpReward: 800, 
    duration: '0:10', 
    difficulty: 'Intermediate', 
    category: 'Non-Tech',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  },
  { 
    id: 'non-2', 
    title: 'Creative Writing: Narrative Design', 
    description: 'Craft compelling stories and world-building techniques for modern media and literature.', 
    xpReward: 600, 
    duration: '0:52', 
    difficulty: 'Beginner', 
    category: 'Non-Tech',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
  }
];

interface AdaptiveModulesProps {
  onStart: (m: Module) => void;
  completedIds: string[];
  activeSessionTitle?: string;
}

const AdaptiveModules: React.FC<AdaptiveModulesProps> = ({ onStart, completedIds, activeSessionTitle }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'Technical', 'Medicine', 'Non-Tech'];

  const filteredModules = useMemo(() => {
    return allModules.filter(m => {
      const matchesCategory = filter === 'All' || m.category === filter;
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery]);

  const CourseCard: React.FC<{ m: Module }> = ({ m }) => {
    const isCompleted = completedIds.includes(m.id);
    const isActive = activeSessionTitle === m.title;

    return (
      <div 
        onClick={() => onStart(m)}
        className="group cursor-pointer flex flex-col bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-slate-800/60 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10"></div>
          <div className="absolute top-3 left-3 z-20">
            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-white shadow-lg ${
              m.category === 'Technical' ? 'bg-blue-600' : 
              m.category === 'Medicine' ? 'bg-rose-600' : 'bg-amber-600'
            }`}>
              {m.category}
            </span>
          </div>
          {isCompleted && (
            <div className="absolute top-3 right-3 z-20 bg-emerald-500 rounded-full p-1 shadow-lg">
               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
             </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
            {m.title}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
            {m.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
             <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-yellow-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
             </div>
             <span className="text-[10px] text-slate-500 font-bold">4.9 • {Math.floor(Math.random()*20)+1}k enrolled</span>
          </div>

          <div className="mt-auto flex flex-col gap-3">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">{m.difficulty}</span>
                <span className="text-indigo-400">{m.duration} Video</span>
             </div>
             <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isCompleted ? 'w-full bg-emerald-500' : 'w-0'}`}
                />
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Search Hero Banner */}
      <section className="relative rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-rose-600/10 opacity-60"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 px-8 py-20 md:px-16 md:py-24 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none">
            Master Any Skill with <span className="text-indigo-400 italic">Deep Focus</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-10 font-medium">
            Biometric-locked courses across Technology, Medicine, and Leadership.
          </p>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-slate-950 border border-white/10 rounded-2xl p-1.5">
              <div className="pl-4">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (e.g. 'Python', 'Neuroscience', 'Business')..." 
                className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-3 font-bold placeholder:text-slate-600 text-sm md:text-base"
              />
              <button className="bg-indigo-600 text-white px-6 md:px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === cat 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' 
                  : 'bg-white/5 text-slate-500 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Showing {filteredModules.length} results
        </div>
      </div>

      {/* Course Grid */}
      {filteredModules.length > 0 ? (
        <div className="space-y-16">
          {/* Group by category if filter is 'All' */}
          {(filter === 'All' ? categories.slice(1) : [filter]).map(catName => {
            const catModules = filteredModules.filter(m => m.category === catName);
            if (catModules.length === 0) return null;

            return (
              <section key={catName} className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{catName} Library</h3>
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{catModules.length} Courses</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catModules.map(m => (
                    <CourseCard key={m.id} m={m} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-900/40 rounded-[3rem] border border-dashed border-white/10">
           <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
           <p className="text-slate-500">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-indigo-900/40">
        <h3 className="text-3xl font-black tracking-tighter mb-4 uppercase italic">Not finding what you need?</h3>
        <p className="text-indigo-100 max-w-xl mx-auto mb-8 font-medium">Our AI-powered curricula are updated weekly based on industry demand. Request a specific topic and we'll prioritize it.</p>
        <button className="px-12 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all">
          Request a Course
        </button>
      </section>
    </div>
  );
};

export default AdaptiveModules;
