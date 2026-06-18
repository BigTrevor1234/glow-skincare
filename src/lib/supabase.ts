import { createClient } from '@supabase/supabase-js';
import { Product, Order, Article, ProductReview } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Clean up standard template strings to check actual config status
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here';

// Create Supabase connection client
// Falls back gracefully inside AI Studio preview if environmental variables are unconfigured
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);

/* ============================================================================
   SUPABASE INTERACTION UTILITIES
   ============================================================================ */

/**
 * Fetch all products from Supabase
 */
export async function getSupabaseProducts(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Product[];
  } catch (err) {
    console.warn('Supabase products fetch failed, using fallback database:', err);
    return null;
  }
}

/**
 * Add or update a product on Supabase
 */
export async function upsertSupabaseProduct(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('products')
      .upsert(product);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase upsert product error:', err);
    return false;
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteSupabaseProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase delete product error:', err);
    return false;
  }
}

/**
 * Fetch global orders from Supabase
 */
export async function getSupabaseOrders(): Promise<Order[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('orderDate', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  } catch (err) {
    console.warn('Supabase orders fetch failed, using memory state:', err);
    return null;
  }
}

/**
 * Insert or edit an order on Supabase
 */
export async function upsertSupabaseOrder(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('orders')
      .upsert(order);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase upsert order error:', err);
    return false;
  }
}

/**
 * Fetch all articles from Supabase
 */
export async function getSupabaseArticles(): Promise<Article[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as Article[];
  } catch (err) {
    console.warn('Supabase articles fetch failed:', err);
    return null;
  }
}

/**
 * Upsert article on Supabase
 */
export async function upsertSupabaseArticle(article: Article): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('articles')
      .upsert(article);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase upsert article error:', err);
    return false;
  }
}

/**
 * Delete article from Supabase
 */
export async function deleteSupabaseArticle(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase delete article error:', err);
    return false;
  }
}

/**
 * Fetch product reviews from Supabase
 */
export async function getSupabaseReviews(): Promise<ProductReview[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data as ProductReview[];
  } catch (err) {
    console.warn('Supabase reviews fetch failed:', err);
    return null;
  }
}

/**
 * Upsert product review
 */
export async function upsertSupabaseReview(review: ProductReview): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('reviews')
      .upsert(review);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase upsert review error:', err);
    return false;
  }
}

/* ============================================================================
   SQL CODE CHEATSHEET / SCHEMA SETUP GENERATOR
   ============================================================================ */
export const SUPABASE_SQL_TRANSCRIPT = `-- Glow Skincare Postgres Database Schema
-- Paste this script directly in the Supabase SQL Editor to provision tables:

-- 1. Create PRODUCTS table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  description TEXT,
  "howToUse" TEXT,
  ingredients TEXT[],
  "primaryImage" TEXT,
  "secondaryImage" TEXT,
  "skinTypes" TEXT[],
  concerns TEXT[],
  category TEXT,
  rating NUMERIC DEFAULT 5,
  "reviewsCount" INTEGER DEFAULT 0,
  "inStock" BOOLEAN DEFAULT true,
  size TEXT
);

-- Enable RLS & allow public read-only access (anonymous keys)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to products" ON public.products
  FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated upsert to products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon admin access (or insert role)" ON public.products
  FOR ALL USING (true);

-- 2. Create ORDERS table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  "discountCode" TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  "shippingAddress" JSONB NOT NULL,
  "paymentMethod" TEXT,
  "paymentStatus" TEXT,
  "orderDate" TEXT,
  status TEXT,
  "trackingNumber" TEXT,
  "trackingCarrier" TEXT,
  "earnedPoints" INTEGER,
  "pointsSpent" INTEGER,
  "pointsDiscount" NUMERIC
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and insert to orders" ON public.orders
  FOR ALL USING (true);

-- 3. Create ARTICLES table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  "readingTime" TEXT,
  date TEXT,
  summary TEXT,
  "contentParagraphs" TEXT[],
  "coverImage" TEXT,
  author TEXT
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read to blog" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow global write to code" ON public.articles FOR ALL USING (true);

-- 4. Create REVIEWS table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "productName" TEXT,
  "authorName" TEXT NOT NULL,
  "authorEmail" TEXT,
  rating NUMERIC,
  title TEXT,
  comment TEXT,
  "imageUrl" TEXT,
  date TEXT,
  status TEXT,
  "skinType" TEXT,
  concern TEXT
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read to approved reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow global write to reviews" ON public.reviews FOR ALL USING (true);
`;
