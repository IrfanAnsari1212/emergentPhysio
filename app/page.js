'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Phone, MessageCircle, MapPin, Mail, Clock, Calendar as CalendarIcon, ChevronRight,
  Activity, Heart, Stethoscope, Brain, Bone, Baby, Users, Home as HomeIcon, Zap,
  Award, ShieldCheck, Sparkles, Star, ArrowRight, Menu, X, CheckCircle2, Quote,
  GraduationCap, Trophy, Smile, Hand, Footprints, Pill, Dumbbell, Waves,
  LogOut, LayoutDashboard, ClipboardList, MessageSquare, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

// ---------- CLINIC CONFIG ----------
const CLINIC = {
  name: 'Apex Physio Care',
  tagline: 'Move Better. Live Pain-Free.',
  doctor: 'Dr. Rajesh Kumar',
  doctorTitle: 'BPT, MPT (Ortho), Certified Manual Therapist',
  experience: '15+',
  phone: '+91 98765 43210',
  phoneRaw: '919876543210',
  whatsapp: '919876543210',
  email: 'care@apexphysio.in',
  address: 'Plot 24, Main Road, Near City Hospital, Civil Lines',
  city: 'Indore, Madhya Pradesh 452001',
  timings: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 1:00 PM',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233.42!2d75.857!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2sIndore!5e0!3m2!1sen!2sin!4v1700000000000',
}

// ---------- IMAGES ----------
const IMG = {
  hero: 'https://images.pexels.com/photos/20860622/pexels-photo-20860622.jpeg',
  doctor: 'https://images.unsplash.com/photo-1659355894058-c02512c16533',
  clinic: 'https://images.unsplash.com/photo-1717500250573-a76fce75ffb3',
  back: 'https://images.pexels.com/photos/5794053/pexels-photo-5794053.jpeg',
  knee: 'https://images.pexels.com/photos/11716938/pexels-photo-11716938.jpeg',
  elderly: 'https://images.unsplash.com/photo-1581090122319-8fab9528eaaa',
  sports: 'https://images.pexels.com/photos/6111585/pexels-photo-6111585.jpeg',
  shoulder: 'https://images.pexels.com/photos/5888099/pexels-photo-5888099.jpeg',
}

