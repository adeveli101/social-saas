import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Header } from "@/components/shared/header"
import { CarouselForm } from "@/components/carousel_page/carousel-form"
import { PageContainer } from "@/components/shared/page-container"

export default async function CarouselPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <PageContainer>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
              AI Instagram Carousel Creator
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Create Instagram carousel posts with AI. 
              Images and captions are automatically generated.
            </p>
          </div>
          
          <CarouselForm />
        </div>
      </main>
    </PageContainer>
  )
} 