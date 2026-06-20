import { SITE_URL, SERVICES } from '@/lib/clinic-data'
import { getBlogs, getCmsServices } from '@/lib/cms'

export default async function sitemap() {
  const now = new Date()
  const staticRoutes = [
    '', '/about', '/services', '/doctors', '/testimonials', '/contact', '/book', '/home-visit', '/blog', '/gallery',
    '/physiotherapy-clinic-dudhi', '/physiotherapy-clinic-kushinagar',
    '/joint-pain-treatment', '/back-pain-treatment', '/neck-pain-treatment',
    '/sciatica-treatment', '/arthritis-management',
  ]
  const urls = staticRoutes.map(p => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === '' || p === '/blog' ? 'weekly' : 'monthly',
    priority: p === '' ? 1.0 : (p.includes('treatment') || p.includes('clinic-') ? 0.9 : 0.7),
  }))
  const serviceUrls = SERVICES.map(s => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 }))
  const cms = await getCmsServices()
  const cmsUrls = cms.map(s => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 }))
  const blogs = await getBlogs()
  const blogUrls = blogs.map(b => ({ url: `${SITE_URL}/blog/${b.slug}`, lastModified: b.publishedAt ? new Date(b.publishedAt) : now, changeFrequency: 'monthly', priority: 0.7 }))
  return [...urls, ...serviceUrls, ...cmsUrls, ...blogUrls]
}
