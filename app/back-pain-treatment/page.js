import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata, getServiceBySlug } from '@/lib/clinic-data'
import { MedicalServiceSchema } from '@/components/site/structured-data'

const service = getServiceBySlug('back-pain')

const faqs = [
  { q: 'Can chronic back pain be cured without medicines?', a: 'Yes. Our acupressure & electro-therapy approach treats the root cause of back pain and provides lasting relief without any medication.' },
  { q: 'How quickly will I get relief from back pain?', a: 'Most patients feel noticeable improvement within 3–5 sessions. Complete relief usually takes 8–12 sessions.' },
  { q: 'Do you treat slip disc and herniated disc?', a: 'Yes, we successfully treat disc-related back pain with our targeted therapy protocols, often avoiding surgery.' },
  { q: 'Will I need surgery for my back pain?', a: 'In most cases, no. Our drug-free therapy has helped many patients avoid back surgery.' },
  { q: 'Is the treatment safe?', a: 'Completely safe. There are no side effects — only pressure and gentle electrical stimulation on specific points.' },
]

export const metadata = buildMetadata({
  title: 'Back Pain Treatment in Kushinagar | Natural Relief',
  description: 'Suffering from back pain? Get expert back pain treatment at Shri Ramvidya, Dudhi, Kushinagar. Drug-free acupressure & electro-therapy for chronic back pain, slip disc, lumbar pain. Book today.',
  path: '/back-pain-treatment',
  keywords: 'back pain treatment Kushinagar, lower back pain, slip disc treatment, lumbar pain Dudhi, chronic back pain, back pain physiotherapy',
  image: IMG.back,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Back Pain Treatment', path: '/back-pain-treatment' }]} />
      {service && <MedicalServiceSchema service={service} />}
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Back Pain Expert',
        h1: 'Back Pain Treatment in Dudhi, Kushinagar',
        intro: 'Years of back pain holding you back? Our acupressure and electro-therapy approach treats the root cause — not just symptoms — giving you lasting relief from chronic lower back pain, slip disc, and lumbar issues.',
        highlights: ['Treats root cause, not just symptoms', 'Surgery often avoided', 'No medicines required', 'Lasting long-term relief'],
        image: IMG.back,
        symptoms: ['Lower back stiffness & pain', 'Sharp shooting pain to legs', 'Difficulty bending or sitting', 'Muscle spasms in back', 'Slip disc / herniated disc', 'Lumbar & coccyx pain'],
        benefits: ['Pain-free movement', 'Improved posture', 'Stronger back muscles', 'No medicine dependency', 'Better sleep & quality of life', 'Surgery avoidance'],
        processSteps: ['Detailed back examination', 'Identify pain source', 'Custom therapy plan', 'Targeted acupressure & electro-therapy', 'Strengthening & maintenance'],
        faqs,
      }} />
    </>
  )
}
