import { Hero, Stats, About, ServicesGrid, WhyUs, Doctors, Testimonials, CTABanner, FAQ, Contact } from '@/components/site/sections'
import { FAQSchema } from '@/components/site/structured-data'
import { FAQS } from '@/lib/clinic-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Shri Ramvidya | Electro Acupressure & Neuro Therapy Clinic in Dudhi, Kushinagar',
  description: 'Trusted natural therapy clinic offering expert treatment for back pain, paralysis, stroke recovery, sciatica & joint pain in Dudhi, Kushinagar. Book online or call now.',
  path: '/',
  keywords: 'physiotherapy clinic Kushinagar, acupressure Dudhi, neuro therapy, back pain, paralysis recovery',
})

export default function HomePage() {
  return (
    <>
      <FAQSchema faqs={FAQS} />
      <Hero />
      <Stats />
      <About />
      <ServicesGrid limit={9} />
      <WhyUs />
      <Doctors />
      <Testimonials />
      <CTABanner />
      <FAQ />
      <Contact />
    </>
  )
}
