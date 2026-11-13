'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, discountPercent } from '@/lib/utils';
import { useCartStore } from '@/store';
import { ProductCard } from '@/components/storefront/ProductCard';
import {
  Star,
  Check,
  ShieldCheck,
  Truck,
  Wrench,
  RotateCcw,
  ShoppingCart,
  Plus,
  Minus,
  ChevronLeft,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/resim/pasaoglulogo-crop.png'];
  const currentImage = productImages[activeImageIdx] || productImages[0];

  const effectivePrice = product.discountedPrice ?? product.price;
  const hasDiscount = Boolean(product.discountedPrice && product.discountedPrice < product.price);

  const modelFeature = product.features.find((f) => f.startsWith('Model Kodu:'));
  const modelCode = modelFeature
    ? modelFeature.replace('Model Kodu:', '').trim()
    : product.id.toUpperCase();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-14 sm:pb-24 bg-[#f8fafc] text-slate-900">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 space-y-8 sm:space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-1 text-[#005596] font-semibold hover:underline"
          >
            <ChevronLeft size={14} />
            <span>Ürün Kataloğuna Dön</span>
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-md">{product.name}</span>
        </div>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Product Studio Visual */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-8 relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px] overflow-hidden border border-slate-200 shadow-2xs">
              {/* Top-left Badges */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg font-mono">
                  Model: {modelCode}
                </span>
              </div>

              {hasDiscount && (
                <div className="absolute top-5 right-5 px-3 py-1 bg-[#005596]/10 text-[#005596] text-xs font-bold rounded-lg">
                  %{discountPercent(product.price, product.discountedPrice!)} Avantaj
                </div>
              )}

              {/* Studio Appliance Photograph */}
              <div className="my-6 w-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-72 sm:h-88 object-contain select-none transition-all duration-200"
                />
              </div>

              {/* Çoklu Ürün Görseli Küçük Önizlemeleri */}
              {productImages.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={`${imgUrl}-${idx}`}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-14 rounded-xl border p-1 bg-white transition-all cursor-pointer ${
                        idx === activeImageIdx
                          ? 'border-[#005596] ring-2 ring-[#005596]/25'
                          : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Official Dealer Badge */}
              <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">
                <ShieldCheck size={15} className="text-[#005596]" />
                <span>Paşaoğlu Mağazaları • Resmi Yetkili Bayi Garantili</span>
              </div>
            </div>

            {/* Value Props Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: ShieldCheck, title: 'Resmi Garanti', desc: 'BSH / Profilo Güvencesi' },
                { icon: Truck, title: 'Ücretsiz Teslimat', desc: 'Gaziantep İçi Özel Sevkiyat' },
                { icon: Wrench, title: 'Yetkili Kurulum', desc: 'Ücretsiz Yetkili Servis Montajı' },
                { icon: RotateCcw, title: 'Mağaza Güvencesi', desc: '43 Yıllık Esnaf Güveni' },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col items-center text-center space-y-1 shadow-2xs"
                >
                  <Icon size={18} className="text-[#005596]" />
                  <p className="text-xs font-bold text-slate-900">{title}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="lg:col-span-6 space-y-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#005596] uppercase tracking-widest">
                  {product.brand} • Resmi Yetkili Satıcı
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span className="text-slate-900 font-bold">{product.rating}</span>
                  <span>({product.reviewCount} Değerlendirme)</span>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>

              <p className="text-xs text-slate-500 font-mono">Üretici Model Kodu: {modelCode}</p>
            </div>

            {/* Pricing Box */}
            <div className="bg-slate-50 rounded-2xl p-5 space-y-1.5 border border-slate-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#005596] font-mono">
                  {formatPrice(effectivePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-slate-400 line-through font-mono">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                KDV Dahil • Seçili Kredi Kartlarına Peşin Fiyatına <strong>6 Taksit</strong> İmkanı
                (Ayda{' '}
                <span className="text-slate-900 font-bold font-mono">
                  {formatPrice(Math.round(effectivePrice / 6))}
                </span>
                )
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Ürün Açıklaması
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Highlights */}
            <div className="space-y-2.5">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Teknik Özellikler
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium"
                  >
                    <Check size={14} className="text-[#005596] flex-shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center justify-between text-xs py-2.5 border-y border-slate-200">
              <span className="text-slate-500 font-medium">Mağaza Stok Durumu:</span>
              {product.stock > 0 ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Akkent & Şehreküstü Stoklarında Mevcut ({product.stock} adet)
                </span>
              ) : (
                <span className="text-red-600 font-bold">Tükendi</span>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#005596] hover:bg-[#00447c] text-white shadow-md'
                  } disabled:opacity-40`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Sepete Eklendi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Sepete Ekle • {formatPrice(effectivePrice * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/905370103427?text=${encodeURIComponent(
                    `Merhaba Paşaoğlu Mağazaları, aşağıdaki ürünü sipariş vermek istiyorum:\n\n• Ürün: ${product.name}\n• Model Kodu: ${modelCode}\n• Adet: ${quantity}\n• Toplam Tutar: ${formatPrice(effectivePrice * quantity)}\n\nTeslimat ve ödeme işlemleri için bilgi alabilir miyim?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp ile Hemen Satın Al</span>
                </a>
                <Link
                  href="/sepet"
                  className="py-3.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors"
                >
                  Sepete ve Ödemeye Git
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <div>
              <p className="text-xs text-[#005596] font-bold uppercase tracking-widest">
                Benzer Modeller
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
                İlginizi Çekebilecek Diğer Ürünler
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
