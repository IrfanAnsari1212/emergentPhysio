import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata } from '@/lib/clinic-data'

const faqs = [
  { q: 'Which is the top physiotherapy clinic in Kushinagar?', a: 'Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy in Dudhi is widely regarded as the top physiotherapy clinic in Kushinagar district.' },
  { q: 'What conditions can I get treated in Kushinagar?', a: 'We treat back pain, knee & joint pain, sciatica, paralysis, stroke recovery, arthritis, frozen shoulder, migraine, cervical spondylosis and more — all naturally.' },
  { q: 'Do you provide home visit physiotherapy in Kushinagar?', a: 'Yes, our doctors travel across Kushinagar district for home visits for bed-ridden, elderly and post-surgery patients.' },
  { q: 'Is your clinic affordable?', a: 'Yes, we provide affordable, transparent pricing to make quality physiotherapy accessible to everyone in Kushinagar.' },
  { q: 'How can I book an appointment?', a: 'You can book online via our website, call us at 7300846971/8601125240/9161151496, or send a WhatsApp message.' },
]

export const metadata = buildMetadata({
  title: 'Best Physiotherapy Clinic in Kushinagar, UP',
  description: 'Best physiotherapy clinic in Kushinagar district. Shri Ramvidya offers expert acupressure, neuro therapy & home visits across Kushinagar. Drug-free natural healing for back pain, paralysis, sciatica & more.',
  path: '/physiotherapy-clinic-kushinagar',
  keywords: 'physiotherapy clinic Kushinagar, best physiotherapist Kushinagar, acupressure Kushinagar, neuro therapy Kushinagar, physiotherapy near me Kushinagar',
  image: IMG.clinic,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Physiotherapy in Kushinagar', path: '/physiotherapy-clinic-kushinagar' }]} />
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Trusted in Kushinagar',
        h1: 'Best Physiotherapy Clinic in Kushinagar, Uttar Pradesh',
        intro: 'Shri Ramvidya is the leading physiotherapy clinic serving Kushinagar district. With 15+ years of experience, certified doctors and modern acupressure & neuro-therapy techniques, we help patients recover naturally without medicines.',
        highlights: ['Serving entire Kushinagar district', '5000+ satisfied patients', 'Home visits available', 'Drug-free natural healing'],
        image: IMG.clinic,
        symptoms: ['Back, neck & cervical pain', 'Knee, hip & joint pain', 'Paralysis & stroke recovery', 'Sciatica & nerve pain', 'Arthritis & frozen shoulder', 'Sports injuries & post-surgery rehab'],
        benefits: ['Certified M.D.A.M. doctors', 'Modern electrotherapy equipment', 'Aayu Pharmacy on-site', 'Same-day appointments', 'Affordable for all', 'Family-friendly clinic'],
        processSteps: ['Reach Dudhi, Kushinagar', 'Initial consultation', 'Personalized plan', 'Regular therapy sessions', 'Recovery & long-term wellness'],
        faqs,
      }} />
    </>
  )
}
