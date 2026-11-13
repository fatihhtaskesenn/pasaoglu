'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProductsFromSupabase } from '@/lib/supabase-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { matchesProductSearch, formatPrice, normalizeSearchText } from '@/lib/utils';
import { Product } from '@/types';
import {
  Search,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Truck,
  Wrench,
  ArrowRight,
  Package,
  Filter,
  Sparkles,
  Check,
} from 'lucide-react';

interface CatalogTab {
  id: string;
  label: string;
  match: (p: Product) => boolean;
}

interface SubFilterChip {
  id: string;
  label: string;
  keywords: string[];
}

const catalogTabs: CatalogTab[] = [
  {
    id: 'all',
    label: 'Tüm Ürünler',
    match: () => true,
  },
  {
    id: 'buzdolabi',
    label: 'Buzdolabı',
    match: (p) => p.tags.includes('buzdolabi'),
  },
  {
    id: 'derin-dondurucu',
    label: 'Derin Dondurucu',
    match: (p) => p.tags.includes('derin-dondurucu'),
  },
  {
    id: 'bulasik-makinesi',
    label: 'Bulaşık Makinesi',
    match: (p) => p.tags.includes('bulasik-makinesi'),
  },
  {
    id: 'camasir-makinesi',
    label: 'Çamaşır Makinesi',
    match: (p) => p.tags.includes('camasir-makinesi'),
  },
  {
    id: 'kurutma-makinesi',
    label: 'Kurutma Makinesi',
    match: (p) => p.tags.includes('kurutma-makinesi'),
  },
  {
    id: 'ocak',
    label: 'Fırın & Ocak',
    match: (p) => p.tags.includes('ocak') || p.tags.includes('firin'),
  },
  {
    id: 'davlumbaz',
    label: 'Davlumbaz',
    match: (p) => p.tags.includes('davlumbaz'),
  },
  {
    id: 'tv-ses-sistemleri',
    label: 'Televizyon',
    match: (p) => p.category === 'tv-ses-sistemleri' || p.tags.includes('smart-tv'),
  },
  {
    id: 'kucuk-ev-aletleri',
    label: 'Küçük Ev Aletleri',
    match: (p) => p.category === 'kucuk-ev-aletleri',
  },
  {
    id: 'klima',
    label: 'Klimalar',
    match: (p) => p.category === 'klima' || p.tags.includes('klima'),
  },
];

