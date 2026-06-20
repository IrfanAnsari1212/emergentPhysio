import { Doctors, PageHero, CTABanner } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Our Doctors | Certified M.D.A.M. Accu Therapists',
  description: 'Meet our team of certified doctors at Shri Ramvidya — Dr. Ashwani Kumar Gupta, Dr. Chhotelal Singh, Dr. Santosh Singh. M.D.A.M. Accu Therapy qualified with years of experience.',
  path: '/doctors',
})

export default function DoctorsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Doctors', path: '/doctors' }]} />
      <PageHero eyebrow="Our Team" title="Meet the Expert Doctors at Shri Ramvidya" subtitle="Certified M.D.A.M. Accu Therapists with decades of combined experience treating patients across Kushinagar." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Doctors' }]} />
      <Doctors />
      <CTABanner />
    </>
  )
}
