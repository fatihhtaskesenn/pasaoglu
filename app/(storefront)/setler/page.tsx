'use client';

import { useState } from 'react';
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
import { Product } from '@/types';

interface ApplianceSet {
  id: string;
  slug: string;
  name: string;
  badge: string;
  machineCount: string;
  oldPrice: number;
  price: number;
  image: string;
  summary: string;
  machines: {
    code: string;
    title: string;
    spec: string;
  }[];
}

const applianceSets: ApplianceSet[] = [
  {
    id: 'set-001',
    slug: 'profilo-5li-beyaz-konfor-ceyiz-seti',
    name: 'Profilo 5’li Beyaz Konfor Çeyiz Seti',
    badge: '5’Lİ TAM BEYAZ PAKET • KURUTMA MAKİNELİ',
    machineCount: '5 Makine',
    oldPrice: 131990,
    price: 114999,
    image: '/resim/setler/set1.png',
    summary:
      'Dijital ekranlı alttan donduruculu No-Frost buzdolabı, 9 Kg çamaşır makinesi, 9 Kg ısı pompalı kurutma makinesi, bulaşık makinesi ve 4 gözü gazlı solo fırından oluşan eksiksiz beyaz seri çeyiz paketi.',
    machines: [
      {
        code: 'BD3056WFDN',
        title: 'Kombi No-Frost Buzdolabı (Beyaz)',
        spec: '508 Litre Hacim • Kapak Üstü Dijital LED Ekran',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: 'SilentPlus Inverter Motor • Ekspres Yıkama',
      },
      {
        code: 'KM9611CTR',
        title: '9 Kg Isı Pompalı Kurutma Makinesi',
        spec: 'A++ Enerji Verimliliği • Hassas Kurutma Sensörü',
      },
      {
        code: 'BM4321EG',
        title: '4 Programlı 13 Kişilik Bulaşık Makinesi',
        spec: 'HijyenEkstra Opsiyonu • Yarım Yük Yıkama',
      },
      {
        code: 'FGP6301W',
        title: '4 Gözü Gazlı Dijital Beyaz Solo Fırın',
        spec: '66 Litre Turbo Fırın • Dijital Saat & Zamanlayıcı',
      },
    ],
  },
  {
    id: 'set-002',
    slug: 'profilo-5li-inox-ve-beyaz-premium-ceyiz-seti',
    name: 'Profilo 5’li Inox & Beyaz Premium Çeyiz Seti',
    badge: '5’Lİ PREMIUM SET • INOX MUTFAK & KURUTMA',
    machineCount: '5 Makine',
    oldPrice: 142990,
    price: 124999,
    image: '/resim/setler/set2.png',
    summary:
      'Mutfağınız için parmak izi bırakmayan Inox kombi buzdolabı, Inox dijital bulaşık makinesi ve Inox solo fırın; banyonuz için ise 9 Kg çamaşır ve 9 Kg ısı pompalı kurutma makinesi bir arada.',
    machines: [
      {
        code: 'BD3056WFVN',
        title: 'Inox Alttan Donduruculu No-Frost Buzdolabı',
        spec: '508 Litre • Parmak İzi Bırakmayan Inox Gövde',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: '1200 Devir • SilentPlus Sessiz Inverter Motor',
      },
      {
        code: 'KM9611CTR',
        title: '9 Kg Isı Pompalı Kurutma Makinesi',
        spec: 'Isı Pompalı Teknoloji • Kırışıklık Azaltma Sistemi',
      },
      {
        code: 'BM5380MA',
        title: '5 Programlı Dijital Inox Bulaşık Makinesi',
        spec: '13 Kişilik Kapasite • Siyah Dijital Kontrol Paneli',
      },
      {
        code: 'FGP6402S',
        title: '4 Gözü Gazlı Dijital Inox Solo Fırın',
        spec: '66 Litre Turbo Fanlı • Otomatik Gaz Kesme Emniyeti',
      },
    ],
  },
  {
    id: 'set-003',
    slug: 'profilo-4lu-beyaz-esya-ve-4k-smart-tv-ev-paketi',
    name: 'Profilo 4’lü Beyaz Eşya & 65" 4K Smart TV Ev Paketi',
    badge: '4’LÜ ÖZEL PAKET • 4K ANDROID TV DAHİL',
    machineCount: '4 Makine',
    oldPrice: 121990,
    price: 104999,
    image: '/resim/setler/set3.png',
    summary:
      'Kombi No-Frost buzdolabı, 9 Kg çamaşır makinesi, 9 Kg ısı pompalı kurutma makinesi ve salonunuz için 65" (165 Ekran) 4K Ultra HD Android Smart LED TV içeren avantajlı kurulum paketi.',
    machines: [
      {
        code: 'BD3056WFDN',
        title: 'Kombi No-Frost Buzdolabı',
        spec: '508 Litre Geniş Hacim • MultiAirflow Soğutma',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: 'SilentPlus Motor • Leke Uzmanı Programı',
      },
      {
        code: 'KM9611CTR',
        title: '9 Kg Isı Pompalı Kurutma Makinesi',
        spec: 'DuoTronic Nem Sensörü • Düşük Enerji Tüketimi',
      },
      {
        code: '65PA525ESG',
        title: '65" (165 Ekran) 4K Ultra HD Android Smart TV',
        spec: 'Lisanslı Android TV • HDR10 & Dolby Audio Ses',
      },
    ],
  },
  {
    id: 'set-004',
    slug: 'profilo-5li-inox-mutfak-ve-egimli-cam-davlumbaz-seti',
    name: 'Profilo 5’li Inox Beyaz Eşya & Eğimli Cam Davlumbaz Seti',
    badge: '5’Lİ INOX SET • DOKUNMATİK CAM DAVLUMBAZLI',
    machineCount: '5 Makine',
    oldPrice: 125990,
    price: 109999,
    image: '/resim/setler/set4.png',
    summary:
      'Inox kombi buzdolabı, siyah kapaklı 9 Kg çamaşır makinesi, Inox dijital bulaşık makinesi, Inox solo fırın ve 60 cm eğimli siyah cam dokunmatik davlumbazdan oluşan modern 5’li set.',
    machines: [
      {
        code: 'BD3056WFVN',
        title: 'Inox Kombi No-Frost Buzdolabı',
        spec: '508 Litre • ExtraFresh Tazelik Çekmecesi',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: 'SilentPlus Motor • Siyah Kapak Çerçeveli Tasarım',
      },
      {
        code: 'BM5380MA',
        title: '5 Programlı Dijital Inox Bulaşık Makinesi',
        spec: 'Paslanmaz Çelik Gövde • HijyenEkstra+',
      },
      {
        code: 'FGP6402S',
        title: '4 Gözü Gazlı Dijital Inox Solo Fırın',
        spec: '66 Litre İç Hacim • 3D Sıcak Hava Dolaşımı',
      },
      {
        code: 'DVB6E660',
        title: '60 cm Eğimli Siyah Cam Dokunmatik Davlumbaz',
        spec: '650 m³/s Emiş Gücü • TouchControl & Çift LED',
      },
    ],
  },
  {
    id: 'set-005',
    slug: 'profilo-6li-mega-ceyiz-ve-smart-tv-paketi',
    name: 'Profilo 6’lı Mega Çeyiz Paketi (Tam Beyaz Eşya + Davlumbaz + 4K TV)',
    badge: '6’LI MEGA ÇEYİZ SETİ • TÜM EV TEK PAKETTE',
    machineCount: '6 Makine',
    oldPrice: 159990,
    price: 137999,
    image: '/resim/setler/set5.png',
    summary:
      'Yeni ev kuranlar için A’dan Z’ye eksiksiz 6’lı mega paket: Inox kombi buzdolabı, Inox bulaşık makinesi, 9 Kg çamaşır makinesi, Inox solo fırın, eğimli siyah cam davlumbaz ve 65" 4K Smart LED TV.',
    machines: [
      {
        code: 'BD3056WFVN',
        title: 'Inox Kombi No-Frost Buzdolabı',
        spec: '508 Litre • Parmak İzi Bırakmayan Inox',
      },
      {
        code: 'BM5380MA',
        title: '5 Programlı Dijital Inox Bulaşık Makinesi',
        spec: '13 Kişilik Kapasite • Rackmatic Üst Sepet',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: 'A Enerji Sınıfı • SilentPlus Inverter Motor',
      },
      {
        code: 'FGP6402S',
        title: '4 Gözü Gazlı Dijital Inox Solo Fırın',
        spec: '66 Litre Turbo Fırın • Dijital Zamanlayıcı',
      },
      {
        code: 'DVB6E660',
        title: '60 cm Eğimli Siyah Cam Davlumbaz',
        spec: 'Dokunmatik LED Panel • Yıkanabilir Alüminyum Filtre',
      },
      {
        code: '65PA525ESG',
        title: '65" (165 Ekran) 4K Ultra HD Android Smart TV',
        spec: 'Çerçevesiz Tasarım • Sesli Komut Kumandası',
      },
    ],
  },
  {
    id: 'set-006',
    slug: 'profilo-5li-tam-inox-beyaz-esya-ve-piramit-davlumbaz-seti',
    name: 'Profilo 5’li Tam Inox Beyaz Eşya & Piramit Davlumbaz Seti',
    badge: '5’Lİ KLASİK INOX SET • EKONOMİK AVANTAJ',
    machineCount: '5 Makine',
    oldPrice: 121490,
    price: 105999,
    image: '/resim/setler/set6.png',
    summary:
      'Inox kombi No-Frost buzdolabı, 9 Kg 1200 devir çamaşır makinesi, Inox dijital bulaşık makinesi, Inox 4 gözü gazlı solo fırın ve paslanmaz çelik Inox piramit davlumbazdan oluşan uyumlu 5’li set.',
    machines: [
      {
        code: 'BD3056WFVN',
        title: 'Inox Kombi No-Frost Buzdolabı',
        spec: '508 Litre Toplam Hacim • AirFlow Soğutma',
      },
      {
        code: 'CGA252X0TR',
        title: '9 Kg 1200 Devir Çamaşır Makinesi',
        spec: 'SilentPlus Motor • 15/30 Dk Ekspres Program',
      },
      {
        code: 'BM5380MA',
        title: '5 Programlı Dijital Inox Bulaşık Makinesi',
        spec: '13 Kişilik Kapasite • Ekstra Kurutma Opsiyonu',
      },
      {
        code: 'FGP6402S',
        title: '4 Gözü Gazlı Dijital Inox Solo Fırın',
        spec: '66 Litre Geniş Hacim • Düğmeden Otomatik Ateşleme',
      },
      {
        code: 'DVB6P460X',
        title: '60 cm Paslanmaz Çelik Inox Piramit Davlumbaz',
        spec: '3 Kademeli Emiş Gücü • Çift Alüminyum Filtre',
      },
    ],
  },
];

