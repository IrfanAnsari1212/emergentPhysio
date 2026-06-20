import { CLINIC, SITE_URL, SERVICES, TESTIMONIALS } from '@/lib/clinic-data'

const aggregateRating = {
  '@type': 'AggregateRating',
  ratingValue: '4.9',
  reviewCount: '520',
  bestRating: '5',
  worstRating: '1',
}

const reviews = TESTIMONIALS.slice(0, 5).map(t => ({
  '@type': 'Review',
  reviewRating: { '@type': 'Rating', ratingValue: String(t.rating), bestRating: '5' },
  author: { '@type': 'Person', name: t.name },
  reviewBody: t.text,
}))

export const LocalBusinessSchema = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'MedicalClinic', 'HealthAndBeautyBusiness'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: CLINIC.fullName,
    alternateName: CLINIC.name,
    description: 'Trusted Electro Acupressure & Neuro Therapy clinic in Dudhi, Kushinagar offering drug-free treatment for back pain, paralysis, stroke recovery, sciatica, knee and joint pain.',
    url: SITE_URL,
    telephone: CLINIC.phones.map(p => `+91${p}`),
    email: CLINIC.email,
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CLINIC.address,
      addressLocality: CLINIC.city,
      addressRegion: CLINIC.region,
      postalCode: CLINIC.postal,
      addressCountry: CLINIC.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
    hasMap: CLINIC.mapsLink,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '09:00', closes: '13:00' },
    ],
    medicalSpecialty: ['PhysicalTherapy','Acupuncture','Rehabilitation'],
    availableService: SERVICES.slice(0, 12).map(s => ({
      '@type': 'MedicalTherapy',
      name: s.title,
      description: s.short,
      url: `${SITE_URL}/services/${s.slug}`,
    })),
    aggregateRating,
    review: reviews,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export const WebsiteSchema = () => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: CLINIC.fullName,
    description: 'Electro Acupressure & Neuro Therapy clinic in Dudhi, Kushinagar.',
    publisher: { '@id': `${SITE_URL}/#localbusiness` },
    inLanguage: 'en-IN',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export const BreadcrumbSchema = ({ items }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export const MedicalServiceSchema = ({ service }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalTherapy',
    name: service.title,
    description: service.short,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { '@id': `${SITE_URL}/#localbusiness` },
    relevantSpecialty: 'PhysicalTherapy',
    indication: service.symptoms?.map(s => ({ '@type': 'MedicalIndication', name: s })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export const FAQSchema = ({ faqs }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
