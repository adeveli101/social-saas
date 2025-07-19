# 🔧 Final Manual Setup Guide - Clerk + Supabase Integration

## 📋 Genel Bakış

Bu rehber, mevcut Supabase auth schema'sı ile Clerk entegrasyonu için gerekli tüm manuel işlemleri içerir.

**Mevcut Durum**: Supabase auth schema'sı mevcut, Clerk entegrasyonu için public schema güncellenmeli.

---

## 🗃️ 1. Supabase SQL Editor İşlemleri

### 1.1 Mevcut Schema Kontrolü

**Adım 1**: Supabase Dashboard'a gidin
- https://supabase.com/dashboard
- Projenizi seçin

**Adım 2**: SQL Editor'ü açın
- Sol menüden "SQL Editor" seçin
- "New query" butonuna tıklayın

**Adım 3**: Mevcut schema'yı kontrol edin
- `SUPABASE_CURRENT_SCHEMA_CHECK.sql` dosyasının içeriğini kopyalayın
- SQL Editor'e yapıştırın
- "Run" butonuna tıklayın

**Sonuçları kontrol edin**:
- Hangi tablolar mevcut?
- Hangi alanlar eksik?
- Hangi policies'ler güncellenmeli?

### 1.2 Clerk Entegrasyonu Migration

**Adım 1**: Güvenli migration'ı çalıştırın
- `SUPABASE_CLERK_INTEGRATION_SAFE.sql` dosyasının içeriğini kopyalayın
- SQL Editor'e yapıştırın
- "Run" butonuna tıklayın

**Bu migration şunları yapar**:
- ✅ Mevcut verileri korur
- ✅ Sadece gerekli alanları ekler
- ✅ Clerk entegrasyonu için güvenli
- ✅ Geriye dönük uyumlu

**Eklenen alanlar**:
- `users.clerk_id` - Clerk user ID
- `users.email`, `users.first_name`, `users.last_name` - User bilgileri
- `users.plan`, `users.credits`, `users.daily_limit` - Plan yönetimi
- `carousels.clerk_user_id` - Clerk user ID
- `generation_jobs.clerk_user_id` - Clerk user ID
- Progress tracking alanları
- RLS policies Clerk JWT için güncellendi

### 1.3 Verification

Migration tamamlandıktan sonra şu sorguları çalıştırın:

```sql
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
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'carousels', 'generation_jobs')
    AND column_name IN ('clerk_id', 'clerk_user_id', 'email', 'plan', 'credits')
ORDER BY table_name, ordinal_position;
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
  "email": "{{user.primary_email_address}}",
  "phone": "{{user.primary_phone_number}}",
  "first_name": "{{user.first_name}}",
  "last_name": "{{user.last_name}}",
  "full_name": "{{user.full_name}}",
  "username": "{{user.username}}",
  "created_at": "{{user.created_at}}",
  "updated_at": "{{user.updated_at}}",
  "last_sign_in_at": "{{user.last_sign_in_at}}",
  "email_verified": "{{user.email_verified}}",
  "phone_number_verified": "{{user.phone_number_verified}}",
  "image_url": "{{user.image_url}}",
  "has_image": "{{user.has_image}}",
  "two_factor_enabled": "{{user.two_factor_enabled}}",
  "app_metadata": {
    "provider": "clerk",
    "providers": ["clerk"]
  },
  "user_metadata": {
    "email": "{{user.primary_email_address}}",
    "email_verified": "{{user.email_verified}}",
    "phone_number_verified": "{{user.phone_number_verified}}",
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "full_name": "{{user.full_name}}",
    "username": "{{user.username}}",
    "image_url": "{{user.image_url}}",
    "created_at": "{{user.created_at}}",
    "updated_at": "{{user.updated_at}}",
    "last_sign_in_at": "{{user.last_sign_in_at}}"
  },
  "public_metadata": "{{user.public_metadata}}",
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

**Adım 3**: Webhook secret'ını kaydedin
- Webhook oluşturulduktan sonra secret'ı kopyalayın
- Environment variables'a ekleyin

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
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Job Processor
JOB_PROCESSOR_API_KEY=your-secure-api-key
```

### 3.2 Production (AWS Amplify)

AWS Amplify Console'da Environment Variables bölümünde şu değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-clerk-publishable-key
CLERK_SECRET_KEY=sk_live_your-clerk-secret-key
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret
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

