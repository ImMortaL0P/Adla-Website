import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { SchoolLogo } from './SchoolLogo';

const BOOT_LOGS = [
  { text: "Initializing environment...", at: 0 },
  { text: "Waking up compute instance...", at: 15 },
  { text: "Starting backend services...", at: 35 },
  { text: "Connecting to database...", at: 55 },
  { text: "Establishing secure connections...", at: 75 },
  { text: "Finalizing startup sequence...", at: 90 },
];

export function BootLoader({ onReady }: { onReady: () => void }) {
  const [, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState("Connecting to server...");
  const [isReady, setIsReady] = useState(false);
  const [visible, setVisible] = useState(true);
  
  // Track if we should actually show the UI (delayed to prevent flash on fast load)
  const [showUI, setShowUI] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setShowUI(true), 300);
    return () => clearTimeout(t);
  }, []);
  
  // Fake progress ticking (still tracks progress internally for text logs)
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
             }, 1000);
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
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ease-in-out ${isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div 
        className={`flex flex-col items-center justify-center w-full max-w-sm px-6 transition-all duration-700 ease-in-out ${isReady ? 'scale-105 blur-[2px]' : 'scale-100 blur-0'}`}
      >
        <div className="relative mb-10 flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32">
          {/* Soft outer glow pulse */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
          
          {/* Creative animated SVG ring */}
          <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] animate-[spin_4s_linear_infinite] text-primary/30" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="48" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeDasharray="40 20 60 40 20 60" 
              strokeLinecap="round" 
              className={`transition-all duration-700 ${isReady ? 'stroke-primary/80 opacity-0' : 'opacity-100'}`}
            />
          </svg>

          {/* Logo container wrapper */}
          <div className="relative z-10 p-4 sm:p-5 rounded-full bg-card shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-border/50 backdrop-blur-md flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse" style={{ animationDuration: '2.5s' }}>
               <SchoolLogo className="w-full h-full" />
            </div>
          </div>
        </div>
        
        {/* Animated log text */}
        <div className="flex flex-col items-center justify-center h-8 overflow-hidden">
          <span 
            key={currentLog} // Re-triggers animation on log change (if we add custom CSS)
            className="block text-center font-medium font-body text-[11px] sm:text-xs text-muted-foreground tracking-[0.15em] uppercase animate-pulse"
          >
            {currentLog}
          </span>
        </div>
      </div>
    </div>
  );
}
