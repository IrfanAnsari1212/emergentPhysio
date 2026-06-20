import { getGallery } from '@/lib/cms'
import { PageHero, CTABanner } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'
import GalleryGrid from '@/components/site/gallery-grid'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Gallery | Clinic Photos & Recovery Stories',
  description: 'View photos of Shri Ramvidya clinic, equipment, treatment sessions and patient recovery stories.',
  path: '/gallery',
})

export default async function GalleryPage() {
  const images = await getGallery()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }]} />
      <PageHero eyebrow="Photo Gallery" title="Inside Our Clinic" subtitle="Modern facilities, dedicated team and life-changing recovery moments." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Gallery' }]} />
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <GalleryGrid images={images} />
        </div>
      </section>
      <CTABanner />
    </>
  )
}
