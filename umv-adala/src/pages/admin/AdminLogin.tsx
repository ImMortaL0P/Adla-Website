import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Seo } from '@/components/common/Seo';
import { API_URL } from '@/lib/api';

export default function AdminLogin() {
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to request OTP');
      
      setMessage(data.message);
      setView('reset');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset password');
      
      setMessage('Password reset successful. Please login.');
      setView('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Seo titleKey="Admin Portal" path="/admin" />
      <div className="mx-auto max-w-md px-5 py-24 sm:px-8 lg:px-12">
        <SectionHeading title="Admin Portal" level={1} />
        
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm">
          {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}
          {message && <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">{message}</div>}

          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm focus:border-[hsl(var(--primary-strong))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-strong))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm focus:border-[hsl(var(--primary-strong))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-strong))]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] focus:outline-none"
              >
                Login
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setView('forgot')} className="text-sm text-[hsl(var(--primary-strong))] hover:underline">
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {view === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Enter your username to receive an OTP on your registered email and phone.</p>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm focus:border-[hsl(var(--primary-strong))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-strong))]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] focus:outline-none"
              >
                Send OTP
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setView('login')} className="text-sm text-[hsl(var(--muted-foreground))] hover:underline">
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {view === 'reset' && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm focus:border-[hsl(var(--primary-strong))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-strong))]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--foreground))]">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-[hsl(var(--foreground))] shadow-sm focus:border-[hsl(var(--primary-strong))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary-strong))]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[hsl(var(--primary-strong))] px-4 py-2 text-white hover:bg-[hsl(var(--primary))] focus:outline-none"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
