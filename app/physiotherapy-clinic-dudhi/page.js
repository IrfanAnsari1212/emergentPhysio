import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata } from '@/lib/clinic-data'

const faqs = [
  { q: 'Where is the best physiotherapy clinic in Dudhi?', a: 'Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy, located Near PNB Bank, Dudhi, Kushinagar, is the most trusted clinic offering modern drug-free physiotherapy.' },
  { q: 'What treatments does the Dudhi clinic offer?', a: 'We offer back pain treatment, knee pain, sciatica, neck pain, paralysis recovery, stroke rehab, arthritis management, sports injury rehab, and home visit physiotherapy.' },
  { q: 'Is the Dudhi clinic affordable?', a: 'Yes. We provide transparent and affordable pricing with consultation fees suitable for everyone in Dudhi and surrounding villages.' },
  { q: 'Do you do home visits in Dudhi?', a: 'Yes, we provide home visit physiotherapy across Dudhi and nearby areas for bed-ridden, elderly, and post-surgery patients.' },
  { q: 'How do I reach the clinic?', a: 'We are located Near PNB Bank, Dudhi, Kushinagar. Open Mon–Sat 9 AM–8 PM. Call 7300846971 for directions.' },
]

export const metadata = buildMetadata({
  title: 'Best Physiotherapy Clinic in Dudhi, Kushinagar',
  description: 'Looking for the best physiotherapy clinic in Dudhi? Shri Ramvidya offers expert acupressure & neuro therapy for back pain, knee pain, sciatica, paralysis & more. Near PNB Bank, Dudhi.',
  path: '/physiotherapy-clinic-dudhi',
  keywords: 'physiotherapy clinic Dudhi, physiotherapy in Dudhi, best physiotherapist Dudhi, acupressure Dudhi, neuro therapy Dudhi, physiotherapy near PNB bank Dudhi',
  image: IMG.clinic,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Physiotherapy in Dudhi', path: '/physiotherapy-clinic-dudhi' }]} />
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Trusted in Dudhi',
        h1: 'Best Physiotherapy Clinic in Dudhi, Kushinagar',
        intro: 'Shri Ramvidya is the most trusted physiotherapy and acupressure clinic in Dudhi, Kushinagar. Located conveniently near PNB Bank, we have helped 5000+ patients heal naturally from chronic pain, paralysis and neurological conditions — all without medicines.',
        highlights: ['Located Near PNB Bank, Dudhi', '15+ years of experience', 'Home visits in Dudhi', 'Drug-free natural therapy'],
        image: IMG.clinic,
        symptoms: ['Chronic back & neck pain', 'Knee, joint & arthritis pain', 'Paralysis & post-stroke weakness', 'Sciatica & nerve pain', 'Frozen shoulder & cervical issues', 'Sports injuries & recovery'],
        benefits: ['Same-day appointments available', 'Treatment by certified doctors', 'Affordable for everyone', 'Home visits across Dudhi', 'No medicines, no side effects', 'Aayu Pharmacy on premises'],
        processSteps: ['Visit our clinic in Dudhi', 'Detailed consultation & diagnosis', 'Personalized therapy plan', 'Regular therapy sessions', 'Long-term recovery & maintenance'],
        faqs,
      }} />
    </>
  )
}
