import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Apex Physio Care | Best Physiotherapy Clinic | Dr. Rajesh Kumar',
  description: 'Apex Physio Care is a trusted physiotherapy clinic offering expert treatment for back pain, knee pain, sports injuries, stroke rehabilitation, and home visit physiotherapy. Book your appointment today.',
  keywords: 'physiotherapy clinic, back pain treatment, knee pain, sports injury, stroke rehabilitation, home visit physiotherapy, best physiotherapist',
  openGraph: {
    title: 'Apex Physio Care | Trusted Physiotherapy Clinic',
    description: 'Expert physiotherapy treatment with 15+ years of experience. Book your appointment online.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
