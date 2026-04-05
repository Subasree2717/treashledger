import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogoWithText } from '../components/common/Logo';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an access token in the URL (Supabase reset flow)
    const hash = window.location.hash;
    if (!hash && !window.location.search.includes('type=recovery')) {
      toast.error('Invalid or expired reset link');
      navigate('/auth');
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm apple-glass rounded-2xl p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Success!</h2>
            <p className="text-muted-foreground text-sm">
              Your password has been reset. Redirecting you to login...
            </p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-[20%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-[20%] w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10 py-8"
      >
        <div className="flex justify-center mb-10">
          <LogoWithText size={48} textClassName="text-3xl" showTextOnMobile={true} />
        </div>

        <div className="text-center mb-8">
          <p className="text-xl font-black text-foreground uppercase tracking-tight mb-2">Reset Password</p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Set your new password</p>
        </div>

        <div className="apple-glass rounded-2xl p-8 space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
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

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl gradient-primary text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-glow"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
