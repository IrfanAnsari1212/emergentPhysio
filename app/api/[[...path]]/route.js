import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { Resend } from 'resend'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'physio_clinic'
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ashwani@123'
const RECOVERY_EMAIL = process.env.ADMIN_RECOVERY_EMAIL || 'irfanking8215@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

const getAdminPassword = async (db) => {
  const a = await db.collection('admin_auth').findOne({ _key: 'main' })
  return a?.password || ENV_ADMIN_PASSWORD
}

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
const clean = (doc) => { if (!doc) return doc; const { _id, ...r } = doc; return r }

const DEFAULT_DOCTORS = [
  { name: 'Dr. Ashwani Kumar Gupta', title: 'M.D.A.M. Accu Therapy (Raj.), B.Pharma, M.H.A.', specialization: 'Senior Acupressure & Neuro Therapist', experience: '5+ years', photo: '', active: true, order: 1 },
  { name: 'Dr. Chhotelal Singh', title: 'M.D.A.M. Accu Therapy (Raj.)', specialization: 'Electro Acupressure Specialist', experience: '12+ years', photo: '', active: true, order: 2 },
  { name: 'Dr. Santosh Singh', title: 'M.D.A.M. Accu Therapy (Raj.)', specialization: 'Neuro Therapy Specialist', experience: '10+ years', photo: '', active: true, order: 3 },
]

const DEFAULT_TESTIMONIALS = [
  { patientName: 'Rajesh Yadav', rating: 5, review: 'After years of back pain, Shri Ramvidya acupressure therapy gave me relief in just 3 weeks. No more medicines!', role: 'Farmer, Dudhi', photo: '', active: true, order: 1 },
  { patientName: 'Sunita Devi', rating: 5, review: 'My mother had paralysis after stroke. The doctors here brought her back to walking again. Truly blessed!', role: 'Daughter', photo: '', active: true, order: 2 },
  { patientName: 'Ankit Singh', rating: 5, review: 'Best clinic in Kushinagar. Frozen shoulder cured completely. Highly professional doctors.', role: 'Businessman', photo: '', active: true, order: 3 },
  { patientName: 'Geeta Sharma', rating: 5, review: 'Sciatica was unbearable. After 2 months of treatment, I am completely pain-free. Thank you doctors!', role: 'Homemaker', photo: '', active: true, order: 4 },
  { patientName: 'Mukesh Patel', rating: 5, review: 'Affordable, effective and caring team. My knee pain is gone after 15 sessions. Highly recommended.', role: 'Shopkeeper', photo: '', active: true, order: 5 },
  { patientName: 'Pooja Verma', rating: 5, review: 'Migraine of 5 years cured with neuro therapy. Could not believe it works so well without medicines.', role: 'Teacher', photo: '', active: true, order: 6 },
]

const DEFAULT_SETTINGS = {
  _key: 'global',
  clinic: {
    name: 'Shri Ramvidya',
    fullName: 'Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy',
    tagline: 'Heal Naturally. Live Pain-Free.',
    description: 'Trusted natural therapy clinic in Dudhi, Kushinagar offering Electro Acupressure & Neuro Therapy for back pain, paralysis, stroke recovery, sciatica, knee and joint pain.',
    logoUrl: '',
    phones: ['7300846971', '8601125240', '9161151496'],
    whatsapp: '917300846971',
    email: 'info@shriramvidya.in',
    address: 'Near PNB Bank, Dudhi',
    city: 'Kushinagar',
    region: 'Uttar Pradesh',
    postal: '274403',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 9:00 AM - 1:00 PM',
    mapsLink: 'https://maps.app.goo.gl/1m8kyhL8UfGWiZyW8',
    mapsEmbed: 'https://www.google.com/maps?q=PNB+Bank+Dudhi+Kushinagar+Uttar+Pradesh&output=embed',
    social: { facebook: '', instagram: '', youtube: '', twitter: '' },
  },
  content: {
    hero: { eyebrow: 'Trusted Clinic in Kushinagar', title: 'Heal Naturally. Live Pain-Free.', subtitle: 'Expert Electro Acupressure & Neuro Therapy for back pain, paralysis, stroke recovery, sciatica, knee & joint pain — drug-free, scientifically proven.' },
    about: { eyebrow: 'About Our Clinic', title: 'Trusted Healing Through Acupressure & Neuro Therapy', paragraph1: 'Shri Ramvidya is a leading therapy clinic located near PNB Bank, Dudhi, Kushinagar. We offer scientifically-backed, drug-free treatment for chronic pain, paralysis, stroke recovery and many other conditions.', paragraph2: 'Our team of certified M.D.A.M. Accu Therapists has helped over 5000 patients reclaim a pain-free life.' },
    stats: [
      { value: '5000+', label: 'Happy Patients' },
      { value: '15+', label: 'Years Experience' },
      { value: '3', label: 'Expert Doctors' },
      { value: '98%', label: 'Success Rate' },
    ],
    whyUs: { eyebrow: 'Why Choose Us', title: 'The Shri Ramvidya Difference', subtitle: 'What makes us the most trusted therapy clinic in Kushinagar.' },
    cta: { title: 'Start Your Healing Journey Today', subtitle: 'Book your appointment online, via WhatsApp, or call us directly. Home visits available.' },
    footer: { tagline: 'Trusted natural therapy clinic in Kushinagar, Uttar Pradesh.' },
  },
  seo: {
    home: {
      title: 'Shri Ramvidya Neurotherapy | Electro Acupressure & Neuro Therapy Clinic in Dudhi, Kushinagar',
      description: 'Trusted natural therapy clinic offering expert treatment for back pain, paralysis, stroke recovery, sciatica & joint pain in Dudhi, Kushinagar.',
      keywords: 'physiotherapy clinic Kushinagar, acupressure Dudhi, neuro therapy, back pain, paralysis recovery',
      ogImage: '',
    },
    services: { title: 'Services | 18+ Specialized Therapy Treatments', description: 'Explore our specialized treatments.' },
    blog: { title: 'Blog | Health Tips & Recovery Stories', description: 'Read articles on natural healing and patient recovery stories.' },
  },
}