const categorySubFilters: Record<string, SubFilterChip[]> = {
  buzdolabi: [
    { id: 'ustten', label: 'Üstten Donduruculu', keywords: ['üstten donduruculu'] },
    { id: 'alttan', label: 'Alttan Donduruculu (Kombi)', keywords: ['alttan donduruculu', 'kombi'] },
    { id: 'gardirop', label: 'Gardırop Tipi', keywords: ['gardırop', 'gardirop', 'xxl'] },
    { id: 'nofrost', label: 'No-Frost', keywords: ['no-frost', 'nofrost'] },
    { id: 'inox', label: 'Inox', keywords: ['inox'] },
    { id: 'beyaz', label: 'Beyaz', keywords: ['beyaz'] },
    { id: 'siyah', label: 'Siyah Cam', keywords: ['siyah'] },
  ],
  'derin-dondurucu': [
    { id: '6-cekmece', label: '6 Çekmeceli', keywords: ['6 çekmeceli', '6-cekmeceli'] },
    { id: '7-cekmece', label: '7 Çekmeceli', keywords: ['7 çekmeceli', '7-cekmeceli'] },
    { id: '8-cekmece', label: '8 Çekmeceli', keywords: ['8 çekmeceli', '8-cekmeceli'] },
    { id: 'sandik', label: 'Sandık Tipi', keywords: ['sandık'] },
    { id: 'nofrost', label: 'No-Frost', keywords: ['no-frost', 'nofrost'] },
    { id: 'lowfrost', label: 'LowFrost', keywords: ['lowfrost'] },
    { id: 'inox', label: 'Inox', keywords: ['inox'] },
  ],
  'bulasik-makinesi': [
    { id: '3-prog', label: '3 Programlı', keywords: ['3 program'] },
    { id: '4-prog', label: '4 Programlı', keywords: ['4 program'] },
    { id: '5-prog', label: '5 Programlı', keywords: ['5 program'] },
    { id: '6-prog', label: '6+ Programlı', keywords: ['6 program', '7 program', '8 program'] },
    { id: 'inox', label: 'Inox', keywords: ['inox'] },
    { id: 'beyaz', label: 'Beyaz', keywords: ['beyaz'] },
    { id: 'siyah', label: 'Siyah', keywords: ['siyah'] },
  ],
  'camasir-makinesi': [
    { id: '8kg', label: '8 Kg', keywords: ['8 kg', '8-kg'] },
    { id: '9kg', label: '9 Kg', keywords: ['9 kg', '9-kg'] },
    { id: '10kg', label: '10 Kg', keywords: ['10 kg', '10-kg'] },
    { id: '11kg', label: '11+ Kg', keywords: ['11 kg', '12 kg', '11-kg'] },
    { id: '1200d', label: '1200 Devir', keywords: ['1200 devir'] },
    { id: '1400d', label: '1400 Devir', keywords: ['1400 devir'] },
    { id: 'buhar', label: 'Buhar Destekli', keywords: ['buhar'] },
  ],
  'kurutma-makinesi': [
    { id: '8kg', label: '8 Kg', keywords: ['8 kg', '8-kg'] },
    { id: '9kg', label: '9 Kg', keywords: ['9 kg', '9-kg'] },
    { id: '10kg', label: '10 Kg', keywords: ['10 kg', '10-kg'] },
    { id: 'isi-pompali', label: 'Isı Pompalı', keywords: ['ısı pompalı', 'isi-pompali', 'heat-pump'] },
    { id: 'a3', label: 'A+++ Enerji', keywords: ['a+++'] },
    { id: 'a2', label: 'A++ Enerji', keywords: ['a++'] },
  ],
  ocak: [
    { id: 'ank-firin', label: 'Ankastre Fırın', keywords: ['ankastre fırın'] },
    { id: 'ank-ocak', label: 'Ankastre Ocak', keywords: ['ankastre ocak', 'gazlı ocak'] },
    { id: 'ank-set', label: 'Ankastre 3’lü Set', keywords: ['3’lü set', '3lü set', 'ankastre set'] },
    { id: 'solo', label: 'Solo Fırın', keywords: ['solo'] },
    { id: 'siyah-cam', label: 'Siyah Cam', keywords: ['siyah cam', 'siyah'] },
    { id: 'beyaz-cam', label: 'Beyaz Cam', keywords: ['beyaz cam', 'beyaz'] },
    { id: 'inox', label: 'Inox', keywords: ['inox'] },
  ],
  davlumbaz: [
    { id: '60cm', label: '60 cm', keywords: ['60 cm', '60cm'] },
    { id: '90cm', label: '90 cm', keywords: ['90 cm', '90cm'] },
    { id: 'egimli', label: 'Eğimli Cam', keywords: ['eğimli'] },
    { id: 'piramit', label: 'Piramit Tipi', keywords: ['piramit'] },
    { id: 'siyah', label: 'Siyah', keywords: ['siyah'] },
    { id: 'beyaz', label: 'Beyaz', keywords: ['beyaz'] },
  ],
  'tv-ses-sistemleri': [
    { id: '43', label: '43"', keywords: ['43"', '43 inç', '109 ekran'] },
    { id: '50', label: '50"', keywords: ['50"', '50 inç', '127 ekran'] },
    { id: '55', label: '55"', keywords: ['55"', '55 inç', '139 ekran'] },
    { id: '65', label: '65"', keywords: ['65"', '65 inç', '165 ekran'] },
    { id: '75', label: '75"', keywords: ['75"', '75 inç', '190 ekran'] },
    { id: '4k', label: '4K Ultra HD', keywords: ['4k', 'uhd', 'ultra hd'] },
    { id: 'qled', label: 'QLED', keywords: ['qled'] },
    { id: 'android', label: 'Android / Google TV', keywords: ['android', 'google tv'] },
  ],
  klima: [
    { id: '9000', label: '9.000 BTU', keywords: ['9.000', '9000'] },
    { id: '12000', label: '12.000 BTU', keywords: ['12.000', '12000'] },
    { id: '18000', label: '18.000 BTU', keywords: ['18.000', '18000'] },
    { id: '24000', label: '24.000 BTU', keywords: ['24.000', '24000'] },
    { id: 'wifi', label: 'Wi-Fi Kontrollü', keywords: ['wi-fi', 'wifi'] },
  ],
  'kucuk-ev-aletleri': [
    { id: 'supurge', label: 'Elektrikli & Dikey Süpürge', keywords: ['süpürge', 'supurge', 'hepa'] },
    { id: 'robot', label: 'Robot Süpürge', keywords: ['robot', 'lidar', 'paspas'] },
    { id: 'kahve', label: 'Çay & Kahve Makinesi', keywords: ['kahve', 'çay', 'kettle', 'karaf'] },
    { id: 'blender', label: 'Blender & Mutfak Robotu', keywords: ['blender', 'mikser', 'rondo', 'doğrayıcı'] },
    { id: 'tost', label: 'Tost & Izgara / Airfryer', keywords: ['tost', 'izgara', 'airfryer'] },
    { id: 'utu', label: 'Ütü', keywords: ['ütü', 'utu'] },
    { id: 'bakim', label: 'Kişisel Bakım', keywords: ['saç kurutma', 'fön', 'difüzör', 'kisisel-bakim'] },
  ],
};

