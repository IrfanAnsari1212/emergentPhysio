'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Calendar as CalendarIcon, ArrowRight, MessageCircle, CheckCircle2, Home as HomeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SERVICES, TIME_SLOTS, waLink } from '@/lib/clinic-data'

export const BookingPage = () => {
  const sp = useSearchParams()
  const prefill = sp?.get('service') || ''
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ service: prefill, date: '', time: '', patientName: '', phone: '', email: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  useEffect(() => { if (prefill) setForm(f => ({ ...f, service: prefill })) }, [prefill])
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
      if (j.success) { setConfirmed(j.appointment); toast.success('Appointment booked!') }
      else toast.error(j.error || 'Failed to book')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  const sendViaWA = () => {
    if (!form.service) return toast.error('Please select a service first')
    const msg = `Hi Shri Ramvidya clinic,\n\nI want to book an appointment.\n\nService: ${form.service}${form.date ? `\nDate: ${form.date}` : ''}${form.time ? `\nTime: ${form.time}` : ''}\n\nPlease confirm.`
    window.open(waLink(msg), '_blank')
  }

  if (confirmed) {
    const waMsg = `Hi Shri Ramvidya clinic,\n\nI just booked an appointment.\nBooking ID: ${confirmed.id.slice(0, 8).toUpperCase()}\nName: ${confirmed.patientName}\nService: ${confirmed.service}\nDate: ${confirmed.date} ${confirmed.time}\nPhone: ${confirmed.phone}\n\nPlease confirm.`
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-200">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"><CheckCircle2 className="h-10 w-10 text-green-600" /></div>
            <h1 className="font-display text-3xl font-bold text-slate-900 mb-3">Appointment Confirmed!</h1>
            <p className="text-slate-600 mb-6">We have received your booking. Our team will call you shortly to confirm.</p>
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Booking ID</span><span className="font-mono font-medium">{confirmed.id.slice(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Name</span><span className="font-medium">{confirmed.patientName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Service</span><span className="font-medium">{confirmed.service}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Date & Time</span><span className="font-medium">{confirmed.date} • {confirmed.time}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Phone</span><span className="font-medium">{confirmed.phone}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={waLink(waMsg)} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full"><MessageCircle className="h-4 w-4 mr-2" />Notify on WhatsApp</Button>
              </a>
              <Link href="/" className="flex-1"><Button variant="outline" className="w-full rounded-full">Back to Home</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 mb-5"><ArrowRight className="h-4 w-4 rotate-180" />Back to Home</Link>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-7 text-white">
            <h1 className="font-display text-2xl md:text-3xl font-bold">Book Your Appointment</h1>
            <p className="text-blue-100 text-sm mt-1">Quick 3-step booking. We will confirm via call.</p>
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
                    <SelectContent>{SERVICES.map(s => <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid sm:grid-cols-3 gap-2 pt-3">
                  {SERVICES.slice(0, 6).map(s => (
                    <button key={s.slug} onClick={() => setForm({ ...form, service: s.title })} className={`p-3 rounded-xl border text-left text-sm transition-all ${form.service === s.title ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}>
                      <s.icon className="h-4 w-4 mb-1.5" />{s.title}
                    </button>
                  ))}
                </div>
                <Button onClick={next} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12 mt-4">Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
                <div className="text-center text-sm text-slate-500">or</div>
                <Button onClick={sendViaWA} variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50 rounded-full h-12">
                  <MessageCircle className="h-4 w-4 mr-2" />Book Directly via WhatsApp
                </Button>
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
                  <Button onClick={submit} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Booking...' : 'Confirm Booking'}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const HomeVisitPage = () => {
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
          <p className="text-slate-600 mb-6">We will call you within 2 hours to confirm timing.</p>
          <Link href="/"><Button className="bg-blue-600 hover:bg-blue-700 rounded-full">Back to Home</Button></Link>
        </div>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1 mb-5"><ArrowRight className="h-4 w-4 rotate-180" />Back to Home</Link>
        <Card className="border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-7 text-white">
            <HomeIcon className="h-8 w-8 mb-2" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">Request Home Visit</h1>
            <p className="text-blue-100 text-sm mt-1">Expert therapy delivered to your doorstep.</p>
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
                  <SelectContent>{SERVICES.map(s => <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>)}</SelectContent>
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
