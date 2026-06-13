
import React, { useState } from 'react';
import { CommunityPost } from '../types';

const initialPosts: CommunityPost[] = [
  { id: '1', user: 'NeuroDivergent92', content: 'Just finished a 25-minute study session without looking away once! The audio alerts really helped me stay locked in.', time: '2h ago', cheers: 24 },
  { id: '2', user: 'FocusFighter', content: 'Leveled up to Level 5 today! StaySharp is literally changing how I handle my online courses.', time: '4h ago', cheers: 15 },
  { id: '3', user: 'BrainFogFree', content: 'Tip: Try using a cold drink while watching. It helps keep your sensory system grounded while StaySharp keeps your eyes on the prize.', time: '6h ago', cheers: 42 },
];

const CommunitySupport: React.FC = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: CommunityPost = {
      id: Date.now().toString(),
      user: 'You',
      content: newPost,
      time: 'Just now',
      cheers: 0
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleCheer = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, cheers: p.cheers + 1 } : p));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white">Community Support</h2>
        <p className="text-slate-400">Shared wins and motivation from the StaySharp squad.</p>
      </header>

      <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5">
        <textarea 
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your focus win or a tip..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none h-24"
        />
        <div className="flex justify-end mt-4">
          <button 
            onClick={handlePost}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
          >
            Post Win
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-slate-800/20 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-bold ${post.user === 'You' ? 'text-indigo-400' : 'text-white'}`}>{post.user}</h4>
              <span className="text-[10px] text-slate-500 uppercase font-bold">{post.time}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{post.content}</p>
            <button 
              onClick={() => handleCheer(post.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-xs font-bold border border-indigo-500/20"
            >
              <span>🔥</span>
              <span>{post.cheers} Cheers</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitySupport;
