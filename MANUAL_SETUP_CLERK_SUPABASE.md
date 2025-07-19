# 🔧 Clerk + Supabase Manuel Kurulum Rehberi

## 📋 Genel Bakış

Bu rehber, Clerk authentication ile Supabase entegrasyonu için gerekli tüm manuel işlemleri içerir.

---

## 🗃️ 1. Supabase SQL Editor İşlemleri

### 1.1 SQL Migration Çalıştırma

**Adım 1**: Supabase Dashboard'a gidin
- https://supabase.com/dashboard
- Projenizi seçin

**Adım 2**: SQL Editor'ü açın
- Sol menüden "SQL Editor" seçin
- "New query" butonuna tıklayın

**Adım 3**: Migration'ı çalıştırın
- `SUPABASE_CLERK_INTEGRATION.sql` dosyasının içeriğini kopyalayın
- SQL Editor'e yapıştırın
- "Run" butonuna tıklayın

**Adım 4**: Sonuçları kontrol edin
- Migration başarılı olduğunda verification queries çalışacak
- Tüm tablolar ve policies'in oluştuğunu doğrulayın

### 1.2 Verification Queries

Migration tamamlandıktan sonra şu sorguları çalıştırın:

```sql
-- Tabloların durumunu kontrol et
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('users', 'carousels', 'generation_jobs')
    AND column_name IN ('clerk_id', 'clerk_user_id', 'user_id')
ORDER BY table_name, ordinal_position;

-- RLS policies'lerin durumunu kontrol et
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('users', 'carousels', 'generation_jobs')
ORDER BY tablename, policyname;
```

---

## 🔐 2. Clerk Dashboard İşlemleri

### 2.1 JWT Template Oluşturma

**Adım 1**: Clerk Dashboard'a gidin
- https://dashboard.clerk.com
- Projenizi seçin

**Adım 2**: JWT Templates'e gidin
- Sol menüden "JWT Templates" seçin
- "Create template" butonuna tıklayın

**Adım 3**: Template'i yapılandırın
```json
{
  "aud": "authenticated",
  "exp": "{{exp}}",
  "iat": "{{iat}}",
  "iss": "{{iss}}",
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address.email_address}}",
  "phone": "{{user.primary_phone_number.phone_number}}",
  "app_metadata": {
    "provider": "clerk",
    "providers": ["clerk"]
  },
  "user_metadata": {
    "email": "{{user.primary_email_address.email_address}}",
    "email_verified": "{{user.primary_email_address.verification.status}}",
    "phone_verified": "{{user.primary_phone_number.verification.status}}",
    "sub": "{{user.id}}"
  },
  "role": "authenticated"
}
```

**Adım 4**: Template'i kaydedin
- Template adı: "supabase-auth"
- "Save" butonuna tıklayın

### 2.2 Webhook Endpoint Oluşturma

**Adım 1**: Webhooks bölümüne gidin
- Sol menüden "Webhooks" seçin
- "Add endpoint" butonuna tıklayın

**Adım 2**: Webhook'u yapılandırın
- Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- "Create endpoint" butonuna tıklayın

---

## 🌐 3. Environment Variables Ayarlama

### 3.1 Local Development (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Job Processor
JOB_PROCESSOR_API_KEY=your-secure-api-key

# Database
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
```

### 3.2 Production (AWS Amplify)

AWS Amplify Console'da Environment Variables bölümünde şu değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_live_your-clerk-secret-key
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
JOB_PROCESSOR_API_KEY=your-secure-api-key
```

---

## 🔧 4. Supabase Authentication Ayarları

### 4.1 JWT Verification Ayarlama

**Adım 1**: Supabase Dashboard'da Authentication > Settings'e gidin

**Adım 2**: JWT Settings bölümünde:
- "Enable JWT verification" seçeneğini aktif edin
- JWT Secret: Clerk JWT template'inizin secret'ını ekleyin