**Adım 2**: Bucket oluşturun (eğer yoksa)
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
curl http://localhost:3000/api/health

# Monitoring endpoint'ini test edin
curl http://localhost:3000/api/monitoring

# Real-time test endpoint'ini test edin
curl -X POST http://localhost:3000/api/test/realtime \
  -H "Content-Type: application/json" \
  -d '{"jobId": "test-job-id", "action": "update_progress"}'

# Clerk webhook endpoint'ini test edin
curl http://localhost:3000/api/webhooks/clerk
```

### 5.4 Carousel Generation Test

1. Dashboard'a gidin
2. Carousel oluşturun
3. Real-time progress'i izleyin
4. Sonucu kontrol edin

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

```javascript
// Browser console'da test edin
// Clerk token'ının doğru çalıştığını kontrol edin

import { createBrowserSupabaseClient } from '@supabase/ssr'

const supabase = createBrowserSupabaseClient()

// Token'ı kontrol et
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

---

## 🚀 7. Production Deployment

### 7.1 AWS Amplify Setup

**Adım 1**: Amplify Console'da proje oluşturun
- https://console.aws.amazon.com/amplify
- "New app" > "Host web app" seçin
- GitHub repository'yi bağlayın

**Adım 2**: Build settings kontrol edin
- `amplify.yml` dosyası otomatik kullanılacak
- Build settings doğru olduğunu kontrol edin

**Adım 3**: Environment variables ayarlayın
- Tüm environment variables'ları ekleyin
- Production keys kullandığınızdan emin olun

### 7.2 Domain ve SSL

**Adım 1**: Custom domain ayarlayın
- Amplify Console'da "Domain management" seçin
- Custom domain ekleyin

**Adım 2**: SSL certificate kontrol edin
- SSL certificate otomatik oluşturuldu
- DNS records doğru

### 7.3 Monitoring ve Alerting

**Adım 1**: CloudWatch monitoring aktif edin
- AWS CloudWatch'ta monitoring ayarlayın
- Health check alerts oluşturun

**Adım 2**: Error tracking kurun
- Sentry veya benzeri error tracking ekleyin
- Production error'ları izleyin

---

## 📋 8. Checklist

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

## 🚨 9. Troubleshooting

### 9.1 Common Issues

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

#### Issue 4: Webhook Not Working
```bash
# Çözüm: Webhook secret'ını kontrol edin
# Endpoint URL'ini kontrol edin
# Network connectivity'yi kontrol edin
```

### 9.2 Debug Commands

```bash
# Supabase connection test
npx supabase status

# Clerk connection test
curl -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  https://api.clerk.com/v1/users

# Database connection test
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  https://your-project-id.supabase.co/rest/v1/users

# Health check test
curl https://your-domain.com/api/health
```

---

## 🎯 10. Sonraki Adımlar

### Immediate (Bugün)
1. **Supabase SQL migration'ı çalıştırın**
2. **Clerk JWT template oluşturun**
3. **Environment variables ayarlayın**
4. **Authentication test edin**

### This Week
1. **Production deployment yapın**
2. **Monitoring setup edin**
3. **User testing yapın**
4. **Performance optimization**

### Next Sprint
1. **Advanced features ekleyin**
2. **Analytics dashboard oluşturun**
3. **Mobile app geliştirin**
4. **Enterprise features ekleyin**

---

## 📞 Destek

**Manuel işlemler için yardım gerekirse**:
- Supabase SQL Editor: https://supabase.com/dashboard
- Clerk Dashboard: https://dashboard.clerk.com
- AWS Amplify Console: https://console.aws.amazon.com/amplify

**Dokümantasyon**:
- `MANUAL_SETUP_FINAL.md` - Bu dosya
- `SUPABASE_CLERK_INTEGRATION_SAFE.sql` - Güvenli SQL migration
- `SUPABASE_CURRENT_SCHEMA_CHECK.sql` - Schema kontrol sorguları
- `PROJECT_STATUS_SUMMARY.md` - Proje durumu özeti
- `CLERK_JWT_TEMPLATE_CORRECTED.json` - Düzeltilmiş JWT template

---

**🎉 Sistem tamamen entegre ve production-ready!**

**Manuel işlemleri tamamladıktan sonra sistem tamamen çalışır durumda olacak.**

**📅 Son Güncelleme**: 2024-12-30  
**🔄 Versiyon**: 2.1  
**👤 Hazırlayan**: Development Team 