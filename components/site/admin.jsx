'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  LogOut, LayoutDashboard, ClipboardList, MessageSquare, Calendar as CalendarIcon, Clock,
  Home as HomeIcon, User, CheckCircle2, UserPlus, Edit2, Trash2, Upload, Eye, EyeOff,
  Settings, Image as ImageIcon, FileText, Stethoscope, Heart, Search, Download, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { DoctorAvatar } from './sections'

// ---------- Image upload helper (canvas-compress to base64) ----------
const compressImage = (file, maxSize = 1000, quality = 0.85) => new Promise((resolve, reject) => {
  if (file.size > 8 * 1024 * 1024) return reject(new Error('Image too large (max 8MB)'))
  const img = new Image()
  const reader = new FileReader()
  reader.onload = ev => {
    img.onload = () => {
      let { width, height } = img
      if (width > height) { if (width > maxSize) { height = (height * maxSize) / width; width = maxSize } }
      else { if (height > maxSize) { width = (width * maxSize) / height; height = maxSize } }
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = ev.target.result
  }
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const PhotoUpload = ({ value, onChange, label = 'Upload Image', maxSize = 800 }) => {
  const ref = useRef(null)
  const onFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    try { const url = await compressImage(file, maxSize); onChange(url) }
    catch (err) { toast.error(err.message) }
  }
  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-8 w-8 text-slate-400" />}
      </div>
      <div className="flex-1">
        <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <Button type="button" variant="outline" onClick={() => ref.current?.click()} className="rounded-full" size="sm"><Upload className="h-4 w-4 mr-2" />{label}</Button>
        {value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')} className="ml-2 text-red-600">Remove</Button>}
      </div>
    </div>
  )
}

// ---------- Generic confirm delete dialog ----------
const ConfirmDelete = ({ item, label, onConfirm, onClose }) => (
  <Dialog open={!!item} onOpenChange={onClose}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle>Delete?</DialogTitle>
        <DialogDescription>This will permanently remove <span className="font-semibold">{label}</span>. This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
        <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 rounded-full">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

// ============================================================
// DOCTOR EDIT DIALOG
// ============================================================
const DoctorEditDialog = ({ open, onOpenChange, doctor, onSaved }) => {
  const [form, setForm] = useState({ name: '', title: '', specialization: '', experience: '', timings: '', photo: '', active: true, order: 99 })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (doctor) setForm({ name: doctor.name || '', title: doctor.title || '', specialization: doctor.specialization || '', experience: doctor.experience || '', timings: doctor.timings || '', photo: doctor.photo || '', active: doctor.active !== false, order: doctor.order ?? 99 })
    else setForm({ name: '', title: '', specialization: '', experience: '', timings: '', photo: '', active: true, order: 99 })
  }, [doctor, open])
  const save = async () => {
    if (!form.name) return toast.error('Name required')
    setSaving(true)
    try {
      const url = doctor ? `/api/doctors/${doctor.id}` : '/api/doctors'
      const r = await fetch(url, { method: doctor ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { toast.success('Saved'); onSaved(); onOpenChange(false) } else toast.error(j.error || 'Failed')
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{doctor ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <PhotoUpload value={form.photo} onChange={v => setForm({ ...form, photo: v })} label="Upload Photo" maxSize={600} />
          <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" /></div>
          <div><Label>Qualifications</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
            <div><Label>Experience</Label><Input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} /></div>
          </div>
          <div><Label>Consultation Timings</Label><Input value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })} placeholder="e.g. Mon-Fri 10AM - 6PM" /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Order</Label><Input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 99 })} /></div>
            <div className="flex items-end pb-1"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label className="ml-2">{form.active ? 'Active' : 'Hidden'}</Label></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button><Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 rounded-full">{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// SERVICE EDIT DIALOG
// ============================================================
const ServiceEditDialog = ({ open, onOpenChange, service, onSaved }) => {
  const [form, setForm] = useState({ title: '', slug: '', short: '', description: '', image: '', iconName: 'Activity', symptoms: '', benefits: '', causes: '', process: '', seoTitle: '', seoDescription: '', active: true, order: 99 })
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (service) setForm({
      title: service.title || '', slug: service.slug || '', short: service.short || '', description: service.description || '',
      image: service.image || '', iconName: service.iconName || 'Activity',
      symptoms: (service.symptoms || []).join('\n'), benefits: (service.benefits || []).join('\n'),
      causes: (service.causes || []).join('\n'), process: (service.process || []).join('\n'),
      seoTitle: service.seoTitle || '', seoDescription: service.seoDescription || '',
      active: service.active !== false, order: service.order ?? 99,
    })
    else setForm({ title: '', slug: '', short: '', description: '', image: '', iconName: 'Activity', symptoms: '', benefits: '', causes: '', process: '', seoTitle: '', seoDescription: '', active: true, order: 99 })
  }, [service, open])
  const save = async () => {
    if (!form.title) return toast.error('Title required')
    setSaving(true)
    const payload = {
      ...form,
      symptoms: form.symptoms.split('\n').map(s => s.trim()).filter(Boolean),
      benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean),
      causes: form.causes.split('\n').map(s => s.trim()).filter(Boolean),
      process: form.process.split('\n').map(s => s.trim()).filter(Boolean),
    }
    try {
      const url = service ? `/api/cms-services/${service.id}` : '/api/cms-services'
      const r = await fetch(url, { method: service ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json()
      if (j.success) { toast.success('Saved'); onSaved(); onOpenChange(false) } else toast.error(j.error || 'Failed')
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{service ? 'Edit Service' : 'Add Service'}</DialogTitle><DialogDescription>Create custom services in addition to default ones.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <PhotoUpload value={form.image} onChange={v => setForm({ ...form, image: v })} label="Service Image" maxSize={1200} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>URL Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
          </div>
          <div><Label>Short Description</Label><Input value={form.short} onChange={e => setForm({ ...form, short: e.target.value })} /></div>
          <div><Label>Full Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Symptoms (one per line)</Label><Textarea value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} rows={4} /></div>
            <div><Label>Benefits (one per line)</Label><Textarea value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} rows={4} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Causes (one per line)</Label><Textarea value={form.causes} onChange={e => setForm({ ...form, causes: e.target.value })} rows={3} /></div>
            <div><Label>Process (one per line)</Label><Textarea value={form.process} onChange={e => setForm({ ...form, process: e.target.value })} rows={3} /></div>
          </div>
          <div className="border-t pt-3"><Label className="font-semibold">SEO</Label></div>
          <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} /></div>
          <div><Label>SEO Description</Label><Textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Order</Label><Input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 99 })} /></div>
            <div className="flex items-end pb-1"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label className="ml-2">{form.active ? 'Published' : 'Draft'}</Label></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button><Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 rounded-full">{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// TESTIMONIAL EDIT DIALOG
