-- =============================================================================
-- CURRENT SCHEMA CHECK - Supabase SQL Editor'de çalıştırın
-- =============================================================================

-- 1. Mevcut public tabloları kontrol et
-- =============================================================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. Users tablosu varsa yapısını kontrol et
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Carousels tablosu varsa yapısını kontrol et
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'carousels'
ORDER BY ordinal_position;

-- 4. Generation jobs tablosu varsa yapısını kontrol et
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'generation_jobs'
ORDER BY ordinal_position;

-- 5. Todos tablosu varsa yapısını kontrol et
-- =============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'todos'
ORDER BY ordinal_position;

-- 6. Mevcut RLS policies'leri kontrol et
-- =============================================================================
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
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. Mevcut index'leri kontrol et
-- =============================================================================
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 8. Storage buckets'ları kontrol et
-- =============================================================================
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
ORDER BY name;

-- =============================================================================
-- SONUÇLAR:
-- =============================================================================
-- Bu sorguları çalıştırdıktan sonra:
-- 1. Hangi tablolar mevcut olduğunu göreceksiniz
-- 2. Hangi alanların eksik olduğunu anlayacaksınız
-- 3. Hangi policies'lerin güncellenmesi gerektiğini göreceksiniz
-- ============================================================================= 