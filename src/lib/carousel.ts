import { SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from './database.types'

type Supabase = SupabaseClient<Database>

export interface Carousel {
  id: string
  user_id: string
  clerk_user_id: string | null
  prompt: string
  image_count: number
  status: string // Allow any string to match database
  final_caption: string | null
  error_message: string | null
  progress_percent: number | null
  progress_message: string | null
  generation_metadata: any | null
  estimated_completion_time: string | null
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

export async function createCarousel(
  supabase: Supabase,
  carousel: Omit<Carousel, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const { data, error } = await supabase
    .from('carousels')
    .insert([carousel])
    .select('id')
    .single()

  if (error) {
    throw new Error(`Could not create carousel: ${error.message}`)
  }

  return data.id
}

export async function getCarouselById(
  supabase: Supabase, 
  carouselId: string
): Promise<Carousel | null> {
  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('id', carouselId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Could not retrieve carousel: ${error.message}`)
  }

  return data
}

export async function getCarouselSlides(
  supabase: Supabase,
  carouselId: string
): Promise<CarouselSlide[]> {
  const { data, error } = await supabase
    .from('carousel_slides')
    .select('*')
    .eq('carousel_id', carouselId)
    .order('slide_number', { ascending: true })

  if (error) {
    throw new Error(`Could not retrieve carousel slides: ${error.message}`)
  }

  return data || []
}

export async function updateCarouselStatus(
  supabase: Supabase,
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

  const { error } = await supabase
    .from('carousels')
    .update(updateData)
    .eq('id', carouselId)

  if (error) {
    throw new Error(`Could not update carousel status: ${error.message}`)
  }
}

export async function createCarouselSlide(
  supabase: Supabase,
  slide: Omit<CarouselSlide, 'id' | 'created_at'>
): Promise<string> {
  const { data, error } = await supabase
    .from('carousel_slides')
    .insert([slide])
    .select('id')
    .single()

  if (error) {
    throw new Error(`Could not create carousel slide: ${error.message}`)
  }

  return data.id
}

export async function updateCarouselSlide(
  supabase: Supabase,
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

  const { error } = await supabase
    .from('carousel_slides')
    .update(updateData)
    .eq('id', slideId)

  if (error) {
    throw new Error(`Could not update carousel slide: ${error.message}`)
  }
}

// AI ile görsel ve caption üretimini başlatan fonksiyon (asenkron, fire-and-forget)
export async function triggerAIGeneration(
  supabase: Supabase,
  carouselId: string,
  prompt: string,
  imageCount: number,
  userId: string
) {
  try {
    // Status'u processing olarak güncelle
    await updateCarouselStatus(supabase, carouselId, 'processing')

    // TODO: Burada seçilecek AI servisine göre görsel ve caption üretimi yapılacak
    // 1. AI ile image ve caption üret
    // 2. Supabase Storage'a upload et, carousel_slides tablosuna kaydet
    // 3. carousels tablosunda status ve final_caption güncelle
    // 4. Hata olursa error_message ve status 'failed' olarak güncelle
    
    console.log(`AI generation triggered for carousel ${carouselId}`)
    console.log(`Prompt: ${prompt}, Image count: ${imageCount}, User: ${userId}`)

    // Şimdilik mock data ile test ediyoruz
    await simulateAIGeneration(supabase, carouselId, imageCount, prompt)
    
  } catch (error) {
    console.error('AI generation error:', error)
    await updateCarouselStatus(supabase, carouselId, 'failed', undefined, error instanceof Error ? error.message : 'Unknown error')
  }
}

// Mock AI generation for testing
async function simulateAIGeneration(
  supabase: Supabase, 
  carouselId: string, 
  imageCount: number, 
  prompt: string
) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000))

  try {
    // Create slides
    for (let i = 1; i <= imageCount; i++) {
      await createCarouselSlide(supabase, {
        carousel_id: carouselId,
        slide_number: i,
        image_url: `https://picsum.photos/400/400?random=${carouselId}-${i}`,
        caption: `Generated caption for slide ${i} based on: ${prompt}`
      })
    }

    // Update carousel status to completed
    const finalCaption = `🎯 ${prompt}\n\n✨ This carousel features ${imageCount} different visuals!\n\n#${prompt.replace(/\s+/g, '')} #socialmedia #contentcreation #digitalmarketing`;
    await updateCarouselStatus(supabase, carouselId, 'completed', finalCaption)

  } catch (error) {
    await updateCarouselStatus(supabase, carouselId, 'failed', undefined, 'Mock generation failed')
  }
}

// Carousel oluşturma işlemini yöneten ana fonksiyon
export async function generateCarousel(params: {
  supabase: Supabase
  prompt: string
  imageCount: number
  userId: string
}): Promise<string> {
  const { supabase, prompt, imageCount, userId } = params
  
  // Carousel kaydını oluştur
  const carouselId = await createCarousel(supabase, {
    user_id: userId,
    clerk_user_id: userId,
    prompt,
    image_count: imageCount,
    status: 'pending',
    final_caption: null,
    error_message: null,
    progress_percent: null,
    progress_message: null,
    generation_metadata: null,
    estimated_completion_time: null
  })
  
  // AI generation'ı başlat (asenkron)
  triggerAIGeneration(supabase, carouselId, prompt, imageCount, userId)
  
  return carouselId
} 