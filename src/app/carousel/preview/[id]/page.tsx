import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CarouselPreview } from "@/components/carousel_page/carousel-preview"

interface CarouselPreviewPageProps {
  params: {
    id: string
  }
}

export default async function CarouselPreviewPage({ params }: CarouselPreviewPageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-blue-950/20">
      <main className="container mx-auto px-4 py-16">
        <CarouselPreview carouselId={params.id} />
      </main>
    </div>
  )
} 