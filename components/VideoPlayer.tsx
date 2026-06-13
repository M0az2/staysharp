
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface VideoPlayerProps {
  url: string;
  isFocused: boolean;
  onInterruption: () => void;
  onEnded?: () => void;
}

const LOFI_TRACKS = [
  { 
    name: 'Focus', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    name: 'Study', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    name: 'Zen', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
      </svg>
    )
  }
];

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, isFocused, onInterruption, onEnded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lofiRef = useRef<HTMLAudioElement>(null);
  const alarmCtxRef = useRef<AudioContext | null>(null);
  const alarmNodesRef = useRef<{ 
    osc: OscillatorNode; 
    lfo: OscillatorNode; 
    gain: GainNode; 
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const [lofiTrack, setLofiTrack] = useState<number | null>(null);
  const [isSirenMuted, setIsSirenMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [quality, setQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    if (lofiRef.current) {
      lofiRef.current.volume = 0.3;
    }
  }, []);

  const startAlarm = useCallback(async () => {
    if (isSirenMuted || alarmNodesRef.current || !isPlaying || isSwitching) return;
    if (!alarmCtxRef.current) {
      alarmCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = alarmCtxRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const mainGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(1.8, ctx.currentTime); 
    lfoGain.gain.setValueAtTime(100, ctx.currentTime);
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(mainGain);
    mainGain.connect(ctx.destination);
    osc.start();
    lfo.start();
    alarmNodesRef.current = { osc, lfo, gain: mainGain };
  }, [isSirenMuted, isPlaying, isSwitching]);

  const stopAlarm = useCallback(() => {
    if (alarmNodesRef.current) {
      const { osc, lfo, gain } = alarmNodesRef.current;
      const ctx = alarmCtxRef.current!;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      setTimeout(() => {
        try {
          osc.stop(); lfo.stop();
          osc.disconnect(); lfo.disconnect(); gain.disconnect();
        } catch (e) {}
      }, 200);
      alarmNodesRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isFocused && isPlaying && !isLoading && !isSwitching) {
        videoRef.current.play().catch(() => {});
        if (lofiTrack !== null) lofiRef.current?.play().catch(() => {});
        stopAlarm();
      } else {
        videoRef.current.pause();
        lofiRef.current?.pause();
        if (!isFocused && isPlaying && !isLoading && !isSwitching) {
          onInterruption();
          startAlarm();
        } else {
          stopAlarm();
        }
      }
    }
  }, [isFocused, isPlaying, isLoading, isSwitching, lofiTrack, startAlarm, stopAlarm, onInterruption]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleQualityChange = (q: string) => {
    if (q === quality || isSwitching) return;
    setIsSwitching(true);
    setShowQualityMenu(false);
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setTimeout(() => {
        setQuality(q);
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          setIsSwitching(false);
          if (isPlaying && isFocused) videoRef.current.play().catch(() => {});
        }
      }, 800);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-1000 group ${!isFocused && isPlaying ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.5)] ring-4 ring-red-500/10' : 'border-white/5'}`}
    >
      {(isLoading || isSwitching) && (
        <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="mt-4 text-[9px] font-black text-white uppercase tracking-[0.4em]">
            {isSwitching ? `Optimizing ${quality}` : 'Loading Session'}
          </span>
        </div>
      )}

      <video 
        ref={videoRef} 
        src={url} 
        className="w-full h-full object-contain" 
        onCanPlay={() => setIsLoading(false)} 
        onEnded={onEnded}
        playsInline 
        muted={false}
      />
      
      {!isFocused && isPlaying && !isLoading && !isSwitching && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[60px] z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-[-30px] bg-red-500/20 rounded-full animate-ping"></div>
            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500/40 relative z-10 shadow-[0_0_40px_rgba(239,68,68,0.4)]">
               <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic text-center px-4">Focus Interrupted</h2>
          <p className="text-red-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-4">Return your gaze to continue</p>
        </div>
      )}

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[96%] md:w-[92%] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center justify-between bg-slate-950/85 backdrop-blur-[30px] border border-white/10 p-2 md:p-2.5 rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-1.5 md:gap-2 min-w-max">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-indigo-600 transition-all active:scale-90"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              ) : (
                <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="h-10 md:h-11 px-3 md:px-4 rounded-xl bg-white/5 text-[9px] md:text-[10px] font-black uppercase text-slate-300 hover:bg-white/10 transition-all border border-white/5 flex items-center gap-1.5 active:scale-95"
              >
                {quality}
                <svg className={`w-3 h-3 transition-transform ${showQualityMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showQualityMenu && (
                <div className="absolute bottom-full mb-4 left-0 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[100px] animate-in slide-in-from-bottom-2">
                  {['1080p', '720p', '480p'].map(q => (
                    <button 
                      key={q}
                      onClick={() => handleQualityChange(q)}
                      className={`w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest transition-all ${quality === q ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-1 items-center justify-center gap-1.5 px-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-[1.5rem] border border-white/5">
              {LOFI_TRACKS.map((track, i) => {
                const isActive = lofiTrack === i;
                return (
                  <button 
                    key={i} 
                    onClick={() => setLofiTrack(isActive ? null : i)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-200'}`}
                  >
                    {track.icon}
                    <span className="text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">{track.name}</span>
                  </button>
                );
              })}
              <div className="w-[1px] h-3 bg-white/10 mx-1"></div>
              <span className="text-[8px] font-bold text-slate-500 uppercase px-2 whitespace-nowrap">Mix: 30%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 min-w-max">
            <button 
              onClick={() => setIsSirenMuted(!isSirenMuted)}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-xl border flex items-center justify-center transition-all active:scale-90 ${isSirenMuted ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/15'}`}
              title="Siren Alert"
            >
              {isSirenMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              )}
            </button>

            <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center active:scale-90"
              title="Fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <audio ref={lofiRef} src={lofiTrack !== null ? LOFI_TRACKS[lofiTrack].url : ''} loop />
    </div>
  );
};

export default VideoPlayer;
