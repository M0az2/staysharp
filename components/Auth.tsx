
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthView = 'login' | 'signup' | 'forgot';
type SocialStep = 'IDLE' | 'PICK_ACCOUNT' | 'CONFIRM_PERMISSIONS' | 'FINALIZING';

const FocusLogo = ({ className = "w-16 h-16" }) => (
  <div className={`${className} bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 relative overflow-hidden`}>
    <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-2m0-14V3m9 9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 16.95l1.414 1.414M7.05 7.05L5.636 5.636" />
    </svg>
    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
  </div>
);

const InputField = ({ label, type, value, onChange, placeholder, error }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{label}</label>
    <input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-slate-900/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600`}
      placeholder={placeholder}
    />
    {error && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">{error}</p>}
  </div>
);

const SocialFlowModal = ({ provider, onComplete, onCancel }: { provider: string, onComplete: () => void, onCancel: () => void }) => {
  const [step, setStep] = useState<SocialStep>('PICK_ACCOUNT');
  const isGoogle = provider === 'Google';

  const accounts = [
    { name: 'John Doe', email: 'johndoe@gmail.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { name: 'Professional Me', email: 'work.doe@company.com', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Work' }
  ];

  if (step === 'FINALIZING') {
    return (
      <div className="absolute inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 rounded-[3rem] animate-in fade-in duration-300">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 rounded-[3rem] animate-in fade-in duration-300">
      <div className={`w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border transition-all duration-500 ${isGoogle ? 'bg-white border-slate-200' : 'bg-[#1a1a1a] border-white/10'}`}>
        <div className={`px-6 py-4 flex items-center justify-between border-b ${isGoogle ? 'bg-slate-50 border-slate-100' : 'bg-black border-white/5'}`}>
          <div className="flex items-center gap-2">
            {isGoogle ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05 1.61-3.12 1.61-1.38 0-1.87-.85-3.55-.85-1.68 0-2.21.83-3.51.83-1.07 0-2.22-.69-3.32-1.78-2.31-2.25-3.05-6.86-1.54-9.37.75-1.25 2-2.02 3.36-2.02 1.05 0 2.04.73 2.68.73.65 0 1.83-.87 3.09-.87 1.3 0 2.5.7 3.23 1.7-2.68 1.58-2.24 5.35.44 6.44-.54 1.34-1.24 2.55-2.3 3.59zM12.03 7.25c-.02-2.21 1.81-4.05 4.02-4.07.03 2.21-1.81 4.15-4.02 4.07z"/></svg>
            )}
            <span className={`text-xs font-bold ${isGoogle ? 'text-slate-700' : 'text-slate-300'}`}>Sign in with {provider}</span>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-black/5 rounded-full transition-colors">
            <svg className={`w-4 h-4 ${isGoogle ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {step === 'PICK_ACCOUNT' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${isGoogle ? 'text-slate-900' : 'text-white'}`}>Choose an account</h3>
                <p className="text-slate-500 text-sm">to continue to StaySharp</p>
              </div>
              <div className="space-y-2">
                {accounts.map(acc => (
                  <button 
                    key={acc.email}
                    onClick={() => setStep('CONFIRM_PERMISSIONS')}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${isGoogle ? 'hover:bg-slate-50 border-slate-100 hover:border-slate-200' : 'hover:bg-white/5 border-white/5 hover:border-white/10'}`}
                  >
                    <img src={acc.img} className="w-10 h-10 rounded-full border border-slate-200" alt={acc.name} />
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-bold text-sm ${isGoogle ? 'text-slate-900' : 'text-white'}`}>{acc.name}</p>
                      <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
                <button className={`w-full text-left p-3 rounded-xl border transition-all text-sm font-bold mt-4 ${isGoogle ? 'text-indigo-600 border-slate-100 hover:bg-slate-50' : 'text-indigo-400 border-white/5 hover:bg-white/5'}`}>
                  Use another account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <FocusLogo className="w-12 h-12" />
                <div className="w-8 h-0.5 bg-slate-300 mx-2"></div>
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${isGoogle ? 'text-slate-900' : 'text-white'}`}>Consent Required</h3>
                <p className="text-slate-500 text-sm mt-2">StaySharp wants to access your profile and email address.</p>
              </div>
              
              <div className={`p-4 rounded-xl text-xs space-y-3 leading-relaxed ${isGoogle ? 'bg-slate-50 text-slate-600' : 'bg-black/40 text-slate-400'}`}>
                <div className="flex gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>See your personal info, including any personal info you’ve made publicly available.</span>
                </div>
                <div className="flex gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>See your primary email address.</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={() => { setStep('FINALIZING'); setTimeout(onComplete, 1500); }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all"
                >
                  Allow & Continue
                </button>
                <button 
                  onClick={() => setStep('PICK_ACCOUNT')}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${isGoogle ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`px-8 py-4 border-t text-[9px] uppercase font-bold tracking-widest ${isGoogle ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-black text-slate-600 border-white/5'}`}>
          Secure connection to staysharp.ai
        </div>
      </div>
    </div>
  );
};

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialProvider, setSocialProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('staysharp_mock_db')) {
      localStorage.setItem('staysharp_mock_db', JSON.stringify([
        { email: 'demo@staysharp.ai', password: 'password123', name: 'Demo Warrior' }
      ]));
    }
  }, []);

  const getMockDB = () => JSON.parse(localStorage.getItem('staysharp_mock_db') || '[]');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const db = getMockDB();

    setTimeout(() => {
      if (view === 'forgot') {
        const userExists = db.find((u: any) => u.email === email);
        if (userExists) {
          setResetSent(true);
        } else {
          setError('Email not found in our database.');
        }
        setLoading(false);
      } else if (view === 'signup') {
        const userExists = db.find((u: any) => u.email === email);
        if (userExists) {
          setError('This email is already registered.');
          setLoading(false);
          return;
        }

        const newUser = { email, password, name };
        localStorage.setItem('staysharp_mock_db', JSON.stringify([...db, newUser]));
        
        onLogin({
          id: `u-${Date.now()}`,
          name: name,
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });
      } else {
        const user = db.find((u: any) => u.email === email && u.password === password);
        if (user) {
          onLogin({
            id: `u-${Math.random()}`,
            name: user.name,
            email: user.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
          });
        } else {
          setError('Invalid email or password. Please try again.');
          setLoading(false);
        }
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialProvider(provider);
    setLoading(true);
    setError(null);
  };

  const finalizeSocialLogin = () => {
    const mockUser: User = {
      id: `social-${Math.random()}`,
      name: `${socialProvider} User`,
      email: `${socialProvider?.toLowerCase()}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${socialProvider}`
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {socialProvider && (
          <SocialFlowModal 
            provider={socialProvider} 
            onComplete={finalizeSocialLogin} 
            onCancel={() => { setSocialProvider(null); setLoading(false); }} 
          />
        )}

        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <FocusLogo className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white tracking-tighter">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Recover Access'}
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            {view === 'login' ? 'Continue your journey to mastery.' : view === 'signup' ? 'Join 10,000+ focused learners.' : 'We\'ll help you get back in.'}
          </p>
        </div>

        {resetSent && view === 'forgot' ? (
          <div className="text-center py-8 space-y-6 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-slate-300 font-medium leading-relaxed">Check your inbox. We've sent a recovery link to <strong>{email}</strong>.</p>
            <button 
              onClick={() => { setView('login'); setResetSent(false); }}
              className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-700">
            {view === 'signup' && (
              <InputField label="Full Name" type="text" value={name} onChange={setName} placeholder="John Doe" />
            )}
            
            <InputField 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={setEmail} 
              placeholder="warrior@staysharp.ai"
              error={error && error.includes('email') ? error : null}
            />
            
            {view !== 'forgot' && (
              <InputField 
                label="Password" 
                type="password" 
                value={password} 
                onChange={setPassword} 
                placeholder="••••••••" 
                error={error && (error.includes('password') || error.includes('Invalid')) ? error : null}
              />
            )}

            {view === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => { setView('forgot'); setError(null); }}
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading && !socialProvider ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                view === 'login' ? 'Sign In' : view === 'signup' ? 'Get Started Free' : 'Send Recovery Link'
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-600"><span className="bg-[#111827]/80 px-4">Instant Authentication</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Google')}
                disabled={loading}
                className="group flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold disabled:opacity-50"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Apple')}
                disabled={loading}
                className="group flex items-center justify-center gap-2 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05 1.61-3.12 1.61-1.38 0-1.87-.85-3.55-.85-1.68 0-2.21.83-3.51.83-1.07 0-2.22-.69-3.32-1.78-2.31-2.25-3.05-6.86-1.54-9.37.75-1.25 2-2.02 3.36-2.02 1.05 0 2.04.73 2.68.73.65 0 1.83-.87 3.09-.87 1.3 0 2.5.7 3.23 1.7-2.68 1.58-2.24 5.35.44 6.44-.54 1.34-1.24 2.55-2.3 3.59zM12.03 7.25c-.02-2.21 1.81-4.05 4.02-4.07.03 2.21-1.81 4.15-4.02 4.07z"/></svg>
                Apple
              </button>
            </div>

            <p className="text-center text-slate-500 text-xs font-medium">
              {view === 'login' ? "New to StaySharp?" : "Have an account?"}
              <button 
                type="button"
                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(null); }}
                className="text-indigo-400 font-black ml-2 uppercase tracking-widest hover:text-indigo-300 transition-colors"
              >
                {view === 'login' ? 'Create for free' : 'Log in here'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
