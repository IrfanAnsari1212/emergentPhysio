import { Testimonials, PageHero, CTABanner } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Testimonials | Real Patient Success Stories',
  description: 'Read real success stories from patients of Shri Ramvidya. Back pain cured, paralysis recovered, sciatica relieved — see what our patients say about their healing journey.',
  path: '/testimonials',
})

export default function TestimonialsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Testimonials', path: '/testimonials' }]} />
      <PageHero eyebrow="Patient Stories" title="Real Results from Real Patients" subtitle="Hear directly from those who reclaimed pain-free lives at Shri Ramvidya clinic." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Testimonials' }]} />
      <Testimonials />
      <CTABanner />
    </>
  )
}
