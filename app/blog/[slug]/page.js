import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogBySlug } from '@/lib/cms'
import { BreadcrumbSchema } from '@/components/site/structured-data'
import { buildMetadata, SITE_URL, CLINIC } from '@/lib/clinic-data'
import { Badge } from '@/components/ui/badge'
import { Calendar, User as UserIcon, ChevronLeft } from 'lucide-react'
import { CTABanner } from '@/components/site/sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const b = await getBlogBySlug(slug)
  if (!b) return { title: 'Blog post not found' }
  return buildMetadata({
    title: b.seoTitle || b.title,
    description: b.seoDescription || b.excerpt || b.title,
    path: `/blog/${b.slug}`,
    image: b.featuredImage,
    keywords: (b.tags || []).join(', '),
  })
}

// Very small markdown -> html renderer (no external deps)
function mdToHtml(md) {
  if (!md) return ''
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // headings
  html = html.replace(/^### (.*)$/gm, '<h3 class="font-display text-xl font-bold mt-6 mb-2 text-slate-900">$1</h3>')
  html = html.replace(/^## (.*)$/gm, '<h2 class="font-display text-2xl font-bold mt-8 mb-3 text-slate-900">$1</h2>')
  html = html.replace(/^# (.*)$/gm, '<h1 class="font-display text-3xl font-bold mt-8 mb-4 text-slate-900">$1</h1>')
  // bold/italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank" rel="noopener">$1</a>')
  // lists
  html = html.replace(/(^|\n)((?:- .*(?:\n|$))+)/g, (_, p1, p2) => {
    const items = p2.trim().split(/\n/).map(l => l.replace(/^- /, '')).map(l => `<li>${l}</li>`).join('')
    return `${p1}<ul class="list-disc pl-5 space-y-1 my-3">${items}</ul>`
  })
  // paragraphs
  html = html.split(/\n{2,}/).map(p => /^<(h\d|ul|ol|blockquote)/.test(p.trim()) ? p : `<p class="my-3 text-slate-700 leading-relaxed">${p.replace(/\n/g, '<br/>')}</p>`).join('\n')
  return html
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const b = await getBlogBySlug(slug)
  if (!b) notFound()
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: b.title, image: b.featuredImage ? [b.featuredImage] : undefined,
    datePublished: b.publishedAt, dateModified: b.publishedAt,
    author: { '@type': 'Person', name: b.author || 'Admin' },
    publisher: { '@type': 'Organization', name: CLINIC.fullName, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${b.slug}` },
    description: b.excerpt,
  }
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: b.title, path: `/blog/${b.slug}` }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="pt-24 md:pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 mb-6"><ChevronLeft className="h-4 w-4" />All Posts</Link>
          <div className="flex items-center gap-2 mb-4">
            {b.category && <Badge className="bg-blue-50 text-blue-700 border-0">{b.category}</Badge>}
            {b.publishedAt && <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(b.publishedAt).toLocaleDateString()}</span>}
            {b.author && <span className="text-xs text-slate-500 flex items-center gap-1"><UserIcon className="h-3 w-3" />{b.author}</span>}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">{b.title}</h1>
          {b.excerpt && <p className="text-lg text-slate-600 mb-6 leading-relaxed">{b.excerpt}</p>}
          {b.featuredImage && <img src={b.featuredImage} alt={b.title} className="w-full rounded-2xl shadow-lg mb-8 max-h-[440px] object-cover" />}
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(b.content) }} />
          {b.tags?.length > 0 && <div className="mt-10 flex flex-wrap gap-2">{b.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}</div>}
        </div>
      </article>
      <CTABanner />
    </>
  )
}
