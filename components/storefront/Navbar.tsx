'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store';
import { fetchProductsFromSupabase } from '@/lib/supabase-data';
import { cn, matchesProductSearch } from '@/lib/utils';
import type { Product } from '@/types';

const navLinks = [
  { label: 'Anasayfa', href: '/' },
  {
    label: 'Ürünler',
    href: '/urunler',
    children: [
      { label: 'Buzdolabı', href: '/urunler?kategori=buzdolabi' },
      { label: 'Derin Dondurucu', href: '/urunler?kategori=derin-dondurucu' },
      { label: 'Bulaşık Makinesi', href: '/urunler?kategori=bulasik-makinesi' },
      { label: 'Çamaşır Makinesi', href: '/urunler?kategori=camasir-makinesi' },
      { label: 'Kurutma Makinesi', href: '/urunler?kategori=kurutma-makinesi' },
      { label: 'Fırın & Ocak', href: '/urunler?kategori=ocak' },
      { label: 'Davlumbaz', href: '/urunler?kategori=davlumbaz' },
      { label: 'Televizyon', href: '/urunler?kategori=tv-ses-sistemleri' },
      { label: 'Küçük Ev Aletleri', href: '/urunler?kategori=kucuk-ev-aletleri' },
      { label: 'Klimalar', href: '/urunler?kategori=klima' },
    ],
  },
  { label: 'Setler', href: '/setler' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    setMounted(true);
    fetchProductsFromSupabase().then(setLiveProducts);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? liveProducts.filter((p) => matchesProductSearch(p, searchQuery))
    : [];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out bg-[#005596] border-b border-[#00477d] shadow-md',
          scrolled ? 'h-20 shadow-lg' : 'h-28'
        )}
      >
        <nav className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between gap-8 transition-all duration-300">
          {/* Brand Logo + Sol Köşede 43. Yıl Altın Logosu */}
          <Link href="/" className="flex-shrink-0 relative group flex items-center gap-2.5">
            {/* Sol Köşe: 43. Yıl Altın İmzası */}
            <div
              className={cn(
                'relative transition-all duration-300 ease-out flex-shrink-0 -mt-2',
                scrolled ? 'w-14 h-7' : 'w-20 h-10'
              )}
            >
              <Image
                src="/resim/43yil-crop.png"
                alt="43. Yıl"
                fill
                sizes="80px"
                className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>

            {/* Paşaoğlu Mağazaları Ana Logo */}
            <div
              className={cn(
                'relative transition-all duration-300 ease-out origin-left',
                scrolled ? 'w-48 h-12' : 'w-60 h-15'
              )}
            >
              <Image
                src="/resim/pasaoglulogo-crop.png"
                alt="Paşaoğlu Mağazaları"
                fill
                sizes="(max-width: 768px) 192px, 240px"
                className="object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                priority
                loading="eager"
              />
            </div>
          </Link>

          {/* Desktop Nav - Beyaz yazılar */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 font-semibold text-white/95 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10',
                    scrolled
                      ? 'px-3.5 py-2 text-[15.5px]'
                      : 'px-4 py-2.5 text-[17.5px] tracking-[0.01em]'
                  )}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown
                      size={scrolled ? 15 : 17}
                      className={cn(
                        'transition-transform duration-200 text-white/80',
                        openDropdown === link.label && 'rotate-180 text-white'
                      )}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {link.children && openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:text-[#005596] hover:bg-blue-50 font-medium transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                'flex items-center gap-2.5 text-white/90 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl border border-white/20 transition-all duration-200 cursor-pointer backdrop-blur-sm',
                scrolled ? 'px-3.5 py-2 text-xs' : 'px-4 py-2.5 text-xs'
              )}
            >
              <Search size={15} className="text-white/90" />
              <span className="hidden sm:inline">Model veya ürün ara...</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className={cn(
                'relative rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all duration-200 cursor-pointer backdrop-blur-sm',
                scrolled ? 'p-2.5' : 'p-3'
              )}
              aria-label="Alışveriş Sepeti"
            >
              <ShoppingCart size={scrolled ? 18 : 20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center min-w-[20px] min-h-[20px] shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-white/15 text-white border border-white/20"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[#00477d] border-b border-[#003d6b] overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Search Bar Input */}
              <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
                <Search size={20} className="text-[#005596]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün adı, marka, kategori veya model yazın..."
                  className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-4 divide-y divide-slate-100">
                {searchQuery.trim() === '' ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    Aramak istediğiniz ürün veya marka adını girin (Örn: Samsung, Beko, Klima)
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    &quot;{searchQuery}&quot; için eşleşen ürün bulunamadı.
                  </p>
                ) : (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/urun/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center p-1">
                          <Image
                            src={product.images[0] || '/resim/pasaoglulogo-crop.png'}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-[#005596] transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {product.brand} • {product.category.replace(/-/g, ' ')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