export default function SetlerPage() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; name: string } | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddSetToCart = (setItem: ApplianceSet) => {
    const asProduct: Product = {
      id: setItem.id,
      slug: setItem.slug,
      name: setItem.name,
      brand: 'Profilo',
      category: 'beyaz-esya',
      price: setItem.oldPrice,
      discountedPrice: setItem.price,
      stock: 10,
      rating: 5.0,
      reviewCount: 48,
      images: [setItem.image],
      description: setItem.summary,
      features: setItem.machines.map((m) => `${m.code} - ${m.title}`),
      isFeatured: true,
      tags: ['set', 'ceyiz'],
      createdAt: '2026-11-12',
    };
    addItem(asProduct, 1);
    setAddedId(setItem.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-14 sm:pb-24 bg-gradient-to-b from-[#eef5fc] via-[#f8fafc] to-white text-[#0f172a]">
      {/* ─── Kurumsal Başlık Bandı ──────────────────────────── */}
      <section className="bg-gradient-to-r from-[#002b52] via-[#00447c] to-[#005596] text-white border-b border-[#005596]/20">
        <div className="max-w-screen-xl mx-auto px-6 py-11 sm:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-sky-200">
                <PackageCheck size={15} className="text-sky-300" />
                <span>Paşaoğlu Mağazaları • Çoklu Çeyiz & Ev Paketleri</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                Beyaz Eşya & Çeyiz Setlerimiz
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Birbiriyle tam uyumlu Profilo modellerinden oluşturduğumuz 4’lü, 5’li ve 6’lı
                avantaj paketleri. Tüm setlerimizde Gaziantep içi ücretsiz teslimat ve yetkili
                servis kurulumu geçerlidir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-blue-100/90 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/15">
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

      {/* ─── Setler Listesi (6 Set) ─────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-12 space-y-10">
        {applianceSets.map((setItem, index) => {
          const isAdded = addedId === setItem.id;
          const savings = setItem.oldPrice - setItem.price;

          return (
            <motion.div
              key={setItem.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="bg-white border border-slate-200/90 hover:border-[#005596]/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Sol: Beyaz Stüdyo Set Görseli */}
                <div
                  onClick={() => setPreviewImage({ src: setItem.image, name: setItem.name })}
                  className="lg:col-span-5 relative min-h-[320px] sm:min-h-[390px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 cursor-pointer group overflow-hidden flex items-center justify-center p-6"
                >
                  <Image
                    src={setItem.image}
                    alt={setItem.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.12]"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#005596] text-white text-xs font-bold tracking-wider uppercase shadow-xs z-10">
                    {setItem.machineCount}
                  </div>
                  <div className="absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-lg bg-slate-900/80 text-white text-[11px] font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Maximize2 size={12} />
                    <span>Görseli Büyüt</span>
                  </div>
                </div>

                {/* Sağ: Set İçeriği & Fiyatlandırma */}
                <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#005596] uppercase tracking-widest">
                        {setItem.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#005596]/10 text-[#005596] text-xs font-bold">
                        Set Avantajı: {formatPrice(savings)} İndirim
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 leading-snug">
                      {setItem.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {setItem.summary}
                    </p>

                    {/* Set İçeriğindeki Makineler */}
                    <div className="pt-1 space-y-2.5">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Set İçeriğindeki Makineler ({setItem.machines.length} Parça):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {setItem.machines.map((m, idx) => (
                          <div
                            key={m.code + idx}
                            className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 flex items-start gap-2.5"
                          >
                            <div className="w-5 h-5 rounded-md bg-[#005596] text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-slate-900">
                                  {m.title}
                                </span>
                                <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                                  {m.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {m.spec}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fiyat & Aksiyon Alt Barı */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 line-through font-mono block">
                        Tekil Liste Toplamı: {formatPrice(setItem.oldPrice)}
                      </span>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                          {formatPrice(setItem.price)}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          KDV & Kurulum Dahil
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddSetToCart(setItem)}
                        className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                          `Merhaba, "${setItem.name}" (${formatPrice(setItem.price)}) setiniz hakkında bilgi almak istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle size={16} className="text-emerald-600" />
                        <span>WhatsApp ile Sor</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
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
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
