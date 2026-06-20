import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'physio_clinic'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

let cachedClient = null
async function getDb() {
  if (cachedClient) return cachedClient.db(DB_NAME)
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  cachedClient = client
  return client.db(DB_NAME)
}

const json = (data, status = 200) => NextResponse.json(data, { status })
const err = (msg, status = 400) => NextResponse.json({ error: msg }, { status })

const DEFAULT_DOCTORS = [
  { name: 'Dr. Ashwani Kumar Gupta', title: 'M.D.A.M. Accu Therapy (Raj.), B.Pharma, M.H.A.', specialization: 'Senior Acupressure & Neuro Therapist', experience: '15+ years', photo: '', active: true, order: 1 },
  { name: 'Dr. Chhotelal Singh', title: 'M.D.A.M. Accu Therapy (Raj.)', specialization: 'Electro Acupressure Specialist', experience: '12+ years', photo: '', active: true, order: 2 },
  { name: 'Dr. Santosh Singh', title: 'M.D.A.M. Accu Therapy (Raj.)', specialization: 'Neuro Therapy Specialist', experience: '10+ years', photo: '', active: true, order: 3 },
]

async function ensureDoctorsSeeded(db) {
  const count = await db.collection('doctors').countDocuments({})
  if (count === 0) {
    const now = new Date().toISOString()
    await db.collection('doctors').insertMany(DEFAULT_DOCTORS.map(d => ({ id: uuidv4(), ...d, createdAt: now })))
  }
}

async function handler(request, ctx) {
  const params = await ctx.params
  const segs = (params?.path) || []
  const route = '/' + segs.join('/')
  const method = request.method

  try {
    const db = await getDb()

    if (route === '/' || route === '/health') return json({ ok: true, service: 'clinic-api' })

    // ---------- APPOINTMENTS ----------
    if (route === '/appointments' && method === 'POST') {
      const body = await request.json()
      const { patientName, phone, email, service, date, time, notes } = body
      if (!patientName || !phone || !service || !date || !time) return err('Missing required fields')
      const doc = { id: uuidv4(), patientName, phone, email: email || '', service, date, time, notes: notes || '', status: 'pending', type: 'clinic', createdAt: new Date().toISOString() }
      await db.collection('appointments').insertOne(doc)
      const { _id, ...clean } = doc
      return json({ success: true, appointment: clean })
    }
    if (route === '/appointments' && method === 'GET') {
      const items = await db.collection('appointments').find({}).sort({ createdAt: -1 }).limit(500).toArray()
      return json({ appointments: items.map(({ _id, ...r }) => r) })
    }
    if (segs[0] === 'appointments' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      await db.collection('appointments').updateOne({ id: segs[1] }, { $set: { status: body.status } })
      return json({ success: true })
    }
    if (segs[0] === 'appointments' && segs[1] && method === 'DELETE') {
      await db.collection('appointments').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- HOME VISITS ----------
    if (route === '/home-visits' && method === 'POST') {
      const body = await request.json()
      const { patientName, phone, address, treatment, preferredDate, preferredTime, notes } = body
      if (!patientName || !phone || !address || !preferredDate) return err('Missing required fields')
      const doc = { id: uuidv4(), patientName, phone, address, treatment: treatment || '', preferredDate, preferredTime: preferredTime || '', notes: notes || '', status: 'pending', createdAt: new Date().toISOString() }
      await db.collection('home_visits').insertOne(doc)
      const { _id, ...clean } = doc
      return json({ success: true, request: clean })
    }
    if (route === '/home-visits' && method === 'GET') {
      const items = await db.collection('home_visits').find({}).sort({ createdAt: -1 }).toArray()
      return json({ visits: items.map(({ _id, ...r }) => r) })
    }
    if (segs[0] === 'home-visits' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      await db.collection('home_visits').updateOne({ id: segs[1] }, { $set: { status: body.status } })
      return json({ success: true })
    }

    // ---------- CONTACT ----------
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      const { name, phone, email, message } = body
      if (!name || !phone || !message) return err('Missing required fields')
      const doc = { id: uuidv4(), name, phone, email: email || '', message, status: 'new', createdAt: new Date().toISOString() }
      await db.collection('contacts').insertOne(doc)
      const { _id, ...clean } = doc
      return json({ success: true, enquiry: clean })
    }
    if (route === '/contact' && method === 'GET') {
      const items = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray()
      return json({ enquiries: items.map(({ _id, ...r }) => r) })
    }
    if (segs[0] === 'contact' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      await db.collection('contacts').updateOne({ id: segs[1] }, { $set: { status: body.status } })
      return json({ success: true })
    }

    // ---------- DOCTORS ----------
    if (route === '/doctors' && method === 'GET') {
      await ensureDoctorsSeeded(db)
      const url = new URL(request.url)
      const includeInactive = url.searchParams.get('all') === '1'
      const q = includeInactive ? {} : { active: true }
      const items = await db.collection('doctors').find(q).sort({ order: 1, createdAt: 1 }).toArray()
      return json({ doctors: items.map(({ _id, ...r }) => r) })
    }
    if (route === '/doctors' && method === 'POST') {
      const body = await request.json()
      const { name, title, specialization, experience, photo, active, order } = body
      if (!name) return err('Name required')
      const doc = { id: uuidv4(), name, title: title || '', specialization: specialization || '', experience: experience || '', photo: photo || '', active: active !== false, order: typeof order === 'number' ? order : 99, createdAt: new Date().toISOString() }
      await db.collection('doctors').insertOne(doc)
      const { _id, ...clean } = doc
      return json({ success: true, doctor: clean })
    }
    if (segs[0] === 'doctors' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['name', 'title', 'specialization', 'experience', 'photo', 'active', 'order']
      const update = {}
      for (const k of allowed) if (k in body) update[k] = body[k]
      await db.collection('doctors').updateOne({ id: segs[1] }, { $set: update })
      const doc = await db.collection('doctors').findOne({ id: segs[1] })
      const { _id, ...clean } = doc || {}
      return json({ success: true, doctor: clean })
    }
    if (segs[0] === 'doctors' && segs[1] && method === 'DELETE') {
      await db.collection('doctors').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- ADMIN ----------
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      if (body.password === ADMIN_PASSWORD) return json({ success: true, token: uuidv4() })
      return err('Invalid password', 401)
    }
    if (route === '/admin/stats' && method === 'GET') {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const todayIso = todayStart.toISOString().slice(0, 10)
      const [totalAppts, pending, todays, visits, contacts, doctors] = await Promise.all([
        db.collection('appointments').countDocuments({}),
        db.collection('appointments').countDocuments({ status: 'pending' }),
        db.collection('appointments').countDocuments({ date: todayIso }),
        db.collection('home_visits').countDocuments({}),
        db.collection('contacts').countDocuments({ status: 'new' }),
        db.collection('doctors').countDocuments({ active: true }),
      ])
      return json({ totalAppointments: totalAppts, pendingAppointments: pending, todayAppointments: todays, homeVisits: visits, newEnquiries: contacts, activeDoctors: doctors })
    }

    return err('Not found', 404)
  } catch (e) {
    console.error('API error:', e)
    return err(e.message || 'Server error', 500)
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

// Allow larger payloads (doctor photo as base64)
export const maxDuration = 30
export const runtime = 'nodejs'
