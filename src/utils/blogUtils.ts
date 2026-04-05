import { supabase } from '@/integrations/supabase/client';

export async function uploadBlogImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const filePath = `blogs/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError.message);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export const BLOG_CATEGORIES = [
  'Savings',
  'Investment',
  'Budgeting',
  'Financial News',
  'Crypto',
  'Tax Advice',
  'Wealth Management',
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];
