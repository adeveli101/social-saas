-- =============================================================================
-- SUPABASE + CLERK INTEGRATION MIGRATION
-- =============================================================================
-- Bu migration'ı Supabase SQL Editor'de manuel olarak çalıştırın
-- =============================================================================

-- 1. USERS TABLE GÜNCELLEME (Clerk entegrasyonu için)
-- =============================================================================

-- Mevcut users tablosunu Clerk için güncelle
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT;
ALTER TABLE users ADD CONSTRAINT users_clerk_id_unique UNIQUE (clerk_id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_limit INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;

-- Clerk ID için index oluştur
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- 2. CAROUSELS TABLE GÜNCELLEME (Clerk user_id için)
-- =============================================================================

-- Carousels tablosunda user_id'yi Clerk ID ile uyumlu hale getir
-- Mevcut verileri korumak için güvenli güncelleme
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- 3. GENERATION_JOBS TABLE GÜNCELLEME
-- =============================================================================

-- Generation jobs tablosunu Clerk için güncelle
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- Clerk user_id için index
CREATE INDEX IF NOT EXISTS idx_generation_jobs_clerk_user_id ON generation_jobs(clerk_user_id);

-- 4. RLS POLICIES GÜNCELLEME (Clerk JWT için)
-- =============================================================================

-- Önce eski policies'leri temizle
DROP POLICY IF EXISTS "Users can view their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can insert their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can update their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can delete their own carousels" ON carousels;

DROP POLICY IF EXISTS "Users can view their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can insert their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can update their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can delete their own generation jobs" ON generation_jobs;

DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- Yeni Clerk-compatible policies oluştur
-- Carousels için RLS policies
CREATE POLICY "Users can view their own carousels" ON carousels
    FOR SELECT USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can insert their own carousels" ON carousels
    FOR INSERT WITH CHECK (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can update their own carousels" ON carousels
    FOR UPDATE USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can delete their own carousels" ON carousels
    FOR DELETE USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

-- Generation jobs için RLS policies
CREATE POLICY "Users can view their own generation jobs" ON generation_jobs
    FOR SELECT USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can insert their own generation jobs" ON generation_jobs
    FOR INSERT WITH CHECK (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can update their own generation jobs" ON generation_jobs
    FOR UPDATE USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can delete their own generation jobs" ON generation_jobs
    FOR DELETE USING (
        clerk_user_id = auth.jwt() ->> 'sub' OR 
        user_id = auth.jwt() ->> 'sub'
    );

-- Todos için RLS policies
CREATE POLICY "Users can view their own todos" ON todos
    FOR SELECT USING (
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can insert their own todos" ON todos
    FOR INSERT WITH CHECK (
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can update their own todos" ON todos
    FOR UPDATE USING (
        user_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can delete their own todos" ON todos
    FOR DELETE USING (
        user_id = auth.jwt() ->> 'sub'
    );

-- Users tablosu için RLS policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (
        clerk_id = auth.jwt() ->> 'sub'
    );

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (
        clerk_id = auth.jwt() ->> 'sub'
    );

-- 5. STORAGE POLICIES GÜNCELLEME
-- =============================================================================

-- Storage policies'leri Clerk için güncelle
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;

CREATE POLICY "Users can upload their own images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'carousel-images' AND 
        auth.jwt() ->> 'sub' IS NOT NULL
    );

CREATE POLICY "Users can view their own images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'carousel-images' AND 
        auth.jwt() ->> 'sub' IS NOT NULL
    );

CREATE POLICY "Users can delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'carousel-images' AND 
        auth.jwt() ->> 'sub' IS NOT NULL
    );

-- 6. VERIFICATION QUERIES
-- =============================================================================

-- Tabloların durumunu kontrol et
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'carousels', 'generation_jobs', 'todos')
    AND column_name IN ('clerk_id', 'clerk_user_id', 'user_id', 'email', 'plan', 'credits')
ORDER BY table_name, ordinal_position;

-- RLS policies'lerin durumunu kontrol et
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('users', 'carousels', 'generation_jobs', 'todos', 'storage.objects')
ORDER BY tablename, policyname;

-- Index'lerin durumunu kontrol et
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('users', 'carousels', 'generation_jobs')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =============================================================================
-- MIGRATION TAMAMLANDI
-- =============================================================================
-- Sonraki adımlar:
-- 1. Environment variables'ları ayarlayın
-- 2. Clerk JWT template'ini yapılandırın
-- 3. TypeScript types'ları güncelleyin
-- ============================================================================= 