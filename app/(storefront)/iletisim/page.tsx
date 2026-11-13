'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  MessageCircle,
  Building2,
  CheckCircle2,
  Send,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const branches = [
  {
    id: 'akkent',
    name: 'Akkent Şubesi',
    type: 'Showroom & Satış Mağazası',
    address: 'Akkent Mahallesi, Şahinbey / Gaziantep',
    googleMapsUrl: 'https://maps.app.goo.gl/b1DrPiti9LznG1Bc8',
    embedMapUrl:
      'https://maps.google.com/maps?q=Akkent+Mahallesi,+%C5%9Eahinbey,+Gaziantep&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: 'Pazartesi - Cumartesi: 08:30 - 20:00 • Pazar: 11:00 - 18:30',
    description:
      'Ankastre setler, televizyonlar, klima ve beyaz eşya koleksiyonlarının sergilendiği Akkent mağazamız.',
    photos: [
      { src: '/resim/subeler/akkent/p1.jpeg', label: 'Akkent Şubesi Dış Cephe' },
      { src: '/resim/subeler/akkent/p2.jpeg', label: 'Showroom Giriş Alanı' },
      { src: '/resim/subeler/akkent/p3.jpeg', label: 'Ankastre Teşhir Alanı' },
      { src: '/resim/subeler/akkent/p4.jpeg', label: 'Mağaza İç Görünüm' },
      { src: '/resim/subeler/akkent/p5.jpeg', label: 'Beyaz Eşya Reyonu' },
    ],
  },
  {
    id: 'sehrekustu',
    name: 'Şehreküstü Şubesi',
    type: 'Merkez Şube (Kuruluş 1983)',
    address: 'Şehreküstü Mahallesi, Şahinbey / Gaziantep',
    googleMapsUrl: 'https://maps.app.goo.gl/7mPcVJ6krGBGg5ot7',
    embedMapUrl:
      'https://maps.google.com/maps?q=%C5%9Eehrek%C3%BCst%C3%BC+Mahallesi,+%C5%9Eahinbey,+Gaziantep&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: 'Pazartesi - Cumartesi: 08:30 - 20:00 • Pazar: 11:00 - 18:30',
    description:
      'Paşaoğlu Mağazaları\'nın 43 yıllık köklü geçmişine ev sahipliği yapan merkez mağazamız.',
    photos: [
      { src: '/resim/subeler/sehrekustu/sehre1.jpeg', label: 'Şehreküstü Şubesi Görünüm 1' },
      { src: '/resim/subeler/sehrekustu/sehre2.jpeg', label: 'Şehreküstü Şubesi Görünüm 2' },
      { src: '/resim/subeler/sehrekustu/sehre2.png', label: 'Şehreküstü Şubesi Görünüm 3' },
      { src: '/resim/subeler/sehrekustu/sehre4.jpeg', label: 'Şehreküstü Şubesi Görünüm 4' },
    ],
  },
];

const contacts = [
  {
    name: 'Enes Paşaoğlu',
    phone: '+90 537 010 34 27',
    cleanPhone: '905370103427',
  },
  {
    name: 'Zekeriya Paşaoğlu',
    phone: '+90 551 044 56 58',
    cleanPhone: '905510445658',
  },
];

