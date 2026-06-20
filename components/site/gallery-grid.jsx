'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState(null)
  if (!images?.length) return <div className="text-center text-slate-500 py-12">No images yet.</div>
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <motion.button key={img.id} whileHover={{ scale: 1.02 }} onClick={() => setActive(img)} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img src={img.imageUrl} alt={img.title || 'Gallery image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {img.title && <div className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{img.title}</div>}
          </motion.button>
        ))}
      </div>
      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out">
          <button onClick={() => setActive(null)} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><X className="h-5 w-5" /></button>
          <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={active.imageUrl} alt={active.title} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
          {active.title && <div className="absolute bottom-6 left-0 right-0 text-center text-white text-sm">{active.title}</div>}
        </div>
      )}
    </>
  )
}
