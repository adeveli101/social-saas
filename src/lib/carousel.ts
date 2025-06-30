import { typedSupabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

export interface Carousel {
  id: string
  user_id: string
  prompt: string
  image_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  final_caption: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface CarouselSlide {
  id: string
  carousel_id: string
  slide_number: number
  image_url: string | null
  caption: string | null
  created_at: string
}

export async function createCarousel(carousel: Omit<Carousel, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const { data, error } = await typedSupabase
    .from('carousels')
    .insert([carousel])
    .select('id')
    .single()

  if (error) {
    throw new Error(`Carousel oluşturulamadı: ${error.message}`)
  }

  return data.id
}

export async function getCarouselById(carouselId: string): Promise<Carousel | null> {
  const { data, error } = await typedSupabase
    .from('carousels')
    .select('*')
    .eq('id', carouselId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Carousel getirilemedi: ${error.message}`)
  }

  return data
}

export async function getCarouselSlides(carouselId: string): Promise<CarouselSlide[]> {
  const { data, error } = await typedSupabase
    .from('carousel_slides')
    .select('*')
    .eq('carousel_id', carouselId)
    .order('slide_number', { ascending: true })

  if (error) {
    throw new Error(`Carousel slides getirilemedi: ${error.message}`)
  }

  return data || []
}

export async function updateCarouselStatus(
  carouselId: string, 
  status: Carousel['status'], 
  finalCaption?: string,
  errorMessage?: string
): Promise<void> {
  const updateData: any = { status }
  
  if (finalCaption !== undefined) {
    updateData.final_caption = finalCaption
  }
  
  if (errorMessage !== undefined) {
    updateData.error_message = errorMessage
  }

  const { error } = await typedSupabase
    .from('carousels')
    .update(updateData)
    .eq('id', carouselId)

  if (error) {
    throw new Error(`Carousel durumu güncellenemedi: ${error.message}`)
  }
}

export async function createCarouselSlide(slide: Omit<CarouselSlide, 'id' | 'created_at'>): Promise<string> {
  const { data, error } = await typedSupabase
    .from('carousel_slides')
    .insert([slide])
    .select('id')
    .single()

  if (error) {
    throw new Error(`Carousel slide oluşturulamadı: ${error.message}`)
  }

  return data.id
}

export async function updateCarouselSlide(
  slideId: string, 
  imageUrl?: string, 
  caption?: string
): Promise<void> {
  const updateData: any = {}
  
  if (imageUrl !== undefined) {
    updateData.image_url = imageUrl
  }
  
  if (caption !== undefined) {
    updateData.caption = caption
  }

  const { error } = await typedSupabase
    .from('carousel_slides')
    .update(updateData)
    .eq('id', slideId)

  if (error) {
    throw new Error(`Carousel slide güncellenemedi: ${error.message}`)
  }
}

// AI ile görsel ve caption üretimini başlatan fonksiyon (asenkron, fire-and-forget)
export async function triggerAIGeneration(
  carouselId: string,
  prompt: string,
  imageCount: number,
  userId: string
) {
  try {
    // Status'u processing olarak güncelle
    await updateCarouselStatus(carouselId, 'processing')

    // TODO: Burada seçilecek AI servisine göre görsel ve caption üretimi yapılacak
    // 1. AI ile image ve caption üret
    // 2. Supabase Storage'a upload et, carousel_slides tablosuna kaydet
    // 3. carousels tablosunda status ve final_caption güncelle
    // 4. Hata olursa error_message ve status 'failed' olarak güncelle
    
    console.log(`AI generation triggered for carousel ${carouselId}`)
    console.log(`Prompt: ${prompt}, Image count: ${imageCount}, User: ${userId}`)

    // Şimdilik mock data ile test ediyoruz
    await simulateAIGeneration(carouselId, imageCount, prompt)
    
  } catch (error) {
    console.error('AI generation error:', error)
    await updateCarouselStatus(carouselId, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error')
  }
}

// Mock AI generation for testing
async function simulateAIGeneration(carouselId: string, imageCount: number, prompt: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000))

  try {
    // Create slides
    for (let i = 1; i <= imageCount; i++) {
      await createCarouselSlide({
        carousel_id: carouselId,
        slide_number: i,
        image_url: `https://picsum.photos/400/400?random=${carouselId}-${i}`,
        caption: `Generated caption for slide ${i} based on: ${prompt}`
      })
    }

    // Update carousel status to completed
    const finalCaption = `🎯 ${prompt}\n\n✨ Bu carousel'de ${imageCount} farklı görsel bulunuyor!\n\n#${prompt.replace(/\s+/g, '')} #carousel #instagram #content`
    await updateCarouselStatus(carouselId, 'completed', finalCaption)

  } catch (error) {
    await updateCarouselStatus(carouselId, 'failed', undefined, 'Mock generation failed')
  }
}

// Carousel oluşturma işlemini yöneten ana fonksiyon
export async function generateCarousel(params: {
  prompt: string
  imageCount: number
  userId: string
}): Promise<string> {
  const { prompt, imageCount, userId } = params
  
  // Carousel kaydını oluştur
  const carouselId = await createCarousel({
    user_id: userId,
    prompt,
    image_count: imageCount,
    status: 'pending',
    final_caption: null,
    error_message: null
  })
  
  // AI generation'ı başlat (asenkron)
  triggerAIGeneration(carouselId, prompt, imageCount, userId)
  
  return carouselId
} 