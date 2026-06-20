import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata } from '@/lib/clinic-data'

const faqs = [
  { q: 'What is the best treatment for joint pain?', a: 'A combination of acupressure, electro-therapy and targeted exercises gives the best long-term relief from joint pain without medicines.' },
  { q: 'Can joint pain be cured without surgery?', a: 'Yes, in most cases. Our drug-free therapy has helped patients avoid joint surgery and recover full mobility.' },
  { q: 'How long does joint pain treatment take?', a: 'Most patients see significant relief in 8–12 sessions over 3–5 weeks, depending on severity.' },
  { q: 'Do you treat knee, shoulder and hip pain?', a: 'Yes, we treat all major joint pain — knee, shoulder, hip, wrist, ankle, elbow and finger joints.' },
  { q: 'Is the therapy painful?', a: 'No. Acupressure and electro-therapy are completely painless. You may feel only gentle pressure or mild tingling.' },
]

export const metadata = buildMetadata({
  title: 'Joint Pain Treatment in Kushinagar | Natural Therapy',
  description: 'Expert joint pain treatment at Shri Ramvidya, Dudhi, Kushinagar. Drug-free acupressure & electro-therapy for knee, shoulder, hip, arthritis & joint stiffness. Book today.',
  path: '/joint-pain-treatment',
  keywords: 'joint pain treatment, joint pain Kushinagar, knee shoulder hip pain, arthritis treatment, joint stiffness, natural joint pain relief',
  image: IMG.knee,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Joint Pain Treatment', path: '/joint-pain-treatment' }]} />
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Joint Pain Expert',
        h1: 'Joint Pain Treatment in Dudhi, Kushinagar',
        intro: 'Living with chronic joint pain? Our drug-free acupressure and electro-therapy at Shri Ramvidya has helped thousands recover from knee, shoulder, hip and other joint pains — without surgery or medication.',
        highlights: ['All joint pains treated', 'Surgery avoidance specialists', 'No medicines, no side effects', 'Long-term relief'],
        image: IMG.knee,
        symptoms: ['Knee pain & swelling', 'Shoulder stiffness & frozen shoulder', 'Hip pain & limited movement', 'Wrist, ankle & elbow pain', 'Morning joint stiffness', 'Clicking or grinding sounds'],
        benefits: ['Pain-free movement', 'Stronger muscles around joints', 'Better mobility & flexibility', 'Surgery often avoided', 'No drug dependency', 'Lasting results'],
        processSteps: ['Joint examination & diagnosis', 'Inflammation reduction therapy', 'Acupressure on specific points', 'Strengthening exercises', 'Lifestyle & posture guidance'],
        faqs,
      }} />
    </>
  )
}
