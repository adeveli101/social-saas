import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CarouselPreview } from "@/components/carousel_page/carousel-preview"
import { PageContainer } from "@/components/shared/page-container"

interface CarouselPreviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CarouselPreviewPage({ params }: CarouselPreviewPageProps) {
  const { userId } = await auth()
  const { id } = await params
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <PageContainer>
      <main className="container mx-auto px-4 py-16">
        <CarouselPreview carouselId={id} />
      </main>
    </PageContainer>
  )
} 