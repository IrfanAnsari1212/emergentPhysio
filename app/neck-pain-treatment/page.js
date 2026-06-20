import { SeoLanding } from '@/components/site/service-detail'
import { BreadcrumbSchema, FAQSchema, MedicalServiceSchema } from '@/components/site/structured-data'
import { IMG, buildMetadata, getServiceBySlug } from '@/lib/clinic-data'

const service = getServiceBySlug('neck-pain')
const faqs = [
  { q: 'What causes chronic neck pain?', a: 'Common causes include cervical spondylosis, tech-neck from screen use, wrong sleeping posture, stress, and old injuries.' },
  { q: 'Can cervical spondylosis be reversed?', a: 'While the structural changes cannot be reversed, our therapy can completely eliminate the pain and restore full neck movement.' },
  { q: 'How long does neck pain treatment take?', a: 'Most patients get significant relief in 6–10 sessions. Severe cases may need 12–15 sessions.' },
  { q: 'Do you treat neck pain with headache?', a: 'Yes, we specialize in treating neck pain that causes headaches, dizziness, and arm numbness — all through targeted acupressure.' },
  { q: 'Is the treatment safe for elderly patients?', a: 'Absolutely. Our gentle techniques are completely safe for patients of all ages, including senior citizens.' },
]

export const metadata = buildMetadata({
  title: 'Neck Pain Treatment in Kushinagar | Cervical Therapy',
  description: 'Expert neck pain & cervical spondylosis treatment at Shri Ramvidya, Dudhi, Kushinagar. Natural acupressure & electro-therapy for chronic neck pain, tech-neck, headaches. Book now.',
  path: '/neck-pain-treatment',
  keywords: 'neck pain treatment Kushinagar, cervical spondylosis Dudhi, tech neck, cervical pain, neck stiffness, neck pain physiotherapy',
  image: IMG.shoulder,
})

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Neck Pain Treatment', path: '/neck-pain-treatment' }]} />
      {service && <MedicalServiceSchema service={service} />}
      <FAQSchema faqs={faqs} />
      <SeoLanding data={{
        eyebrow: 'Neck Pain & Cervical Expert',
        h1: 'Neck Pain & Cervical Treatment in Dudhi, Kushinagar',
        intro: 'Suffering from chronic neck pain, tech-neck or cervical spondylosis? Our targeted acupressure and electro-therapy provides lasting relief without medicines — even for severe cervical cases.',
        highlights: ['Cervical spondylosis specialist', 'Headache & dizziness relief', 'Tech-neck experts', 'Drug-free natural therapy'],
        image: IMG.shoulder,
        symptoms: ['Stiff neck & shoulders', 'Headaches from neck', 'Pain radiating to arms', 'Tingling in fingers', 'Reduced neck rotation', 'Dizziness & vertigo'],
        benefits: ['Released neck tension', 'Better posture', 'Reduced headaches', 'Improved sleep', 'Full mobility restored', 'No arm numbness'],
        processSteps: ['Neck assessment & X-ray review', 'Trigger point identification', 'Cervical acupressure protocol', 'Gentle stretching exercises', 'Ergonomic & posture guidance'],
        faqs,
      }} />
    </>
  )
}
