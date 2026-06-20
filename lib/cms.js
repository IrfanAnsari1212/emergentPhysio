// Server-side CMS helpers
import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'physio_clinic'

let cached = null
async function getDb() {
  if (cached) return cached.db(DB_NAME)
  const client = new MongoClient(MONGO_URL)
  await client.connect()
  cached = client
  return client.db(DB_NAME)
}

const clean = d => { if (!d) return d; const { _id, ...r } = d; return r }

export async function getSettings() {
  try { const db = await getDb(); const s = await db.collection('settings').findOne({ _key: 'global' }); return clean(s) || {} }
  catch { return {} }
}
export async function getTestimonials() {
  try { const db = await getDb(); const items = await db.collection('testimonials').find({ active: true }).sort({ order: 1, createdAt: -1 }).toArray(); return items.map(clean) }
  catch { return [] }
}
export async function getDoctors() {
  try { const db = await getDb(); const items = await db.collection('doctors').find({ active: true }).sort({ order: 1 }).toArray(); return items.map(clean) }
  catch { return [] }
}
export async function getCmsServices() {
  try { const db = await getDb(); const items = await db.collection('cms_services').find({ active: true }).sort({ order: 1 }).toArray(); return items.map(clean) }
  catch { return [] }
}
export async function getBlogs({ limit = 50, all = false } = {}) {
  try { const db = await getDb(); const q = all ? {} : { published: true }; const items = await db.collection('blogs').find(q).sort({ publishedAt: -1, createdAt: -1 }).limit(limit).toArray(); return items.map(clean) }
  catch { return [] }
}
export async function getBlogBySlug(slug) {
  try { const db = await getDb(); const b = await db.collection('blogs').findOne({ slug, published: true }); return clean(b) }
  catch { return null }
}
export async function getGallery({ category } = {}) {
  try { const db = await getDb(); const q = category ? { category } : {}; const items = await db.collection('gallery').find(q).sort({ createdAt: -1 }).toArray(); return items.map(clean) }
  catch { return [] }
}
