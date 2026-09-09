import { Wrench, Clock, RefreshCcw } from 'lucide-react'

export function Maintenance() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 dark:bg-blue-900/20 blur-[100px] animate-pulse"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-violet-100/40 dark:bg-violet-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-2xl border border-white/40 dark:border-slate-800/60 text-center relative z-10 transform transition-all hover:scale-[1.01] duration-500">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white dark:bg-slate-800 shadow-xl rounded-full p-6 text-blue-600 dark:text-blue-400 border border-blue-50 dark:border-slate-700">
            <Wrench className="w-12 h-12 animate-[spin_6s_linear_infinite] origin-center" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-violet-700 dark:from-blue-400 dark:to-violet-400">
          We're upgrading!
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-medium">
          The website is currently undergoing scheduled maintenance to bring you an even better experience. We'll be back shortly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-full shadow-inner border border-slate-200 dark:border-slate-700">
            <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span className="font-semibold tracking-wide">Coming Back Soon</span>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Check Again
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-slate-400 dark:text-slate-500 font-medium text-sm tracking-widest uppercase">
        Adala Website &copy; {new Date().getFullYear()}
      </div>
    </div>
  )
}
