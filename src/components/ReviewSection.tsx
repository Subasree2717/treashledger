import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Send, Loader2, User, X, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

function Reveal({ children, className, delay }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: delay || 0, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const defaultReviews = [
  { id: 'd1', name: "Rahul Sharma", location: "Chennai, India", content: "Amazing dashboard! Very clean UI and the insights help me manage my savings much better.", rating: 5, avatar_url: "https://ui-avatars.com/api/?name=Rahul&background=6366f1&color=fff" },
  { id: 'd2', name: "Priya Patel", location: "Mumbai, India", content: "Loved the AI insights and interactive charts. It makes financial tracking actually fun.", rating: 4, avatar_url: "https://ui-avatars.com/api/?name=Priya&background=6366f1&color=fff" },
  { id: 'd3', name: "Alex Thompson", location: "London, UK", content: "The best open-source finance dashboard I've used. Clean, fast, and secure.", rating: 5, avatar_url: "https://ui-avatars.com/api/?name=Alex&background=6366f1&color=fff" },
  { id: 'd4', name: "Sara Kim", location: "Seoul, Korea", content: "Incredible UX. I finally understand where my money goes each month.", rating: 5, avatar_url: "https://ui-avatars.com/api/?name=Sara&background=6366f1&color=fff" },
  { id: 'd5', name: "Marco Rossi", location: "Milan, Italy", content: "Love the budgeting feature. It's like having a personal CFO in my pocket.", rating: 4, avatar_url: "https://ui-avatars.com/api/?name=Marco&background=6366f1&color=fff" },
  { id: 'd6', name: "Yuki Tanaka", location: "Tokyo, Japan", content: "Beautifully designed. The dark mode is perfect for late-night budgeting.", rating: 5, avatar_url: "https://ui-avatars.com/api/?name=Yuki&background=6366f1&color=fff" },
];

function ReviewCard({ r }: { r: any }) {
  return (
    <div className="flex-shrink-0 w-[420px] bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 hover:border-primary/40 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden">
      {/* Subtle organic glow inside card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star 
              key={j} 
              className={cn(
                "h-4 w-4 transition-all duration-300", 
                j < r.rating 
                  ? "fill-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                  : "text-muted-foreground/20"
              )} 
            />
          ))}
        </div>
        
        <p className="text-[16px] text-foreground font-medium leading-relaxed mb-8  opacity-90 line-clamp-4">
          "{r.content}"
        </p>
        
        <div className="flex items-center gap-4 border-t border-white/5 pt-8">
          <div className="h-12 w-12 rounded-[1.25rem] overflow-hidden flex-shrink-0 border border-white/10 shadow-lg group-hover:border-primary/30 transition-all duration-500">
            {r.avatar_url
              ? <img src={r.avatar_url} alt={r.name} className="h-full w-full object-cover" />
              : <div className="h-full w-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>}
          </div>
          <div>
            <p className="text-[14px] font-black text-foreground uppercase tracking-widest leading-none mb-1.5">{r.name}</p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              <MapPin className="h-3 w-3 text-primary/60" />{r.location || 'Protocol Node'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewSection() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', content: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  const { data: dbReviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await (supabase.from('reviews') as any).select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const allReviews = [...dbReviews, ...defaultReviews];

  const submitReview = useMutation({
    mutationFn: async () => {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=6366f1&color=fff`;
      const { error } = await (supabase.from('reviews') as any).insert({
        name: form.name.trim(), location: form.location.trim() || 'Global',
        content: form.content.trim(), rating: form.rating, avatar_url: avatarUrl,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Your review has been published!');
      setForm({ name: '', location: '', content: '', rating: 5 });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to submit review'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) { toast.error('Please provide your name and feedback'); return; }
    submitReview.mutate();
  };

  return (
    <section className="py-32 px-4 bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.03)_0,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <Reveal>
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">The Testimony</span>
            <h2 className="text-5xl md:text-5xl font-black tracking-[0.1em]  text-foreground uppercase leading-none">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-6 font-medium leading-relaxed">
              Real voices from the community who transformed their financial future using our intelligence protocol.
            </p>
          </Reveal>
          
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/5 active:scale-95 mt-6"
          >
            <Pencil className="h-4 w-4" /> Share Your Protocol Status
          </button>
        </div>

        {/* Single-row marquee */}
        <div
          className="relative w-full overflow-hidden py-10"
          style={{ 
            maskImage: 'linear-gradient(90deg, transparent 0, #000 15%, #000 85%, transparent 100%)', 
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 15%, #000 85%, transparent 100%)' 
          }}
        >
          <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused] py-4">
            {[...allReviews, ...allReviews].map((r, i) => <ReviewCard key={`${r.id}-${i}`} r={r} />)}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-[2.5rem] p-10 w-full max-w-[550px] relative shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
            >
              <button 
                onClick={() => setOpen(false)} 
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-accent transition-all"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="mb-8">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Feedback Portal</span>
                <h3 className="text-3xl text-foreground uppercase tracking-tight">Broadcast Experience</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Identity</label>
                    <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-4 text-sm rounded-2xl border border-border bg-muted/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/40 text-foreground transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Origin</label>
                    <input type="text" placeholder="City, Country" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full px-5 py-4 text-sm rounded-2xl border border-border bg-muted/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground/40 text-foreground transition-all" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Transmission</label>
                  <textarea rows={4} placeholder="Describe your financial evolution..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-5 py-4 text-sm rounded-2xl border border-border bg-muted/30 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none resize-none placeholder:text-muted-foreground/40 text-foreground transition-all" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Status Rating</span>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} onClick={() => setForm({ ...form, rating: n })} className="transition-all hover:scale-125">
                          <Star className={cn("h-6 w-6 transition-colors", n <= (hoverRating || form.rating) ? "fill-primary text-primary" : "text-muted-foreground/20")} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button type="submit" disabled={submitReview.isPending}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_10px_30px_rgba(var(--primary),0.3)] active:scale-95">
                    {submitReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitReview.isPending ? 'Transmitting...' : 'Send Broadacst'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
