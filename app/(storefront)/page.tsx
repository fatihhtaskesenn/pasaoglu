'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchProductsFromSupabase,
  fetchCampaignsFromSupabase,
} from '@/lib/supabase-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { HeroVideo } from '@/components/storefront/HeroVideo';
import { Product } from '@/types';
import type { InstagramPostItem } from '@/app/api/instagram/route';

interface ApplianceCategory {
  id: string;
  label: string;
  filterFn: (p: Product) => boolean;
  icon: React.ReactNode;
}

const applianceCategories: ApplianceCategory[] = [
  {
    id: 'buzdolabi',
    label: 'BUZDOLABI',
    filterFn: (p) => p.tags.includes('buzdolabi'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="16" y="4" width="32" height="44" rx="3.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="16" y1="20" x2="48" y2="20" stroke="currentColor" strokeWidth="2.2" />
        <line x1="21" y1="10" x2="21" y2="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="21" y1="25" x2="21" y2="36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="37" y="9" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'derin-dondurucu',
    label: 'DERİN DONDURUCU',
    filterFn: (p) => p.tags.includes('derin-dondurucu'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="15" y="4" width="34" height="44" rx="3.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="15" y1="15" x2="49" y2="15" stroke="currentColor" strokeWidth="1.8" />
        <line x1="15" y1="26" x2="49" y2="26" stroke="currentColor" strokeWidth="1.8" />
        <line x1="15" y1="37" x2="49" y2="37" stroke="currentColor" strokeWidth="1.8" />
        <line x1="20" y1="19" x2="20" y2="33" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M35 16v9M30.5 20.5h9M31.8 17.3l6.4 6.4M38.2 17.3l-6.4 6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="27" y1="9.5" x2="37" y2="9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="27" y1="42.5" x2="37" y2="42.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'bulasik-makinesi',
    label: 'BULAŞIK MAKİNESİ',
    filterFn: (p) => p.tags.includes('bulasik-makinesi'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="11" y="5" width="42" height="42" rx="3.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="11" y1="14" x2="53" y2="14" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="8.5" width="10" height="3" rx="1" fill="currentColor" />
        <circle cx="43" cy="10" r="1.6" fill="currentColor" />
        <circle cx="48" cy="10" r="1.6" fill="currentColor" />
        <rect x="16" y="19" width="32" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="24" cy="31" r="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="31" cy="31" r="5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M39 26h5v6a2.5 2.5 0 0 1-5 0v-6z" stroke="currentColor" strokeWidth="1.8" />
        <line x1="18" y1="37" x2="46" y2="37" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'camasir-makinesi',
    label: 'ÇAMAŞIR MAKİNESİ',
    filterFn: (p) => p.tags.includes('camasir-makinesi'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="12" y="5" width="40" height="42" rx="4" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="12" y1="15" x2="52" y2="15" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="8.5" width="9" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="32" cy="10.2" r="2.2" fill="currentColor" />
        <circle cx="45" cy="10.2" r="1.5" fill="currentColor" />
        <circle cx="32" cy="31" r="10.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.16" />
        <circle cx="32" cy="31" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M26 32c2-2.5 4-2.5 6 0s4 2.5 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'kurutma-makinesi',
    label: 'KURUTMA MAKİNESİ',
    filterFn: (p) => p.tags.includes('kurutma-makinesi'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="12" y="5" width="40" height="42" rx="4" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="12" y1="15" x2="52" y2="15" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="8.5" width="9" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="32" cy="10.2" r="2.2" fill="currentColor" />
        <rect x="40" y="8.8" width="8" height="3" rx="1" fill="currentColor" />
        <circle cx="32" cy="29.5" r="9.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.16" />
        <path d="M27.5 27.5c1.5-2 3-2 4.5 0s3 2 4.5 0M27.5 31.5c1.5-2 3-2 4.5 0s3 2 4.5 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="44" cy="42" r="2.8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
        <line x1="16" y1="42" x2="28" y2="42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ocaklar',
    label: 'FIRIN & OCAK',
    filterFn: (p) => p.tags.includes('ocak') || p.tags.includes('firin'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <path d="M14 8h8M28 8h8M42 8h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="10" y="11" width="44" height="36" rx="3.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <line x1="10" y1="19" x2="54" y2="19" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="15" r="1.6" fill="currentColor" />
        <circle cx="25" cy="15" r="1.6" fill="currentColor" />
        <circle cx="32" cy="15" r="1.6" fill="currentColor" />
        <circle cx="39" cy="15" r="1.6" fill="currentColor" />
        <circle cx="46" cy="15" r="1.6" fill="currentColor" />
        <rect x="17" y="24" width="30" height="17" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.18" />
        <line x1="22" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'davlumbaz',
    label: 'DAVLUMBAZ',
    filterFn: (p) => p.tags.includes('davlumbaz'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <path d="M26 5h12v17H26V5z" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.14" />
        <path d="M10 34l16-12h12l16 12v4H10v-4z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" fill="currentColor" fillOpacity="0.18" />
        <line x1="15" y1="35" x2="49" y2="35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 45c0-2 1.5-3 1.5-5M32 45v-5M42 45c0-2-1.5-3-1.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'televizyon',
    label: 'TELEVİZYON',
    filterFn: (p) => p.category === 'tv-ses-sistemleri' || p.tags.includes('smart-tv'),
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <rect x="7" y="8" width="50" height="30" rx="2.5" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.18" />
        <path d="M14 14l8 16M22 14l5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
        <path d="M28 38v6M36 38v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M20 44h24" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'kucuk-ev-aletleri',
    label: 'KÜÇÜK EV ALETLERİ',
    filterFn: (p) => p.category === 'kucuk-ev-aletleri',
    icon: (
      <svg viewBox="0 0 64 52" fill="none" className="w-11 h-9">
        <path d="M15 11h14l-2 18h-10L15 11z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.14" />
        <path d="M13 11h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M29 14h4v8h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="16" y="29" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="22" cy="36" r="2" fill="currentColor" />
        <path d="M36 22h12l2 14a3 3 0 0 1-3 3H37a3 3 0 0 1-3-3l2-14z" stroke="currentColor" strokeWidth="2.2" fill="currentColor" fillOpacity="0.14" />
        <path d="M48 25h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" />
        <line x1="35" y1="43" x2="50" y2="43" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'klimalar',
    label: 'KLİMALAR',
    filterFn: (p) => p.category === 'klima' || p.tags.includes('klima'),
    icon: (
      <svg viewBox="0 0 64 48" fill="none" className="w-11 h-9">
        <rect x="6" y="6" width="52" height="22" rx="4" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
        <circle cx="20" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M20 11v10M15 16h10M16.5 12.5l7 7M23.5 12.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="32" y1="13" x2="50" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="18" x2="46" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="24" x2="54" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 32c0 4-3 6-3 10M32 32v10M46 32c0 4 3 6 3 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
    ),
  },
];

const initialInstagramPosts: InstagramPostItem[] = [
  {
    id: 'ig-post-1',
    image: '/resim/kampanyalar/k1.jpeg',
    title: 'Kampanyaya Özel 4K Ultra HD / Android Smart TV (55PA525EQG) — 45.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-2',
    image: '/resim/kampanyalar/k2.jpeg',
    title: 'İkili Alımlara Özel 9 Kg Çamaşır & Kurutma Makinesi — 49.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-3',
    image: '/resim/kampanyalar/k3.jpeg',
    title: 'Kampanyaya Özel A++ Enerji Verimli Buzdolabı (RF4210W) — 89.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
  {
    id: 'ig-post-4',
    image: '/resim/kampanyalar/k4.jpeg',
    title: 'Kampanyaya Özel 4 Programlı Bulaşık Makinesi (BM4210MA) — 15.999 ₺',
    permalink: 'https://www.instagram.com/pasaoglu_profilo/',
  },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [igPosts, setIgPosts] = useState<InstagramPostItem[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchProductsFromSupabase()
      .then((liveProducts) => {
        if (!active) return;
        setProducts(liveProducts);
        setProductsLoading(false);
      })
      .catch(() => {
        if (active) setProductsLoading(false);
      });

    fetchCampaignsFromSupabase()
      .then((liveCampaigns) => {
        if (!active) return;
        if (liveCampaigns.length > 0) {
          setIgPosts(
            liveCampaigns.slice(0, 4).map((c) => ({
              id: c.id,
              image: c.image_url,
              title: c.title,
              permalink: c.target_url || '/setler',
            }))
          );
          setCampaignsLoading(false);
          return;
        }

        fetch('/api/instagram')
          .then((res) => res.json())
          .then((data) => {
            if (!active) return;
            if (Array.isArray(data?.posts) && data.posts.length > 0) {
              setIgPosts(data.posts.slice(0, 4));
            } else {
              setIgPosts(initialInstagramPosts);
            }
          })
          .catch(() => {
            if (active) setIgPosts(initialInstagramPosts);
          })
          .finally(() => {
            if (active) setCampaignsLoading(false);
          });
      })
      .catch(() => {
        if (active) {
          setIgPosts(initialInstagramPosts);
          setCampaignsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedCatObj = applianceCategories.find((c) => c.id === activeCategory);
  const displayedProducts = selectedCatObj
    ? products.filter(selectedCatObj.filterFn)
    : [...products].sort((a, b) => {
        const idxA = applianceCategories.findIndex((cat) => cat.filterFn(a));
        const idxB = applianceCategories.findIndex((cat) => cat.filterFn(b));
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      });

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ─── Hero Video (Sade, Çizgisiz, Butonsuz Tam Ekran Video) ─── */}
      <HeroVideo />

      {/* ─── 10-Category Appliance Bar & Instagram Campaign Posts ─── */}
      <section className="max-w-screen-xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-12 sm:pb-24 relative z-20">
        {/* Category Strip */}
        <div className="mb-5 sm:mb-12">
          <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 sm:gap-2.5">
            {applianceCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-3.5 flex flex-col items-center justify-between gap-1 sm:gap-2 text-center transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#003d6e] text-white ring-2 ring-amber-400 shadow-xl shadow-[#005596]/30 -translate-y-1'
                      : 'bg-gradient-to-b from-[#005da3] to-[#004b84] hover:from-[#0066b3] hover:to-[#005596] text-white shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-[#005596]/25 hover:-translate-y-1'
                  }`}
                >
                  {/* Subtle top highlight line */}
                  <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                  {/* Appliance SVG Icon */}
                  <div className="w-7 h-7 sm:w-11 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 group-hover:bg-white/15 border border-white/15 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-7 sm:[&>svg]:h-7">
                    {cat.icon}
                  </div>

                  {/* Category Label */}
                  <span className="font-display text-[8.5px] sm:text-[11px] font-bold tracking-tight sm:tracking-wider uppercase leading-[1.15] sm:leading-tight text-white drop-shadow-xs min-h-[20px] sm:min-h-0 flex items-center justify-center text-center break-words w-full">
                    {cat.label}
                  </span>

                  {/* Active bottom indicator */}
                  <div
                    className={`h-1 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'w-8 bg-amber-400'
                        : 'w-0 group-hover:w-5 bg-white/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Filter Status Pill */}
          <AnimatePresence>
            {selectedCatObj && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5 flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs"
              >
                <span className="text-xs sm:text-sm text-slate-700">
                  Seçili Kategori:{' '}
                  <strong className="text-[#005596] font-bold">{selectedCatObj.label}</strong> (
                  {displayedProducts.length} ürün)
                </span>
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#005596] transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Tümünü Göster</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Latest 4 Instagram Campaign Posts (Directly Under Category Strip) ─── */}
        {!selectedCatObj && (
          <div className="mb-6 sm:mb-16">
            {campaignsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[54/77] rounded-lg sm:rounded-xl bg-slate-200/70 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {igPosts.slice(0, 4).map((post) => (
                  <div
                    key={post.id}
                    className="relative aspect-[54/77] rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={post.image.startsWith('http')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Grid — Supabase Canlı Ürünler */}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 sm:h-96 rounded-xl sm:rounded-2xl bg-white border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            <p className="text-base font-bold text-slate-800">
              {selectedCatObj
                ? `${selectedCatObj.label} kategorisinde henüz ürün bulunmuyor.`
                : 'Katalogda henüz yayınlanmış ürün bulunmuyor.'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Admin panelinden (<code className="font-mono text-[#005596]">/admin/urunler</code>) yeni ürün ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
