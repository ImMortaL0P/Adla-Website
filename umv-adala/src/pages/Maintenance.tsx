import { Wrench, Clock, Settings, RefreshCcw, HardHat } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { Marquee } from '@/components/motion/Marquee'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function Maintenance() {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative min-h-screen bg-background bg-grid-paper flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden z-0">
      {/* Background Animated Layered Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[hsl(var(--primary)_/_0.15)] blur-[100px] animate-pulse"></div>
        <div className="absolute top-[50%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[hsl(var(--accent)_/_0.15)] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background Marquee for texture */}
      <div className="absolute top-1/3 left-0 w-full -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -rotate-3 scale-110 select-none">
        <Marquee speed={30} pauseOnHover={false}>
          {Array(10).fill('MAINTENANCE').map((text, i) => (
            <span key={i} className="text-9xl font-extrabold px-8 font-display">
              {text}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="max-w-2xl w-full">
        {/* Main interactive glass card */}
        <Reveal direction="up" delay={100} className="relative z-10 bg-card/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-14 shadow-2xl border border-border">

          {/* Animated Icons Container */}
          <div className="relative flex justify-center mb-10">
            {/* The pulsing backdrop circle */}
            <div className="absolute inset-0 max-w-[120px] max-h-[120px] m-auto bg-[hsl(var(--primary)_/_0.2)] rounded-full animate-ping opacity-60"></div>

            {/* The main overlapping icons */}
            <div className="relative flex items-center justify-center w-28 h-28 bg-card shadow-xl rounded-full border border-border z-10">
              <Wrench
                className={`absolute w-10 h-10 text-[hsl(var(--primary-strong))] ${!prefersReducedMotion ? 'animate-[spin_8s_linear_infinite]' : ''}`}
                style={{ transformOrigin: 'center' }}
              />
              <Settings
                className={`absolute w-7 h-7 text-[hsl(var(--accent-strong))] bottom-4 right-4 ${!prefersReducedMotion ? 'animate-[spin_6s_linear_infinite_reverse]' : ''}`}
                style={{ transformOrigin: 'center' }}
              />
              <HardHat className="absolute w-6 h-6 text-muted-foreground top-4 left-4 -rotate-12" />
            </div>
          </div>

          <StaggerGroup stagger={150} className="text-center">
            <Reveal direction="up">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 font-display tracking-tight">
                <span className={!prefersReducedMotion ? 'title-shimmer-ink' : ''}>
                  Site Under Upgrades
                </span>
              </h1>
            </Reveal>

            <Reveal direction="up">
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg mx-auto">
                We are actively polishing our systems and adding new features to improve your experience. Thank you for your patience!
              </p>
            </Reveal>

            <Reveal direction="up">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-3 text-foreground bg-muted/50 px-6 py-3.5 rounded-full shadow-inner border border-border">
                  <Clock className="w-5 h-5 text-[hsl(var(--primary-strong))]" />
                  <span className="font-semibold tracking-wide">Back Online Soon</span>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="group flex items-center justify-center gap-2 bg-[hsl(var(--primary-strong))] text-[hsl(var(--primary-foreground))] px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-[hsl(var(--primary-strong)_/_0.2)] hover:shadow-[hsl(var(--primary-strong)_/_0.4)] transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Check Status
                </button>
              </div>
            </Reveal>
          </StaggerGroup>
        </Reveal>
      </div>

      <Reveal direction="up" delay={600} className="absolute bottom-8 left-0 w-full text-center z-10 pointer-events-none">
        <p className="text-muted-foreground font-medium text-sm tracking-widest uppercase">
          Adala Website &copy; {new Date().getFullYear()}
        </p>
      </Reveal>
    </div>
  )
}
