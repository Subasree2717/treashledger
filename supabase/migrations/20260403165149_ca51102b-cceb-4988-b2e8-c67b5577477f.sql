
-- Blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
  FOR SELECT TO public
  USING (published = true);

-- Authenticated users can create blogs
CREATE POLICY "Authenticated users can create blogs" ON public.blogs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update own blogs
CREATE POLICY "Users can update own blogs" ON public.blogs
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete own blogs
CREATE POLICY "Users can delete own blogs" ON public.blogs
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON public.reviews
  FOR SELECT TO public
  USING (approved = true);

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews" ON public.reviews
  FOR INSERT TO public
  WITH CHECK (true);
