'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, MessageCircle, MapPin, Mail, Activity, Menu, X, Calendar as CalendarIcon, ArrowRight,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CLINIC, SERVICES, fmtPhone, waLink } from '@/lib/clinic-data'

export const Section = ({ id, children, className = '' }) => (
  <section id={id} className={`w-full py-16 md:py-24 ${className}`}>
    <div className="container mx-auto px-4 max-w-7xl">{children}</div>
  </section>
)

export const SectionTitle = ({ eyebrow, title, subtitle, center = true }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6 }}
    className={`mb-12 ${center ? 'text-center' : ''}`}>
    {eyebrow && <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">{eyebrow}</Badge>}
    <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-600 text-lg md:max-w-2xl md:mx-auto leading-relaxed">{subtitle}</p>}
  </motion.div>
)

export const CallPopover = ({ children, align = 'end', side = 'top' }) => (
  <Popover>
    <PopoverTrigger asChild>{children}</PopoverTrigger>
    <PopoverContent align={align} side={side} className="w-72 p-3">
      <div className="text-xs font-medium text-slate-500 mb-2 px-1">Choose a number to call</div>
      <div className="space-y-1.5">
        {CLINIC.phones.map((p) => (
          <a key={p} href={`tel:+91${p}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition-colors group">
            <div className="h-9 w-9 rounded-lg bg-blue-100 group-hover:bg-blue-600 transition-colors flex items-center justify-center">
              <Phone className="h-4 w-4 text-blue-600 group-hover:text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900 text-sm">{fmtPhone(p)}</div>
              <div className="text-xs text-slate-500">Tap to call</div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
          </a>
        ))}
      </div>
    </PopoverContent>
  </Popover>
)

export const FloatingActions = () => (
  <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 flex flex-col gap-3">
    <a href={waLink('Hi, I want to book an appointment at Shri Ramvidya clinic.')} target="_blank" rel="noopener noreferrer"
       className="group flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl pulse-ring transition-all hover:scale-105"
       aria-label="WhatsApp">
      <div className="p-3"><MessageCircle className="h-6 w-6" /></div>
      <span className="hidden md:inline pr-4 font-medium">WhatsApp</span>
    </a>
    <CallPopover side="left" align="end">
      <button className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl transition-all hover:scale-105" aria-label="Call">
        <div className="p-3"><Phone className="h-6 w-6" /></div>
        <span className="hidden md:inline pr-4 font-medium">Call Now</span>
      </button>
    </CallPopover>
  </div>
)

export const Nav = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])
  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Blog', href: '/blog' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ]
  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="leading-none">
            <div className="font-display font-bold text-slate-900 text-sm md:text-base">{CLINIC.name}</div>
            <div className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden sm:block">Electro Acupressure & Neuro Therapy</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link key={l.href} href={l.href} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}>{l.label}</Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-2">
          <CallPopover side="bottom" align="end">
            <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-full border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-sm font-medium text-slate-700 transition-colors">
              <Phone className="h-4 w-4 text-blue-600" />Call
            </button>
          </CallPopover>
          <Link href="/book" className="hidden md:block">
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
              <CalendarIcon className="h-4 w-4 mr-2" />Book Appointment
            </Button>
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-slate-100" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => <Link key={l.href} href={l.href} className="px-4 py-3 rounded-lg hover:bg-blue-50 text-slate-700 font-medium">{l.label}</Link>)}
              <Link href="/book" className="mt-2"><Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full">Book Appointment</Button></Link>
              <a href={`tel:+91${CLINIC.phones[0]}`} className="text-center px-4 py-3 rounded-full border border-slate-200 text-blue-600 font-medium">Call {fmtPhone(CLINIC.phones[0])}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export const Footer = () => {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><Activity className="h-5 w-5 text-white" /></div>
              <div>
                <div className="font-display text-white font-bold">{CLINIC.name}</div>
                <div className="text-xs text-slate-400">Electro Acupressure & Neuro Therapy</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{CLINIC.fullName}<br />Trusted natural therapy clinic in {CLINIC.city}, {CLINIC.region}.</p>
            <div className="flex gap-2 flex-wrap">
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm text-white">
                <MessageCircle className="h-4 w-4" />WhatsApp
              </a>
              <a href={`tel:+91${CLINIC.phones[0]}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm text-white">
                <Phone className="h-4 w-4" />Call Now
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/doctors" className="hover:text-white">Doctors</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/book" className="hover:text-white">Book Appointment</Link></li>
              <li><Link href="/home-visit" className="hover:text-white">Home Visit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/back-pain-treatment" className="hover:text-white">Back Pain Treatment</Link></li>
              <li><Link href="/neck-pain-treatment" className="hover:text-white">Neck Pain Treatment</Link></li>
              <li><Link href="/joint-pain-treatment" className="hover:text-white">Joint Pain Treatment</Link></li>
              <li><Link href="/sciatica-treatment" className="hover:text-white">Sciatica Treatment</Link></li>
              <li><Link href="/arthritis-management" className="hover:text-white">Arthritis Management</Link></li>
              <li><Link href="/physiotherapy-clinic-dudhi" className="hover:text-white">Clinic in Dudhi</Link></li>
              <li><Link href="/physiotherapy-clinic-kushinagar" className="hover:text-white">Clinic in Kushinagar</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-800 grid md:grid-cols-2 gap-3 text-sm text-slate-400">
          <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" /><a href={CLINIC.mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">{CLINIC.address}, {CLINIC.city}, {CLINIC.region}</a></div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
            {CLINIC.phones.map(p => <a key={p} href={`tel:+91${p}`} className="hover:text-white flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{fmtPhone(p)}</a>)}
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} {CLINIC.fullName}. All rights reserved.</div>
          <Link href="/admin" className="hover:text-white opacity-50 hover:opacity-100">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
