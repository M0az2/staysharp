
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';

const Coach: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hello! I'm your StaySharp Focus Coach. Struggling with a task or feeling overstimulated? Let's talk about it." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getChatResponse(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Sorry, I encountered an error.' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-slate-800/30 rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-700 text-slate-100 rounded-tl-none border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-none animate-pulse text-slate-400 text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-800/50 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for advice on focus, study techniques, or ADHD hacks..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Coach;
