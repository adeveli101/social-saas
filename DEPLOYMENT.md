# Production Deployment Guide

Bu rehber, Social SaaS uygulamasını production ortamında deploy etmek için gerekli adımları içerir.

## 🚀 Hızlı Başlangıç

### 1. Environment Variables Ayarlayın

```bash
# Environment dosyasını kopyalayın
cp env.production.example .env.production

# .env.production dosyasını düzenleyin
nano .env.production
```

### 2. Docker ile Deploy

```bash
# Deploy script'ini çalıştırın
chmod +x deploy.sh
./deploy.sh
```

## 📋 Gereksinimler

- Docker ve Docker Compose
- Node.js 18+ (development için)
- Git

## 🔧 Manuel Deploy Adımları

### 1. Environment Variables

`.env.production` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
# Next.js
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 2. Docker Build

```bash
# Production build
docker-compose build --no-cache

# Uygulamayı başlat
docker-compose up -d
```

### 3. Health Check

```bash
# Health check
curl http://localhost/health
```

## 🌐 Domain ve SSL

### Nginx SSL Konfigürasyonu

1. SSL sertifikalarınızı `./ssl/` klasörüne yerleştirin
2. `nginx.conf` dosyasındaki HTTPS bölümünü aktif edin
3. Domain adınızı güncelleyin

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... diğer ayarlar
}
```

## 📊 Monitoring ve Logs

### Logları İzleme

```bash
# Tüm servislerin logları
docker-compose logs -f

# Sadece app logları
docker-compose logs -f app

# Nginx logları
docker-compose logs -f nginx
```

### Performance Monitoring

```bash
# Container resource kullanımı
docker stats

# Disk kullanımı
docker system df
```

## 🔄 Update ve Rollback

### Update

```bash
# Yeni versiyonu pull edin
git pull origin main

# Yeniden build edin
docker-compose build --no-cache

# Deploy edin
docker-compose up -d
```

### Rollback

```bash
# Önceki versiyona dönün
git checkout <previous-commit>

# Yeniden deploy edin
docker-compose up -d
```

## 🛡️ Security

### Firewall Ayarları

```bash
# Sadece gerekli portları açın
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

### SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d your-domain.com
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Daha fazla app instance
docker-compose up -d --scale app=3
```

### Load Balancer

Nginx upstream konfigürasyonunu güncelleyin:

```nginx
upstream app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}
```

## 🔍 Troubleshooting

### Yaygın Sorunlar

1. **Port 3000 kullanımda**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Docker disk space**
   ```bash
   docker system prune -a
   ```

3. **Environment variables**
   ```bash
   docker-compose config
   ```

### Debug Mode

```bash
# Debug modunda çalıştırın
docker-compose up --build
```

## 📞 Support

Sorun yaşarsanız:

1. Logları kontrol edin: `docker-compose logs`
2. Health check yapın: `curl http://localhost/health`
3. Container durumunu kontrol edin: `docker-compose ps`

## 🎯 Production Checklist

- [ ] Environment variables ayarlandı
- [ ] SSL sertifikası yüklendi
- [ ] Domain DNS ayarlandı
- [ ] Firewall konfigürasyonu yapıldı
- [ ] Monitoring aktif edildi
- [ ] Backup stratejisi belirlendi
- [ ] Health check çalışıyor
- [ ] Performance testleri yapıldı 