-- =============================================================================
-- AI Generation System - Phase 1 Database Migration
-- =============================================================================
-- Bu migration mevcut carousels ve carousel_slides tablolarını bozmadan
-- yeni queue sistemi ve progress tracking ekler
-- =============================================================================

-- 1. GENERATION_JOBS TABLE - Job queue infrastructure
-- =============================================================================
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
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

-- 2. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_scheduled_at ON generation_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_carousel_id ON generation_jobs(carousel_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status_priority ON generation_jobs(status, priority DESC);

-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own jobs
CREATE POLICY "Users can view their own generation jobs" ON generation_jobs
  FOR SELECT USING (auth.uid()::text = user_id);

-- Service role can manage all jobs (for background processing)
CREATE POLICY "Service role can manage all jobs" ON generation_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. ENHANCE EXISTING CAROUSELS TABLE
-- =============================================================================
-- Add progress tracking fields (safe to run multiple times)
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100);
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_message TEXT;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS generation_metadata JSONB;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_carousels_progress ON carousels(progress_percent);
CREATE INDEX IF NOT EXISTS idx_carousels_progress_message ON carousels(progress_message);

-- 5. ENHANCE USERS TABLE FOR CREDIT SYSTEM
-- =============================================================================
-- Add credit management fields (safe to run multiple times)
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_limit INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;

-- Add indexes for credit system
CREATE INDEX IF NOT EXISTS idx_users_credits ON users(credits);
CREATE INDEX IF NOT EXISTS idx_users_daily_limit ON users(daily_limit);

-- 6. VERIFICATION QUERIES
-- =============================================================================
-- Check if all tables exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('carousels', 'carousel_slides', 'generation_jobs', 'users') 
    THEN '✅ EXISTS' 
    ELSE '❌ MISSING' 
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('carousels', 'carousel_slides', 'generation_jobs', 'users')
ORDER BY table_name;

-- Check if all indexes exist
SELECT 
  indexname,
  tablename,
  CASE 
    WHEN indexname LIKE 'idx_generation_jobs%' OR 
         indexname LIKE 'idx_carousels_progress%' OR
         indexname LIKE 'idx_users_credits%'
    THEN '✅ NEW INDEX'
    ELSE '📋 EXISTING INDEX'
  END as type
FROM pg_indexes 
WHERE tablename IN ('generation_jobs', 'carousels', 'users') 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check RLS status
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename IN ('generation_jobs', 'carousels', 'carousel_slides', 'users')
ORDER BY tablename;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================
-- Bu migration başarıyla tamamlandıktan sonra:
-- 1. TypeScript types'ları güncelleyin
-- 2. Queue Manager'ı implement edin
-- 3. API routes'ları güncelleyin
-- ============================================================================= 