'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchHomepageSlidesFromSupabase } from '@/lib/supabase-data';

interface HeroSlide {
  src: string;
  alt: string;
  objectPosition?: string;
  fitMode?: 'cover' | 'contain';
}

const defaultHeroSlides: HeroSlide[] = [
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
  const [slides, setSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHomepageSlidesFromSupabase().then((liveSlides) => {
      if (liveSlides.length > 0) {
        setSlides(
          liveSlides.map((s) => ({
            src: s.image_url,
            alt: s.title || 'Paşaoğlu Mağazaları',
            objectPosition: 'center center',
            fitMode: s.fit_mode || 'contain',
          }))
        );
        setCurrentIndex(0);
      }
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [nextSlide, currentIndex, slides.length]);

  return (
    <section className="group relative w-full h-[260px] min-h-[240px] sm:h-[calc(100vh)] sm:min-h-[560px] overflow-hidden bg-[#0a1322] select-none">
      {/* ─── Full HD Fotoğraf Kesintisiz Döngü & Sinematik Geçiş Katmanı ─── */}
      <div className="absolute inset-x-0 top-16 sm:top-28 bottom-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isContain = slide.fitMode === 'contain';
          return (
            <motion.div
              key={`${slide.src}-${index}`}
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
              {isContain && (
                /* Tam Sığdır modunda kenar boşluklarını yumuşak bulanık arka planla doldur */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-45 select-none pointer-events-none"
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="eager"
                decoding="sync"
                draggable={false}
                style={{ objectPosition: slide.objectPosition || 'center center' }}
                className={`relative z-10 w-full h-full select-none ${
                  isContain ? 'object-contain p-2 sm:p-4' : 'object-cover'
                }`}
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
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/45 sm:bg-slate-900/35 hover:bg-[#005596]/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
      >
        <ChevronLeft size={18} className="sm:w-[22px] sm:h-[22px]" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Sonraki Fotoğraf"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-900/45 sm:bg-slate-900/35 hover:bg-[#005596]/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg"
      >
        <ChevronRight size={18} className="sm:w-[22px] sm:h-[22px]" />
      </button>

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
