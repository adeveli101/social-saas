import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getCarouselById, getCarouselSlides } from '@/lib/carousel'

// GET /api/carousel/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const carousel = await getCarouselById(params.id)
    
    if (!carousel) {
      return NextResponse.json(
        { error: 'Carousel bulunamadı' },
        { status: 404 }
      )
    }

    // Kullanıcının kendi carousel'ini görüntüleyebilmesi için kontrol
    if (carousel.user_id !== userId) {
      return NextResponse.json(
        { error: 'Bu carousel\'e erişim izniniz yok' },
        { status: 403 }
      )
    }

    // Carousel slides'larını getir
    const slides = await getCarouselSlides(params.id)

    return NextResponse.json({
      ...carousel,
      slides
    })
  } catch (error) {
    console.error('Carousel fetch error:', error)
    return NextResponse.json(
      { error: 'Carousel bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 