import { SITE_URL, SERVICES } from '@/lib/clinic-data'

export default function sitemap() {
  const now = new Date()
  const staticRoutes = [
    '', '/about', '/services', '/doctors', '/testimonials', '/contact', '/book', '/home-visit',
    '/physiotherapy-clinic-dudhi', '/physiotherapy-clinic-kushinagar',
    '/joint-pain-treatment', '/back-pain-treatment', '/neck-pain-treatment',
    '/sciatica-treatment', '/arthritis-management',
  ]
  const urls = staticRoutes.map(p => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1.0 : (p.includes('treatment') || p.includes('clinic-') ? 0.9 : 0.7),
  }))
  const serviceUrls = SERVICES.map(s => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
  return [...urls, ...serviceUrls]
}
