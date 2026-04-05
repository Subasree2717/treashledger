import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for error parameters in the URL (Common in OAuth failures)
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error_description') || params.get('error');
    if (error) {
      console.error('Authentication error:', error);
      toast.error(error.replace(/\+/g, ' '));
      navigate('/auth');
      return;
    }

    // 2. Immediate session check on mount
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast.error('Failed to retrieve session');
        navigate('/auth');
      } else if (session) {
        navigate('/dashboard');
      }
    });

    // 3. Listen for the initial sign-in event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    // 4. Failsafe check after 3 seconds
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      } else {
        // If we still don't have a session after 3s, something went wrong
        toast.error('Authentication timed out. Please try again.');
        navigate('/auth');
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-bg text-foreground gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="text-center">
        <h2 className="text-xl font-bold">Completing authentication...</h2>
        <p className="text-sm text-muted-foreground">Please wait a moment while we set things up.</p>
      </div>
    </div>
  );
}
