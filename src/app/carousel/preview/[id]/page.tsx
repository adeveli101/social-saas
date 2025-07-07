import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Header } from "@/components/shared/header"
import { CarouselPreview } from "@/components/carousel_page/carousel-preview"
import { PageContainer } from "@/components/shared/page-container"

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
    <PageContainer>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <CarouselPreview carouselId={params.id} />
      </main>
    </PageContainer>
  )
} 