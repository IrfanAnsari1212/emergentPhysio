import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/site/service-detail'
import { BreadcrumbSchema, MedicalServiceSchema } from '@/components/site/structured-data'
import { SERVICES, getServiceBySlug, buildMetadata } from '@/lib/clinic-data'

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const s = getServiceBySlug(slug)
  if (!s) return { title: 'Service not found' }
  return buildMetadata({
    title: `${s.title} in Dudhi, Kushinagar`,
    description: `${s.short} Drug-free, scientifically proven treatment at Shri Ramvidya clinic. Book your appointment today.`,
    path: `/services/${s.slug}`,
    keywords: `${s.title}, ${s.title} Kushinagar, ${s.title} Dudhi, acupressure ${s.title}, natural treatment`,
    image: s.image,
  })
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }]} />
      <MedicalServiceSchema service={service} />
      <ServiceDetail slug={service.slug} />
    </>
  )
}
