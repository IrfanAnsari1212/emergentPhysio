import Link from 'next/link'
import { getBlogs } from '@/lib/cms'
import { PageHero, CTABanner } from '@/components/site/sections'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata } from '@/lib/clinic-data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = buildMetadata({
  title: 'Blog | Health Tips & Recovery Stories',
  description: 'Read expert articles on natural healing, acupressure therapy, recovery tips and patient stories from Shri Ramvidya clinic.',
  path: '/blog',
})

export default async function BlogPage() {
  const blogs = await getBlogs()
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]} />
      <PageHero eyebrow="Blog" title="Health Tips & Recovery Stories" subtitle="Expert articles on natural healing, therapy techniques and inspiring patient journeys." breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Blog' }]} />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {blogs.length === 0 ? (
            <div className="text-center text-slate-500 py-12">No blog posts yet. Check back soon!</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(b => (
                <Link key={b.id} href={`/blog/${b.slug}`}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group">
                    {b.featuredImage && <div className="h-48 overflow-hidden"><img src={b.featuredImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {b.category && <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0">{b.category}</Badge>}
                        {b.publishedAt && <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(b.publishedAt).toLocaleDateString()}</span>}
                      </div>
                      <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-blue-600 line-clamp-2">{b.title}</h2>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-3">{b.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
