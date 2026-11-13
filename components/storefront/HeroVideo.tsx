'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  src: string;
  alt: string;
  objectPosition?: string;
}

const heroSlides: HeroSlide[] = [
  {
    src: '/resim/magaza-foto/akkent4.png',
    alt: 'Paşaoğlu Mağazaları — Akkent Profilo Yetkili Satış Mağazası Dış Cephe',
    objectPosition: 'center center',
  },
  {
    src: '/resim/magaza-foto/akknet1.jpeg',
    alt: 'Paşaoğlu Mağazaları — Akkent Şubesi Geniş Panoramik Showroom',
    objectPosition: 'center center',
  },
  {
    src: '/resim/magaza-foto/sehre2.png',
    alt: 'Paşaoğlu Mağazaları — Şehreküstü Merkez Şubesi Dış Cephe',
    objectPosition: 'center center',
  },
  {
    src: '/resim/magaza-foto/akkent3.jpeg',
    alt: 'Paşaoğlu Mağazaları — Televizyon, Küçük Ev Aletleri ve Deneyim Alanı',
    objectPosition: 'center center',
  },
  {
    src: '/resim/magaza-foto/sehre1.jpeg',
    alt: 'Paşaoğlu Mağazaları — Şehreküstü Beyaz Eşya ve Buzdolabı Reyonu',
    objectPosition: 'center center',
  },
  {
    src: '/resim/magaza-foto/sehre3.jpeg',
    alt: 'Paşaoğlu Mağazaları — Smart TV ve Ankastre Mağaza Koridoru',
    objectPosition: 'center center',
  },
];

const SLIDE_DURATION_MS = 4800;

export function HeroVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [nextSlide, currentIndex]);

  return (
    <section className="group relative w-full h-[calc(100vh)] min-h-[560px] overflow-hidden bg-[#0a1322] select-none">
      {/* ─── Full HD 6-Fotoğraf Kesintisiz Döngü & Sinematik Geçiş Katmanı ─── */}
      <div className="absolute inset-x-0 top-20 sm:top-28 bottom-0 overflow-hidden">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <motion.div
              key={slide.src}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.055,
                filter: isActive ? 'blur(0px)' : 'blur(6px)',
              }}
              transition={{
                opacity: { duration: 1.35, ease: [0.22, 1, 0.36, 1] },
                scale: {
                  duration: isActive ? 5.2 : 1.35,
                  ease: isActive ? 'easeOut' : 'easeInOut',
                },
                filter: { duration: 0.9, ease: 'easeOut' },
              }}
              style={{
                zIndex: isActive ? 10 : 1,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              className="absolute inset-0 w-full h-full will-change-[opacity,transform,filter]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="eager"
                decoding="sync"
                draggable={false}
                style={{ objectPosition: slide.objectPosition || 'center center' }}
                className="w-full h-full object-cover select-none"
              />
            </motion.div>
          );
        })}

        {/* Üst kenarda navigasyon barı ile yumuşak bütünleşme gölgesi */}
        <div
          className="absolute inset-x-0 top-0 h-20 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 42, 78, 0.28) 0%, rgba(0, 42, 78, 0) 100%)',
          }}
        />
      </div>

      {/* ─── Sol / Sağ İnce Geçiş Okları (Hover'da Belirir) ─── */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Önceki Fotoğraf"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/35 hover:bg-[#005596]/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Sonraki Fotoğraf"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/35 hover:bg-[#005596]/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
      >
        <ChevronRight size={22} />
      </button>

      {/* ─── Alt İlerleme Çubukları (6 Fotoğraf Döngü Göstergesi) ─── */}
      <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/35 backdrop-blur-md border border-white/15">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`${idx + 1}. Mağaza Fotoğrafı`}
              className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                isActive ? 'w-9 bg-white/30' : 'w-2.5 bg-white/45 hover:bg-white/75'
              }`}
            >
              {isActive && (
                <motion.span
                  key={`progress-${currentIndex}`}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                  className="absolute inset-y-0 left-0 bg-amber-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Alt Kısımda Sayfa Zeminine (#f8fafc) Yumuşak Geçiş ─── */}
      <div
        className="absolute inset-x-0 -bottom-px h-28 sm:h-36 z-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(248, 250, 252, 0) 0%, rgba(248, 250, 252, 0.08) 30%, rgba(248, 250, 252, 0.32) 60%, rgba(248, 250, 252, 0.74) 85%, #f8fafc 100%)',
        }}
      />
    </section>
  );
}
