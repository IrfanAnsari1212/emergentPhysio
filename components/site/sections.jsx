'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Phone, MessageCircle, MapPin, Mail, Clock, Calendar as CalendarIcon, ChevronRight, Activity,
  ShieldCheck, Sparkles, Star, ArrowRight, CheckCircle2, Quote, GraduationCap, Trophy, Smile,
  Hand, Award, Heart, Home as HomeIcon, User, Navigation,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CLINIC, SERVICES, TESTIMONIALS, FAQS, IMG, fmtPhone, waLink } from '@/lib/clinic-data'
import { Section, SectionTitle, CallPopover } from './shell'

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.6, ease: 'easeOut' } }
const stagger = { initial: {}, whileInView: { transition: { staggerChildren: 0.08 } }, viewport: { once: true } }

export const Hero = () => (
  <section id="home" className="relative pt-28 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-50" />
    <div className="absolute inset-0 bg-radial-fade" />
    <div className="container mx-auto px-4 max-w-7xl relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-5 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />Trusted Clinic in Kushinagar
          </Badge>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight">
            Heal Naturally. <span className="text-gradient">Live Pain-Free.</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-700 font-medium">{CLINIC.fullName}</p>
          <p className="mt-3 text-slate-600 leading-relaxed max-w-xl">
            Expert <span className="font-semibold text-slate-800">Electro Acupressure & Neuro Therapy</span> for back pain, paralysis, stroke recovery, sciatica, knee & joint pain — drug-free, scientifically proven.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/book"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full text-base h-12 px-7 shadow-lg shadow-blue-600/20 w-full sm:w-auto">
              <CalendarIcon className="h-5 w-5 mr-2" />Book Appointment<ArrowRight className="h-4 w-4 ml-2" />
            </Button></Link>
            <a href={waLink('Hi, I want to book an appointment at Shri Ramvidya clinic.')} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full text-base h-12 px-7 border-green-300 text-green-700 hover:bg-green-50 w-full sm:w-auto">
                <MessageCircle className="h-5 w-5 mr-2" />Book via WhatsApp
              </Button>
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {['No medicines', 'Painless therapy', 'Affordable care', 'Home visit available'].map(t => (
              <div key={t} className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-slate-700">{t}</span></div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 aspect-[4/5] md:aspect-[4/4]">
            <img src={IMG.hero} alt="Acupressure therapy session at Shri Ramvidya clinic" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-transparent" />
          </div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"><Smile className="h-6 w-6 text-green-600" /></div>
              <div><div className="text-2xl font-bold text-slate-900">5000+</div><div className="text-xs text-slate-500">Happy Patients</div></div>
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

export const Stats = () => {
  const items = [
    { n: '5000+', l: 'Happy Patients', icon: Smile },
    { n: '15+', l: 'Years Experience', icon: Award },
    { n: '3', l: 'Expert Doctors', icon: User },
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

export const About = () => (
  <Section id="about">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div {...fadeUp} className="relative">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img src={IMG.clinic} alt="Modern Shri Ramvidya clinic interior" className="w-full h-[480px] object-cover" />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 hidden sm:block">
          <div className="text-blue-600 font-bold text-3xl font-display">{CLINIC.experience}</div>
          <div className="text-slate-600 text-sm">Years of Trusted Care</div>
        </div>
      </motion.div>
      <motion.div {...fadeUp}>
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-4">About Our Clinic</Badge>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">Trusted Healing Through Acupressure & Neuro Therapy</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          <span className="font-semibold text-slate-800">{CLINIC.fullName}</span> is a leading therapy clinic located near PNB Bank, Dudhi, Kushinagar. We offer scientifically-backed, drug-free treatment for chronic pain, paralysis, stroke recovery and many other conditions.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">Our team of certified M.D.A.M. Accu Therapists has helped over 5000 patients reclaim a pain-free life. Aayu Pharmacy on-site for supportive medication needs.</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { icon: ShieldCheck, t: 'Certified Doctors', d: 'M.D.A.M. Acu Therapists' },
            { icon: Heart, t: 'Personalized Care', d: 'Custom treatment plans' },
            { icon: Sparkles, t: 'Modern Therapy', d: 'Electro acupressure tech' },
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

export const ServicesGrid = ({ limit }) => {
  const list = limit ? SERVICES.slice(0, limit) : SERVICES
  return (
    <Section id="services" className="bg-slate-50">
      <SectionTitle eyebrow="Our Services" title="Specialized Treatments" subtitle="Drug-free therapies for chronic pain and complex conditions — tailored to your needs." />
      <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((s) => (
          <motion.div key={s.slug} variants={fadeUp}>
            <Link href={`/services/${s.slug}`}>
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full cursor-pointer overflow-hidden">
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
            </Link>
          </motion.div>
        ))}
      </motion.div>
      {limit && (
        <div className="mt-10 text-center">
          <Link href="/services"><Button variant="outline" className="rounded-full">View All Services <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
        </div>
      )}
    </Section>
  )
}

export const WhyUs = () => {
  const items = [
    { icon: GraduationCap, t: 'Certified Doctors', d: 'M.D.A.M. Accu Therapy qualified' },
    { icon: Hand, t: 'Drug-Free Therapy', d: 'No side effects, completely natural' },
    { icon: ShieldCheck, t: 'Scientifically Proven', d: 'Modern equipment and techniques' },
    { icon: Heart, t: 'Personalized Care', d: 'Treatment plan for your condition' },
    { icon: HomeIcon, t: 'Home Visits', d: 'Expert care at your doorstep' },
    { icon: Award, t: 'Long-term Results', d: 'Permanent recovery, not temporary' },
  ]
  return (
    <Section>
      <SectionTitle eyebrow="Why Choose Us" title="The Shri Ramvidya Difference" subtitle="What makes us the most trusted therapy clinic in Kushinagar." />
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

export const DoctorAvatar = ({ doctor }) => {
  const initials = doctor.name.replace(/^Dr\.?\s*/i, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
  if (doctor.photo) return <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover" />
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold font-display text-3xl">
      {initials || 'DR'}
    </div>
  )
}

export const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/doctors').then(r => r.json()).then(d => { setDoctors(d.doctors || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  return (
    <Section id="doctors" className="bg-gradient-to-br from-slate-50 to-blue-50">
      <SectionTitle eyebrow="Meet Our Doctors" title="Expert Therapists at Your Service" subtitle="Our team of certified M.D.A.M. Accu Therapists is dedicated to helping you heal naturally." />
      {loading ? <div className="text-center text-slate-500">Loading doctors...</div> : (
        <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <motion.div key={d.id} variants={fadeUp}>
              <Card className="border-slate-200 hover:shadow-xl transition-all h-full overflow-hidden group">
                <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
                  <DoctorAvatar doctor={d} />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display font-bold text-lg text-slate-900">{d.name}</h3>
                  {d.specialization && <p className="text-blue-600 text-sm font-medium mt-0.5">{d.specialization}</p>}
                  {d.title && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{d.title}</p>}
                  <div className="flex items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                    <span className="text-xs text-slate-500 ml-1">{d.experience || 'Expert'}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href="/book" className="flex-1"><Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 rounded-full text-xs"><CalendarIcon className="h-3.5 w-3.5 mr-1" />Book</Button></Link>
                    <CallPopover side="top" align="end">
                      <Button size="sm" variant="outline" className="rounded-full"><Phone className="h-3.5 w-3.5" /></Button>
                    </CallPopover>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Section>
  )
}

export const Testimonials = ({ items }) => {
  const [data, setData] = useState(items || [])
  useEffect(() => {
    if (items?.length) return
    fetch('/api/testimonials').then(r => r.json()).then(d => {
      const list = (d.testimonials || []).map(t => ({ name: t.patientName, rating: t.rating || 5, text: t.review, role: t.role || '', photo: t.photo }))
      setData(list.length ? list : TESTIMONIALS)
    }).catch(() => setData(TESTIMONIALS))
  }, [items])
  const list = data.length ? data : TESTIMONIALS
  return (
  <Section id="testimonials">
    <SectionTitle eyebrow="Patient Stories" title="Real Results, Real People" subtitle="Hear directly from patients who reclaimed their lives with our care." />
    <motion.div {...stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.map((t, i) => (
        <motion.div key={i} variants={fadeUp}>
          <Card className="h-full border-slate-200 hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <Quote className="h-7 w-7 text-blue-200 mb-3" />
              <div className="flex mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-slate-700 leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                {t.photo ? <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" /> : (
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-semibold">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
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
}

export const FAQ = ({ faqs }) => (
  <Section id="faq" className="bg-slate-50">
    <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Got questions? We have answers." />
    <motion.div {...fadeUp} className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="space-y-3">
        {(faqs || FAQS).map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-xl border border-slate-200 px-5">
            <AccordionTrigger className="hover:no-underline text-left font-medium text-slate-900 py-4">{f.q}</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed pb-4">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  </Section>
)

export const Contact = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { toast.success('Message sent!'); setForm({ name: '', phone: '', email: '', message: '' }) }
      else toast.error(j.error || 'Failed to send')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  return (
    <Section id="contact">
      <SectionTitle eyebrow="Get in Touch" title="We're Here to Help" subtitle="Reach out for appointments, queries or home visit bookings." />
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div {...fadeUp} className="space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center"><MapPin className="h-5 w-5 text-blue-600" /></div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Visit Our Clinic</div>
                <div className="text-slate-600 text-sm mt-1">{CLINIC.address}, {CLINIC.city}, {CLINIC.region}</div>
                <a href={CLINIC.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium mt-2 hover:underline">
                  <Navigation className="h-4 w-4" />Get Directions
                </a>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center"><Phone className="h-5 w-5 text-blue-600" /></div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 mb-2">Call Us</div>
                <div className="space-y-1.5">
                  {CLINIC.phones.map(p => (
                    <a key={p} href={`tel:+91${p}`} className="flex items-center justify-between text-sm text-slate-700 hover:text-blue-600">
                      <span>{fmtPhone(p)}</span><Phone className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <a href={waLink('Hi, I want to book an appointment at Shri Ramvidya clinic.')} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-5 border border-slate-200 hover:border-green-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-green-100 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-green-600" /></div>
              <div><div className="font-semibold text-slate-900">WhatsApp</div><div className="text-slate-600 text-sm mt-1">Chat with us instantly</div></div>
            </div>
          </a>
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div><div className="font-semibold text-slate-900">Working Hours</div><div className="text-slate-600 text-sm mt-1">{CLINIC.timings}</div></div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 h-64 relative">
            <iframe src={CLINIC.mapsEmbed} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Clinic location map" />
            <a href={CLINIC.mapsLink} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-1.5">
              <Navigation className="h-4 w-4" />Open in Maps
            </a>
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
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Sending...' : 'Send Message'}</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  )
}

export const CTABanner = () => (
  <Section className="!py-12">
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl shadow-blue-900/30">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Start Your Healing Journey Today</h2>
          <p className="text-blue-100 leading-relaxed">Book your appointment online, via WhatsApp, or call us directly. Home visits available.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:justify-end flex-wrap">
          <Link href="/book"><Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full text-base h-12 px-7 w-full sm:w-auto">
            <CalendarIcon className="h-5 w-5 mr-2" />Book Appointment
          </Button></Link>
          <a href={waLink('Hi, I want to book an appointment at Shri Ramvidya clinic.')} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white rounded-full text-base h-12 px-7 bg-white/10 w-full sm:w-auto">
              <MessageCircle className="h-5 w-5 mr-2" />WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  </Section>
)

export const PageHero = ({ eyebrow, title, subtitle, breadcrumbs = [] }) => (
  <section className="relative pt-28 md:pt-32 pb-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-50" />
    <div className="container mx-auto px-4 max-w-7xl relative">
      {breadcrumbs.length > 0 && (
        <nav className="text-sm text-slate-500 mb-4 flex flex-wrap items-center gap-1">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {b.path ? <Link href={b.path} className="hover:text-blue-600">{b.name}</Link> : <span className="text-slate-700">{b.name}</span>}
            </span>
          ))}
        </nav>
      )}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
        {eyebrow && <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 mb-4">{eyebrow}</Badge>}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-slate-600 leading-relaxed">{subtitle}</p>}
      </motion.div>
    </div>
  </section>
)
