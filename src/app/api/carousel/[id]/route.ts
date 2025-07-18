import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/carousel/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.id) {
      return new NextResponse('Carousel ID is required', { status: 400 })
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('carousels')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Carousel fetch error:', error)
      return NextResponse.json(
        { error: 'Carousel bilgileri alınırken bir hata oluştu' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Carousel bulunamadı' },
        { status: 404 }
      )
    }

    // Kullanıcının kendi carousel'ini görüntüleyebilmesi için kontrol
    if (data.user_id !== userId) {
      return NextResponse.json(
        { error: 'Bu carousel\'e erişim izniniz yok' },
        { status: 403 }
      )
    }

    // Carousel slides'larını getir
    const { data: slides, error: slidesError } = await supabase
      .from('carousel_slides')
      .select('*')
      .eq('carousel_id', params.id)

    if (slidesError) {
      console.error('Slides fetch error:', slidesError)
      return NextResponse.json(
        { error: 'Slides bilgileri alınırken bir hata oluştu' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...data,
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