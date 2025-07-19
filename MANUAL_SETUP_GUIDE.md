# 🔧 Manuel Kurulum ve Entegrasyon Rehberi

## 📋 Genel Bakış

Bu rehber, AI generation sisteminin her phase'inde manuel olarak yapmanız gereken adımları içerir. Her phase tamamlandığında ilgili bölümü takip ederek sistemi entegre edebilirsiniz.

---

## 🗃️ PHASE 1: Veritabanı Kurulumu

### 1.1 Supabase Projesi Kurulumu

#### 1.1.1 Supabase Projesi Oluşturma
```bash
# 1. Supabase Dashboard'a gidin
# https://supabase.com/dashboard

# 2. Yeni proje oluşturun
# - Proje adı: social-saas-ai
# - Database password: güçlü bir şifre belirleyin
# - Region: en yakın bölgeyi seçin

# 3. Proje oluşturulduktan sonra şu bilgileri not edin:
# - Project URL: https://your-project-id.supabase.co
# - Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 1.1.2 Environment Variables Ayarlama
```bash
# .env.local dosyasına şu değişkenleri ekleyin:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.2 Veritabanı Migration'ları

#### 1.2.1 SQL Migration'ı Çalıştırma
```sql
-- Supabase SQL Editor'da şu migration'ı çalıştırın:

-- Phase 1 Database Migration
-- Bu migration'ı database-migration-phase1.sql dosyasından kopyalayın

-- 1. Generation jobs tablosunu oluşturun
CREATE TABLE IF NOT EXISTS generation_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('carousel_generation', 'image_generation', 'content_strategy')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  payload JSONB NOT NULL,
  result JSONB,
  error JSONB,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  progress_message TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes oluşturun
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_scheduled_at ON generation_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_carousel_id ON generation_jobs(carousel_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status_priority ON generation_jobs(status, priority DESC);

-- 3. RLS Policies
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generation jobs" ON generation_jobs
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own generation jobs" ON generation_jobs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own generation jobs" ON generation_jobs
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Service role can manage all jobs" ON generation_jobs
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Carousels tablosunu güncelleyin
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100);
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS progress_message TEXT;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS generation_metadata JSONB;
ALTER TABLE carousels ADD COLUMN IF NOT EXISTS estimated_completion_time TIMESTAMP WITH TIME ZONE;

-- 5. Users tablosunu oluşturun (eğer yoksa)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Users için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 7. Verification sorguları
SELECT COUNT(*) FROM generation_jobs;
SELECT COUNT(*) FROM carousels;
SELECT COUNT(*) FROM users;
```

#### 1.2.2 Migration Doğrulama
```sql
-- Migration'ın başarılı olduğunu doğrulayın:
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name IN ('generation_jobs', 'carousels', 'users')
ORDER BY table_name, ordinal_position;
```

### 1.3 TypeScript Types Güncelleme

#### 1.3.1 Database Types Oluşturma
```bash
# Supabase CLI ile database types'ı güncelleyin
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

#### 1.3.2 Types Doğrulama
```typescript
// src/lib/database.types.ts dosyasında şu interface'lerin olduğunu kontrol edin:
// - Database interface
// - GenerationJobs interface
// - Carousels interface
// - Users interface
```

---

## 🤖 PHASE 2: AI Servisleri Kurulumu

### 2.1 OpenAI API Kurulumu

#### 2.1.1 OpenAI API Key Alma
```bash
# 1. OpenAI Dashboard'a gidin
# https://platform.openai.com/api-keys

# 2. Yeni API key oluşturun
# - Key name: social-saas-ai
# - Permissions: All

# 3. API key'i kopyalayın ve güvenli bir yere kaydedin
```

#### 2.1.2 Environment Variables
```bash
# .env.local dosyasına ekleyin:
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_ORGANIZATION_ID=org-your-org-id  # Opsiyonel
```

#### 2.1.3 OpenAI Servis Testi
```bash
# OpenAI servisinin çalıştığını test edin:
curl -X POST http://localhost:3000/api/test/openai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt"}'
```

### 2.2 Google Gemini API Kurulumu

#### 2.2.1 Google AI Studio API Key Alma
```bash
# 1. Google AI Studio'ya gidin
# https://makersuite.google.com/app/apikey

# 2. Yeni API key oluşturun
# - Key name: social-saas-gemini
# - Permissions: All

