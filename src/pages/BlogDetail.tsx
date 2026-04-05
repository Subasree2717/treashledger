import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, Clock, Heart, Share2, Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const { data, error } = await (supabase.from('blogs') as any).select('*').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!blog) return;
      const { error } = await (supabase.from('blogs') as any)
        .update({ likes: (blog.likes || 0) + (isLiked ? -1 : 1) })
        .eq('id', blog.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-4 text-center">
        <div className="h-20 w-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted-foreground/30 font-black text-4xl">?</div>
        <h2 className="text-2xl font-bold text-foreground">Publication not found</h2>
        <p className="text-muted-foreground mt-2 mb-8">This blog post may have been removed or doesn't exist.</p>
        <Link to="/blogs" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Link>
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero section */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        {blog.image_url ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            src={blog.image_url} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full gradient-bg flex items-center justify-center">
            <span className="text-[20vw] font-black text-muted-foreground/10 uppercase tracking-tighter select-none">Zorvyn</span>
          </div>
        )}

        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-4">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
                  {blog.category || 'Finance'}
                </span>
                <span className="text-muted-foreground text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {readTime} min read
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                {blog.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-3xl bg-card border border-border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-primary/20 overflow-hidden shrink-0">
                  {blog.author_avatar ? (
                    <img src={blog.author_avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Authored by</p>
                  <p className="font-bold text-foreground">{blog.author_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Published on</p>
                  <p className="font-bold text-foreground">{format(new Date(blog.created_at), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            {/* Article */}
            <motion.article 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="prose dark:prose-invert prose-lg max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-headings:font-black prose-p:leading-relaxed"
            >
              {blog.description && (
                <p className="text-2xl font-medium text-foreground/80 leading-relaxed border-l-4 border-primary pl-6 mb-12">
                  {blog.description}
                </p>
              )}
              <div className="whitespace-pre-wrap">
                {blog.content}
              </div>
            </motion.article>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-12 border-t border-border">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => likeMutation.mutate()}
                  disabled={likeMutation.isPending}
                  className={cn(
                    "group flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all",
                    isLiked 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  <Heart className={cn("h-5 w-5 transition-transform", isLiked && "fill-current scale-110")} />
                  {blog.likes || 0}
                </button>
                <button className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              <button className="p-3 rounded-2xl bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              {/* Internal Link */}
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-lg font-bold text-foreground mb-3 relative z-10">Start Tracking Smarter</h3>
                <p className="text-sm text-muted-foreground mb-6 relative z-10">
                  Ready to put these insights into practice? Use our smart dashboard to monitor your progress.
                </p>
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all relative z-10"
                >
                  Go to Dashboard <ArrowLeft className="rotate-180 h-4 w-4" />
                </Link>
              </div>

              {/* Share */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {[blog.category, 'Finance', 'Success', 'Wealth'].filter(Boolean).map(t => (
                    <span key={t} className="px-3 py-1 text-[10px] font-bold bg-muted border border-border rounded-lg text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