async function ensureSeeded(db) {
  const [s, d, t] = await Promise.all([
    db.collection('settings').countDocuments({ _key: 'global' }),
    db.collection('doctors').countDocuments({}),
    db.collection('testimonials').countDocuments({}),
  ])
  const now = new Date().toISOString()
  if (s === 0) await db.collection('settings').insertOne({ ...DEFAULT_SETTINGS, updatedAt: now })
  if (d === 0) await db.collection('doctors').insertMany(DEFAULT_DOCTORS.map(x => ({ id: uuidv4(), ...x, createdAt: now })))
  if (t === 0) await db.collection('testimonials').insertMany(DEFAULT_TESTIMONIALS.map(x => ({ id: uuidv4(), ...x, createdAt: now })))
}

const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

async function handler(request, ctx) {
  const params = await ctx.params
  const segs = (params?.path) || []
  const route = '/' + segs.join('/')
  const method = request.method

  try {
    const db = await getDb()
    await ensureSeeded(db)

    if (route === '/' || route === '/health') return json({ ok: true, service: 'clinic-cms-api' })

    // ---------- SETTINGS (single doc CMS) ----------
    if (route === '/settings' && method === 'GET') {
      const s = await db.collection('settings').findOne({ _key: 'global' })
      return json({ settings: clean(s) })
    }
    if (route === '/settings' && method === 'PUT') {
      const body = await request.json()
      delete body._id; delete body._key
      await db.collection('settings').updateOne({ _key: 'global' }, { $set: { ...body, updatedAt: new Date().toISOString() } }, { upsert: true })
      const s = await db.collection('settings').findOne({ _key: 'global' })
      return json({ success: true, settings: clean(s) })
    }

    // ---------- APPOINTMENTS ----------
    if (route === '/appointments' && method === 'POST') {
      const body = await request.json()
      const { patientName, phone, email, service, date, time, notes } = body
      if (!patientName || !phone || !service || !date || !time) return err('Missing required fields')
      const doc = { id: uuidv4(), patientName, phone, email: email || '', service, date, time, notes: notes || '', status: 'pending', createdAt: new Date().toISOString() }
      await db.collection('appointments').insertOne(doc)
      return json({ success: true, appointment: clean(doc) })
    }
    if (route === '/appointments' && method === 'GET') {
      const items = await db.collection('appointments').find({}).sort({ createdAt: -1 }).limit(1000).toArray()
      return json({ appointments: items.map(clean) })
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
      return json({ success: true, request: clean(doc) })
    }
    if (route === '/home-visits' && method === 'GET') {
      const items = await db.collection('home_visits').find({}).sort({ createdAt: -1 }).toArray()
      return json({ visits: items.map(clean) })
    }
    if (segs[0] === 'home-visits' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      await db.collection('home_visits').updateOne({ id: segs[1] }, { $set: { status: body.status } })
      return json({ success: true })
    }
    if (segs[0] === 'home-visits' && segs[1] && method === 'DELETE') {
      await db.collection('home_visits').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- CONTACT ----------
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      const { name, phone, email, message } = body
      if (!name || !phone || !message) return err('Missing required fields')
      const doc = { id: uuidv4(), name, phone, email: email || '', message, status: 'new', createdAt: new Date().toISOString() }
      await db.collection('contacts').insertOne(doc)
      return json({ success: true, enquiry: clean(doc) })
    }
    if (route === '/contact' && method === 'GET') {
      const items = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray()
      return json({ enquiries: items.map(clean) })
    }
    if (segs[0] === 'contact' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      await db.collection('contacts').updateOne({ id: segs[1] }, { $set: { status: body.status } })
      return json({ success: true })
    }
    if (segs[0] === 'contact' && segs[1] && method === 'DELETE') {
      await db.collection('contacts').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- DOCTORS ----------
    if (route === '/doctors' && method === 'GET') {
      const url = new URL(request.url)
      const all = url.searchParams.get('all') === '1'
      const q = all ? {} : { active: true }
      const items = await db.collection('doctors').find(q).sort({ order: 1, createdAt: 1 }).toArray()
      return json({ doctors: items.map(clean) })
    }
    if (route === '/doctors' && method === 'POST') {
      const body = await request.json()
      if (!body.name) return err('Name required')
      const doc = { id: uuidv4(), name: body.name, title: body.title || '', specialization: body.specialization || '', experience: body.experience || '', timings: body.timings || '', photo: body.photo || '', active: body.active !== false, order: body.order ?? 99, createdAt: new Date().toISOString() }
      await db.collection('doctors').insertOne(doc)
      return json({ success: true, doctor: clean(doc) })
    }
    if (segs[0] === 'doctors' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['name', 'title', 'specialization', 'experience', 'timings', 'photo', 'active', 'order']
      const update = {}; for (const k of allowed) if (k in body) update[k] = body[k]
      await db.collection('doctors').updateOne({ id: segs[1] }, { $set: update })
      const d = await db.collection('doctors').findOne({ id: segs[1] })
      return json({ success: true, doctor: clean(d) })
    }
    if (segs[0] === 'doctors' && segs[1] && method === 'DELETE') {
      await db.collection('doctors').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- CUSTOM SERVICES (admin-created) ----------
    if (route === '/cms-services' && method === 'GET') {
      const url = new URL(request.url)
      const all = url.searchParams.get('all') === '1'
      const q = all ? {} : { active: true }
      const items = await db.collection('cms_services').find(q).sort({ order: 1, createdAt: 1 }).toArray()
      return json({ services: items.map(clean) })
    }
    if (route === '/cms-services' && method === 'POST') {
      const body = await request.json()
      if (!body.title) return err('Title required')
      const doc = {
        id: uuidv4(), slug: body.slug || slugify(body.title), title: body.title, short: body.short || '',
        description: body.description || '', image: body.image || '', iconName: body.iconName || 'Activity',
        symptoms: body.symptoms || [], benefits: body.benefits || [], causes: body.causes || [], process: body.process || [],
        seoTitle: body.seoTitle || '', seoDescription: body.seoDescription || '',
        active: body.active !== false, order: body.order ?? 99,
        createdAt: new Date().toISOString(),
      }
      await db.collection('cms_services').insertOne(doc)
      return json({ success: true, service: clean(doc) })
    }
    if (segs[0] === 'cms-services' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['slug', 'title', 'short', 'description', 'image', 'iconName', 'symptoms', 'benefits', 'causes', 'process', 'seoTitle', 'seoDescription', 'active', 'order']
      const update = {}; for (const k of allowed) if (k in body) update[k] = body[k]
      await db.collection('cms_services').updateOne({ id: segs[1] }, { $set: update })
      const d = await db.collection('cms_services').findOne({ id: segs[1] })
      return json({ success: true, service: clean(d) })
    }
    if (segs[0] === 'cms-services' && segs[1] && method === 'DELETE') {
      await db.collection('cms_services').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- TESTIMONIALS ----------
    if (route === '/testimonials' && method === 'GET') {
      const url = new URL(request.url)
      const all = url.searchParams.get('all') === '1'
      const q = all ? {} : { active: true }
      const items = await db.collection('testimonials').find(q).sort({ order: 1, createdAt: -1 }).toArray()
      return json({ testimonials: items.map(clean) })
    }
    if (route === '/testimonials' && method === 'POST') {
      const body = await request.json()
      if (!body.patientName || !body.review) return err('Patient name and review required')
      const doc = { id: uuidv4(), patientName: body.patientName, rating: body.rating || 5, review: body.review, role: body.role || '', photo: body.photo || '', active: body.active !== false, order: body.order ?? 99, createdAt: new Date().toISOString() }
      await db.collection('testimonials').insertOne(doc)
      return json({ success: true, testimonial: clean(doc) })
    }
    if (segs[0] === 'testimonials' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['patientName', 'rating', 'review', 'role', 'photo', 'active', 'order']
      const update = {}; for (const k of allowed) if (k in body) update[k] = body[k]
      await db.collection('testimonials').updateOne({ id: segs[1] }, { $set: update })
      const d = await db.collection('testimonials').findOne({ id: segs[1] })
      return json({ success: true, testimonial: clean(d) })
    }
    if (segs[0] === 'testimonials' && segs[1] && method === 'DELETE') {
      await db.collection('testimonials').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- GALLERY ----------
    if (route === '/gallery' && method === 'GET') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      const q = category ? { category } : {}
      const items = await db.collection('gallery').find(q).sort({ createdAt: -1 }).toArray()
      return json({ images: items.map(clean) })
    }
    if (route === '/gallery' && method === 'POST') {
      const body = await request.json()
      if (!body.imageUrl) return err('imageUrl required')
      const doc = { id: uuidv4(), imageUrl: body.imageUrl, title: body.title || '', category: body.category || 'general', createdAt: new Date().toISOString() }
      await db.collection('gallery').insertOne(doc)
      return json({ success: true, image: clean(doc) })
    }
    if (segs[0] === 'gallery' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['title', 'category', 'imageUrl']
      const update = {}; for (const k of allowed) if (k in body) update[k] = body[k]
      await db.collection('gallery').updateOne({ id: segs[1] }, { $set: update })
      return json({ success: true })
    }
    if (segs[0] === 'gallery' && segs[1] && method === 'DELETE') {
      await db.collection('gallery').deleteOne({ id: segs[1] })
      return json({ success: true })
    }
    if (route === '/gallery/categories' && method === 'GET') {
      const cats = await db.collection('gallery').distinct('category')
      return json({ categories: cats })
    }

    // ---------- BLOGS ----------
    if (route === '/blogs' && method === 'GET') {
      const url = new URL(request.url)
      const all = url.searchParams.get('all') === '1'
      const q = all ? {} : { published: true }
      const items = await db.collection('blogs').find(q).sort({ publishedAt: -1, createdAt: -1 }).toArray()
      return json({ blogs: items.map(clean) })
    }
    if (segs[0] === 'blogs' && segs[1] === 'slug' && segs[2] && method === 'GET') {
      const b = await db.collection('blogs').findOne({ slug: segs[2] })
      if (!b) return err('Not found', 404)
      return json({ blog: clean(b) })
    }
    if (route === '/blogs' && method === 'POST') {
      const body = await request.json()
      if (!body.title) return err('Title required')
      const slug = body.slug || slugify(body.title)
      const exists = await db.collection('blogs').findOne({ slug })
      if (exists) return err('Slug already exists', 409)
      const now = new Date().toISOString()
      const doc = { id: uuidv4(), slug, title: body.title, excerpt: body.excerpt || '', content: body.content || '', featuredImage: body.featuredImage || '', category: body.category || 'General', author: body.author || 'Admin', tags: body.tags || [], seoTitle: body.seoTitle || '', seoDescription: body.seoDescription || '', published: body.published === true, publishedAt: body.published ? now : null, createdAt: now }
      await db.collection('blogs').insertOne(doc)
      return json({ success: true, blog: clean(doc) })
    }
    if (segs[0] === 'blogs' && segs[1] && method === 'PATCH') {
      const body = await request.json()
      const allowed = ['slug', 'title', 'excerpt', 'content', 'featuredImage', 'category', 'author', 'tags', 'seoTitle', 'seoDescription', 'published']
      const update = {}; for (const k of allowed) if (k in body) update[k] = body[k]
      if ('published' in body) {
        const prev = await db.collection('blogs').findOne({ id: segs[1] })
        if (body.published && !prev?.publishedAt) update.publishedAt = new Date().toISOString()
      }
      await db.collection('blogs').updateOne({ id: segs[1] }, { $set: update })
      const d = await db.collection('blogs').findOne({ id: segs[1] })
      return json({ success: true, blog: clean(d) })
    }
    if (segs[0] === 'blogs' && segs[1] && method === 'DELETE') {
      await db.collection('blogs').deleteOne({ id: segs[1] })
      return json({ success: true })
    }

    // ---------- ADMIN ----------
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      const correctPw = await getAdminPassword(db)
      if (body.password === correctPw) {
        const remember = body.remember === true
        const ttlMs = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        return json({ success: true, token: uuidv4(), expiresAt: Date.now() + ttlMs, remember })
      }
      return err('Invalid password', 401)
    }
    if (route === '/admin/forgot-password' && method === 'POST') {
      if (!resend) return err('Email service not configured', 500)
      const otp = String(Math.floor(100000 + Math.random() * 900000))
      const resetToken = uuidv4()
      const expiresAt = Date.now() + 10 * 60 * 1000
      await db.collection('admin_otps').deleteMany({})
      await db.collection('admin_otps').insertOne({ otp, resetToken, expiresAt, createdAt: new Date().toISOString() })
      try {
        await resend.emails.send({
          from: 'Shri Ramvidya CMS <onboarding@resend.dev>',
          to: [RECOVERY_EMAIL],
          subject: `Your Admin Password Reset Code: ${otp}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#fff">
            <div style="text-align:center;margin-bottom:24px">
              <div style="display:inline-block;width:48px;height:48px;background:#2563eb;border-radius:12px;line-height:48px;color:#fff;font-weight:700;font-size:18px">SR</div>
              <h1 style="color:#0f172a;margin:12px 0 4px">Shri Ramvidya CMS</h1>
              <p style="color:#64748b;margin:0">Admin Password Reset</p>
            </div>
            <p style="color:#334155;font-size:14px">Hello,</p>
            <p style="color:#334155;font-size:14px">You requested to reset the admin password for the Shri Ramvidya clinic website. Use the verification code below:</p>
            <div style="text-align:center;margin:24px 0;padding:20px;background:#f1f5f9;border-radius:12px">
              <div style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;color:#2563eb;letter-spacing:8px">${otp}</div>
              <p style="color:#64748b;font-size:12px;margin:8px 0 0">This code expires in 10 minutes</p>
            </div>
            <p style="color:#334155;font-size:14px">If you did not request this, you can safely ignore this email \u2014 your password will not be changed.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
            <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0">Shri Ramvidya Electro Acupressure Neuro Therapy & Aayu Pharmacy<br/>Near PNB Bank, Dudhi, Kushinagar, UP</p>
          </div>`,
        })
        return json({ success: true, message: `OTP sent to ${RECOVERY_EMAIL.replace(/^(.{3}).+(@.+)$/, '$1***$2')}` })
      } catch (e) {
        console.error('Resend error:', e)
        return err('Failed to send email: ' + (e.message || 'unknown'), 500)
      }
    }
    if (route === '/admin/verify-otp' && method === 'POST') {
      const body = await request.json()
      const rec = await db.collection('admin_otps').findOne({ otp: body.otp })
      if (!rec) return err('Invalid OTP', 400)
      if (rec.expiresAt < Date.now()) { await db.collection('admin_otps').deleteOne({ _id: rec._id }); return err('OTP expired', 400) }
      return json({ success: true, resetToken: rec.resetToken })
    }
    if (route === '/admin/reset-password' && method === 'POST') {
      const body = await request.json()
      if (!body.newPassword || body.newPassword.length < 6) return err('Password must be at least 6 characters')
      const rec = await db.collection('admin_otps').findOne({ resetToken: body.resetToken })
      if (!rec) return err('Invalid or expired reset token', 400)
      if (rec.expiresAt < Date.now()) { await db.collection('admin_otps').deleteOne({ _id: rec._id }); return err('Reset token expired', 400) }
      await db.collection('admin_auth').updateOne({ _key: 'main' }, { $set: { password: body.newPassword, updatedAt: new Date().toISOString() } }, { upsert: true })
      await db.collection('admin_otps').deleteMany({})
      return json({ success: true })
    }
    if (route === '/admin/stats' && method === 'GET') {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const todayIso = todayStart.toISOString().slice(0, 10)
      const [totalAppts, pending, todays, visits, contacts, doctors, testimonials, blogs, services, gallery] = await Promise.all([
        db.collection('appointments').countDocuments({}),
        db.collection('appointments').countDocuments({ status: 'pending' }),
        db.collection('appointments').countDocuments({ date: todayIso }),
        db.collection('home_visits').countDocuments({}),
        db.collection('contacts').countDocuments({ status: 'new' }),
        db.collection('doctors').countDocuments({ active: true }),
        db.collection('testimonials').countDocuments({ active: true }),
        db.collection('blogs').countDocuments({}),
        db.collection('cms_services').countDocuments({}),
        db.collection('gallery').countDocuments({}),
      ])
      return json({
        totalAppointments: totalAppts, pendingAppointments: pending, todayAppointments: todays,
        homeVisits: visits, newEnquiries: contacts, activeDoctors: doctors,
        testimonials, blogs, services, gallery,
      })
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
export const maxDuration = 30
export const runtime = 'nodejs'
