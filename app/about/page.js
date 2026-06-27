import { About, Stats, WhyUs, Doctors } from '@/components/site/sections'
import { PageHero } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'About Us | Shri Ramvidya Neurotherapy Clinic Dudhi, Kushinagar',
  description: 'Learn about Shri Ramvidya Electro Acupressure Neuro Therapy & Ayushi Pharmacy in Dudhi, Kushinagar. 15+ years of experience, 5000+ patients treated, certified M.D.A.M. Accu Therapists.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]} />
      <PageHero eyebrow="About Our Clinic" title="15+ Years of Trusted Natural Therapy in Kushinagar" subtitle="Discover the story behind Shri Ramvidya — our mission, our doctors and our commitment to drug-free healing." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'About' }]} />
      <About />
      <Stats />
      <WhyUs />
      <Doctors />
    </>
  )
}
