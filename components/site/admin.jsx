'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  LogOut, LayoutDashboard, ClipboardList, MessageSquare, Calendar as CalendarIcon, Clock,
  Home as HomeIcon, User, CheckCircle2, UserPlus, Edit2, Trash2, Upload, Eye, EyeOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { DoctorAvatar } from './sections'

const DoctorEditDialog = ({ open, onOpenChange, doctor, onSaved }) => {
  const [form, setForm] = useState({ name: '', title: '', specialization: '', experience: '', photo: '', active: true, order: 99 })
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)
  useEffect(() => {
    if (doctor) setForm({ name: doctor.name || '', title: doctor.title || '', specialization: doctor.specialization || '', experience: doctor.experience || '', photo: doctor.photo || '', active: doctor.active !== false, order: doctor.order ?? 99 })
    else setForm({ name: '', title: '', specialization: '', experience: '', photo: '', active: true, order: 99 })
  }, [doctor, open])
  const onFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image too large (max 5MB)')
    const img = new Image()
    const reader = new FileReader()
    reader.onload = ev => {
      img.onload = () => {
        const maxSize = 600
        let { width, height } = img
        if (width > height) { if (width > maxSize) { height = (height * maxSize) / width; width = maxSize } }
        else { if (height > maxSize) { width = (width * maxSize) / height; height = maxSize } }
        const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        setForm(f => ({ ...f, photo: canvas.toDataURL('image/jpeg', 0.85) }))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }
  const save = async () => {
    if (!form.name) return toast.error('Name is required')
    setSaving(true)
    try {
      const url = doctor ? `/api/doctors/${doctor.id}` : '/api/doctors'
      const method = doctor ? 'PATCH' : 'POST'
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const j = await r.json()
      if (j.success) { toast.success(doctor ? 'Doctor updated' : 'Doctor added'); onSaved(); onOpenChange(false) }
      else toast.error(j.error || 'Failed')
    } catch { toast.error('Network error') } finally { setSaving(false) }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{doctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
          <DialogDescription>Manage doctor profile, qualifications and photo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
              {form.photo ? <img src={form.photo} alt="" className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-slate-400" />}
            </div>
            <div className="flex-1">
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="rounded-full"><Upload className="h-4 w-4 mr-2" />Upload Photo</Button>
              {form.photo && <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, photo: '' })} className="ml-2 text-red-600">Remove</Button>}
              <p className="text-xs text-slate-500 mt-1.5">Auto-compressed. JPG/PNG up to 5MB.</p>
            </div>
          </div>
          <div><Label>Doctor Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Full Name" /></div>
          <div><Label>Qualifications</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. M.D.A.M. Accu Therapy (Raj.), B.Pharma" /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Specialization</Label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Senior Neuro Therapist" /></div>
            <div><Label>Experience</Label><Input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 15+ years" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Display Order</Label><Input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 99 })} /></div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
                <Label>{form.active ? 'Active' : 'Inactive'}</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 rounded-full">{saving ? 'Saving...' : (doctor ? 'Save Changes' : 'Add Doctor')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const AdminPage = () => {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('appointments')
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [visits, setVisits] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorEdit, setDoctorEdit] = useState({ open: false, doctor: null })
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => { if (typeof window !== 'undefined' && localStorage.getItem('admin_token')) setAuthed(true) }, [])
  const login = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
      const j = await r.json()
      if (j.success) { localStorage.setItem('admin_token', j.token); setAuthed(true); toast.success('Welcome back!') }
      else toast.error('Invalid password')
    } catch { toast.error('Login failed') } finally { setLoading(false) }
  }
  const logout = () => { localStorage.removeItem('admin_token'); setAuthed(false) }
  const refresh = async () => {
    const [s, a, v, c, d] = await Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/appointments').then(r => r.json()),
      fetch('/api/home-visits').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
      fetch('/api/doctors?all=1').then(r => r.json()),
    ])
    setStats(s); setAppointments(a.appointments || []); setVisits(v.visits || []); setEnquiries(c.enquiries || []); setDoctors(d.doctors || [])
  }
  useEffect(() => { if (authed) refresh() }, [authed])
  const updateApptStatus = async (id, status) => { await fetch(`/api/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); toast.success('Updated'); refresh() }
  const updateVisitStatus = async (id, status) => { await fetch(`/api/home-visits/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); toast.success('Updated'); refresh() }
  const resolveEnquiry = async (id) => { await fetch(`/api/contact/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) }); toast.success('Resolved'); refresh() }
  const toggleDoctor = async (id, active) => { await fetch(`/api/doctors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active }) }); refresh() }
  const deleteDoctor = async (id) => { await fetch(`/api/doctors/${id}`, { method: 'DELETE' }); toast.success('Deleted'); setConfirmDelete(null); refresh() }

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
              <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 w-full text-center block">Back to website</Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusColor = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', completed: 'bg-blue-100 text-blue-800', new: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800' }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-5">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage appointments, doctors, home visits and enquiries</p>
          </div>
          <div className="flex gap-2">
            <Link href="/"><Button variant="outline" className="rounded-full">View Site</Button></Link>
            <Button variant="outline" onClick={logout} className="rounded-full"><LogOut className="h-4 w-4 mr-2" />Logout</Button>
          </div>
        </div>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            {[
              { l: 'Total Appts', v: stats.totalAppointments, i: ClipboardList, c: 'bg-blue-500' },
              { l: 'Today', v: stats.todayAppointments, i: CalendarIcon, c: 'bg-cyan-500' },
              { l: 'Pending', v: stats.pendingAppointments, i: Clock, c: 'bg-yellow-500' },
              { l: 'Home Visits', v: stats.homeVisits, i: HomeIcon, c: 'bg-purple-500' },
              { l: 'Enquiries', v: stats.newEnquiries, i: MessageSquare, c: 'bg-pink-500' },
              { l: 'Doctors', v: stats.activeDoctors, i: User, c: 'bg-emerald-500' },
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
          <TabsList className="bg-white border border-slate-200 flex-wrap h-auto">
            <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
            <TabsTrigger value="visits">Home Visits ({visits.length})</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries ({enquiries.length})</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({doctors.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="mt-4">
            <Card className="border-slate-200"><CardContent className="p-0 overflow-x-auto">
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
                        <td className="p-3">{a.date} • {a.time}</td>
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
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="visits" className="mt-4">
            <Card className="border-slate-200"><CardContent className="p-0 overflow-x-auto">
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
                        <td className="p-3">{v.preferredDate} {v.preferredTime}</td>
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
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="enquiries" className="mt-4">
            <Card className="border-slate-200"><CardContent className="p-0">
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
                      {e.status !== 'resolved' && <Button size="sm" variant="outline" onClick={() => resolveEnquiry(e.id)} className="rounded-full"><CheckCircle2 className="h-4 w-4 mr-1" />Mark Resolved</Button>}
                    </div>
                  ))}
                </div>}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="doctors" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">Manage doctors visible on the public site.</p>
              <Button onClick={() => setDoctorEdit({ open: true, doctor: null })} className="bg-blue-600 hover:bg-blue-700 rounded-full"><UserPlus className="h-4 w-4 mr-2" />Add Doctor</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(d => (
                <Card key={d.id} className={`border-slate-200 ${!d.active ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                        <DoctorAvatar doctor={d} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{d.name}</div>
                        <div className="text-xs text-blue-600 truncate">{d.specialization}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{d.title}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Switch checked={d.active} onCheckedChange={v => toggleDoctor(d.id, v)} />
                          <span className="text-xs text-slate-600">{d.active ? <span className="flex items-center gap-1"><Eye className="h-3 w-3" />Visible</span> : <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" />Hidden</span>}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <Button size="sm" variant="outline" onClick={() => setDoctorEdit({ open: true, doctor: d })} className="flex-1 rounded-full"><Edit2 className="h-3.5 w-3.5 mr-1" />Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmDelete(d)} className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {doctors.length === 0 && <div className="col-span-full text-center text-slate-500 py-12">No doctors yet</div>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <DoctorEditDialog open={doctorEdit.open} onOpenChange={(v) => setDoctorEdit({ ...doctorEdit, open: v })} doctor={doctorEdit.doctor} onSaved={refresh} />
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Doctor?</DialogTitle>
            <DialogDescription>This will permanently remove <span className="font-semibold">{confirmDelete?.name}</span> from the site.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="rounded-full">Cancel</Button>
            <Button onClick={() => deleteDoctor(confirmDelete.id)} className="bg-red-600 hover:bg-red-700 rounded-full">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
