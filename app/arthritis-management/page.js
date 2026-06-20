import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema, MedicalServiceSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata, getServiceBySlug } from '@/lib/clinic-data'

const service = getServiceBySlug('arthritis')
const faqs = [
  { q: 'Can arthritis be cured?', a: 'While arthritis cannot be completely cured, our therapy effectively manages the pain, reduces inflammation, and slows progression — helping you live an active life.' },
  { q: 'What types of arthritis do you treat?', a: 'We treat all major types including osteoarthritis, rheumatoid arthritis, gouty arthritis and post-traumatic arthritis.' },
  { q: 'Is the therapy safe for elderly patients?', a: 'Yes. Our gentle techniques are ideal for elderly arthritis patients. We provide home visit therapy for those with limited mobility.' },
  { q: 'How is your treatment different from medicines?', a: 'Unlike painkillers that only mask symptoms, our therapy actually reduces joint inflammation and strengthens surrounding muscles for long-term relief.' },
  { q: 'Do I need to come daily for treatment?', a: 'No, sessions are typically 3 times per week. Total treatment duration depends on severity but most patients see major improvement in 6–8 weeks.' },
]

export const metadata = buildMetadata({
  title: 'Arthritis Management in Kushinagar | Natural Care',
  description: 'Effective arthritis management at Shri Ramvidya, Dudhi, Kushinagar. Drug-free therapy for osteoarthritis, rheumatoid arthritis, joint inflammation. Reduce pain naturally. Book now.',
  path: '/arthritis-management',
  keywords: 'arthritis treatment Kushinagar, osteoarthritis Dudhi, rheumatoid arthritis, joint inflammation, arthritis management, natural arthritis care',
  image: IMG.knee,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Arthritis Management', path: '/arthritis-management' }]} />
      {service && <MedicalServiceSchema service={service} />}
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Arthritis Specialist',
        h1: 'Arthritis Management in Dudhi, Kushinagar',
        intro: 'Tired of taking painkillers for arthritis with little long-term benefit? Our natural acupressure & electro-therapy approach reduces inflammation, manages pain, and improves joint function — helping you stay active without medicines.',
        highlights: ['All arthritis types treated', 'Reduces inflammation naturally', 'No painkiller dependency', 'Home visits available'],
        image: IMG.knee,
        symptoms: ['Morning joint stiffness', 'Joint swelling & warmth', 'Reduced grip strength', 'Difficulty walking or climbing', 'Joint pain at night', 'Joint deformity'],
        benefits: ['Reduced inflammation', 'Better joint function', 'Less medicine dependency', 'Improved mobility', 'Active lifestyle restored', 'Slowed disease progression'],
        processSteps: ['Comprehensive joint assessment', 'Anti-inflammation therapy', 'Joint protection education', 'Gentle strengthening exercises', 'Long-term care plan'],
        faqs,
      }} />
    </>
  )
}
