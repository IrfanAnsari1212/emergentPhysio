import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema, MedicalServiceSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata, getServiceBySlug } from '@/lib/clinic-data'

const service = getServiceBySlug('sciatica')
const faqs = [
  { q: 'What causes sciatica pain?', a: 'Sciatica is usually caused by compression of the sciatic nerve due to herniated disc, spinal stenosis, piriformis syndrome, or prolonged sitting.' },
  { q: 'Can sciatica be cured permanently?', a: 'Yes. Our therapy releases the nerve compression and strengthens the surrounding muscles, providing permanent relief in most cases.' },
  { q: 'How long does sciatica treatment take?', a: 'Most patients experience significant relief in 5–7 sessions. Complete recovery typically takes 10–15 sessions over 4–6 weeks.' },
  { q: 'Will I need surgery for sciatica?', a: 'In almost all cases, no. Our drug-free therapy has helped patients avoid sciatica surgery entirely.' },
  { q: 'Can pregnant women take this treatment?', a: 'Yes, our techniques are safe for pregnancy-related sciatica with modified protocols for expecting mothers.' },
]

export const metadata = buildMetadata({
  title: 'Sciatica Treatment in Kushinagar | Permanent Relief',
  description: 'Get permanent relief from sciatica pain at Shri Ramvidya, Dudhi, Kushinagar. Expert acupressure & electro-therapy for sciatic nerve compression, leg pain, numbness. No surgery needed.',
  path: '/sciatica-treatment',
  keywords: 'sciatica treatment Kushinagar, sciatica Dudhi, sciatic nerve pain, leg pain treatment, nerve compression, sciatica without surgery',
  image: IMG.back,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Sciatica Treatment', path: '/sciatica-treatment' }]} />
      {service && <MedicalServiceSchema service={service} />}
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Sciatica Expert',
        h1: 'Sciatica Treatment in Dudhi, Kushinagar',
        intro: 'Sciatica pain shooting down your leg making life unbearable? Our targeted acupressure & electro-therapy releases the sciatic nerve compression and provides permanent relief — without surgery or medicines.',
        highlights: ['Surgery-free permanent relief', 'Nerve decompression specialists', '95% success rate', 'Lasting results'],
        image: IMG.back,
        symptoms: ['Sharp pain from back to leg', 'Numbness in leg or foot', 'Tingling sensation', 'Burning pain in buttock', 'Weakness in leg', 'Difficulty sitting'],
        benefits: ['Nerve compression released', 'Walking comfort restored', 'No more leg pain', 'Surgery avoidance', 'Better sleep', 'Independent mobility'],
        processSteps: ['Sciatic nerve examination', 'Identify compression source', 'Nerve decompression therapy', 'Core strengthening', 'Postural correction & maintenance'],
        faqs,
      }} />
    </>
  )
}
