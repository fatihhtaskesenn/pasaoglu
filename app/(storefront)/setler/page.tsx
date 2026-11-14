'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
  X,
  Maximize2,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import {
  fetchProductSetsFromSupabase,
  type ProductSetRecord,
} from '@/lib/supabase-data';
import { Product } from '@/types';

export default function SetlerPage() {
  const [sets, setSets] = useState<ProductSetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; name: string } | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let active = true;
    fetchProductSetsFromSupabase()
      .then((liveSets) => {
        if (active) {
          setSets(liveSets);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleAddSetToCart = (setItem: ProductSetRecord) => {
    const asProduct: Product = {
      id: setItem.id,
      slug: setItem.slug,
      name: setItem.title,
      brand: 'Profilo',
      category: 'beyaz-esya',
      price: setItem.original_price,
      discountedPrice: setItem.campaign_price,
      stock: 10,
      rating: 5.0,
      reviewCount: 48,
      images: [setItem.image_url],
      description: setItem.description,
      features: setItem.included_products.map((m) =>
        m.code ? `${m.code} - ${m.title}` : m.title
      ),
      isFeatured: true,
      tags: ['set', 'ceyiz'],
      createdAt: setItem.created_at || new Date().toISOString(),
    };
    addItem(asProduct, 1);
    setAddedId(setItem.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-14 sm:pb-24 bg-gradient-to-b from-[#eef5fc] via-[#f8fafc] to-white text-[#0f172a]">
      {/* ─── Kurumsal Başlık Bandı ──────────────────────────── */}
      <section className="bg-gradient-to-r from-[#002b52] via-[#00447c] to-[#005596] text-white border-b border-[#005596]/20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-sky-200">
                <PackageCheck size={15} className="text-sky-300" />
                <span>Paşaoğlu Mağazaları • Çoklu Çeyiz & Ev Paketleri</span>
              </div>
              <h1 className="font-display text-2xl sm:text-5xl font-bold tracking-tight">
                Beyaz Eşya & Çeyiz Setlerimiz
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Birbiriyle tam uyumlu Profilo modellerinden oluşturduğumuz 4’lü, 5’li ve 6’lı
                avantaj paketleri. Tüm setlerimizde Gaziantep içi ücretsiz teslimat ve yetkili
                servis kurulumu geçerlidir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs text-blue-100/90 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/15">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-300" />
                <span>Resmi Distribütör Garantili</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-sky-300" />
                <span>Ücretsiz Adrese Sevkiyat</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench size={16} className="text-sky-300" />
                <span>Ücretsiz Yetkili Servis Montajı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Setler Listesi (Supabase Canlı) ─────────────────── */}
      <section className="max-w-screen-xl mx-auto px-3 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-10">
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-72 sm:h-96 rounded-3xl bg-white border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : sets.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-2">
            <p className="text-base font-bold text-slate-800">
              Henüz yayınlanmış çeyiz veya avantaj seti bulunmuyor.
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Admin panelinden (<code className="font-mono text-[#005596]">/admin/urunler</code> → Setler) yeni set ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          sets.map((setItem) => {
            const isAdded = addedId === setItem.id;
            const savings = Math.max(0, setItem.original_price - setItem.campaign_price);
            const machineCountLabel =
              setItem.subtitle || `${setItem.included_products.length || 5} Makine`;

            return (
              <div
                key={setItem.id}
                className="bg-white border border-slate-200/90 hover:border-[#005596]/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Sol: Beyaz Stüdyo Set Görseli */}
                  <div
                    onClick={() =>
                      setPreviewImage({ src: setItem.image_url, name: setItem.title })
                    }
                    className="lg:col-span-5 relative min-h-[220px] sm:min-h-[390px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 cursor-pointer group overflow-hidden flex items-center justify-center p-4 sm:p-6"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={setItem.image_url}
                      alt={setItem.title}
                      loading="lazy"
                      className="max-h-52 sm:max-h-80 w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-1 rounded-lg bg-[#005596] text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-xs z-10">
                      {machineCountLabel}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[11px] font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Maximize2 size={12} />
                      <span>Görseli Büyüt</span>
                    </div>
                  </div>

                  {/* Sağ: Set İçeriği & Fiyatlandırma */}
                  <div className="lg:col-span-7 p-4 sm:p-9 flex flex-col justify-between gap-5 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs font-bold text-[#005596] uppercase tracking-widest">
                          {setItem.badge_text}
                        </span>
                        {savings > 0 && (
                          <span className="px-2.5 py-1 rounded-md bg-[#005596]/10 text-[#005596] text-[11px] sm:text-xs font-bold">
                            Set Avantajı: {formatPrice(savings)} İndirim
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-xl sm:text-[26px] font-bold text-slate-900 leading-snug">
                        {setItem.title}
                      </h2>

                      {setItem.description && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {setItem.description}
                        </p>
                      )}

                      {/* Set İçeriğindeki Makineler */}
                      {setItem.included_products.length > 0 && (
                        <div className="pt-1 space-y-2.5">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Set İçeriğindeki Makineler ({setItem.included_products.length} Parça):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {setItem.included_products.map((m, idx) => (
                              <div
                                key={`${m.code}-${idx}`}
                                className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-2.5"
                              >
                                <div className="w-5 h-5 rounded-md bg-[#005596] text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-slate-900">
                                      {m.title}
                                    </span>
                                    {m.code && (
                                      <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                                        {m.code}
                                      </span>
                                    )}
                                  </div>
                                  {m.spec && (
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                      {m.spec}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fiyat & Aksiyon Alt Barı */}
                    <div className="pt-4 sm:pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        {setItem.original_price > setItem.campaign_price && (
                          <span className="text-xs text-slate-400 line-through font-mono block">
                            Tekil Liste Toplamı: {formatPrice(setItem.original_price)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                            {formatPrice(setItem.campaign_price)}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            KDV & Kurulum Dahil
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => handleAddSetToCart(setItem)}
                          className={`flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#005596] hover:bg-[#00447c] text-white shadow-sm'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={16} />
                              <span>Set Sepete Eklendi</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              <span>Seti Sepete Ekle</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://wa.me/905370103427?text=${encodeURIComponent(
                            `Merhaba, "${setItem.title}" (${formatPrice(setItem.campaign_price)}) setiniz hakkında bilgi almak istiyorum.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <MessageCircle size={16} className="text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ─── Görsel Büyütme Lightbox ────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {previewImage.name}
                </span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative aspect-[16/11] w-full bg-white p-6">
                <Image
                  src={previewImage.src}
                  alt={previewImage.name}
                  fill
                  sizes="768px"
                  className="object-contain p-4"
                  unoptimized={previewImage.src.startsWith('http')}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
