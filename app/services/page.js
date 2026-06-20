import { ServicesGrid, PageHero, CTABanner } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Services | 18+ Specialized Therapy Treatments',
  description: 'Explore our specialized treatments: back pain, neck pain, sciatica, knee pain, paralysis recovery, stroke rehab, arthritis, sports injury and more. All drug-free at Shri Ramvidya Kushinagar.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]} />
      <PageHero eyebrow="Our Services" title="Specialized Therapies for Every Condition" subtitle="From acute pain to neurological recovery — drug-free treatments backed by science and decades of experience." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Services' }]} />
      <ServicesGrid />
      <CTABanner />
    </>
  )
}
