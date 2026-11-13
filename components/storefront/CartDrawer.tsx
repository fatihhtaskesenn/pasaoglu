'use client';

import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } =
    useCartStore();

  const buildWhatsAppCartUrl = () => {
    const lines = [
      'Merhaba Paşaoğlu Mağazaları, aşağıdaki ürünleri sipariş vermek istiyorum:',
      '',
      ...items.map(({ product, quantity }, idx) => {
        const unit = product.discountedPrice ?? product.price;
        const modelFeature = product.features.find((f) => f.startsWith('Model Kodu:'));
        const modelCode = modelFeature
          ? modelFeature.replace('Model Kodu:', '').trim()
          : product.id.toUpperCase();
        return `${idx + 1}. ${product.name} (${modelCode})\n   Adet: ${quantity} x ${formatPrice(unit)} = ${formatPrice(unit * quantity)}`;
      }),
      '',
      `Toplam Sipariş Tutarı: ${formatPrice(totalPrice())}`,
      'Teslimat ve ödeme detayları için yardımcı olabilir misiniz?',
    ];

    return `https://wa.me/905370103427?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col text-slate-900"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-[#005596] text-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-sky-200" />
                <h2 className="text-base font-bold">
                  Alışveriş Sepeti ({totalItems()})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/60">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="text-slate-900 font-bold">Sepetiniz şu anda boş</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Ürün kataloğumuzdaki beyaz eşya, ankastre, televizyon ve küçük ev aletlerini
                    inceleyerek sepetinize ekleyebilirsiniz.
                  </p>
                  <Link
                    href="/urunler"
                    onClick={closeCart}
                    className="px-5 py-2.5 rounded-xl bg-[#005596] hover:bg-[#00447c] text-white text-xs font-bold mt-2 transition-colors"
                  >
                    Ürünleri İncele
                  </Link>
                </div>
              ) : (
                items.map(({ product, quantity }) => {
                  const effectivePrice = product.discountedPrice ?? product.price;
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex gap-3.5 shadow-2xs"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                        <Image
                          src={product.images[0] || '/resim/pasaoglulogo-crop.png'}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/urun/${product.slug}`}
                            onClick={closeCart}
                            className="text-xs font-bold text-slate-900 hover:text-[#005596] line-clamp-1 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                            title="Ürünü Kaldır"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <span className="text-[11px] text-[#005596] font-semibold">
                          {product.brand}
                        </span>

                        <div className="flex items-center justify-between pt-1.5">
                          {/* Quantity control */}
                          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg border border-slate-200 px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:text-[#005596] text-slate-600 transition-colors cursor-pointer"
                              aria-label="Azalt"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="text-xs font-mono font-bold text-slate-900 px-1.5">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= product.stock}
                              className="p-1 hover:text-[#005596] text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                              aria-label="Artır"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          {/* Line total */}
                          <span className="text-xs font-extrabold text-slate-900 font-mono">
                            {formatPrice(effectivePrice * quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Ara Toplam</span>
                    <span className="font-mono text-slate-800">{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Teslimat & Kurulum</span>
                    <span className="text-emerald-600 font-semibold">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Toplam Tutar</span>
                    <span className="font-mono text-[#005596] text-base">
                      {formatPrice(totalPrice())}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={buildWhatsAppCartUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl font-bold text-xs tracking-wide bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp ile Satın Al (Otomatik Mesaj)</span>
                  </a>

                  <Link
                    href="/sepet"
                    onClick={closeCart}
                    className="w-full py-3 rounded-xl font-bold text-xs tracking-wide bg-[#005596] hover:bg-[#00447c] text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Sepete ve Ödeme Sayfasına Git</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