# 3. API key'i kopyalayın
```

#### 2.2.2 Environment Variables
```bash
# .env.local dosyasına ekleyin:
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
```

#### 2.2.3 Gemini Servis Testi
```bash
# Gemini servisinin çalıştığını test edin:
curl -X POST http://localhost:3000/api/test/gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt"}'
```

### 2.3 Supabase Storage Kurulumu

#### 2.3.1 Storage Bucket Oluşturma
```bash
# 1. Supabase Dashboard > Storage
# 2. "New bucket" butonuna tıklayın
# 3. Bucket adı: carousel-images
# 4. Public bucket: ✅ Evet
# 5. File size limit: 10MB
# 6. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
```

#### 2.3.2 Storage Policies
```sql
-- Storage bucket için RLS policies oluşturun:

-- 1. Bucket'a erişim politikası
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'carousel-images');

-- 2. Kullanıcı upload politikası
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'carousel-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Kullanıcı silme politikası
CREATE POLICY "Users can delete their images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'carousel-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### 2.3.3 Storage Testi
```bash
# Storage'ın çalıştığını test edin:
curl -X POST http://localhost:3000/api/test/storage \
  -H "Content-Type: application/json" \
  -d '{"test": "upload"}'
```

---

## ⚙️ PHASE 3: Background Processing Kurulumu

### 3.1 Job Processor API Key

#### 3.1.1 API Key Oluşturma
```bash
# Güvenli bir API key oluşturun:
# Bu key job processor API'sini koruyacak

# .env.local dosyasına ekleyin:
JOB_PROCESSOR_API_KEY=your-secure-api-key-here
```

#### 3.1.2 Job Processor Testi
```bash
# Job processor'ın çalıştığını test edin:
curl -X POST http://localhost:3000/api/queue/process \
  -H "Authorization: Bearer your-secure-api-key-here" \
  -H "Content-Type: application/json"
```

### 3.2 Background Job Processing

#### 3.2.1 Cron Job Kurulumu (Opsiyonel)
```bash
# Eğer cron job kullanmak istiyorsanız:

# 1. Crontab'a ekleyin:
# Her 5 dakikada bir job'ları işlemek için:
*/5 * * * * curl -X POST http://your-domain.com/api/queue/process \
  -H "Authorization: Bearer your-secure-api-key-here"

# 2. Veya AWS Lambda/Cloud Functions kullanın
```

#### 3.2.2 End-to-End Test
```bash
# Tam bir carousel generation testi yapın:
curl -X POST http://localhost:3000/api/carousel/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Modern tech startup carousel",
    "style": "modern",
    "aspectRatio": "16:9",
    "keyPoints": ["Innovation", "Growth", "Success"]
  }'
```

---

## 🖥️ PHASE 4: Real-time Frontend Entegrasyonu

### 4.1 Supabase Realtime Kurulumu

#### 4.1.1 Realtime Subscription Testi
```javascript
// Browser console'da test edin:
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

// Job status değişikliklerini dinleyin
const subscription = supabase
  .channel('generation_jobs')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'generation_jobs' },
    (payload) => {
      console.log('Job updated:', payload.new)
    }
  )
  .subscribe()
```

#### 4.1.2 Frontend Component Testi
```bash
# Carousel client component'ini test edin:
# http://localhost:3000/dashboard
# Yeni bir carousel oluşturun ve real-time updates'i izleyin
```

### 4.2 Error Handling Testi

#### 4.2.1 Error Senaryoları
```bash
# 1. API key'leri geçersiz yapın ve test edin
# 2. Network bağlantısını kesin ve test edin
# 3. Rate limit'leri aşın ve test edin
```

---

## 🚀 PHASE 5: Production Deployment

### 5.1 AWS Amplify Kurulumu

#### 5.1.1 Amplify Console Kurulumu
```bash
# 1. AWS Amplify Console'a gidin
# https://console.aws.amazon.com/amplify/

# 2. "New app" > "Host web app"
# 3. Git provider seçin (GitHub, GitLab, Bitbucket)
# 4. Repository'yi bağlayın
```

#### 5.1.2 Build Settings
```yaml
# amplify.yml dosyası oluşturun:
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### 5.1.3 Environment Variables
```bash
# Amplify Console > App settings > Environment variables
# Şu değişkenleri ekleyin:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
JOB_PROCESSOR_API_KEY=your-secure-api-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5.2 Domain ve SSL

#### 5.2.1 Custom Domain
```bash
# 1. Amplify Console > Domain management
# 2. "Add domain" butonuna tıklayın
# 3. Domain adınızı girin
# 4. SSL sertifikası otomatik olarak oluşturulacak
```

### 5.3 Monitoring ve Analytics

#### 5.3.1 AWS CloudWatch
```bash
# 1. CloudWatch > Logs > Log groups
# 2. Amplify app loglarını izleyin
# 3. Error rate'leri takip edin
```

