import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy | Dudhi, Kushinagar',
  description: 'Shri Ramvidya offers expert Electro Acupressure & Neuro Therapy in Dudhi, Kushinagar for back pain, paralysis, stroke recovery, sciatica, knee & joint pain. Drug-free, scientifically proven. Book your appointment today.',
  keywords: 'acupressure clinic Kushinagar, neuro therapy Dudhi, back pain treatment, paralysis recovery, sciatica, electro acupressure, Shri Ramvidya, Aayu Pharmacy, Dr. Ashwani Kumar Gupta',
  openGraph: {
    title: 'Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy',
    description: 'Trusted natural therapy clinic in Dudhi, Kushinagar. Expert care for chronic pain and neurological conditions.',
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
