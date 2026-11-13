'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Star,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, discountPercent } from '@/lib/utils';
import { useCartStore } from '@/store';

interface ProductCardProps {
  product: Product;
}

export function renderApplianceIllustration(product: Product, size: 'card' | 'detail' = 'card') {
  const imageSrc = product.images?.[0];
  const cls =
    size === 'detail'
      ? 'w-full h-72 sm:h-88 object-contain select-none'
      : 'w-full h-48 object-contain select-none';

  if (imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={product.name}
        loading="lazy"
        className={cls}
      />
    );
  }

  return null;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const hasDiscount = Boolean(product.discountedPrice && product.discountedPrice < product.price);
  const effectivePrice = product.discountedPrice ?? product.price;

  const modelFeature = product.features.find((f) => f.startsWith('Model Kodu:'));
  const modelCode = modelFeature
    ? modelFeature.replace('Model Kodu:', '').trim()
    : product.id.toUpperCase();

  const highlightSpecs = product.features
    .filter((f) => !f.startsWith('Model Kodu:'))
    .slice(0, 2);

  const imageSrc = product.images?.[0] || '/resim/pasaoglulogo-crop.png';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white border border-slate-200/90 hover:border-[#005596]/50 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col group relative"
    >
      <Link href={`/urun/${product.slug}`} className="flex-1 flex flex-col">
        {/* ─── Top Clean Studio Image Frame ──────────────────── */}
        <div className="relative h-64 bg-white flex items-center justify-center overflow-hidden border-b border-slate-100 px-6 pt-10 pb-5">
          {/* Top-left Model Code */}
          <div className="absolute top-3.5 left-4 flex items-center gap-1.5 z-10">
            <span className="px-2.5 py-0.5 bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-semibold rounded-md font-mono tracking-tight">
              {modelCode}
            </span>
          </div>

          {/* Top-right Subtle Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-3.5 right-4 px-2 py-0.5 bg-[#005596]/10 text-[#005596] text-[11px] font-bold rounded-md z-10">
              %{discountPercent(product.price, product.discountedPrice!)} Avantaj
            </span>
          )}

          {/* Product Photograph — Smooth 18% Hover Zoom */}
          <div className="w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              className="max-h-48 w-auto max-w-full object-contain select-none transition-transform duration-500 ease-out group-hover:scale-[1.18] will-change-transform"
            />
          </div>
        </div>

        {/* ─── Product Details Body ──────────────────────────── */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4 bg-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#005596]">
                {product.brand} • Yetkili Bayi
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-slate-700 font-semibold">{product.rating}</span>
              </div>
            </div>

            <h3 className="font-display text-[15px] sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#005596] transition-colors">
              {product.name}
            </h3>

            {/* Understated Technical Specs */}
            <div className="pt-1 space-y-1">
              {highlightSpecs.map((spec) => (
                <div
                  key={spec}
                  className="text-[11.5px] text-slate-500 flex items-center gap-1.5 truncate"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                  <span className="truncate">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Price & Action Footer ───────────────────────── */}
          <div className="pt-3.5 border-t border-slate-100 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                {hasDiscount && (
                  <span className="block text-[11px] text-slate-400 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {formatPrice(effectivePrice)}
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                Peşin Fiyatına 6 Taksit
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#005596] hover:bg-[#004175] text-white'
                } disabled:opacity-40`}
              >
                {added ? (
                  <>
                    <Check size={14} />
                    <span>Sepete Eklendi</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>

              <span
                className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50/70 text-slate-600 group-hover:text-[#005596] border border-slate-200/80 transition-colors"
                title="Ürünü İncele"
              >
                <ArrowUpRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
