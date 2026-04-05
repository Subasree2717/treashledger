import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, User, Loader2, Clock, Image as ImageIcon, Filter, X, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { uploadBlogImage, BLOG_CATEGORIES } from '@/utils/blogUtils';
import { cn } from '@/lib/utils';

export default function Blogs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    content: '',
    category: BLOG_CATEGORIES[0],
    imageFile: null as File | null,
    imagePreview: null as string | null
  });

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await (supabase.from('blogs') as any)
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter((b: any) => b.category === activeCategory);

  const createBlog = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      
      let imageUrl = null;
      if (form.imageFile) {
        try {
          imageUrl = await uploadBlogImage(form.imageFile);
        } catch (err: any) {
          if (err.message?.toLowerCase().includes('bucket not found')) {
            throw new Error('Supabase Storage bucket "blog-images" not found. Please create it in your Supabase dashboard.');
          }
          throw err;
        }
      }

      const { error } = await (supabase.from('blogs') as any).insert({
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content.trim(),
        category: form.category,
        image_url: imageUrl,
        author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous User',
        author_avatar: user?.user_metadata?.avatar_url || null,
        user_id: user?.id,
        likes: 0
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Blog published!');
      setForm({ 
        title: '', 
        description: '', 
        content: '', 
        category: BLOG_CATEGORIES[0],
        imageFile: null,
        imagePreview: null 
      });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to publish blog'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    createBlog.mutate();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setForm({ 
        ...form, 
        imageFile: file, 
        imagePreview: URL.createObjectURL(file) 
      });
    }
  };

  const readTime = (content: string) => Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Header section */}
      <div className="flex flex-col items-center text-center gap-6 mb-16">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-foreground tracking-[0.1em] uppercase"
          >
            Resources & <span>Insights</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed"
          >
            Master your finances with our latest tips, market updates, and wealth management guides.
          </motion.p>
        </div>
        
        {user && !showForm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-2 font-bold rounded-2xl bg-primary text-slate-50 shadow-xl shadow-primary/20 hover:opacity-90 transition-all uppercase tracking-widest text-[11px]"
          >
            <Plus className="h-4 w-4" /> Write a Blog
          </motion.button>
        )}
      </div>

      {/* Write form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl border border-border p-6 md:p-10 mb-16 space-y-6 shadow-2xl shadow-primary/5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">New Publication</h2>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cover Image</label>
                  <div 
                    className="relative aspect-video rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center bg-muted/30 overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center p-6">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Click to upload cover photo</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Recommended size: 1200x800px</p>
                      </div>
                    )}
                    <input 
                      id="image-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Title & Category */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Publication Title</label>
                      <input
                        type="text"
                        placeholder="Enter a catchy title..."
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        {BLOG_CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Short Description</label>
                <input
                  type="text"
                  placeholder="Summarize your blog in a few sentences..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Content</label>
                <textarea
                  placeholder="Share your wisdom..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBlog.isPending}
                  className="px-8 py-2.5 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {createBlog.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {createBlog.isPending ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        <Filter className="h-4 w-4 text-muted-foreground mr-1 shrink-0" />
        {['All', ...BLOG_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0",
              activeCategory === c 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10" 
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-card rounded-3xl border border-border aspect-[4/5] animate-pulse" />
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
          <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No publications found</h3>
          <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
            {activeCategory === 'All' 
              ? "We haven't shared anything yet. Check back soon!" 
              : `No blogs currently categorize under ${activeCategory}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog: any, i: number) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/blog/${blog.id}`}
                className="group flex flex-col h-full bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
              >
                {/* Featured Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />
                  {blog.image_url ? (
                    <img 
                      src={blog.image_url} 
                      alt="" 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="h-full w-full gradient-bg flex items-center justify-center">
                      <span className="text-6xl font-black text-muted-foreground/10 uppercase tracking-tighter">Zorvyn</span>
                    </div>
                  )}
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                      {blog.category || 'Opinion'}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-slate-100 text-[10px] font-medium">
                    <span className="flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(blog.created_at), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1.5 backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded">
                      <Clock className="h-3 w-3" />
                      {readTime(blog.content)} min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {blog.description || blog.content.substring(0, 100) + '...'}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border border-border overflow-hidden">
                        {blog.author_avatar ? (
                          <img src={blog.author_avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-foreground">{blog.author_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-3.5 w-3.5 fill-muted-foreground/10" />
                      <span className="text-[10px] font-bold">{blog.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