// ---------- SERVICES DATA ----------
const SERVICES = [
  { id: 'back', title: 'Back Pain Treatment', icon: Bone, image: IMG.back, short: 'Relief from chronic and acute back pain through targeted therapy.',
    symptoms: ['Lower back stiffness', 'Sharp shooting pain', 'Muscle spasms', 'Difficulty bending'],
    benefits: ['Long-term pain relief', 'Improved posture', 'Restored mobility', 'No medication dependency'] },
  { id: 'neck', title: 'Neck Pain Treatment', icon: Activity, image: IMG.shoulder, short: 'Resolve neck pain, cervical issues and tech-neck syndrome.',
    symptoms: ['Stiff neck', 'Headaches', 'Pain radiating to arms', 'Tingling sensation'],
    benefits: ['Released tension', 'Better posture', 'Reduced headaches', 'Improved sleep'] },
  { id: 'knee', title: 'Knee Pain Treatment', icon: Footprints, image: IMG.knee, short: 'Restore knee function for sports, work and daily life.',
    symptoms: ['Pain on stairs', 'Knee swelling', 'Clicking sound', 'Instability'],
    benefits: ['Pain-free walking', 'Stronger muscles', 'Surgery avoidance', 'Better mobility'] },
  { id: 'shoulder', title: 'Shoulder Pain Treatment', icon: Hand, image: IMG.shoulder, short: 'Frozen shoulder, rotator cuff and impingement specialists.',
    symptoms: ['Limited movement', 'Night pain', 'Weakness', 'Difficulty lifting'],
    benefits: ['Full range of motion', 'Strength recovery', 'Pain elimination', 'Return to activities'] },
  { id: 'arthritis', title: 'Arthritis Management', icon: Pill, image: IMG.knee, short: 'Manage joint pain and slow progression of arthritis.',
    symptoms: ['Joint stiffness', 'Morning pain', 'Swelling', 'Reduced grip'],
    benefits: ['Less inflammation', 'Better function', 'Slower progression', 'Active lifestyle'] },
  { id: 'sports', title: 'Sports Injury Rehab', icon: Dumbbell, image: IMG.sports, short: 'Athlete-grade rehabilitation to get you back in the game.',
    symptoms: ['Acute injury', 'Reduced performance', 'Joint instability', 'Recurring pain'],
    benefits: ['Faster recovery', 'Injury prevention', 'Peak performance', 'Stronger comeback'] },
  { id: 'stroke', title: 'Stroke Rehabilitation', icon: Brain, image: IMG.elderly, short: 'Neurological rehab to regain movement and independence.',
    symptoms: ['Weakness one side', 'Speech issues', 'Balance loss', 'Coordination problems'],
    benefits: ['Restored mobility', 'Independence', 'Better balance', 'Quality of life'] },
  { id: 'paralysis', title: 'Paralysis Rehabilitation', icon: Heart, image: IMG.elderly, short: 'Progressive neuro-rehab for paralysis recovery.',
    symptoms: ['Loss of movement', 'Muscle wasting', 'Spasticity', 'Sensory loss'],
    benefits: ['Movement recovery', 'Muscle tone', 'Daily function', 'Hope and progress'] },
  { id: 'post-surgery', title: 'Post Surgery Rehab', icon: ShieldCheck, image: IMG.clinic, short: 'Safe and faster recovery after orthopedic surgeries.',
    symptoms: ['Post-op stiffness', 'Weakness', 'Limited movement', 'Swelling'],
    benefits: ['Faster healing', 'Full mobility', 'Strength return', 'Confidence back'] },
  { id: 'sciatica', title: 'Sciatica Treatment', icon: Zap, image: IMG.back, short: 'Targeted treatment to release sciatic nerve compression.',
    symptoms: ['Leg pain', 'Numbness', 'Tingling', 'Burning sensation'],
    benefits: ['Nerve relief', 'Walking comfort', 'No surgery needed', 'Long-term relief'] },
  { id: 'cervical', title: 'Cervical Spondylosis', icon: Stethoscope, image: IMG.shoulder, short: 'Manage degenerative changes with proven techniques.',
    symptoms: ['Neck stiffness', 'Headache', 'Arm pain', 'Dizziness'],
    benefits: ['Reduced pain', 'Better movement', 'Headache relief', 'Restored function'] },
  { id: 'pediatric', title: 'Pediatric Physiotherapy', icon: Baby, image: IMG.clinic, short: 'Gentle therapy for children with developmental needs.',
    symptoms: ['Delayed milestones', 'Poor posture', 'Coordination issues', 'Weakness'],
    benefits: ['Better development', 'Strength', 'Confidence', 'Independence'] },
  { id: 'geriatric', title: 'Geriatric Physiotherapy', icon: Users, image: IMG.elderly, short: 'Compassionate care for elderly patients.',
    symptoms: ['Balance issues', 'Joint pain', 'Weakness', 'Fall risk'],
    benefits: ['Fall prevention', 'Independence', 'Pain management', 'Quality of life'] },
  { id: 'home-visit', title: 'Home Visit Physiotherapy', icon: HomeIcon, image: IMG.elderly, short: 'Expert care delivered to your doorstep.',
    symptoms: ['Limited mobility', 'Bed-ridden', 'Post-surgery', 'Elderly care'],
    benefits: ['No travel stress', 'Family present', 'Comfortable setting', 'Same quality care'] },
  { id: 'manual', title: 'Manual Therapy', icon: Hand, image: IMG.back, short: 'Hands-on techniques to release tissue restrictions.',
    symptoms: ['Tight muscles', 'Joint stiffness', 'Chronic pain', 'Reduced motion'],
    benefits: ['Instant relief', 'Better mobility', 'Drug-free', 'Lasting results'] },
  { id: 'exercise', title: 'Exercise Therapy', icon: Dumbbell, image: IMG.sports, short: 'Personalized exercise programs for healing and prevention.',
    symptoms: ['Weakness', 'Imbalance', 'Poor endurance', 'Stiffness'],
    benefits: ['Strength building', 'Lifelong health', 'Prevention', 'Confidence'] },
  { id: 'electro', title: 'Electrotherapy', icon: Zap, image: IMG.clinic, short: 'Modern electrotherapy modalities for pain and healing.',
    symptoms: ['Acute pain', 'Inflammation', 'Muscle spasm', 'Slow healing'],
    benefits: ['Pain relief', 'Faster healing', 'Reduced inflammation', 'Non-invasive'] },
  { id: 'dry-needling', title: 'Dry Needling', icon: Waves, image: IMG.back, short: 'Trigger point release for stubborn muscle knots.',
    symptoms: ['Muscle knots', 'Referred pain', 'Tightness', 'Chronic spasm'],
    benefits: ['Instant release', 'Lasting relief', 'Better function', 'Quick results'] },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', rating: 5, text: "After 2 months of unbearable back pain, Dr. Rajesh's treatment changed my life. Pain-free in just 4 weeks!", role: 'Schoolteacher' },
  { name: 'Amit Verma', rating: 5, text: 'Best physiotherapist in the city. My frozen shoulder is completely cured. Highly professional team.', role: 'Businessman' },
  { name: 'Sunita Devi', rating: 5, text: 'They came home for my mother who had a stroke. Within 3 months she started walking again. Truly blessed!', role: 'Daughter' },
  { name: 'Rahul Mehta', rating: 5, text: 'Cricket injury recovery in just 6 weeks. Now I am back on the field stronger than before!', role: 'Cricket Player' },
  { name: 'Anjali Patil', rating: 5, text: "Sciatica was destroying my life. Dr. Rajesh's treatment is magical. No more pain after years!", role: 'Homemaker' },
  { name: 'Vikram Singh', rating: 5, text: 'Post-surgery knee recovery was smooth. Got my normal walking back faster than expected.', role: 'Engineer' },
]