export default function IletisimPage() {
  const [selectedGallery, setSelectedGallery] = useState<{
    branchId: string;
    index: number;
  } | null>(null);

  const activeBranch = selectedGallery
    ? branches.find((b) => b.id === selectedGallery.branchId) ?? null
    : null;
  const activePhoto =
    activeBranch && selectedGallery
      ? activeBranch.photos[selectedGallery.index] ?? null
      : null;

  useEffect(() => {
    if (!selectedGallery || !activeBranch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGallery(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedGallery((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % activeBranch.photos.length } : null
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedGallery((prev) =>
          prev
            ? {
                ...prev,
                index: (prev.index - 1 + activeBranch.photos.length) % activeBranch.photos.length,
              }
            : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGallery, activeBranch]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Akkent Şubesi',
    subject: 'Fiyat ve Stok Talebi',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-32 pb-14 sm:pb-24 bg-[#f8fafc] text-[#0f172a]">
      {/* ─── Corporate Header ───────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold tracking-widest uppercase rounded">
              <Building2 size={13} className="text-[#005596]" />
              <span>Paşaoğlu Mağazaları • İletişim Direktörlüğü</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Yetkililerimiz & <span className="text-[#005596]">Şubelerimiz</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Ürün danışmanlığı, kurumsal teklif talepleri ve showroom ziyareti için yönetim kurulu üyelerimiz
              ve şube koordinatörlerimizle doğrudan iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Direct Contact Cards (Enes & Zekeriya Paşaoğlu + Instagram) ─ */}
      <section className="max-w-screen-xl mx-auto px-6 py-12 border-b border-slate-200">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            İletişim Bilgileri
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {contact.name}
                </h3>
                <a
                  href={`tel:${contact.phone}`}
                  className="font-mono text-base font-semibold text-[#005596] hover:underline mt-1 inline-block"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-[#005596] hover:bg-[#00477d] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone size={14} />
                  <span>Ara</span>
                </a>

                <a
                  href={`https://wa.me/${contact.cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}

          {/* Official Instagram Card */}
          <div className="bg-white border border-slate-200 hover:border-pink-500/40 rounded-xl p-6 flex flex-col justify-between gap-5 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">
                  Sosyal Medya
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                  Resmi Instagram Hesabımız
                </h3>
                <a
                  href="https://www.instagram.com/pasaoglu_profilo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#005596] hover:text-pink-600 transition-colors mt-1 inline-flex items-center gap-1.5"
                >
                  <span>@pasaoglu_profilo</span>
                </a>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Güncel kampanyalar, yeni ürünler ve mağazalarımızdan kareler için takip edin.
                </p>
              </div>

              {/* Instagram Gradient Logo Badge */}
              <a
                href="https://www.instagram.com/pasaoglu_profilo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <a
                href="https://www.instagram.com/pasaoglu_profilo/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-opacity shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>Instagram&apos;da Takip Et (@pasaoglu_profilo)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Branches & Google Maps Integration ─────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 border-b border-slate-200">
        <div className="max-w-3xl mb-10 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Şubelerimiz ve Konum Bilgileri
          </h2>
          <p className="text-sm text-slate-600">
            Şubelerimizin konumunu Google Haritalar üzerinde açarak yol tarifi alabilirsiniz:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {branches.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 flex flex-col justify-between space-y-5 sm:space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#005596] uppercase tracking-wider block">
                      {b.type}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900">
                      {b.name}
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#005596] flex-shrink-0">
                    <Building2 size={20} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={17} className="text-[#005596] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Adres</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {b.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-slate-200/70">
                    <Clock size={16} className="text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Çalışma Saatleri</span>
                      <p className="text-xs text-slate-600">{b.hours}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.description}
                </p>

                {/* Refined, Polite & Compact Branch Photo Strip */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Mağaza Görselleri
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Büyütmek için tıklayın
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {b.photos.map((photo, photoIdx) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() =>
                          setSelectedGallery({
                            branchId: b.id,
                            index: photoIdx,
                          })
                        }
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 hover:border-[#005596] bg-slate-100 transition-all cursor-pointer"
                        title={photo.label}
                      >
                        <Image
                          src={photo.src}
                          alt={`${b.name} - ${photo.label}`}
                          fill
                          sizes="120px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                          <Maximize2 size={13} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mini Harita Önizlemesi */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Konum Haritası
                  </span>
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      title={`${b.name} Harita`}
                      src={b.embedMapUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              </div>

              {/* Verified Clickable Google Maps Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={b.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#005596] hover:bg-[#00477d] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation size={16} />
                  <span>Google Haritalar&apos;da Konumu Aç</span>
                  <ExternalLink size={14} className="opacity-80" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Corporate Contact Form & Assurance ──────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Yazılı İletişim
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Kurumsal Talep & Danışma Formu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Toplu satın alma, çeyiz setleri veya ürün teknik detayları için formu doldurabilirsiniz.
                Yetkililerimiz tarafınıza resmi dönüş sağlayacaktır.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Talebiniz Alındı
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Sayın <strong>{formData.name}</strong>, mesajınız Enes ve Zekeriya Paşaoğlu&apos;na
                  iletilmiştir. En kısa süre içinde <strong>{formData.phone}</strong> numaranızdan sizinle
                  iletişim kurulacaktır.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      branch: 'Akkent Şubesi',
                      subject: 'Fiyat ve Stok Talebi',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Yeni Form Doldur
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Adınız Soyadınız / Firma Unvanı *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ad Soyad"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#005596] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Telefon Numaranız *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#005596] transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      İlgili Şube Seçimi
                    </label>
                    <select
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#005596] transition-colors"
                    >
                      <option value="Akkent Şubesi">Akkent Şubesi</option>
                      <option value="Şehreküstü Şubesi">Şehreküstü Şubesi</option>
                      <option value="Genel Yönetim">Genel Yönetim / Her İkisi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Konu
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#005596] transition-colors"
                    >
                      <option value="Fiyat ve Stok Talebi">Fiyat ve Stok Talebi</option>
                      <option value="Toplu / Kurumsal Teklif">Toplu / Kurumsal Teklif</option>
                      <option value="Çeyiz Paketi Danışmanlığı">Çeyiz Paketi Danışmanlığı</option>
                      <option value="Satış Sonrası Destek">Satış Sonrası Destek</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Mesajınız / Talep Detayı
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="İlgilendiğiniz ürün modelleri, adetler veya talebinizi buraya yazabilirsiniz..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#005596] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-[#005596] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Send size={16} />
                  <span>Talebi İlet</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Corporate Note */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-900">
                43 Yıllık Resmi Bayi Güvencesi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paşaoğlu Mağazaları üzerinden gerçekleştireceğiniz tüm alışverişler, kurucumuz Mehmet Ali Paşaoğlu
                ve yöneticilerimiz Enes & Zekeriya Paşaoğlu&apos;nun 43 yıllık kurumsal ticari itibarıyla teminat
                altındadır.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <ShieldCheck size={18} className="text-[#005596] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">100% Orijinal & Faturalı Ürün</strong>
                    Tüm ürünlerimiz resmi Türkiye distribütörü bandrollü ve onaylıdır.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <Clock size={18} className="text-[#005596] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Yetkili Montaj & Randevulu Teslimat</strong>
                    Gaziantep genelinde teknik ekiplerimizce aynı gün veya randevulu kurulum.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Acil Destek & Sipariş
              </span>
              <h4 className="font-display text-lg font-bold">
                Telefonla Hızlı İrtibat
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mesai saatleri içerisinde doğrudan şube yöneticilerimize bağlanarak beklemeden işlem
                yapabilirsiniz.
              </p>
              <div className="pt-2 flex flex-col gap-2 font-mono text-sm font-bold text-amber-300">
                <a href="tel:+905370103427" className="hover:underline flex items-center gap-2">
                  <Phone size={14} /> Enes Paşaoğlu: 0537 010 34 27
                </a>
                <a href="tel:+905510445658" className="hover:underline flex items-center gap-2">
                  <Phone size={14} /> Zekeriya Paşaoğlu: 0551 044 56 58
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Lightbox Modal for Branch Photos ──────────────── */}
      <AnimatePresence>
        {selectedGallery && activeBranch && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedGallery(null)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md"
          >
            {/* Üst Bilgi & Kapatma Çubuğu */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl flex items-center justify-between gap-4 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-bold text-sky-300 shrink-0">
                  {activeBranch.name}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/85 truncate">{activePhoto.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-white/60">
                  {selectedGallery.index + 1} / {activeBranch.photos.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGallery(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Ana Görsel + Sağ/Sol Oklar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex-1 w-full max-w-5xl my-4 flex items-center justify-center min-h-0"
            >
              {activeBranch.photos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedGallery({
                      branchId: activeBranch.id,
                      index:
                        (selectedGallery.index - 1 + activeBranch.photos.length) %
                        activeBranch.photos.length,
                    })
                  }
                  className="absolute left-1 sm:left-3 z-10 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                  aria-label="Önceki fotoğraf"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <motion.div
                key={activePhoto.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center max-h-full max-w-full"
              >
                <img
                  src={activePhoto.src}
                  alt={`${activeBranch.name} - ${activePhoto.label}`}
                  className="max-h-[70vh] max-w-[88vw] sm:max-w-[78vw] w-auto h-auto object-contain rounded-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/15"
                />
              </motion.div>

              {activeBranch.photos.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedGallery({
                      branchId: activeBranch.id,
                      index: (selectedGallery.index + 1) % activeBranch.photos.length,
                    })
                  }
                  className="absolute right-1 sm:right-3 z-10 w-10 h-10 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
                  aria-label="Sonraki fotoğraf"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Alt Küçük Önizleme Şeridi */}
            {activeBranch.photos.length > 1 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md"
              >
                {activeBranch.photos.map((photo, idx) => {
                  const isCurrent = idx === selectedGallery.index;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() =>
                        setSelectedGallery({ branchId: activeBranch.id, index: idx })
                      }
                      className={`relative w-14 h-10 rounded-xl overflow-hidden transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-white scale-105 opacity-100'
                          : 'opacity-55 hover:opacity-90'
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.label}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
