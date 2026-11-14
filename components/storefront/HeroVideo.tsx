'use client';

import { useState, useEffect, useCallback } from 'react';
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
    fitMode: 'cover',
  },
  {
    src: '/resim/magaza-foto/akknet1.jpeg',
    alt: 'Paşaoğlu Mağazaları — Akkent Şubesi Geniş Panoramik Showroom',
    objectPosition: 'center center',
    fitMode: 'cover',
  },
  {
    src: '/resim/magaza-foto/sehre2.png',
    alt: 'Paşaoğlu Mağazaları — Şehreküstü Merkez Şubesi Dış Cephe',
    objectPosition: 'center center',
    fitMode: 'cover',
  },
];

const SLIDE_DURATION_MS = 4800;

export function HeroVideo() {
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let active = true;
    fetchHomepageSlidesFromSupabase()
      .then((liveSlides) => {
        if (!active) return;
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
        } else {
          setSlides(defaultHeroSlides);
        }
      })
      .catch(() => {
        if (active) setSlides(defaultHeroSlides);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalSlides = slides?.length ?? 0;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [nextSlide, currentIndex, totalSlides]);

  const activeSlide = slides && slides.length > 0 ? slides[currentIndex] || slides[0] : null;
  const isContain = activeSlide?.fitMode === 'contain';

  return (
    <section className="group relative w-full h-[260px] min-h-[240px] sm:h-[calc(100vh)] sm:min-h-[560px] overflow-hidden bg-[#0a1322] select-none">
      {/* ─── Yalnızca Aktif Slaytı Render Et (Hızlı İlk Açılış & Düşük Bellek) ─── */}
      <div className="absolute inset-x-0 top-16 sm:top-28 bottom-0 overflow-hidden bg-[radial-gradient(circle_at_center,_#16263f_0%,_#0a1322_100%)]">
        {!activeSlide ? (
          <div className="w-full h-full animate-pulse bg-slate-900/60" />
        ) : (
          <div key={activeSlide.src} className="w-full h-full transition-opacity duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSlide.src}
              alt={activeSlide.alt}
              loading="eager"
              decoding="async"
              draggable={false}
              style={{ objectPosition: activeSlide.objectPosition || 'center center' }}
              className={`w-full h-full select-none ${
                isContain ? 'object-contain p-2 sm:p-4' : 'object-cover'
              }`}
            />
          </div>
        )}

        {/* Üst kenarda navigasyon barı ile yumuşak bütünleşme gölgesi */}
        <div
          className="absolute inset-x-0 top-0 h-20 z-20 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 42, 78, 0.28) 0%, rgba(0, 42, 78, 0) 100%)',
          }}
        />
      </div>

      {/* ─── Sol / Sağ İnce Geçiş Okları ─── */}
      {totalSlides > 1 && (
        <>
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
        </>
      )}

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
