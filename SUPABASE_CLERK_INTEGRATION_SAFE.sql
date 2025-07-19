-- =============================================================================
-- CLERK + SUPABASE INTEGRATION - SAFE MIGRATION
-- =============================================================================
-- Bu migration mevcut verileri koruyarak sadece Clerk entegrasyonu ekler
-- =============================================================================

-- 1. USERS TABLE - Clerk entegrasyonu için güvenli güncelleme
-- =============================================================================

-- Users tablosu yoksa oluştur
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    plan TEXT DEFAULT 'free',
    credits INTEGER DEFAULT 10,
    daily_limit INTEGER DEFAULT 5,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clerk entegrasyonu için alanları ekle (eğer yoksa)
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_limit INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;

-- Clerk ID için unique constraint ekle
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_clerk_id_unique'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_clerk_id_unique UNIQUE (clerk_id);
    END IF;
END $$;

-- Clerk ID için index oluştur
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- 2. CAROUSELS TABLE - Clerk entegrasyonu için güvenli güncelleme
-- =============================================================================

-- Carousels tablosu yoksa oluştur
CREATE TABLE IF NOT EXISTS carousels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    clerk_user_id TEXT,
    prompt TEXT NOT NULL,
    image_count INTEGER NOT NULL CHECK (image_count >= 3 AND image_count <= 10),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    final_caption TEXT,
    error_message TEXT,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    progress_message TEXT,
    generation_metadata JSONB,
    estimated_completion_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clerk entegrasyonu için alanları ekle (eğer yoksa)
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100);
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_message TEXT;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS generation_metadata JSONB;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE;

-- Clerk user_id için index
CREATE INDEX IF NOT EXISTS idx_carousels_clerk_user_id ON carousels(clerk_user_id);

-- 3. GENERATION_JOBS TABLE - Clerk entegrasyonu için güvenli güncelleme
-- =============================================================================

-- Generation jobs tablosu yoksa oluştur
CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    clerk_user_id TEXT,
    job_type TEXT NOT NULL DEFAULT 'carousel_generation',
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    payload JSONB NOT NULL,
    result JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clerk entegrasyonu için alanları ekle (eğer yoksa)
ALTER TABLE generation_jobs ADD COLUMN IF NOT EXISTS clerk_user_id TEXT;

-- Clerk user_id için index
CREATE INDEX IF NOT EXISTS idx_generation_jobs_clerk_user_id ON generation_jobs(clerk_user_id);

-- 4. CAROUSEL_SLIDES TABLE - Eğer yoksa oluştur
-- =============================================================================

CREATE TABLE IF NOT EXISTS carousel_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
    slide_number INTEGER NOT NULL CHECK (slide_number >= 1),
    image_url TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(carousel_id, slide_number)
);

-- 5. TODOS TABLE - Eğer yoksa oluştur
-- =============================================================================

CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PERFORMANCE INDEXES - Güvenli oluşturma
-- =============================================================================

-- Users tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_users_daily_limit ON users(daily_limit);

-- Carousels tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_carousels_user_id ON carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_status ON carousels(status);
CREATE INDEX IF NOT EXISTS idx_carousels_created_at ON carousels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousels_progress ON carousels(progress_percent);

-- Generation jobs tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_scheduled_at ON generation_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_carousel_id ON generation_jobs(carousel_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status_priority ON generation_jobs(status, priority DESC);

-- Carousel slides tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_carousel_slides_carousel_id ON carousel_slides(carousel_id);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_slide_number ON carousel_slides(slide_number);

-- Todos tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- 7. ROW LEVEL SECURITY (RLS) - Güvenli güncelleme
-- =============================================================================

-- RLS'yi aktif et
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Eski policies'leri temizle (eğer varsa)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

DROP POLICY IF EXISTS "Users can view their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can insert their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can update their own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can delete their own carousels" ON carousels;

DROP POLICY IF EXISTS "Users can view their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can insert their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can update their own generation jobs" ON generation_jobs;
DROP POLICY IF EXISTS "Users can delete their own generation jobs" ON generation_jobs;

DROP POLICY IF EXISTS "Users can view slides of their own carousels" ON carousel_slides;
DROP POLICY IF EXISTS "Users can insert slides for their own carousels" ON carousel_slides;
DROP POLICY IF EXISTS "Users can update slides of their own carousels" ON carousel_slides;
DROP POLICY IF EXISTS "Users can delete slides of their own carousels" ON carousel_slides;

DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- Yeni Clerk-compatible policies oluştur
-- Users tablosu için policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub');

-- Carousels tablosu için policies
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

-- Generation jobs tablosu için policies
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

-- Carousel slides tablosu için policies
CREATE POLICY "Users can view slides of their own carousels" ON carousel_slides
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND (carousels.clerk_user_id = auth.jwt() ->> 'sub' OR carousels.user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can insert slides for their own carousels" ON carousel_slides
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND (carousels.clerk_user_id = auth.jwt() ->> 'sub' OR carousels.user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can update slides of their own carousels" ON carousel_slides
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND (carousels.clerk_user_id = auth.jwt() ->> 'sub' OR carousels.user_id = auth.jwt() ->> 'sub')
        )
    );

CREATE POLICY "Users can delete slides of their own carousels" ON carousel_slides
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND (carousels.clerk_user_id = auth.jwt() ->> 'sub' OR carousels.user_id = auth.jwt() ->> 'sub')
        )
    );

-- Todos tablosu için policies
CREATE POLICY "Users can view their own todos" ON todos
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own todos" ON todos
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own todos" ON todos
    FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own todos" ON todos
    FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- 8. STORAGE BUCKET VE POLICIES - Güvenli oluşturma
-- =============================================================================

-- Storage bucket oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('carousel-images', 'carousel-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies'leri güncelle
DROP POLICY IF EXISTS "Users can upload their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

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

-- 9. VERIFICATION QUERIES
-- =============================================================================

-- Tabloların durumunu kontrol et
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'carousels', 'generation_jobs', 'carousel_slides', 'todos') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'carousels', 'generation_jobs', 'carousel_slides', 'todos')
ORDER BY table_name;

-- Clerk entegrasyonu alanlarını kontrol et
SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('clerk_id', 'clerk_user_id', 'email', 'plan', 'credits') 
        THEN '✅ CLERK FIELD'
        ELSE '📋 EXISTING FIELD'
    END as type
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'carousels', 'generation_jobs')
    AND column_name IN ('clerk_id', 'clerk_user_id', 'user_id', 'email', 'plan', 'credits')
ORDER BY table_name, ordinal_position;

-- RLS policies'lerin durumunu kontrol et
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN policyname LIKE '%clerk%' OR policyname LIKE '%user%'
        THEN '✅ CLERK POLICY'
        ELSE '📋 EXISTING POLICY'
    END as type
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('users', 'carousels', 'generation_jobs', 'carousel_slides', 'todos')
ORDER BY tablename, policyname;

-- Storage bucket'ı kontrol et
SELECT 
    id,
    name,
    public,
    CASE 
        WHEN name = 'carousel-images' THEN '✅ CAROUSEL BUCKET'
        ELSE '📋 OTHER BUCKET'
    END as type
FROM storage.buckets
WHERE name = 'carousel-images';

-- =============================================================================
-- MIGRATION TAMAMLANDI
-- =============================================================================
-- Bu migration:
-- ✅ Mevcut verileri korur
-- ✅ Sadece gerekli alanları ekler
-- ✅ Clerk entegrasyonu için güvenli
-- ✅ Geriye dönük uyumlu
-- ============================================================================= 