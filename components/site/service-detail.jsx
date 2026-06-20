'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Activity, Phone, MessageCircle, Calendar as CalendarIcon, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CLINIC, FAQS, fmtPhone, waLink, getServiceBySlug } from '@/lib/clinic-data'
import { Section, SectionTitle, CallPopover } from './shell'

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

export const ServiceDetail = ({ slug }) => {
  const service = getServiceBySlug(slug)
  if (!service) return <div className="py-32 text-center">Service not found</div>
  const Icon = service.icon
  const faqs = [
    { q: `How long does ${service.title} take?`, a: `Most patients see noticeable improvement in 6–10 sessions over 2–4 weeks. Severity determines the exact duration.` },
    { q: `Is ${service.title} painful?`, a: 'No. Our acupressure and electro-therapy is completely painless. You may feel gentle pressure or mild warmth.' },
    { q: `What is the cost of ${service.title}?`, a: 'We offer transparent and affordable pricing. Initial consultation is minimal. Please call us for current rates.' },
    ...FAQS.slice(0, 2),
  ]
  return (
    <>
      <section className="relative pt-24 md:pt-28 pb-8 bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <nav className="text-sm text-slate-500 mb-4"><Link href="/" className="hover:text-blue-600">Home</Link> &raquo; <Link href="/services" className="hover:text-blue-600">Services</Link> &raquo; <span className="text-slate-700">{service.title}</span></nav>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
                <Icon className="h-4 w-4" />Service
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 leading-tight">{service.title}</h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{service.short}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/book"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full w-full sm:w-auto"><CalendarIcon className="h-4 w-4 mr-2" />Book Appointment</Button></Link>
                <a href={waLink(`Hi, I want to know about ${service.title} at Shri Ramvidya clinic.`)} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 rounded-full w-full sm:w-auto"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp Us</Button>
                </a>
                <CallPopover side="bottom" align="start">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto"><Phone className="h-4 w-4 mr-2" />Call Now</Button>
                </CallPopover>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 aspect-[4/3]">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div {...fadeUp}>
            <Card className="border-red-100 bg-red-50/30 h-full">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center mb-4"><Activity className="h-6 w-6 text-red-600" /></div>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3">Common Symptoms</h2>
                <ul className="space-y-2">
                  {service.symptoms.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />{s}</li>)}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          {service.causes && (
            <motion.div {...fadeUp}>
              <Card className="border-amber-100 bg-amber-50/30 h-full">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4"><Sparkles className="h-6 w-6 text-amber-600" /></div>
                  <h2 className="font-display font-bold text-xl text-slate-900 mb-3">Common Causes</h2>
                  <ul className="space-y-2">
                    {service.causes.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />{s}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <motion.div {...fadeUp}>
            <Card className="border-green-100 bg-green-50/30 h-full">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4"><CheckCircle2 className="h-6 w-6 text-green-600" /></div>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3">Treatment Benefits</h2>
                <ul className="space-y-2">
                  {service.benefits.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />{s}</li>)}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {service.process && (
        <Section className="bg-slate-50">
          <SectionTitle eyebrow="How It Works" title="Our Treatment Process" subtitle="A proven step-by-step approach designed for lasting results." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {service.process.map((p, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="border-slate-200 h-full">
                  <CardContent className="p-5">
                    <div className="font-display text-3xl font-bold text-blue-600 mb-2">{String(i + 1).padStart(2, '0')}</div>
                    <p className="text-slate-700 text-sm leading-relaxed">{p}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <SectionTitle eyebrow="FAQ" title={`${service.title} — FAQs`} />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="bg-white rounded-xl border border-slate-200 px-5">
                <AccordionTrigger className="hover:no-underline text-left font-medium text-slate-900 py-4">{f.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-4">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-3">Start Your Recovery Today</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">Book your {service.title} consultation now. Our experts will create a personalized plan for you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book"><Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full w-full sm:w-auto"><CalendarIcon className="h-4 w-4 mr-2" />Book Appointment</Button></Link>
            <a href={waLink(`Hi, I want to book ${service.title} at Shri Ramvidya clinic.`)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white rounded-full bg-white/10 w-full sm:w-auto"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}

export const SeoLanding = ({ data }) => {
  // data: { title, h1, intro, highlights[], symptoms[], benefits[], processSteps[], faqs[], image, location? }
  return (
    <>
      <section className="relative pt-28 md:pt-32 pb-12 bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
                <ShieldCheck className="h-4 w-4" />{data.eyebrow || 'Trusted in Kushinagar'}
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-900 leading-tight">{data.h1}</h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">{data.intro}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/book"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full w-full sm:w-auto"><CalendarIcon className="h-4 w-4 mr-2" />Book Appointment</Button></Link>
                <a href={waLink(data.waMessage || `Hi, I want to know about ${data.h1} at Shri Ramvidya clinic.`)} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 rounded-full w-full sm:w-auto"><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</Button>
                </a>
                <CallPopover side="bottom" align="start">
                  <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto"><Phone className="h-4 w-4 mr-2" />Call</Button>
                </CallPopover>
              </div>
              {data.highlights && (
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {data.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 text-green-500" />{h}</div>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 aspect-[4/3]">
                <img src={data.image} alt={data.h1} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Section>
        <SectionTitle eyebrow="What We Treat" title="Symptoms & Conditions Covered" subtitle="Comprehensive natural therapy for all stages of these conditions." />
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-red-100 bg-red-50/30">
            <CardContent className="p-6">
              <div className="h-11 w-11 rounded-xl bg-red-100 flex items-center justify-center mb-3"><Activity className="h-5 w-5 text-red-600" /></div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-3">Common Symptoms</h3>
              <ul className="space-y-2">
                {data.symptoms.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />{s}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-green-100 bg-green-50/30">
            <CardContent className="p-6">
              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center mb-3"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-3">Treatment Benefits</h3>
              <ul className="space-y-2">
                {data.benefits.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {data.processSteps && (
        <Section className="bg-slate-50">
          <SectionTitle eyebrow="How It Works" title="Our Treatment Process" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {data.processSteps.map((p, i) => (
              <Card key={i} className="border-slate-200 h-full">
                <CardContent className="p-5">
                  <div className="font-display text-3xl font-bold text-blue-600 mb-2">{String(i + 1).padStart(2, '0')}</div>
                  <p className="text-slate-700 text-sm leading-relaxed">{p}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <SectionTitle eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {(data.faqs || FAQS).map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="bg-white rounded-xl border border-slate-200 px-5">
                <AccordionTrigger className="hover:no-underline text-left font-medium text-slate-900 py-4">{f.q}</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-4">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="font-display text-3xl font-bold mb-3">Visit Our Clinic Today</h2>
          <p className="text-blue-100 mb-2">{CLINIC.address}, {CLINIC.city}, {CLINIC.region}</p>
          <p className="text-blue-100 mb-6">{CLINIC.phones.map(fmtPhone).join(' | ')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/book"><Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-full w-full sm:w-auto"><CalendarIcon className="h-4 w-4 mr-2" />Book Appointment</Button></Link>
            <a href={CLINIC.mapsLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white rounded-full bg-white/10 w-full sm:w-auto"><ArrowRight className="h-4 w-4 mr-2" />Get Directions</Button>
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
