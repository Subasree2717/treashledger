import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LogoWithText } from '../components/common/Logo';

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast.success('Password reset link sent to your email.');
        setMode('login');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-20 left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-[20%] w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10 py-8"
      >
        <div className="flex justify-center mb-10">
          <LogoWithText size={48} textClassName="text-3xl" showTextOnMobile={true} />
        </div>

        <div className="text-center mb-8">
          <p className="text-xl font-black text-foreground uppercase tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Get Started' : 'Account Recovery'}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
            {mode === 'login' ? 'Access your dashboard' : mode === 'signup' ? 'Join the community' : 'Restore your access'}
          </p>
        </div>

        <div className="apple-glass rounded-2xl p-8 space-y-5">
          <AnimatePresence mode="wait">
            {mode !== 'forgot' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Google */}
                <button
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  {googleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-3 text-muted-foreground">or continue with email</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-primary/80 hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-glow"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center">
            {mode === 'forgot' ? (
              <button
                onClick={() => setMode('login')}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            ) : (
              <p className="text-xs text-muted-foreground">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
