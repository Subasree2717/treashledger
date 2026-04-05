import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';



export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
      setDisplayName(name);
      setUsername(user.user_metadata?.username || user.email?.split('@')[0] || '');
      setBio(user.user_metadata?.bio || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  const handleDiscard = () => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      setUsername(user.user_metadata?.username || user.email?.split('@')[0] || '');
      setBio(user.user_metadata?.bio || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
      setIsDirty(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName, username, bio, avatar_url: avatarUrl },
      });
      if (error) throw error;
      toast.success('Profile updated successfully');
      setIsDirty(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    setLoading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user?.id}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const initials = (displayName || user?.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  const shortId = user?.id?.substring(0, 12) ?? '—';
  const isVerified = !!user?.email_confirmed_at;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1">
            Settings / <span className="text-muted-foreground/30">Profile</span>
          </p>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Account profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-5 items-start">

          {/* ── Sidebar ── */}
          <div className="w-full md:w-[200px] flex-shrink-0 flex flex-col gap-4">

            {/* Avatar card */}
            <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col items-center gap-3">
              <div className="relative group">
                <div className="h-[72px] w-[72px] rounded-full border-2 border-primary/50 flex items-center justify-center overflow-hidden bg-muted">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-primary font-mono">{initials}</span>
                  )}
                </div>
                {/* Upload overlay */}
                <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-4 w-4 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                {/* Online dot */}
                <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-card" />
              </div>

              <div className="text-center w-full">
                <p className="text-sm font-medium text-foreground truncate">{displayName || 'Authorized User'}</p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
              </div>

              <label className="w-full flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-muted-foreground border border-border/60 rounded-lg py-1.5 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors">
                <Camera className="h-3 w-3" />
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`h-2 w-2 rounded-full ${isVerified ? 'bg-primary' : 'bg-amber-400'}`} />
                {isVerified ? 'Verified account' : 'Pending verification'}
              </div>
            </div>


          </div>

          {/* ── Main panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0 flex flex-col gap-4"
          >
            {/* Personal information */}
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
                <span className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
                  Personal information
                </span>
                <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-primary/80 border border-primary/20">
                  Editable
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Row 1: Full name + Display name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground/60">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={handleChange(setDisplayName)}
                        className="w-full pl-9 pr-3 py-2.5 text-[13px] rounded-lg border border-border/60 bg-muted/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground/60">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/40 font-mono select-none">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={handleChange(setUsername)}
                        className="w-full pl-7 pr-3 py-2.5 text-[13px] rounded-lg border border-border/60 bg-muted/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email (readonly) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground/60">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full pl-9 pr-9 py-2.5 text-[13px] rounded-lg border border-border/40 bg-muted/15 text-muted-foreground cursor-default select-none"
                    />
                    {isVerified && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  {isVerified && (
                    <p className="text-[11px] text-primary/80 ml-0.5">
                      Email verified
                    </p>
                  )}
                </div>

                {/* Row 3: Bio */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground/60">
                      Bio
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground/40">
                      {bio.length} / 200
                    </span>
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground/40" />
                    <textarea
                      value={bio}
                      onChange={handleChange(setBio)}
                      rows={3}
                      maxLength={200}
                      placeholder="Brief description about yourself..."
                      className="w-full pl-9 pr-3 py-2.5 text-[13px] rounded-lg border border-border/60 bg-muted/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  {isDirty && (
                    <button
                      onClick={handleDiscard}
                      className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground border border-border/60 rounded-lg px-4 py-2 hover:border-border hover:text-foreground transition-colors"
                    >
                      Discard
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={loading || !isDirty}
                    className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider gradient-primary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-all shadow-lg active:scale-95"
                  >
                    {loading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Save className="h-3.5 w-3.5" />
                    }
                    Save changes
                  </button>
                </div>
              </div>
            </div>

            {/* Account details */}
            <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
                <span className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
                  Account details
                </span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/30 border border-border/40 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/50 mb-1">
                      Member since
                    </p>
                    <p className="text-[13px] font-medium text-foreground">{joinDate}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 border border-border/40 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/50 mb-1">
                      Auth status
                    </p>
                    <p className={`text-[13px] font-medium ${isVerified ? 'text-primary' : 'text-amber-500'}`}>
                      {isVerified ? 'Authenticated' : 'Pending'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 border border-border/40 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground/50 mb-1">
                      User ID
                    </p>
                    <p className="text-[12px] font-mono font-medium text-muted-foreground">{shortId}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}