type PriceRangeId = 'all' | 'under-10k' | '10k-25k' | '25k-40k' | 'over-40k';

const priceRanges: { id: PriceRangeId; label: string }[] = [
  { id: 'all', label: 'Tüm Fiyat Aralıkları' },
  { id: 'under-10k', label: '10.000 ₺ Altı' },
  { id: '10k-25k', label: '10.000 ₺ – 25.000 ₺' },
  { id: '25k-40k', label: '25.000 ₺ – 40.000 ₺' },
  { id: 'over-40k', label: '40.000 ₺ ve Üzeri' },
];

function mapQueryParamToTab(param: string | null): string {
  if (!param) return 'all';
  if (param === 'beyaz-esya') return 'buzdolabi';
  if (param === 'firin') return 'ocak';
  const found = catalogTabs.find((t) => t.id === param);
  return found ? found.id : 'all';
}

const popularSearchTerms = ['No-Frost', 'Inox', '9 Kg', '4K TV', 'Inverter', 'Robot Süpürge'];

function UrunlerContent() {
  const searchParams = useSearchParams();
  const kategoriParam = searchParams.get('kategori');
  const aramaParam = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>(() =>
    mapQueryParamToTab(kategoriParam)
  );
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState(aramaParam);
  const [searchFocused, setSearchFocused] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRangeId>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>(
    'default'
  );

  useEffect(() => {
    fetchProductsFromSupabase().then((data) => {
      setProducts(data);
      setLoadingProducts(false);
    });
  }, []);

  useEffect(() => {
    if (kategoriParam) {
      setSelectedTab(mapQueryParamToTab(kategoriParam));
      setSelectedSubFilters([]);
    }
  }, [kategoriParam]);

  useEffect(() => {
    if (aramaParam) {
      setSearchQuery(aramaParam);
    }
  }, [aramaParam]);

  const handleTabSelect = (tabId: string) => {
    setSelectedTab(tabId);
    setSelectedSubFilters([]);
  };

  const toggleSubFilter = (chipId: string) => {
    setSelectedSubFilters((prev) =>
      prev.includes(chipId) ? prev.filter((id) => id !== chipId) : [...prev, chipId]
    );
  };

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of catalogTabs) {
      counts[tab.id] = products.filter(tab.match).length;
    }
    return counts;
  }, [products]);

  const activeSubChips = categorySubFilters[selectedTab] || [];

  const filteredProducts = useMemo(() => {
    const currentTabObj = catalogTabs.find((t) => t.id === selectedTab) || catalogTabs[0];

    return products
      .filter((product) => {
        if (!currentTabObj.match(product)) {
          return false;
        }

        if (onlyDiscounted && !(product.discountedPrice && product.discountedPrice < product.price)) {
          return false;
        }

        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        if (selectedSubFilters.length > 0 && activeSubChips.length > 0) {
          const searchableText = normalizeSearchText(
            [
              product.name,
              product.description,
              ...product.features,
              ...product.tags,
            ].join(' ')
          );

          const matchesAllSelected = selectedSubFilters.every((subId) => {
            const chipDef = activeSubChips.find((c) => c.id === subId);
            if (!chipDef) return true;
            return chipDef.keywords.some((kw) => searchableText.includes(normalizeSearchText(kw)));
          });

          if (!matchesAllSelected) return false;
        }

        const effectivePrice = product.discountedPrice ?? product.price;
        if (priceRange === 'under-10k' && effectivePrice >= 10000) return false;
        if (priceRange === '10k-25k' && (effectivePrice < 10000 || effectivePrice > 25000)) {
          return false;
        }
        if (priceRange === '25k-40k' && (effectivePrice < 25000 || effectivePrice > 40000)) {
          return false;
        }
        if (priceRange === 'over-40k' && effectivePrice <= 40000) return false;

        if (searchQuery.trim() && !matchesProductSearch(product, searchQuery)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice ?? a.price;
        const priceB = b.discountedPrice ?? b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [
    products,
    selectedTab,
    selectedSubFilters,
    activeSubChips,
    onlyDiscounted,
    onlyInStock,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const activeTabLabel =
    catalogTabs.find((t) => t.id === selectedTab)?.label || 'Tüm Ürünler';

  const hasActiveFilters =
    selectedTab !== 'all' ||
    selectedSubFilters.length > 0 ||
    onlyDiscounted ||
    onlyInStock ||
    priceRange !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'default';

  const clearFilters = () => {
    setSelectedTab('all');
    setSelectedSubFilters([]);
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setPriceRange('all');
    setSearchQuery('');
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-20 sm:pt-28 pb-14 sm:pb-24">
      {/* ─── Üst Kurumsal Banner ─────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#003e70] via-[#005596] to-[#004478] text-white border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-sky-200 bg-white/10 px-3 py-1 rounded-full">
                Profilo Yetkili Satış Mağazaları
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Ürün Kataloğu
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/85 leading-relaxed">
                Gaziantep Akkent ve Şehreküstü mağazalarımızda resmi BSH / Profilo garantisiyle
                sunulan güncel beyaz eşya, ankastre, iklimlendirme, televizyon ve küçük ev aletleri.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-blue-100/90 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/15">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-300" />
                <span>Resmi Yetkili Bayi Garantisi</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-sky-300" />
                <span>Gaziantep İçi Ücretsiz Teslimat</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench size={16} className="text-sky-300" />
                <span>Yetkili Servis Kurulumu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 pt-7 space-y-5">
        {/* ─── Kibar ve Zarif Kategori & Filtre Paneli ─── */}
        <div className="bg-white/95 backdrop-blur-xs border border-slate-200/70 rounded-2xl px-5 py-4 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.06)] space-y-3.5">
          {/* Zarif Kategori Sekmeleri (Kutu içinde kutu olmadan, ince ve ferah) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {catalogTabs.map((tab) => {
              const active = selectedTab === tab.id;
              const count = tabCounts[tab.id] ?? 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#005596] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#005596] hover:bg-slate-100/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10.5px] font-normal ${
                      active ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* ─── Seçili Kategoriye Özel Ayrıştırıcı Alt Filtreler ─── */}
          {activeSubChips.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 shrink-0 mr-1">
                <Filter size={12} className="text-[#005596]" />
                <span>{activeTabLabel}:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {activeSubChips.map((chip) => {
                  const isSelected = selectedSubFilters.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => toggleSubFilter(chip.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#005596]/10 text-[#005596] ring-1 ring-[#005596]/30'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && <Check size={11} />}
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
                {selectedSubFilters.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSubFilters([])}
                    className="text-[11px] font-medium text-rose-500 hover:underline px-2 py-0.5 cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ─── Zarif Arama & Filtreleme Satırı ─── */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex flex-col lg:flex-row gap-2.5 justify-between items-stretch lg:items-center">
              {/* Gelişmiş Arama Kutusu + Canlı Öneri Açılır Listesi */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Model kodu, özellik veya ürün adı ara..."
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-full pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005596]/50 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}

                {/* Canlı Arama Önerileri Dropdown */}
                {searchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-lg z-40 overflow-hidden">
                    {filteredProducts.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-slate-500">
                        &ldquo;{searchQuery}&rdquo; için eşleşen ürün bulunamadı.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {filteredProducts.slice(0, 5).map((item) => (
                          <Link
                            key={item.id}
                            href={`/urun/${item.slug}`}
                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.images[0] || '/resim/pasaoglulogo-crop.png'}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0"
                              />
                              <span className="text-xs font-medium text-slate-800 truncate">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-[#005596] shrink-0">
                              {formatPrice(item.discountedPrice ?? item.price)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kibar Filtre & Sıralama Kontrolleri */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyDiscounted((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    onlyDiscounted
                      ? 'bg-amber-100/80 text-amber-800'
                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Sparkles size={12} />
                  <span>Fırsatlar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyInStock((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    onlyInStock
                      ? 'bg-emerald-100/80 text-emerald-800'
                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Check size={12} />
                  <span>Stokta</span>
                </button>

                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as PriceRangeId)}
                  className="bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 text-xs font-medium rounded-full px-3.5 py-1.5 focus:outline-none cursor-pointer transition-colors"
                >
                  {priceRanges.map((pr) => (
                    <option key={pr.id} value={pr.id}>
                      {pr.label}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'rating')}
                  className="bg-slate-100/70 hover:bg-slate-200/60 text-slate-700 text-xs font-medium rounded-full px-3.5 py-1.5 focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="default">Sıralama: Varsayılan</option>
                  <option value="price-asc">Fiyat: Artan</option>
                  <option value="price-desc">Fiyat: Azalan</option>
                  <option value="rating">Puanı En Yüksek</option>
                </select>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-medium text-[#005596] hover:underline px-2 py-1 cursor-pointer"
                  >
                    Sıfırla
                  </button>
                )}
              </div>
            </div>

            {/* Zarif Popüler Aramalar */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] pl-1">
              <span className="text-slate-400">Popüler:</span>
              {popularSearchTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="text-slate-500 hover:text-[#005596] hover:underline transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Kategori Başlığı & Sonuç Sayısı ────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-1">
          <div>
            <span className="font-semibold text-slate-800">{activeTabLabel}</span> kategorisinde{' '}
            <strong className="text-[#005596]">{filteredProducts.length}</strong> model
            gösteriliyor
          </div>
          <Link
            href="/setler"
            className="inline-flex items-center gap-1.5 font-semibold text-[#005596] hover:underline"
          >
            <Package size={14} />
            <span>Avantajlı Çeyiz & Beyaz Eşya Setlerini İncele</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* ─── Ürün Grid ──────────────────────────────────────── */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 sm:h-96 rounded-xl sm:rounded-2xl bg-white border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center space-y-4 max-w-md mx-auto shadow-2xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <SlidersHorizontal size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Aradığınız kriterlere uygun ürün bulunamadı
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Farklı bir özellik veya kategori seçebilir ya da filtreleri sıfırlayarak tüm modelleri
              görüntüleyebilirsiniz.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 bg-[#005596] hover:bg-[#004478] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UrunlerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-24 bg-[#f8fafc] flex items-center justify-center text-sm text-slate-500">
          Katalog yükleniyor...
        </div>
      }
    >
      <UrunlerContent />
    </Suspense>
  );
}
