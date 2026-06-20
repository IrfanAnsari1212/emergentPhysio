import { Suspense } from 'react'
import { BookingPage } from '@/components/site/booking'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Book Appointment | Shri Ramvidya Clinic',
  description: 'Book your physiotherapy appointment online at Shri Ramvidya in Dudhi, Kushinagar. Quick 3-step booking. Confirmation via call/WhatsApp.',
  path: '/book',
})

export default function BookPage() {
  return <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}><BookingPage /></Suspense>
}
