
import React from 'react';

interface PricingProps {
  onSelectGrant: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectGrant }) => {
  const tiers = [
    {
      name: 'Free Starter',
      price: '$0',
      description: 'Perfect for exploring the StaySharp methodology.',
      features: ['Basic Eye-Tracking', '5 Academy Modules', 'Community Access', 'Basic Stats'],
      buttonText: 'Current Plan',
      highlight: false
    },
    {
      name: 'StaySharp Pro',
      price: '$9.99',
      period: '/mo',
      description: 'For power users building lifelong focus habits.',
      features: ['Advanced Biometric Analysis', 'Unlimited Library Access', '24/7 AI Focus Coach', 'Custom Distraction Alarms', 'Cloud Sync'],
      buttonText: 'Start Free Trial',
      highlight: true
    },
    {
      name: 'Lifetime Mastery',
      price: '$149',
      period: ' once',
      description: 'One payment for a lifetime of cognitive performance.',
      features: ['All Pro Features', 'Early Access to New Tech', 'Exclusive Content', 'StaySharp Kit (Digital)', 'Personal Onboarding'],
      buttonText: 'Get Lifetime',
      highlight: false
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Invest in Your Focus</h2>
        <p className="text-slate-400 text-lg">Unlock the full power of biometric cognitive training and take control of your ADHD journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.name} className={`relative p-8 rounded-[3rem] border transition-all duration-500 ${
            tier.highlight 
              ? 'bg-gradient-to-br from-indigo-600/20 to-indigo-900/40 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105 z-10' 
              : 'bg-slate-800/20 border-white/5 hover:border-white/10'
          }`}>
            {tier.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">{tier.price}</span>
              {tier.period && <span className="text-slate-500 font-bold">{tier.period}</span>}
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">{tier.description}</p>
            
            <ul className="space-y-4 mb-10">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                  <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
              tier.highlight 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/30 rounded-[3rem] p-12 border border-white/5 text-center flex flex-col items-center">
         <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         </div>
         <h3 className="text-3xl font-black text-white mb-4 tracking-tight">StaySharp Equity Program</h3>
         <p className="text-slate-400 text-lg max-w-2xl mb-8 leading-relaxed">
           Financial barriers should never stop you from mastering your focus. We provide free Pro accounts for students, neurodivergent individuals in need, and anyone facing hardship.
         </p>
         <button 
           onClick={onSelectGrant}
           className="px-10 py-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500/20 transition-all"
         >
           Apply for a Grant
         </button>
      </div>
    </div>
  );
};

export default Pricing;
