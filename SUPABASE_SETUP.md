# Supabase Database Setup

Bu dosya, Social SaaS projesi için Supabase database kurulumunu açıklar.

## 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adını "social-saas" olarak belirleyin
4. Database password'ü güvenli bir şekilde oluşturun
5. Region'ı size en yakın olanı seçin
6. "Create new project" butonuna tıklayın

## 2. Environment Variables

Proje oluşturulduktan sonra, Settings > API bölümünden şu değerleri alın:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Bu değerleri `.env.local` dosyanıza ekleyin.

## 3. Database Schema Kurulumu

### Manuel Kurulum (Önerilen)

Supabase Dashboard'da SQL Editor'ü açın ve şu SQL'i çalıştırın:

```sql
-- Create carousels table
CREATE TABLE IF NOT EXISTS carousels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    image_count INTEGER NOT NULL CHECK (image_count >= 3 AND image_count <= 10),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    final_caption TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carousel_slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
    slide_number INTEGER NOT NULL CHECK (slide_number >= 1),
    image_url TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(carousel_id, slide_number)
);

-- Create todos table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carousels_user_id ON carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_status ON carousels(status);
CREATE INDEX IF NOT EXISTS idx_carousels_created_at ON carousels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_carousel_id ON carousel_slides(carousel_id);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_slide_number ON carousel_slides(slide_number);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for carousels
CREATE POLICY "Users can view their own carousels" ON carousels
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own carousels" ON carousels
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own carousels" ON carousels
    FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own carousels" ON carousels
    FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Create RLS policies for carousel_slides
CREATE POLICY "Users can view slides of their own carousels" ON carousel_slides
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND carousels.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can insert slides for their own carousels" ON carousel_slides
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND carousels.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can update slides of their own carousels" ON carousel_slides
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND carousels.user_id = auth.jwt() ->> 'sub'
        )
    );

CREATE POLICY "Users can delete slides of their own carousels" ON carousel_slides
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM carousels 
            WHERE carousels.id = carousel_slides.carousel_id 
            AND carousels.user_id = auth.jwt() ->> 'sub'
        )
    );

-- Create RLS policies for todos
CREATE POLICY "Users can view their own todos" ON todos
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert their own todos" ON todos
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own todos" ON todos
    FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own todos" ON todos
    FOR DELETE USING (user_id = auth.jwt() ->> 'sub');
```

### Supabase CLI ile Kurulum

Alternatif olarak, Supabase CLI kullanabilirsiniz:

```bash
# Supabase CLI kurulumu
npm install -g supabase

# Proje başlatma
supabase init

# Migration çalıştırma
supabase db push
```

## 4. Clerk Auth Entegrasyonu

Clerk ile Supabase'i entegre etmek için:

1. Supabase Dashboard'da Authentication > Settings'e gidin
2. "Enable JWT verification" seçeneğini aktif edin
3. Clerk JWT secret'ını ekleyin (Clerk Dashboard > JWT Templates)

## 5. Storage Bucket Oluşturma

Görseller için storage bucket oluşturun:

```sql
-- Storage bucket oluşturma
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carousel-images', 'carousel-images', true);

-- Storage policies
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
```

## 6. Test Etme

Database kurulumunu test etmek için:

1. Uygulamayı başlatın: `npm run dev`
2. Carousel oluşturma sayfasına gidin
3. Bir carousel oluşturun
4. Supabase Dashboard'da Tables bölümünden verilerin oluştuğunu kontrol edin

## 7. Troubleshooting

### RLS Hataları
- RLS policies'in doğru çalıştığından emin olun
- Clerk JWT'nin doğru yapılandırıldığını kontrol edin

### Connection Hataları
- Environment variables'ların doğru olduğunu kontrol edin
- Supabase projesinin aktif olduğundan emin olun

### Type Errors
- `src/lib/supabase.ts` dosyasındaki type definitions'ların güncel olduğunu kontrol edin
- Supabase CLI ile type generation yapabilirsiniz: `supabase gen types typescript --local > src/lib/database.types.ts` 