const FAQS = [
  { q: 'How many sessions will I need?', a: 'Most patients see significant improvement in 6–10 sessions. We provide a personalized treatment plan after your first consultation.' },
  { q: 'Do you offer home visit physiotherapy?', a: 'Yes! We provide expert home visit physiotherapy across the city. Book online or call us directly.' },
  { q: 'Is physiotherapy painful?', a: 'No. Our treatments are designed to be comfortable. You may feel mild soreness initially, similar to a workout.' },
  { q: 'Do I need a doctor referral?', a: 'No referral required. You can walk in or book an appointment online directly.' },
  { q: 'What are your charges?', a: 'Consultation is affordable and treatment cost depends on your condition. We offer transparent pricing with no hidden fees.' },
  { q: 'Do you treat sports injuries?', a: 'Absolutely. We specialize in sports rehab with cricketers, athletes, and gym-goers among our regular patients.' },
]

const TIME_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM']

// ---------- HELPERS ----------
const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6, ease: 'easeOut' } }
const stagger = { initial: {}, whileInView: { transition: { staggerChildren: 0.08 } }, viewport: { once: true } }

const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`w-full py-16 md:py-24 ${className}`}>
    <div className="container mx-auto px-4 max-w-7xl">{children}</div>
  </section>
)

const SectionTitle = ({ eyebrow, title, subtitle, center = true }) => (
  <motion.div {...fadeUp} className={`mb-12 ${center ? 'text-center' : ''}`}>
    {eyebrow && <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">{eyebrow}</Badge>}
    <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-600 text-lg md:max-w-2xl md:mx-auto leading-relaxed">{subtitle}</p>}
  </motion.div>
)

// ---------- FLOATING BUTTONS ----------
const FloatingActions = () => (
  <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 flex flex-col gap-3">
    <a href={`https://wa.me/${CLINIC.whatsapp}?text=Hi%20I%20want%20to%20book%20a%20physiotherapy%20appointment`} target="_blank" rel="noopener noreferrer"
       className="group flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl pulse-ring transition-all hover:scale-105">
      <div className="p-3"><MessageCircle className="h-6 w-6" /></div>
      <span className="hidden md:inline pr-4 font-medium">WhatsApp</span>
    </a>
    <a href={`tel:${CLINIC.phoneRaw}`}
       className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all hover:scale-105">
      <div className="p-3"><Phone className="h-6 w-6" /></div>
      <span className="hidden md:inline pr-4 font-medium">Call Now</span>
    </a>
  </div>
)

// ---------- NAV ----------
const Nav = ({ onNav, currentView }) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const links = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about' },
    { label: 'Services', section: 'services' },
    { label: 'Doctor', section: 'doctor' },
    { label: 'Testimonials', section: 'testimonials' },
    { label: 'Contact', section: 'contact' },
  ]
  const go = (s) => {
    setOpen(false)
    if (currentView !== 'home') { onNav('home'); setTimeout(() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' }), 100) }
    else document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/70 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16 md:h-20">
        <button onClick={() => onNav('home')} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-display font-bold text-slate-900 leading-none">{CLINIC.name}</div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5">Physiotherapy Clinic</div>
          </div>
        </button>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <button key={l.section} onClick={() => go(l.section)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">{l.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={() => onNav('book')} className="hidden md:flex bg-blue-600 hover:bg-blue-700 rounded-full">
            <CalendarIcon className="h-4 w-4 mr-2" />Book Appointment
          </Button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-slate-100">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => <button key={l.section} onClick={() => go(l.section)} className="text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-slate-700 font-medium">{l.label}</button>)}
              <Button onClick={() => { setOpen(false); onNav('book') }} className="mt-2 bg-blue-600 hover:bg-blue-700 rounded-full">Book Appointment</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ---------- HERO ----------
const Hero = ({ onBook, onVisit }) => (
  <section id="home" className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-50" />
    <div className="absolute inset-0 bg-radial-fade" />
    <div className="container mx-auto px-4 max-w-7xl relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-5 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />Trusted by 5000+ patients
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
            {CLINIC.tagline.split('.').map((t, i) => i === 1 ? <span key={i} className="text-gradient">{t}.</span> : t + (i === 0 ? '. ' : ''))}
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
            Expert physiotherapy treatment for back pain, knee pain, sports injuries, stroke rehabilitation and more.
            Led by <span className="font-semibold text-slate-800">{CLINIC.doctor}</span> with {CLINIC.experience} years of experience.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={onBook} className="bg-blue-600 hover:bg-blue-700 rounded-full text-base h-12 px-7 shadow-lg shadow-blue-600/20">
              <CalendarIcon className="h-5 w-5 mr-2" />Book Appointment
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={onVisit} className="rounded-full text-base h-12 px-7 border-slate-300">
              <HomeIcon className="h-5 w-5 mr-2" />Home Visit
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-slate-700">No medication</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-slate-700">Result-oriented</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-slate-700">Affordable care</span></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 aspect-[4/5] md:aspect-[4/4]">
            <img src={IMG.hero} alt="Physiotherapy treatment" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent" />
          </div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"><Smile className="h-6 w-6 text-green-600" /></div>
              <div><div className="text-2xl font-bold text-slate-900">98%</div><div className="text-xs text-slate-500">Success Rate</div></div>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"><Award className="h-6 w-6 text-blue-600" /></div>
              <div><div className="text-2xl font-bold text-slate-900">{CLINIC.experience}</div><div className="text-xs text-slate-500">Years Experience</div></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
)

// ---------- STATS ----------
const Stats = () => {
  const items = [
    { n: '5000+', l: 'Happy Patients', icon: Smile },
    { n: '15+', l: 'Years Experience', icon: Award },
    { n: '18+', l: 'Specializations', icon: ShieldCheck },
    { n: '98%', l: 'Success Rate', icon: Trophy },
  ]
  return (
    <Section className="bg-gradient-to-br from-blue-600 to-cyan-600 !py-12 md:!py-16">
      <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="text-center text-white">
            <s.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <div className="font-display text-3xl md:text-5xl font-bold">{s.n}</div>
            <div className="text-blue-100 text-sm md:text-base mt-1">{s.l}</div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// ---------- ABOUT ----------
const About = () => (
  <Section id="about">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div {...fadeUp} className="relative">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img src={IMG.clinic} alt="Modern physiotherapy clinic" className="w-full h-[480px] object-cover" />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 hidden sm:block">
          <div className="text-blue-600 font-bold text-3xl font-display">{CLINIC.experience}</div>
          <div className="text-slate-600 text-sm">Years of Trusted Care</div>
        </div>
      </motion.div>
      <motion.div {...fadeUp}>
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-4">About Our Clinic</Badge>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
          A Modern Clinic Built on Trust, Care & Real Results
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          {CLINIC.name} is a premier physiotherapy clinic in {CLINIC.city.split(',')[0]} dedicated to helping you move better and live pain-free.
          Our state-of-the-art facility combines modern equipment with proven manual techniques delivered by experienced physiotherapists.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          From chronic pain to sports injury and post-surgery rehabilitation — we have helped 5000+ patients reclaim their lives.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: ShieldCheck, t: 'Certified Experts', d: 'Government registered' },
            { icon: Heart, t: 'Personalized Care', d: 'Custom treatment plans' },
            { icon: Sparkles, t: 'Modern Equipment', d: 'Latest technology' },
            { icon: Award, t: 'Proven Results', d: '98% success rate' },
          ].map((b, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center"><b.icon className="h-5 w-5 text-blue-600" /></div>
              <div><div className="font-semibold text-slate-900 text-sm">{b.t}</div><div className="text-slate-500 text-xs">{b.d}</div></div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </Section>
)

// ---------- SERVICES ----------
const Services = ({ onBook }) => {
  const [active, setActive] = useState(null)
  return (
    <Section id="services" className="bg-slate-50">
      <SectionTitle eyebrow="Our Services" title="Specialized Treatments for Every Condition" subtitle="From acute pain to complex rehabilitation — comprehensive physiotherapy services tailored to your needs." />
      <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s) => (
          <motion.div key={s.id} variants={fadeUp}>
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full cursor-pointer overflow-hidden" onClick={() => setActive(s)}>
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent" />
                <div className="absolute bottom-3 left-3 h-10 w-10 rounded-lg bg-white/95 backdrop-blur flex items-center justify-center shadow">
                  <s.icon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.short}</p>
                <div className="flex items-center text-sm font-medium text-blue-600">Learn more <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" /></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {active && (
            <>
              <div className="h-48 -mx-6 -mt-6 mb-2 overflow-hidden">
                <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
              </div>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center"><active.icon className="h-5 w-5 text-blue-600" /></div>
                  {active.title}
                </DialogTitle>
                <DialogDescription className="text-base text-slate-600">{active.short}</DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2"><Activity className="h-4 w-4" />Common Symptoms</h4>
                  <ul className="space-y-1.5">
                    {active.symptoms.map((s, i) => <li key={i} className="text-sm text-red-800 flex items-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />{s}</li>)}
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Treatment Benefits</h4>
                  <ul className="space-y-1.5">
                    {active.benefits.map((s, i) => <li key={i} className="text-sm text-green-800 flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />{s}</li>)}
                  </ul>
                </div>
              </div>
              <Button onClick={() => { setActive(null); onBook(active.title) }} className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full">
                <CalendarIcon className="h-4 w-4 mr-2" />Book This Treatment
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  )
}

// ---------- WHY US ----------
const WhyUs = () => {
  const items = [
    { icon: GraduationCap, t: 'Highly Qualified', d: 'MPT specialist with international certifications' },
    { icon: Hand, t: 'Hands-on Treatment', d: 'Manual therapy by experienced therapists, not assistants' },
    { icon: ShieldCheck, t: 'Evidence-Based', d: 'Only proven techniques backed by research' },
    { icon: Heart, t: 'Personalized Care', d: 'Treatment plan customized to your condition' },
    { icon: HomeIcon, t: 'Home Visits', d: 'Expert care delivered to your doorstep' },
    { icon: Award, t: 'Long-term Results', d: 'Focus on permanent recovery, not temporary relief' },
  ]
  return (
    <Section>
      <SectionTitle eyebrow="Why Choose Us" title="The Apex Difference" subtitle="What makes us the most trusted physiotherapy clinic in the region." />
      <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Card className="border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all h-full">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                  <it.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{it.t}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{it.d}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}

// ---------- DOCTOR ----------
const Doctor = () => (
  <Section id="doctor" className="bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div {...fadeUp} className="relative max-w-md mx-auto lg:mx-0">
        <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
          <img src={IMG.doctor} alt={CLINIC.doctor} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-5 py-3 border border-slate-100 whitespace-nowrap">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
            4.9 (520+ reviews)
          </div>
        </div>
      </motion.div>
      <motion.div {...fadeUp}>
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-4">Meet Your Doctor</Badge>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-2">{CLINIC.doctor}</h2>
        <p className="text-blue-600 font-medium mb-5">{CLINIC.doctorTitle}</p>
        <p className="text-slate-600 leading-relaxed mb-6">
          With {CLINIC.experience} years of experience treating thousands of patients, {CLINIC.doctor} is recognized as one of the
          leading physiotherapists in the region. His patient-first approach combined with advanced manual therapy techniques has
          helped people return to active, pain-free lives.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { l: 'Patients Treated', v: '5000+' },
            { l: 'Years of Experience', v: CLINIC.experience },
            { l: 'Specializations', v: '18+' },
            { l: 'Success Rate', v: '98%' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100">
              <div className="font-display text-2xl font-bold text-blue-600">{s.v}</div>
              <div className="text-slate-600 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['Manual Therapy Certified', 'Sports Injury Specialist', 'Neuro-Rehab Expert', 'IASTM Certified'].map(b => (
            <Badge key={b} variant="outline" className="bg-white border-slate-200 text-slate-700 px-3 py-1">{b}</Badge>
          ))}
        </div>
      </motion.div>
    </div>
  </Section>
)

// ---------- TESTIMONIALS ----------
const Testimonials = () => (
  <Section id="testimonials">
    <SectionTitle eyebrow="Patient Stories" title="Real Results, Real People" subtitle="Hear directly from patients who reclaimed their lives with our care." />
    <motion.div {...stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {TESTIMONIALS.map((t, i) => (
        <motion.div key={i} variants={fadeUp}>
          <Card className="h-full border-slate-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <Quote className="h-7 w-7 text-blue-200 mb-3" />
              <div className="flex mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-slate-700 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-semibold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  </Section>
)

// ---------- FAQ ----------
const FAQ = () => (
  <Section id="faq" className="bg-slate-50">
    <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Got questions? We've got answers." />
    <motion.div {...fadeUp} className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl border border-slate-200 px-5">
            <AccordionTrigger className="hover:no-underline text-left font-medium text-slate-900 py-4">{f.q}</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed pb-4">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  </Section>
)

// ---------- CONTACT ----------
const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { toast.success('Message sent! We will contact you soon.'); setForm({ name: '', phone: '', email: '', message: '' }) }
      else toast.error(j.error || 'Failed to send')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  return (
    <Section id="contact">
      <SectionTitle eyebrow="Get in Touch" title="We're Here to Help" subtitle="Reach out for appointments, queries or home visit bookings." />
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div {...fadeUp} className="space-y-4">
          {[
            { icon: MapPin, t: 'Visit Our Clinic', d: `${CLINIC.address}, ${CLINIC.city}` },
            { icon: Phone, t: 'Call Us', d: CLINIC.phone, href: `tel:${CLINIC.phoneRaw}` },
            { icon: MessageCircle, t: 'WhatsApp', d: 'Chat with us instantly', href: `https://wa.me/${CLINIC.whatsapp}` },
            { icon: Mail, t: 'Email', d: CLINIC.email, href: `mailto:${CLINIC.email}` },
            { icon: Clock, t: 'Working Hours', d: CLINIC.timings },
          ].map((c, i) => (
            <a key={i} href={c.href} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center"><c.icon className="h-5 w-5 text-blue-600" /></div>
              <div><div className="font-semibold text-slate-900">{c.t}</div><div className="text-slate-600 text-sm mt-1">{c.d}</div></div>
            </a>
          ))}
          <div className="rounded-2xl overflow-hidden border border-slate-200 h-64">
            <iframe src={CLINIC.mapsEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </motion.div>
        <motion.div {...fadeUp}>
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="font-display">Send us a Message</CardTitle>
              <CardDescription>We typically respond within 1 hour during business hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div><Label htmlFor="name">Full Name *</Label><Input id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="phone">Phone *</Label><Input id="phone" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" /></div>
                </div>
                <div><Label htmlFor="msg">Message *</Label><Textarea id="msg" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your condition or query..." /></div>
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  )
}

// ---------- CTA BANNER ----------
const CTABanner = ({ onBook, onVisit }) => (
  <Section className="!py-12">
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl shadow-blue-900/30">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Start Your Recovery Today</h2>
          <p className="text-blue-100 leading-relaxed">Book your appointment online or request a home visit. Get expert care in minutes.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
          <Button size="lg" onClick={onBook} className="bg-white text-blue-700 hover:bg-blue-50 rounded-full text-base h-12 px-7">
            <CalendarIcon className="h-5 w-5 mr-2" />Book Appointment
          </Button>
          <Button size="lg" variant="outline" onClick={onVisit} className="border-white/40 text-white hover:bg-white/10 hover:text-white rounded-full text-base h-12 px-7 bg-white/10">
            <HomeIcon className="h-5 w-5 mr-2" />Home Visit
          </Button>
        </div>
      </div>
    </div>
  </Section>
)

// ---------- FOOTER ----------
const Footer = ({ onNav }) => (
  <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="grid md:grid-cols-4 gap-8 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Activity className="h-5 w-5 text-white" /></div>
            <div className="font-display text-white font-bold">{CLINIC.name}</div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{CLINIC.tagline}<br />Trusted physiotherapy clinic in {CLINIC.city.split(',')[0]}.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Home', 'About', 'Services', 'Doctor', 'Contact'].map(l => (
              <li key={l}><button onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Top Services</h4>
          <ul className="space-y-2 text-sm">
            {SERVICES.slice(0, 5).map(s => <li key={s.id}><span className="hover:text-white transition-colors">{s.title}</span></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" /><span>{CLINIC.address}, {CLINIC.city}</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-400" />{CLINIC.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-400" />{CLINIC.email}</li>
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
        <div>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</div>
        <button onClick={() => onNav('admin')} className="hover:text-white transition-colors text-xs opacity-50 hover:opacity-100">Admin</button>
      </div>
    </div>
  </footer>
)

// ---------- BOOKING PAGE ----------
const BookingPage = ({ onNav, prefillService }) => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    service: prefillService || '', date: '', time: '', patientName: '', phone: '', email: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  useEffect(() => { if (prefillService) setForm(f => ({ ...f, service: prefillService })) }, [prefillService])

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const next = () => {
    if (step === 1 && !form.service) return toast.error('Please select a service')
    if (step === 2 && (!form.date || !form.time)) return toast.error('Please select date & time')
    setStep(step + 1)
  }
  const submit = async () => {
    if (!form.patientName || !form.phone) return toast.error('Please fill name and phone')
    setLoading(true)
    try {
      const r = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { setConfirmed(j.appointment); toast.success('Appointment booked successfully!') }
      else toast.error(j.error || 'Failed to book')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }

  if (confirmed) {
    const waMsg = encodeURIComponent(`Hi, I just booked an appointment.\nName: ${confirmed.patientName}\nService: ${confirmed.service}\nDate: ${confirmed.date} ${confirmed.time}\nID: ${confirmed.id.slice(0, 8)}`)
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">Appointment Confirmed!</h1>
            <p className="text-slate-600 mb-6">We've received your booking. Our team will call you shortly to confirm.</p>
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Booking ID</span><span className="font-mono font-medium">{confirmed.id.slice(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Name</span><span className="font-medium">{confirmed.patientName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Service</span><span className="font-medium">{confirmed.service}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Date & Time</span><span className="font-medium">{confirmed.date} • {confirmed.time}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Phone</span><span className="font-medium">{confirmed.phone}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`https://wa.me/${CLINIC.whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full"><MessageCircle className="h-4 w-4 mr-2" />Notify on WhatsApp</Button>
              </a>
              <Button variant="outline" onClick={() => onNav('home')} className="flex-1 rounded-full">Back to Home</Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={() => onNav('home')} className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 mb-5">
          <ArrowRight className="h-4 w-4 rotate-180" />Back to Home
        </button>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-7 text-white">
            <h1 className="font-display text-2xl md:text-3xl font-bold">Book Your Appointment</h1>
            <p className="text-blue-100 text-sm mt-1">Quick 3-step booking. We'll confirm via call.</p>
            <div className="flex items-center gap-2 mt-5">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-white text-blue-700' : 'bg-white/20 text-white'}`}>{s}</div>
                  {s < 3 && <div className={`h-1 flex-1 rounded ${step > s ? 'bg-white' : 'bg-white/20'}`} />}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Select Treatment</h2>
                <div>
                  <Label>Service / Treatment *</Label>
                  <Select value={form.service} onValueChange={v => setForm({ ...form, service: v })}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                    <SelectContent>
                      {SERVICES.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-3 gap-2 pt-3">
                  {SERVICES.slice(0, 6).map(s => (
                    <button key={s.id} onClick={() => setForm({ ...form, service: s.title })} className={`p-3 rounded-xl border text-left text-sm transition-all ${form.service === s.title ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}>
                      <s.icon className="h-4 w-4 mb-1.5" />{s.title}
                    </button>
                  ))}
                </div>
                <Button onClick={next} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12 mt-4">Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Pick Date & Time</h2>
                <div><Label>Preferred Date *</Label><Input type="date" min={minDate} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-12" /></div>
                <div>
                  <Label>Preferred Time *</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                    {TIME_SLOTS.map(t => (
                      <button key={t} onClick={() => setForm({ ...form, time: t })} className={`px-2 py-2.5 rounded-lg border text-sm transition-all ${form.time === t ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-slate-200 hover:border-blue-300'}`}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="rounded-full">Back</Button>
                  <Button onClick={next} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full">Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Your Details</h2>
                <div><Label>Full Name *</Label><Input value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} placeholder="Patient name" className="h-12" /></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="h-12" /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" className="h-12" /></div>
                </div>
                <div><Label>Notes (optional)</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Brief about your condition..." rows={3} /></div>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-900">
                  <div className="font-medium mb-1">Booking Summary</div>
                  <div>{form.service} • {form.date} • {form.time}</div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="rounded-full">Back</Button>
                  <Button onClick={submit} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full h-12">
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- HOME VISIT PAGE ----------
const HomeVisitPage = ({ onNav }) => {
  const [form, setForm] = useState({ patientName: '', phone: '', address: '', treatment: '', preferredDate: '', preferredTime: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await fetch('/api/home-visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { setDone(true); toast.success('Home visit request submitted!') }
      else toast.error(j.error || 'Failed')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  if (done) return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"><HomeIcon className="h-10 w-10 text-green-600" /></div>
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">Home Visit Requested!</h1>
          <p className="text-slate-600 mb-6">We'll call you within 2 hours to confirm timing and details.</p>
          <Button onClick={() => onNav('home')} className="bg-blue-600 hover:bg-blue-700 rounded-full">Back to Home</Button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <button onClick={() => onNav('home')} className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 mb-5"><ArrowRight className="h-4 w-4 rotate-180" />Back to Home</button>
        <Card className="border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-7 text-white">
            <HomeIcon className="h-8 w-8 mb-2" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">Request Home Visit</h1>
            <p className="text-blue-100 text-sm mt-1">Expert physiotherapy delivered to your doorstep.</p>
          </div>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Patient Name *</Label><Input required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} className="h-11" /></div>
                <div><Label>Phone *</Label><Input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="h-11" /></div>
              </div>
              <div><Label>Full Address *</Label><Textarea required rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="House no, street, area, city" /></div>
              <div>
                <Label>Treatment Required</Label>
                <Select value={form.treatment} onValueChange={v => setForm({ ...form, treatment: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select treatment" /></SelectTrigger>
                  <SelectContent>{SERVICES.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Preferred Date *</Label><Input type="date" required min={minDate} value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} className="h-11" /></div>
                <div><Label>Preferred Time</Label>
                  <Select value={form.preferredTime} onValueChange={v => setForm({ ...form, preferredTime: v })}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Additional Notes</Label><Textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Patient condition, age, accessibility..." /></div>
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Submitting...' : 'Request Home Visit'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ---------- ADMIN ----------
const AdminPage = ({ onNav }) => {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('appointments')
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_token')) setAuthed(true)
  }, [])

  const login = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      const j = await r.json()
      if (j.success) { localStorage.setItem('admin_token', j.token); setAuthed(true); toast.success('Welcome back!') }
      else toast.error('Invalid password')
    } catch { toast.error('Login failed') } finally { setLoading(false) }
  }
  const logout = () => { localStorage.removeItem('admin_token'); setAuthed(false); onNav('home') }

  const refresh = async () => {
    const [s, a, v, c] = await Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/appointments').then(r => r.json()),
      fetch('/api/home-visits').then(r => r.json()),
      fetch('/api/contact').then(r => r.json())
    ])
    setStats(s); setAppointments(a.appointments || []); setVisits(v.visits || []); setEnquiries(c.enquiries || [])
  }
  useEffect(() => { if (authed) refresh() }, [authed])

  const updateApptStatus = async (id, status) => {
    await fetch(`/api/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    toast.success('Updated'); refresh()
  }
  const updateVisitStatus = async (id, status) => {
    await fetch(`/api/home-visits/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    toast.success('Updated'); refresh()
  }
  const resolveEnquiry = async (id) => {
    await fetch(`/api/contact/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) })
    toast.success('Resolved'); refresh()
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border-slate-200">
            <CardHeader className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3"><LayoutDashboard className="h-7 w-7 text-white" /></div>
              <CardTitle className="font-display text-2xl">Admin Login</CardTitle>
              <CardDescription>Enter password to access dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="h-12" />
              <Button onClick={login} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Logging in...' : 'Login'}</Button>
              <p className="text-xs text-center text-slate-500">Default password: admin123</p>
              <button onClick={() => onNav('home')} className="text-sm text-slate-500 hover:text-blue-600 w-full text-center">Back to website</button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-blue-100 text-blue-800', new: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800' }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-5">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage appointments, home visits and enquiries</p>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-full"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
        </div>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { l: 'Total Appointments', v: stats.totalAppointments, i: ClipboardList, c: 'bg-blue-500' },
              { l: 'Today', v: stats.todayAppointments, i: CalendarIcon, c: 'bg-cyan-500' },
              { l: 'Pending', v: stats.pendingAppointments, i: Clock, c: 'bg-yellow-500' },
              { l: 'Home Visits', v: stats.homeVisits, i: HomeIcon, c: 'bg-purple-500' },
              { l: 'New Enquiries', v: stats.newEnquiries, i: MessageSquare, c: 'bg-pink-500' },
            ].map((s, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-4">
                  <div className={`h-9 w-9 rounded-lg ${s.c} flex items-center justify-center mb-2`}><s.i className="h-4 w-4 text-white" /></div>
                  <div className="font-display text-2xl font-bold text-slate-900">{s.v}</div>
                  <div className="text-xs text-slate-500">{s.l}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
            <TabsTrigger value="visits">Home Visits ({visits.length})</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries ({enquiries.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="mt-4">
            <Card className="border-slate-200">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                    <tr><th className="text-left p-3">Patient</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Service</th><th className="text-left p-3">Date/Time</th><th className="text-left p-3">Status</th><th className="text-right p-3">Action</th></tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No appointments yet</td></tr> :
                      appointments.map(a => (
                        <tr key={a.id} className="border-t border-slate-100">
                          <td className="p-3 font-medium">{a.patientName}</td>
                          <td className="p-3"><a href={`tel:${a.phone}`} className="text-blue-600">{a.phone}</a></td>
                          <td className="p-3">{a.service}</td>
                          <td className="p-3">{a.date} <span className="text-slate-400">•</span> {a.time}</td>
                          <td className="p-3"><Badge className={`${statusColor[a.status]} border-0`}>{a.status}</Badge></td>
                          <td className="p-3 text-right">
                            <Select value={a.status} onValueChange={v => updateApptStatus(a.id, v)}>
                              <SelectTrigger className="h-8 w-32 ml-auto"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="visits" className="mt-4">
            <Card className="border-slate-200">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                    <tr><th className="text-left p-3">Patient</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Address</th><th className="text-left p-3">Date</th><th className="text-left p-3">Status</th><th className="text-right p-3">Action</th></tr>
                  </thead>
                  <tbody>
                    {visits.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No home visit requests yet</td></tr> :
                      visits.map(v => (
                        <tr key={v.id} className="border-t border-slate-100">
                          <td className="p-3 font-medium">{v.patientName}</td>
                          <td className="p-3"><a href={`tel:${v.phone}`} className="text-blue-600">{v.phone}</a></td>
                          <td className="p-3 max-w-[260px] truncate" title={v.address}>{v.address}</td>
                          <td className="p-3">{v.preferredDate} <span className="text-slate-400">{v.preferredTime}</span></td>
                          <td className="p-3"><Badge className={`${statusColor[v.status]} border-0`}>{v.status}</Badge></td>
                          <td className="p-3 text-right">
                            <Select value={v.status} onValueChange={s => updateVisitStatus(v.id, s)}>
                              <SelectTrigger className="h-8 w-32 ml-auto"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="enquiries" className="mt-4">
            <Card className="border-slate-200">
              <CardContent className="p-0">
                {enquiries.length === 0 ? <div className="p-8 text-center text-slate-500">No enquiries yet</div> :
                  <div className="divide-y divide-slate-100">
                    {enquiries.map(e => (
                      <div key={e.id} className="p-5 flex flex-col md:flex-row gap-4 md:items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900">{e.name}</span>
                            <Badge className={`${statusColor[e.status]} border-0 text-xs`}>{e.status}</Badge>
                          </div>
                          <div className="text-sm text-slate-500 mb-2">
                            <a href={`tel:${e.phone}`} className="text-blue-600 mr-3">{e.phone}</a>
                            {e.email && <span>{e.email}</span>}
                          </div>
                          <p className="text-slate-700 text-sm">{e.message}</p>
                          <div className="text-xs text-slate-400 mt-2">{new Date(e.createdAt).toLocaleString()}</div>
                        </div>
                        {e.status !== 'resolved' && (
                          <Button size="sm" variant="outline" onClick={() => resolveEnquiry(e.id)} className="rounded-full"><CheckCircle2 className="h-4 w-4 mr-1" />Mark Resolved</Button>
                        )}
                      </div>
                    ))}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ---------- MAIN APP ----------
function App() {
  const [view, setView] = useState('home')
  const [prefillService, setPrefillService] = useState('')

  const onBook = (svc) => { setPrefillService(svc || ''); setView('book'); window.scrollTo({ top: 0 }) }
  const onVisit = () => { setView('visit'); window.scrollTo({ top: 0 }) }
  const onNav = (v) => { setView(v); window.scrollTo({ top: 0 }) }

  return (
    <div className="min-h-screen bg-white">
      <Nav onNav={onNav} currentView={view} />
      {view === 'home' && (
        <>
          <Hero onBook={() => onBook()} onVisit={onVisit} />
          <Stats />
          <About />
          <Services onBook={onBook} />
          <WhyUs />
          <Doctor />
          <Testimonials />
          <CTABanner onBook={() => onBook()} onVisit={onVisit} />
          <FAQ />
          <Contact />
        </>
      )}
      {view === 'book' && <BookingPage onNav={onNav} prefillService={prefillService} />}
      {view === 'visit' && <HomeVisitPage onNav={onNav} />}
      {view === 'admin' && <AdminPage onNav={onNav} />}
      <Footer onNav={onNav} />
      <FloatingActions />
    </div>
  )
}

export default App
