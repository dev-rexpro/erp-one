import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Mail, Lock, Loader2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface AuthViewProps {
  onAuthSuccess: (session: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      handleBypass();
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Signed in successfully!');
        onAuthSuccess(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Registration successful! Please check your email for confirmation.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = () => {
    const mockSession = {
      user: {
        email: email || 'sandbox@rexcorp.id',
        id: 'mock-uuid-1234',
        user_metadata: {},
      },
    };
    toast.info('Entered Offline Sandbox Mode.');
    onAuthSuccess(mockSession);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-indigo-500/5"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-blue-500/5"></div>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white shadow-lg dark:bg-white dark:text-black">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-mono">
            REXOne ERP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Export-Import & Logistics Operations Management
          </p>
        </div>

        {/* Auth Card Box */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 transition-all duration-300">
          {!isSupabaseConfigured ? (
            <div className="mb-6 rounded-lg bg-amber-50 p-4 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <span className="font-semibold block">Supabase Keys Not Configured</span>
                  <p>The application is running in local database fallback mode. You can log in using any email or enter immediately.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <span className="font-semibold block">Supabase Connected</span>
                  <p>Authenticated sessions and database records are synced to the cloud server.</p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200 text-xs text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-mono">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-mono">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 focus:outline-none dark:bg-white dark:text-black dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isSupabaseConfigured
                  ? isLogin
                    ? 'Sign In'
                    : 'Register Account'
                  : 'Enter ERP (Offline Sandbox)'}
              </button>

              {!isSupabaseConfigured && (
                <p className="text-center text-xs text-gray-400">
                  Provide credentials or just click the button to enter.
                </p>
              )}
            </div>
          </form>

          {isSupabaseConfigured && (
            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:underline dark:text-gray-300 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : 'Already registered? Sign In'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
