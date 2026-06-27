import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'
import { Nav, Footer, FloatingActions } from '@/components/site/shell'
import { LocalBusinessSchema, WebsiteSchema } from '@/components/site/structured-data'
import { CLINIC, SITE_URL } from '@/lib/clinic-data'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CLINIC.fullName} | Dudhi, Kushinagar`,
    template: `%s | ${CLINIC.name}`,
  },
  description: 'Shri Ramvidya offers expert Electro Acupressure & Neuro Therapy in Dudhi, Kushinagar for back pain, paralysis, stroke recovery, sciatica, knee & joint pain. Drug-free, scientifically proven. Book online.',
  keywords: 'acupressure clinic Kushinagar, neuro therapy Dudhi, back pain treatment, paralysis recovery, sciatica, electro acupressure, Shri Ramvidya, Ayushi Pharmacy, physiotherapy Dudhi, physiotherapy Kushinagar',
  authors: [{ name: CLINIC.fullName }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: CLINIC.fullName,
    description: 'Trusted natural therapy clinic in Dudhi, Kushinagar. Expert care for chronic pain and neurological conditions.',
    url: SITE_URL,
    siteName: CLINIC.fullName,
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: CLINIC.fullName },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
        <LocalBusinessSchema />
        <WebsiteSchema />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
