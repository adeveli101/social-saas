import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CarouselForm } from "@/components/carousel_page/carousel-form"

export default async function CarouselPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-blue-950/20">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              AI Instagram Carousel Oluşturucu
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto">
              Yapay zeka ile Instagram carousel gönderileri oluşturun. 
              Görseller ve alt metinler otomatik olarak üretilir.
            </p>
          </div>
          
          <CarouselForm />
        </div>
      </main>
    </div>
  )
} 