**Adım 3**: Auth Settings'de:
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/dashboard`

### 4.2 Storage Bucket Ayarları

**Adım 1**: Storage bölümüne gidin
- Sol menüden "Storage" seçin

**Adım 2**: Bucket oluşturun
- "New bucket" butonuna tıklayın
- Bucket name: `carousel-images`
- Public bucket: ✅ Evet
- File size limit: 10MB
- Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

**Adım 3**: Policies'i kontrol edin
- Storage policies'in otomatik oluşturulduğunu doğrulayın

---

## 🧪 5. Test İşlemleri

### 5.1 Authentication Test

```bash
# Local development'ta test edin
npm run dev

# Tarayıcıda şu adımları takip edin:
# 1. http://localhost:3000 adresine gidin
# 2. Sign up/Sign in yapın
# 3. Dashboard'a yönlendirildiğinizi kontrol edin
# 4. User data'nın Supabase'de oluştuğunu kontrol edin
```

### 5.2 Database Test

```sql
-- Supabase SQL Editor'de test edin
-- Kullanıcı oluşturulduktan sonra:

-- Users tablosunu kontrol et
SELECT * FROM users WHERE clerk_id IS NOT NULL;

-- Carousels tablosunu kontrol et
SELECT * FROM carousels WHERE clerk_user_id IS NOT NULL;

-- Generation jobs tablosunu kontrol et
SELECT * FROM generation_jobs WHERE clerk_user_id IS NOT NULL;
```

### 5.3 API Test

```bash
# Health check endpoint'ini test edin
curl https://your-domain.com/api/health

# Monitoring endpoint'ini test edin
curl https://your-domain.com/api/monitoring

# Real-time test endpoint'ini test edin
curl -X POST https://your-domain.com/api/test/realtime \
  -H "Content-Type: application/json" \
  -d '{"jobId": "test-job-id", "action": "update_progress"}'
```

---

## 🔒 6. Güvenlik Kontrolleri

### 6.1 RLS Policies Test

```sql
-- Supabase SQL Editor'de test edin
-- Farklı kullanıcılar ile test edin

-- Test 1: Kullanıcı kendi verilerini görebilmeli
-- Test 2: Kullanıcı başka kullanıcının verilerini görememeli
-- Test 3: Service role tüm verilere erişebilmeli
```

### 6.2 JWT Token Test

```bash
# Browser console'da test edin
# Clerk token'ının doğru çalıştığını kontrol edin

import { createBrowserSupabaseClient } from '@supabase/ssr'

const supabase = createBrowserSupabaseClient()

// Token'ı kontrol et
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

---

## 🚨 7. Troubleshooting

### 7.1 Common Issues

#### Issue 1: RLS Policy Errors
```sql
-- Çözüm: Policies'i yeniden oluşturun
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "policy_name" ON table_name FOR SELECT USING (condition);
```

#### Issue 2: JWT Verification Failed
```bash
# Çözüm: Clerk JWT template'ini kontrol edin
# Supabase JWT settings'ini kontrol edin
# Environment variables'ları kontrol edin
```

#### Issue 3: User Not Found
```sql
-- Çözüm: Users tablosunu kontrol edin
SELECT * FROM users WHERE clerk_id = 'user-clerk-id';
```

### 7.2 Debug Commands

```bash
# Supabase connection test
npx supabase status

# Clerk connection test
curl -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  https://api.clerk.com/v1/users

# Database connection test
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  https://your-project-id.supabase.co/rest/v1/users
```

---

## ✅ 8. Checklist

### Supabase Setup
- [ ] SQL migration çalıştırıldı
- [ ] RLS policies oluşturuldu
- [ ] Storage bucket oluşturuldu
- [ ] JWT verification aktif edildi

### Clerk Setup
- [ ] JWT template oluşturuldu
- [ ] Webhook endpoint oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Authentication test edildi

### Integration Test
- [ ] User signup/signin çalışıyor
- [ ] Database'de user data oluşuyor
- [ ] RLS policies doğru çalışıyor
- [ ] Storage upload çalışıyor
- [ ] Real-time subscriptions çalışıyor

### Production Setup
- [ ] Environment variables production'da ayarlandı
- [ ] Health check endpoint çalışıyor
- [ ] Monitoring endpoint çalışıyor
- [ ] Security audit tamamlandı

---

**📅 Son Güncelleme**: 2024-12-30  
**🔄 Versiyon**: 1.0  
**👤 Hazırlayan**: Development Team 