#### 5.3.2 Performance Monitoring
```bash
# 1. AWS X-Ray aktifleştirin
# 2. API Gateway metriklerini izleyin
# 3. Lambda function metriklerini takip edin
```

---

## 🧪 Test Senaryoları

### 6.1 Unit Tests
```bash
# Test'leri çalıştırın:
npm run test

# Coverage raporu:
npm run test:coverage
```

### 6.2 Integration Tests
```bash
# Integration test'leri:
npm run test:integration

# E2E test'leri:
npm run test:e2e
```

### 6.3 Load Testing
```bash
# Load test için Apache Bench kullanın:
ab -n 100 -c 10 http://localhost:3000/api/carousel/generate

# Veya Artillery kullanın:
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3000/api/carousel/generate
```

---

## 🔒 Güvenlik Kontrolleri

### 7.1 API Security
```bash
# 1. API key'lerin güvenli olduğunu kontrol edin
# 2. Rate limiting'in çalıştığını test edin
# 3. CORS ayarlarını kontrol edin
```

### 7.2 Database Security
```sql
-- RLS policies'in doğru çalıştığını test edin:
-- 1. Farklı kullanıcılar ile test edin
-- 2. Service role ile test edin
-- 3. Unauthorized access'leri test edin
```

### 7.3 Storage Security
```bash
# 1. File upload güvenliğini test edin
# 2. File type validation'ı kontrol edin
# 3. File size limits'i test edin
```

---

## 📊 Monitoring ve Alerting

### 8.1 Error Tracking
```bash
# 1. Sentry veya benzeri bir servis kurun
# 2. Error alerting'i yapılandırın
# 3. Performance monitoring'i aktifleştirin
```

### 8.2 Health Checks
```bash
# Health check endpoint'i oluşturun:
# GET /api/health
# Bu endpoint tüm servislerin durumunu kontrol etmeli
```

---

## 🔄 Güncelleme ve Bakım

### 9.1 Regular Updates
```bash
# Haftalık güvenlik güncellemeleri:
npm audit
npm update

# Dependency'leri güncelleyin:
npm outdated
npm update
```

### 9.2 Database Maintenance
```sql
-- Aylık database maintenance:
-- 1. Eski job'ları temizleyin
-- 2. Index'leri optimize edin
-- 3. Storage'ı temizleyin
```

---

## 📞 Destek ve Sorun Giderme

### 10.1 Common Issues

#### 10.1.1 OpenAI Rate Limits
```bash
# Rate limit hatası alırsanız:
# 1. Retry logic'i kontrol edin
# 2. Rate limit handling'i test edin
# 3. API key'lerin doğru olduğunu kontrol edin
```

#### 10.1.2 Supabase Connection Issues
```bash
# Bağlantı sorunları için:
# 1. Environment variables'ı kontrol edin
# 2. Network connectivity'yi test edin
# 3. Supabase status'ü kontrol edin
```

#### 10.1.3 Storage Upload Failures
```bash
# Upload sorunları için:
# 1. File size limits'i kontrol edin
# 2. File type validation'ı test edin
# 3. Storage bucket permissions'ı kontrol edin
```

### 10.2 Debug Commands
```bash
# Debug için kullanışlı komutlar:

# Supabase connection test:
npx supabase status

# OpenAI API test:
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Gemini API test:
curl -H "Authorization: Bearer $GOOGLE_GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models
```

---

## ✅ Checklist

### Phase 1 Checklist
- [ ] Supabase projesi oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Database migration çalıştırıldı
- [ ] RLS policies oluşturuldu
- [ ] TypeScript types güncellendi
- [ ] Queue system test edildi

### Phase 2 Checklist
- [ ] OpenAI API key alındı
- [ ] Google Gemini API key alındı
- [ ] AI services test edildi
- [ ] Storage bucket oluşturuldu
- [ ] Storage policies ayarlandı
- [ ] Image upload test edildi

### Phase 3 Checklist
- [ ] Job processor API key oluşturuldu
- [ ] Background processing test edildi
- [ ] End-to-end generation test edildi
- [ ] Error handling test edildi

### Phase 4 Checklist
- [ ] Real-time subscriptions test edildi
- [ ] Frontend integration tamamlandı
- [ ] Error scenarios test edildi
- [ ] Performance optimized

### Phase 5 Checklist
- [ ] AWS Amplify kuruldu
- [ ] Custom domain ayarlandı
- [ ] SSL sertifikası aktif
- [ ] Monitoring kuruldu
- [ ] Production deployment tamamlandı

---

**📅 Son Güncelleme**: 2024-12-30  
**🔄 Versiyon**: 1.0  
**👤 Hazırlayan**: Development Team 