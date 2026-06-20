import { HomeVisitPage } from '@/components/site/booking'
import { buildMetadata } from '@/lib/clinic-data'

export const metadata = buildMetadata({
  title: 'Home Visit Physiotherapy in Dudhi & Kushinagar',
  description: 'Request expert physiotherapy at home in Dudhi, Kushinagar and nearby areas. Trained doctors visit your home for paralysis recovery, post-surgery rehab, elderly care.',
  path: '/home-visit',
})

export default function HomeVisit() { return <HomeVisitPage /> }
