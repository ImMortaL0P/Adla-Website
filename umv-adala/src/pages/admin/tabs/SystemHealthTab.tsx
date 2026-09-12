import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { CheckCircle2, XCircle, Activity, Server, Database, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthStatus {
  status: string;
  database: 'connected' | 'disconnected';
  drive: {
    ok: boolean;
    folderName?: string;
    error?: string;
  };
  gallery: {
    ok: boolean;
    folderName?: string;
    error?: string;
  };
}

export default function SystemHealthTab() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/health`, {
         // Prevent eager caching so we get live data
         headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      setHealth(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 30 seconds
    const int = setInterval(fetchHealth, 30000);
    return () => clearInterval(int);
  }, []);

  const StatusIcon = ({ ok }: { ok: boolean }) => (
    ok 
      ? <CheckCircle2 className="text-[hsl(var(--leaf))]" size={20} /> 
      : <XCircle className="text-[hsl(var(--destructive))]" size={20} />
  );

  const StatCard = ({ title, icon: Icon, ok, detail, loadingText }: { title: string, icon: any, ok: boolean, detail?: string, loadingText?: string }) => (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="text-[hsl(var(--muted-foreground))]" size={18} />
          <h4 className="font-semibold text-[hsl(var(--foreground))]">{title}</h4>
        </div>
        {loading ? (
          <div className="h-4 w-4 animate-pulse rounded-full bg-[hsl(var(--muted))]"></div>
        ) : (
          <StatusIcon ok={ok} />
        )}
      </div>
      <p className={cn("text-sm", ok ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--destructive))]")}>
        {loading ? (loadingText || "Checking...") : detail}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Live Health Status</h3>
        <button 
          onClick={fetchHealth} 
          disabled={loading}
          className="flex items-center gap-2 rounded-md bg-[hsl(var(--muted))] px-3 py-1.5 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))] disabled:opacity-50"
        >
          <Activity size={16} className={cn(loading && "animate-spin")} />
          Refresh
        </button>
      </div>
      
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Last updated: {lastUpdated.toLocaleTimeString()}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Frontend App" 
          icon={Activity} 
          ok={true} 
          detail="Running normally (Edge)" 
          loadingText="Loading..."
        />
        
        <StatCard 
          title="Backend Server" 
          icon={Server} 
          ok={health?.status === 'ok'} 
          detail={health?.status === 'ok' ? 'Online (Render)' : 'Offline / Unreachable'} 
        />
        
        <StatCard 
          title="Database (MongoDB)" 
          icon={Database} 
          ok={health?.database === 'connected'} 
          detail={health?.database === 'connected' ? 'Connected & Indexed' : 'Disconnected'} 
        />
        
        <StatCard 
          title="Google Drive Auth" 
          icon={Cloud} 
          ok={health?.drive?.ok ?? false} 
          detail={health?.drive?.ok ? `Linked: ${health.drive.folderName}` : (health?.drive?.error || 'Authentication pending')} 
        />
      </div>
      
      {!loading && (!health?.drive?.ok || !health?.gallery?.ok) && (
        <div className="rounded-lg border border-[hsl(var(--saffron))]/50 bg-[hsl(var(--saffron))]/10 p-4 mt-6">
          <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] text-amber-600 mb-1">Attention Required</h4>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-amber-700/80">
             Google Drive folder mapping failed. Run <code>node scripts/get-oauth-token.js</code> on the backend and ensure <code>GOOGLE_OAUTH_REFRESH_TOKEN</code> is populated.
          </p>
        </div>
      )}
    </div>
  );
}