// ============================================================
const TestimonialEditDialog = ({ open, onOpenChange, item, onSaved }) => {
  const [form, setForm] = useState({ patientName: '', rating: 5, review: '', role: '', photo: '', active: true, order: 99 })
  useEffect(() => {
    if (item) setForm({ patientName: item.patientName || '', rating: item.rating || 5, review: item.review || '', role: item.role || '', photo: item.photo || '', active: item.active !== false, order: item.order ?? 99 })
    else setForm({ patientName: '', rating: 5, review: '', role: '', photo: '', active: true, order: 99 })
  }, [item, open])
  const save = async () => {
    if (!form.patientName || !form.review) return toast.error('Name and review required')
    const url = item ? `/api/testimonials/${item.id}` : '/api/testimonials'
    const r = await fetch(url, { method: item ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const j = await r.json()
    if (j.success) { toast.success('Saved'); onSaved(); onOpenChange(false) } else toast.error(j.error)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <PhotoUpload value={form.photo} onChange={v => setForm({ ...form, photo: v })} label="Patient Photo" maxSize={400} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Patient Name *</Label><Input value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} /></div>
            <div><Label>Role / Location</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
          </div>
          <div><Label>Review *</Label><Textarea value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} rows={4} /></div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Rating</Label>
              <Select value={String(form.rating)} onValueChange={v => setForm({ ...form, rating: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[5, 4, 3, 2, 1].map(n => <SelectItem key={n} value={String(n)}>{n} Stars</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Order</Label><Input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 99 })} /></div>
            <div className="flex items-end pb-1"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label className="ml-2">{form.active ? 'Visible' : 'Hidden'}</Label></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button><Button onClick={save} className="bg-blue-600 hover:bg-blue-700 rounded-full">Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// BLOG EDIT DIALOG
// ============================================================
const BlogEditDialog = ({ open, onOpenChange, item, onSaved }) => {
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: 'General', author: 'Admin', tags: '', seoTitle: '', seoDescription: '', published: false })
  useEffect(() => {
    if (item) setForm({ title: item.title || '', slug: item.slug || '', excerpt: item.excerpt || '', content: item.content || '', featuredImage: item.featuredImage || '', category: item.category || 'General', author: item.author || 'Admin', tags: (item.tags || []).join(', '), seoTitle: item.seoTitle || '', seoDescription: item.seoDescription || '', published: item.published === true })
    else setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: 'General', author: 'Admin', tags: '', seoTitle: '', seoDescription: '', published: false })
  }, [item, open])
  const save = async () => {
    if (!form.title) return toast.error('Title required')
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const url = item ? `/api/blogs/${item.id}` : '/api/blogs'
    const r = await fetch(url, { method: item ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const j = await r.json()
    if (j.success) { toast.success('Saved'); onSaved(); onOpenChange(false) } else toast.error(j.error)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? 'Edit Blog' : 'New Blog Post'}</DialogTitle><DialogDescription>Markdown supported in content. Use ## for headings, **bold**, *italic*, etc.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <PhotoUpload value={form.featuredImage} onChange={v => setForm({ ...form, featuredImage: v })} label="Featured Image" maxSize={1200} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>URL Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short summary for blog list..." /></div>
          <div><Label>Content (Markdown)</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={14} placeholder="## Introduction&#10;&#10;Write your blog content here in markdown..." className="font-mono text-sm" /></div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Back Pain" /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="back pain, recovery" /></div>
          </div>
          <div className="border-t pt-3"><Label className="font-semibold">SEO</Label></div>
          <div><Label>SEO Title</Label><Input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="defaults to title" /></div>
          <div><Label>SEO Description</Label><Textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} placeholder="defaults to excerpt" /></div>
          <div className="flex items-center gap-2 pt-2"><Switch checked={form.published} onCheckedChange={v => setForm({ ...form, published: v })} /><Label>{form.published ? 'Published' : 'Draft'}</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button><Button onClick={save} className="bg-blue-600 hover:bg-blue-700 rounded-full">Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================
// SETTINGS TAB
// ============================================================
const SettingsTab = ({ settings, refresh }) => {
  const [data, setData] = useState(settings || {})
  const [saving, setSaving] = useState(false)
  useEffect(() => { setData(settings || {}) }, [settings])
  if (!settings) return <div>Loading...</div>
  const setClinic = (k, v) => setData(d => ({ ...d, clinic: { ...d.clinic, [k]: v } }))
  const setSocial = (k, v) => setData(d => ({ ...d, clinic: { ...d.clinic, social: { ...d.clinic.social, [k]: v } } }))
  const c = data.clinic || {}
  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await r.json()
      if (j.success) { toast.success('Settings saved'); refresh() } else toast.error(j.error)
    } catch { toast.error('Failed') } finally { setSaving(false) }
  }
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle>Clinic Information</CardTitle><CardDescription>Basic info displayed across the entire website.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <PhotoUpload value={c.logoUrl} onChange={v => setClinic('logoUrl', v)} label="Clinic Logo" maxSize={300} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Clinic Name (short)</Label><Input value={c.name || ''} onChange={e => setClinic('name', e.target.value)} /></div>
            <div><Label>Full Name</Label><Input value={c.fullName || ''} onChange={e => setClinic('fullName', e.target.value)} /></div>
          </div>
          <div><Label>Tagline</Label><Input value={c.tagline || ''} onChange={e => setClinic('tagline', e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={c.description || ''} onChange={e => setClinic('description', e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Contact & Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Phone Numbers (one per line)</Label>
            <Textarea value={(c.phones || []).join('\n')} onChange={e => setClinic('phones', e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} rows={3} placeholder="7300846971" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>WhatsApp (with country code, no +)</Label><Input value={c.whatsapp || ''} onChange={e => setClinic('whatsapp', e.target.value)} placeholder="917300846971" /></div>
            <div><Label>Email</Label><Input value={c.email || ''} onChange={e => setClinic('email', e.target.value)} /></div>
          </div>
          <div><Label>Address</Label><Input value={c.address || ''} onChange={e => setClinic('address', e.target.value)} /></div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>City</Label><Input value={c.city || ''} onChange={e => setClinic('city', e.target.value)} /></div>
            <div><Label>State</Label><Input value={c.region || ''} onChange={e => setClinic('region', e.target.value)} /></div>
            <div><Label>Postal Code</Label><Input value={c.postal || ''} onChange={e => setClinic('postal', e.target.value)} /></div>
          </div>
          <div><Label>Working Hours</Label><Input value={c.timings || ''} onChange={e => setClinic('timings', e.target.value)} /></div>
          <div><Label>Google Maps Link</Label><Input value={c.mapsLink || ''} onChange={e => setClinic('mapsLink', e.target.value)} /></div>
          <div><Label>Google Maps Embed URL</Label><Input value={c.mapsEmbed || ''} onChange={e => setClinic('mapsEmbed', e.target.value)} placeholder="https://www.google.com/maps?q=...&output=embed" /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div><Label>Facebook URL</Label><Input value={c.social?.facebook || ''} onChange={e => setSocial('facebook', e.target.value)} /></div>
          <div><Label>Instagram URL</Label><Input value={c.social?.instagram || ''} onChange={e => setSocial('instagram', e.target.value)} /></div>
          <div><Label>YouTube URL</Label><Input value={c.social?.youtube || ''} onChange={e => setSocial('youtube', e.target.value)} /></div>
          <div><Label>Twitter URL</Label><Input value={c.social?.twitter || ''} onChange={e => setSocial('twitter', e.target.value)} /></div>
        </CardContent>
      </Card>
      <div className="sticky bottom-2 z-10"><Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12 shadow-lg">{saving ? 'Saving...' : 'Save All Settings'}</Button></div>
    </div>
  )
}

// ============================================================
// CONTENT TAB (Homepage editor: hero, about, stats, why-us, cta, footer)
// ============================================================
const ContentTab = ({ settings, refresh }) => {
  const [data, setData] = useState(settings || {})
  const [saving, setSaving] = useState(false)
  useEffect(() => { setData(settings || {}) }, [settings])
  if (!settings) return null
  const co = data.content || {}
  const set = (sec, k, v) => setData(d => ({ ...d, content: { ...d.content, [sec]: { ...d.content?.[sec], [k]: v } } }))
  const updateStat = (i, k, v) => {
    const stats = [...(co.stats || [])]
    stats[i] = { ...stats[i], [k]: v }
    setData(d => ({ ...d, content: { ...d.content, stats } }))
  }
  const save = async () => {
    setSaving(true)
    const r = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const j = await r.json()
    if (j.success) { toast.success('Content saved'); refresh() } else toast.error(j.error)
    setSaving(false)
  }
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Eyebrow Badge</Label><Input value={co.hero?.eyebrow || ''} onChange={e => set('hero', 'eyebrow', e.target.value)} /></div>
          <div><Label>Title</Label><Input value={co.hero?.title || ''} onChange={e => set('hero', 'title', e.target.value)} /></div>
          <div><Label>Subtitle</Label><Textarea value={co.hero?.subtitle || ''} onChange={e => set('hero', 'subtitle', e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>About Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Eyebrow</Label><Input value={co.about?.eyebrow || ''} onChange={e => set('about', 'eyebrow', e.target.value)} /></div>
          <div><Label>Title</Label><Input value={co.about?.title || ''} onChange={e => set('about', 'title', e.target.value)} /></div>
          <div><Label>Paragraph 1</Label><Textarea value={co.about?.paragraph1 || ''} onChange={e => set('about', 'paragraph1', e.target.value)} rows={3} /></div>
          <div><Label>Paragraph 2</Label><Textarea value={co.about?.paragraph2 || ''} onChange={e => set('about', 'paragraph2', e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {(co.stats || []).map((s, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <div><Label>Value</Label><Input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} /></div>
                <div><Label>Label</Label><Input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} /></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Why Choose Us</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Eyebrow</Label><Input value={co.whyUs?.eyebrow || ''} onChange={e => set('whyUs', 'eyebrow', e.target.value)} /></div>
          <div><Label>Title</Label><Input value={co.whyUs?.title || ''} onChange={e => set('whyUs', 'title', e.target.value)} /></div>
          <div><Label>Subtitle</Label><Textarea value={co.whyUs?.subtitle || ''} onChange={e => set('whyUs', 'subtitle', e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Title</Label><Input value={co.cta?.title || ''} onChange={e => set('cta', 'title', e.target.value)} /></div>
          <div><Label>Subtitle</Label><Textarea value={co.cta?.subtitle || ''} onChange={e => set('cta', 'subtitle', e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Footer</CardTitle></CardHeader>
        <CardContent>
          <div><Label>Footer Tagline</Label><Textarea value={co.footer?.tagline || ''} onChange={e => set('footer', 'tagline', e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>
      <div className="sticky bottom-2 z-10"><Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12 shadow-lg">{saving ? 'Saving...' : 'Save Homepage Content'}</Button></div>
    </div>
  )
}

// ============================================================
// SEO TAB
// ============================================================
const SeoTab = ({ settings, refresh }) => {
  const [data, setData] = useState(settings || {})
  const [saving, setSaving] = useState(false)
  useEffect(() => { setData(settings || {}) }, [settings])
  if (!settings) return null
  const seo = data.seo || {}
  const set = (page, k, v) => setData(d => ({ ...d, seo: { ...d.seo, [page]: { ...d.seo?.[page], [k]: v } } }))
  const save = async () => {
    setSaving(true)
    const r = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const j = await r.json()
    if (j.success) { toast.success('SEO saved'); refresh() } else toast.error(j.error)
    setSaving(false)
  }
  const pages = [
    { k: 'home', label: 'Homepage' },
    { k: 'services', label: 'Services Page' },
    { k: 'blog', label: 'Blog Page' },
  ]
  return (
    <div className="space-y-4">
      {pages.map(p => (
        <Card key={p.k}>
          <CardHeader><CardTitle>{p.label} SEO</CardTitle><CardDescription>Meta tags + Open Graph for /{p.k === 'home' ? '' : p.k}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div><Label>SEO Title</Label><Input value={seo[p.k]?.title || ''} onChange={e => set(p.k, 'title', e.target.value)} /></div>
            <div><Label>Meta Description</Label><Textarea value={seo[p.k]?.description || ''} onChange={e => set(p.k, 'description', e.target.value)} rows={2} /></div>
            <div><Label>Keywords (comma-separated)</Label><Input value={seo[p.k]?.keywords || ''} onChange={e => set(p.k, 'keywords', e.target.value)} /></div>
            <PhotoUpload value={seo[p.k]?.ogImage || ''} onChange={v => set(p.k, 'ogImage', v)} label="OG Image (1200x630)" maxSize={1200} />
          </CardContent>
        </Card>
      ))}
      <div className="sticky bottom-2 z-10"><Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12 shadow-lg">{saving ? 'Saving...' : 'Save SEO Settings'}</Button></div>
    </div>
  )
}

// ============================================================
// MAIN ADMIN PAGE
// ============================================================
export const AdminPage = () => {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  // Forgot password flow
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1=request, 2=otp, 3=newpw
  const [otpInput, setOtpInput] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [otpMaskedEmail, setOtpMaskedEmail] = useState('')

  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [settings, setSettings] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])
  const [gallery, setGallery] = useState([])
  // dialogs
  const [doctorEdit, setDoctorEdit] = useState({ open: false, item: null })
  const [serviceEdit, setServiceEdit] = useState({ open: false, item: null })
  const [testimonialEdit, setTestimonialEdit] = useState({ open: false, item: null })
  const [blogEdit, setBlogEdit] = useState({ open: false, item: null })
  const [confirmDel, setConfirmDel] = useState(null)
  // filters
  const [apptSearch, setApptSearch] = useState('')
  const [apptStatusFilter, setApptStatusFilter] = useState('all')
  const [galleryUpload, setGalleryUpload] = useState({ category: 'general' })
  const galleryRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('admin_session')
    if (raw) {
      try { const s = JSON.parse(raw); if (s.expiresAt && s.expiresAt > Date.now()) setAuthed(true); else localStorage.removeItem('admin_session') }
      catch { localStorage.removeItem('admin_session') }
    }
  }, [])
  const login = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw, remember }) })
      const j = await r.json()
      if (j.success) {
        localStorage.setItem('admin_session', JSON.stringify({ token: j.token, expiresAt: j.expiresAt, remember: j.remember }))
        setAuthed(true); toast.success('Welcome back!')
      } else toast.error('Invalid password')
    } catch { toast.error('Login failed') } finally { setLoading(false) }
  }
  const logout = () => { localStorage.removeItem('admin_session'); setAuthed(false) }
  const requestOtp = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const j = await r.json()
      if (j.success) { setOtpMaskedEmail(j.message || ''); setForgotStep(2); toast.success('OTP sent to admin email') }
      else toast.error(j.error || 'Failed to send OTP')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  const verifyOtp = async () => {
    if (otpInput.length !== 6) return toast.error('Enter the 6-digit OTP')
    setLoading(true)
    try {
      const r = await fetch('/api/admin/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ otp: otpInput }) })
      const j = await r.json()
      if (j.success) { setResetToken(j.resetToken); setForgotStep(3); toast.success('OTP verified') }
      else toast.error(j.error || 'Invalid OTP')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }
  const resetPassword = async () => {
    if (newPw.length < 6) return toast.error('Password must be at least 6 characters')
    if (newPw !== newPw2) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      const r = await fetch('/api/admin/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resetToken, newPassword: newPw }) })
      const j = await r.json()
      if (j.success) { toast.success('Password updated. Please login with the new password.'); setForgotMode(false); setForgotStep(1); setOtpInput(''); setNewPw(''); setNewPw2(''); setResetToken('') }
      else toast.error(j.error || 'Failed')
    } catch { toast.error('Network error') } finally { setLoading(false) }
  }

  const refresh = async () => {
    try {
      const [s, st, a, v, c, d, sv, t, b, g] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/appointments').then(r => r.json()),
        fetch('/api/home-visits').then(r => r.json()),
        fetch('/api/contact').then(r => r.json()),
        fetch('/api/doctors?all=1').then(r => r.json()),
        fetch('/api/cms-services?all=1').then(r => r.json()),
        fetch('/api/testimonials?all=1').then(r => r.json()),
        fetch('/api/blogs?all=1').then(r => r.json()),
        fetch('/api/gallery').then(r => r.json()),
      ])
      setStats(s); setSettings(st.settings); setAppointments(a.appointments || []); setVisits(v.visits || [])
      setEnquiries(c.enquiries || []); setDoctors(d.doctors || []); setServices(sv.services || [])
      setTestimonials(t.testimonials || []); setBlogs(b.blogs || []); setGallery(g.images || [])
    } catch (e) { console.error(e) }
  }
  useEffect(() => { if (authed) refresh() }, [authed])

  // ---- Actions ----
  const updateApptStatus = async (id, status) => { await fetch(`/api/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); refresh() }
  const updateVisitStatus = async (id, status) => { await fetch(`/api/home-visits/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); refresh() }
  const resolveEnquiry = async (id) => { await fetch(`/api/contact/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) }); refresh() }
  const deleteEnquiry = async (id) => { await fetch(`/api/contact/${id}`, { method: 'DELETE' }); toast.success('Deleted'); refresh() }
  const toggleDoctor = async (id, active) => { await fetch(`/api/doctors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) }); refresh() }
  const toggleService = async (id, active) => { await fetch(`/api/cms-services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) }); refresh() }
  const toggleTestimonial = async (id, active) => { await fetch(`/api/testimonials/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) }); refresh() }
  const togglePublishBlog = async (id, published) => { await fetch(`/api/blogs/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published }) }); refresh() }
  const doDelete = async () => {
    if (!confirmDel) return
    await fetch(confirmDel.url, { method: 'DELETE' })
    toast.success('Deleted'); setConfirmDel(null); refresh()
  }
  const uploadGalleryImage = async (file) => {
    try {
      const dataUrl = await compressImage(file, 1400, 0.85)
      const r = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: dataUrl, category: galleryUpload.category, title: file.name }) })
      const j = await r.json()
      if (j.success) { toast.success('Uploaded'); refresh() }
    } catch (e) { toast.error(e.message) }
  }
  const onGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    for (const f of files) await uploadGalleryImage(f)
    e.target.value = ''
  }
  const exportAppointments = () => {
    const rows = [['ID', 'Patient', 'Phone', 'Email', 'Service', 'Date', 'Time', 'Status', 'Notes', 'Created']]
    appointments.forEach(a => rows.push([a.id.slice(0, 8), a.patientName, a.phone, a.email || '', a.service, a.date, a.time, a.status, (a.notes || '').replace(/[\n,]/g, ' '), a.createdAt]))
    const csv = rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `appointments-${Date.now()}.csv`; a.click()
    URL.revokeObjectURL(url)
  }
  const filteredAppts = appointments.filter(a => {
    if (apptStatusFilter !== 'all' && a.status !== apptStatusFilter) return false
    if (apptSearch) { const q = apptSearch.toLowerCase(); return [a.patientName, a.phone, a.service].some(x => (x || '').toLowerCase().includes(q)) }
    return true
  })

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex items-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3"><LayoutDashboard className="h-7 w-7 text-white" /></div>
              <CardTitle className="font-display text-2xl">{forgotMode ? 'Reset Password' : 'Admin Login'}</CardTitle>
              <CardDescription>{forgotMode ? (forgotStep === 1 ? 'Send a verification code to the admin email.' : forgotStep === 2 ? 'Enter the 6-digit code we sent you.' : 'Set a new password for your account.') : 'Enter password to access dashboard'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!forgotMode && (
                <>
                  <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="h-12" autoFocus />
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Remember me for 30 days
                  </label>
                  <Button onClick={login} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Logging in...' : 'Login'}</Button>
                  <button onClick={() => { setForgotMode(true); setForgotStep(1) }} className="text-sm text-blue-600 hover:underline w-full text-center block">Forgot password?</button>
                  <Link href="/" className="text-xs text-slate-500 hover:text-blue-600 w-full text-center block">← Back to website</Link>
                </>
              )}
              {forgotMode && forgotStep === 1 && (
                <>
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-900">A 6-digit verification code will be sent to the registered admin email address. The code is valid for 10 minutes.</div>
                  <Button onClick={requestOtp} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Sending...' : 'Send OTP to Admin Email'}</Button>
                  <button onClick={() => setForgotMode(false)} className="text-sm text-slate-500 hover:text-blue-600 w-full text-center block">Back to login</button>
                </>
              )}
              {forgotMode && forgotStep === 2 && (
                <>
                  {otpMaskedEmail && <div className="bg-green-50 rounded-lg p-3 text-sm text-green-900">{otpMaskedEmail}</div>}
                  <Input value={otpInput} onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" className="h-12 text-center text-2xl tracking-[0.4em] font-mono" maxLength={6} />
                  <Button onClick={verifyOtp} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Verifying...' : 'Verify Code'}</Button>
                  <button onClick={() => setForgotStep(1)} className="text-sm text-slate-500 hover:text-blue-600 w-full text-center block">Resend code</button>
                </>
              )}
              {forgotMode && forgotStep === 3 && (
                <>
                  <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="New password (min 6 chars)" className="h-12" />
                  <Input type="password" value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="Confirm new password" className="h-12" onKeyDown={e => e.key === 'Enter' && resetPassword()} />
                  <Button onClick={resetPassword} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 rounded-full h-12">{loading ? 'Updating...' : 'Update Password'}</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-blue-100 text-blue-800', new: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800' }
  const navItems = [
    { k: 'dashboard', l: 'Dashboard', i: LayoutDashboard },
    { k: 'appointments', l: 'Appointments', i: ClipboardList },
    { k: 'visits', l: 'Home Visits', i: HomeIcon },
    { k: 'enquiries', l: 'Enquiries', i: MessageSquare },
    { k: 'doctors', l: 'Doctors', i: User },
    { k: 'services', l: 'Services', i: Stethoscope },
    { k: 'testimonials', l: 'Testimonials', i: Heart },
    { k: 'blogs', l: 'Blogs', i: FileText },
    { k: 'gallery', l: 'Gallery', i: ImageIcon },
    { k: 'settings', l: 'Settings', i: Settings },
    { k: 'content', l: 'Content', i: Edit2 },
    { k: 'seo', l: 'SEO', i: Search },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center"><LayoutDashboard className="h-5 w-5 text-white" /></div>
            <div><div className="font-display font-bold text-slate-900">{settings?.clinic?.name || 'Clinic'} CMS</div><div className="text-xs text-slate-500">Admin Dashboard</div></div>
          </div>
          <div className="flex gap-2">
            <Link href="/" target="_blank"><Button variant="outline" size="sm" className="rounded-full">View Site</Button></Link>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-full"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-7xl py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="overflow-x-auto -mx-4 px-4 mb-4 scrollbar-hide">
            <TabsList className="bg-white border border-slate-200 inline-flex w-auto">
              {navItems.map(n => <TabsTrigger key={n.k} value={n.k} className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"><n.i className="h-4 w-4 mr-1.5" />{n.l}</TabsTrigger>)}
            </TabsList>
          </div>

          {/* DASHBOARD */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {stats && [
                { l: 'Total Appointments', v: stats.totalAppointments, i: ClipboardList, c: 'bg-blue-500' },
                { l: "Today's Appts", v: stats.todayAppointments, i: CalendarIcon, c: 'bg-cyan-500' },
                { l: 'Pending', v: stats.pendingAppointments, i: Clock, c: 'bg-yellow-500' },
                { l: 'Home Visits', v: stats.homeVisits, i: HomeIcon, c: 'bg-purple-500' },
                { l: 'New Enquiries', v: stats.newEnquiries, i: MessageSquare, c: 'bg-pink-500' },
                { l: 'Active Doctors', v: stats.activeDoctors, i: User, c: 'bg-emerald-500' },
                { l: 'Testimonials', v: stats.testimonials, i: Heart, c: 'bg-rose-500' },
                { l: 'Blog Posts', v: stats.blogs, i: FileText, c: 'bg-indigo-500' },
                { l: 'Custom Services', v: stats.services, i: Stethoscope, c: 'bg-teal-500' },
                { l: 'Gallery Images', v: stats.gallery, i: ImageIcon, c: 'bg-orange-500' },
              ].map((s, i) => (
                <Card key={i}><CardContent className="p-4">
                  <div className={`h-9 w-9 rounded-lg ${s.c} flex items-center justify-center mb-2`}><s.i className="h-4 w-4 text-white" /></div>
                  <div className="font-display text-2xl font-bold text-slate-900">{s.v}</div>
                  <div className="text-xs text-slate-500">{s.l}</div>
                </CardContent></Card>
              ))}
            </div>
            <Card className="mt-6"><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button onClick={() => setDoctorEdit({ open: true, item: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><UserPlus className="h-4 w-4 mr-2" />Add Doctor</Button>
                <Button onClick={() => setServiceEdit({ open: true, item: null })} variant="outline" className="rounded-full"><Stethoscope className="h-4 w-4 mr-2" />Add Service</Button>
                <Button onClick={() => setBlogEdit({ open: true, item: null })} variant="outline" className="rounded-full"><FileText className="h-4 w-4 mr-2" />Write Blog</Button>
                <Button onClick={() => setTestimonialEdit({ open: true, item: null })} variant="outline" className="rounded-full"><Heart className="h-4 w-4 mr-2" />Add Testimonial</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPOINTMENTS */}
          <TabsContent value="appointments">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1"><Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" /><Input placeholder="Search by name, phone, service..." value={apptSearch} onChange={e => setApptSearch(e.target.value)} className="pl-9" /></div>
              <Select value={apptStatusFilter} onValueChange={setApptStatusFilter}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
              <Button onClick={exportAppointments} variant="outline" className="rounded-full"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            </div>
            <Card><CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase"><tr><th className="text-left p-3">Patient</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Service</th><th className="text-left p-3">Date/Time</th><th className="text-left p-3">Status</th><th className="text-right p-3">Action</th></tr></thead>
                <tbody>
                  {filteredAppts.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No appointments found</td></tr> :
                    filteredAppts.map(a => (
                      <tr key={a.id} className="border-t border-slate-100">
                        <td className="p-3 font-medium">{a.patientName}</td>
                        <td className="p-3"><a href={`tel:${a.phone}`} className="text-blue-600">{a.phone}</a></td>
                        <td className="p-3">{a.service}</td>
                        <td className="p-3">{a.date} • {a.time}</td>
                        <td className="p-3"><Badge className={`${statusColor[a.status]} border-0`}>{a.status}</Badge></td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Select value={a.status} onValueChange={v => updateApptStatus(a.id, v)}>
                              <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                            </Select>
                            <Button size="sm" variant="ghost" onClick={() => setConfirmDel({ url: `/api/appointments/${a.id}`, label: a.patientName })} className="text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent></Card>
          </TabsContent>

          {/* HOME VISITS */}
          <TabsContent value="visits">
            <Card><CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase"><tr><th className="text-left p-3">Patient</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Address</th><th className="text-left p-3">Date</th><th className="text-left p-3">Status</th><th className="text-right p-3">Action</th></tr></thead>
                <tbody>
                  {visits.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No home visit requests</td></tr> :
                    visits.map(v => (
                      <tr key={v.id} className="border-t border-slate-100">
                        <td className="p-3 font-medium">{v.patientName}</td>
                        <td className="p-3"><a href={`tel:${v.phone}`} className="text-blue-600">{v.phone}</a></td>
                        <td className="p-3 max-w-[260px] truncate" title={v.address}>{v.address}</td>
                        <td className="p-3">{v.preferredDate} {v.preferredTime}</td>
                        <td className="p-3"><Badge className={`${statusColor[v.status]} border-0`}>{v.status}</Badge></td>
                        <td className="p-3 text-right">
                          <Select value={v.status} onValueChange={s => updateVisitStatus(v.id, s)}>
                            <SelectTrigger className="h-8 w-32 ml-auto"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent></Card>
          </TabsContent>

          {/* ENQUIRIES */}
          <TabsContent value="enquiries">
            <Card><CardContent className="p-0">
              {enquiries.length === 0 ? <div className="p-8 text-center text-slate-500">No enquiries</div> :
                <div className="divide-y divide-slate-100">
                  {enquiries.map(e => (
                    <div key={e.id} className="p-5 flex flex-col md:flex-row gap-4 md:items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{e.name}</span>
                          <Badge className={`${statusColor[e.status]} border-0 text-xs`}>{e.status}</Badge>
                        </div>
                        <div className="text-sm text-slate-500 mb-2"><a href={`tel:${e.phone}`} className="text-blue-600 mr-3">{e.phone}</a>{e.email && <span>{e.email}</span>}</div>
                        <p className="text-slate-700 text-sm">{e.message}</p>
                        <div className="text-xs text-slate-400 mt-2">{new Date(e.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        {e.status !== 'resolved' && <Button size="sm" variant="outline" onClick={() => resolveEnquiry(e.id)} className="rounded-full"><CheckCircle2 className="h-4 w-4 mr-1" />Resolve</Button>}
                        <Button size="sm" variant="ghost" onClick={() => deleteEnquiry(e.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>}
            </CardContent></Card>
          </TabsContent>

          {/* DOCTORS */}
          <TabsContent value="doctors">
            <div className="flex justify-between mb-4"><h3 className="font-semibold">Manage Doctors</h3><Button onClick={() => setDoctorEdit({ open: true, item: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><UserPlus className="h-4 w-4 mr-2" />Add Doctor</Button></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <Card key={d.id} className={!d.active ? 'opacity-60' : ''}><CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 shrink-0"><DoctorAvatar doctor={d} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{d.name}</div>
                      <div className="text-xs text-blue-600 truncate">{d.specialization}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{d.title}</div>
                      <div className="flex items-center gap-2 mt-2"><Switch checked={d.active} onCheckedChange={v => toggleDoctor(d.id, v)} /><span className="text-xs">{d.active ? <span className="flex items-center gap-1 text-green-700"><Eye className="h-3 w-3" />Visible</span> : <span className="flex items-center gap-1 text-slate-500"><EyeOff className="h-3 w-3" />Hidden</span>}</span></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" onClick={() => setDoctorEdit({ open: true, item: d })} className="flex-1 rounded-full"><Edit2 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmDel({ url: `/api/doctors/${d.id}`, label: d.name })} className="rounded-full text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services">
            <div className="flex justify-between mb-4"><h3 className="font-semibold">Custom Services</h3><Button onClick={() => setServiceEdit({ open: true, item: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><Stethoscope className="h-4 w-4 mr-2" />Add Service</Button></div>
            <p className="text-sm text-slate-500 mb-4">Default services are built-in. Add custom services here \u2014 they will appear on the website alongside default ones.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.length === 0 ? <div className="col-span-full text-center text-slate-500 py-12">No custom services yet.</div> : services.map(s => (
                <Card key={s.id} className={!s.active ? 'opacity-60' : ''}><CardContent className="p-4">
                  {s.image && <img src={s.image} alt={s.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">{s.short}</div>
                  <div className="text-xs text-slate-400 mt-1">/{s.slug}</div>
                  <div className="flex items-center gap-2 mt-2"><Switch checked={s.active} onCheckedChange={v => toggleService(s.id, v)} /><span className="text-xs">{s.active ? 'Published' : 'Draft'}</span></div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" onClick={() => setServiceEdit({ open: true, item: s })} className="flex-1 rounded-full"><Edit2 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmDel({ url: `/api/cms-services/${s.id}`, label: s.title })} className="rounded-full text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          {/* TESTIMONIALS */}
          <TabsContent value="testimonials">
            <div className="flex justify-between mb-4"><h3 className="font-semibold">Manage Testimonials</h3><Button onClick={() => setTestimonialEdit({ open: true, item: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><Heart className="h-4 w-4 mr-2" />Add Testimonial</Button></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map(t => (
                <Card key={t.id} className={!t.active ? 'opacity-60' : ''}><CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {t.photo ? <img src={t.photo} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-semibold">{t.patientName.split(' ').map(n => n[0]).join('')}</div>}
                    <div><div className="font-semibold text-sm">{t.patientName}</div><div className="text-xs text-slate-500">{t.role}</div></div>
                  </div>
                  <div className="text-xs">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="text-sm text-slate-700 mt-2 line-clamp-3">{t.review}</p>
                  <div className="flex items-center gap-2 mt-3"><Switch checked={t.active} onCheckedChange={v => toggleTestimonial(t.id, v)} /><span className="text-xs">{t.active ? 'Visible' : 'Hidden'}</span></div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" onClick={() => setTestimonialEdit({ open: true, item: t })} className="flex-1 rounded-full"><Edit2 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmDel({ url: `/api/testimonials/${t.id}`, label: t.patientName })} className="rounded-full text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          {/* BLOGS */}
          <TabsContent value="blogs">
            <div className="flex justify-between mb-4"><h3 className="font-semibold">Blog Posts</h3><Button onClick={() => setBlogEdit({ open: true, item: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><FileText className="h-4 w-4 mr-2" />Write Blog</Button></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.length === 0 ? <div className="col-span-full text-center text-slate-500 py-12">No blog posts yet. Write your first post!</div> : blogs.map(b => (
                <Card key={b.id} className={!b.published ? 'opacity-70' : ''}><CardContent className="p-4">
                  {b.featuredImage && <img src={b.featuredImage} alt={b.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                  <div className="flex items-center gap-2 mb-2"><Badge variant={b.published ? 'default' : 'outline'} className={b.published ? 'bg-green-100 text-green-800 border-0' : ''}>{b.published ? 'Published' : 'Draft'}</Badge>{b.category && <span className="text-xs text-blue-600">{b.category}</span>}</div>
                  <div className="font-semibold text-sm line-clamp-2">{b.title}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">{b.excerpt}</div>
                  <div className="text-xs text-slate-400 mt-1">/blog/{b.slug}</div>
                  <div className="flex items-center gap-2 mt-2"><Switch checked={b.published} onCheckedChange={v => togglePublishBlog(b.id, v)} /><span className="text-xs">{b.published ? 'Live' : 'Hidden'}</span></div>
                  <div className="flex gap-2 mt-3 pt-3 border-t">
                    <Button size="sm" variant="outline" onClick={() => setBlogEdit({ open: true, item: b })} className="flex-1 rounded-full"><Edit2 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmDel({ url: `/api/blogs/${b.id}`, label: b.title })} className="rounded-full text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery">
            <Card className="mb-4"><CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
              <Input placeholder="Category (e.g. clinic, equipment, treatment)" value={galleryUpload.category} onChange={e => setGalleryUpload({ category: e.target.value })} className="flex-1" />
              <input ref={galleryRef} type="file" multiple accept="image/*" onChange={onGalleryFiles} className="hidden" />
              <Button onClick={() => galleryRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 rounded-full"><Upload className="h-4 w-4 mr-2" />Upload Images</Button>
            </CardContent></Card>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.length === 0 ? <div className="col-span-full text-center text-slate-500 py-12">No images uploaded yet.</div> : gallery.map(g => (
                <div key={g.id} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <Badge className="bg-white/90 text-slate-800 text-xs">{g.category}</Badge>
                    <Button size="sm" variant="destructive" onClick={() => setConfirmDel({ url: `/api/gallery/${g.id}`, label: g.title || 'image' })} className="rounded-full"><Trash2 className="h-3 w-3 mr-1" />Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings"><SettingsTab settings={settings} refresh={refresh} /></TabsContent>
          <TabsContent value="content"><ContentTab settings={settings} refresh={refresh} /></TabsContent>
          <TabsContent value="seo"><SeoTab settings={settings} refresh={refresh} /></TabsContent>
        </Tabs>
      </div>

      <DoctorEditDialog open={doctorEdit.open} onOpenChange={v => setDoctorEdit({ ...doctorEdit, open: v })} doctor={doctorEdit.item} onSaved={refresh} />
      <ServiceEditDialog open={serviceEdit.open} onOpenChange={v => setServiceEdit({ ...serviceEdit, open: v })} service={serviceEdit.item} onSaved={refresh} />
      <TestimonialEditDialog open={testimonialEdit.open} onOpenChange={v => setTestimonialEdit({ ...testimonialEdit, open: v })} item={testimonialEdit.item} onSaved={refresh} />
      <BlogEditDialog open={blogEdit.open} onOpenChange={v => setBlogEdit({ ...blogEdit, open: v })} item={blogEdit.item} onSaved={refresh} />
      <ConfirmDelete item={confirmDel} label={confirmDel?.label} onClose={() => setConfirmDel(null)} onConfirm={doDelete} />
    </div>
  )
}
