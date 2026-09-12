import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';

const BOOT_LOGS = [
  { text: "Initializing environment...", at: 0 },
  { text: "Waking up compute instance...", at: 15 },
  { text: "Starting backend services...", at: 35 },
  { text: "Connecting to database...", at: 55 },
  { text: "Establishing secure connections...", at: 75 },
  { text: "Finalizing startup sequence...", at: 90 },
];

export function BootLoader({ onReady }: { onReady: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("Connecting to server...");
  const [isReady, setIsReady] = useState(false);
  const [visible, setVisible] = useState(true);
  
  // Track if we should actually show the UI (delayed to prevent flash on fast load)
  const [showUI, setShowUI] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 300);
    return () => clearTimeout(t);
  }, []);
  
  // Fake progress ticking
  useEffect(() => {
    if (isReady) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          const increment = (95 - prev) * 0.05 + 0.1;
          const next = Math.min(prev + increment, 95);
          
          const log = BOOT_LOGS.slice().reverse().find(l => next >= l.at);
          if (log && log.text !== currentLog) {
            setCurrentLog(log.text);
          }
          return next;
        }
        return prev;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isReady, currentLog]);

  // Actual server poll
  useEffect(() => {
    let active = true;
    
    const checkHealth = async (isInitial = false) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch(`${API_URL}/api/health`, { 
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        clearTimeout(timeoutId);
        
        if (res.ok && active) {
          setIsReady(true);
          setProgress(100);
          setCurrentLog("Server Ready. Launching application...");
          
          if (isInitial) {
             onReady();
          } else {
             setTimeout(() => {
               if (active) {
                 setVisible(false);
                 setTimeout(() => onReady(), 500);
               }
             }, 800);
          }
        } else {
          if (active) setTimeout(() => checkHealth(false), 3000);
        }
      } catch (err) {
        if (active) setTimeout(() => checkHealth(false), 3000);
      }
    };
    
    checkHealth(true);
    
    return () => {
      active = false;
    };
  }, [onReady]);

  if (!visible) return null;
  if (!showUI) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0d] transition-opacity duration-500 ease-in-out ${isReady ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center justify-center w-full max-w-sm px-6">
        <div className="text-white font-display text-6xl font-light mb-8 tabular-nums tracking-tighter">
          {Math.floor(progress)}<span className="text-white/40 text-4xl">%</span>
        </div>
        
        <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="w-full font-mono text-xs flex flex-col items-center gap-4 text-white/50">
           <svg className="w-5 h-5 animate-spin text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span className="text-center font-medium animate-pulse tracking-wide uppercase">
             {currentLog}
           </span>
        </div>
      </div>
    </div>
  );
}
