import { Contact, PageHero } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Contact Us | Visit Shri Ramvidya Clinic in Dudhi, Kushinagar',
  description: 'Contact Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy. Phone: 7300846971, 8601125240, 9161151496. Near PNB Bank, Dudhi, Kushinagar, UP.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]} />
      <PageHero eyebrow="Get in Touch" title="We're Here to Help You Heal" subtitle="Reach out for appointments, queries, or home visit bookings. Open 6 days a week." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact' }]} />
      <Contact />
    </>
  )
}
