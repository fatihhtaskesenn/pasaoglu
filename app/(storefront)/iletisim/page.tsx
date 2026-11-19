'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Clock,
  Headphones,
  Truck,
} from 'lucide-react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Fiyat ve Stok Talebi',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-32 pb-14 sm:pb-24 bg-[#f8fafc] text-[#0f172a]">
      {/* ─── Corporate Header ───────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold tracking-widest uppercase rounded">
              <Building2 size={13} className="text-[#005596]" />
              <span>Profilo Yetkili Bayi • İletişim &amp; Destek</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Müşteri Hizmetleri &amp; <span className="text-[#005596]">Teklif Formu</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Profilo ürünleri hakkında fiyat, stok, çeyiz seti teklifi ve yetkili servis
              kurulumuyla ilgili tüm sorularınız için aşağıdaki iletişim formundan bize ulaşabilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Contact Form & Corporate Info ──────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Mesaj &amp; Teklif Formu
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Çeyiz setleri, kurumsal alımlar veya ürün stok durumu hakkında bilgi almak için formu doldurun.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Talebiniz Alındı
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Sayın <strong>{formData.name}</strong>, mesajınız Profilo Yetkili Satış ekibimize
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
                      subject: 'Fiyat ve Stok Talebi',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Yeni Form Gönder
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#005596]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Telefon Numaranız *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#005596]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">E-posta Adresiniz</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ornek@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#005596]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Konu</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#005596]"
                    >
                      <option value="Fiyat ve Stok Talebi">Fiyat ve Stok Talebi</option>
                      <option value="Çeyiz Seti Teklifi">Çeyiz Seti Teklifi</option>
                      <option value="Kurumsal / Toplu Alım">Kurumsal / Toplu Alım</option>
                      <option value="Teslimat & Yetkili Servis">Teslimat &amp; Yetkili Servis</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mesajınız *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="İlgilendiğiniz Profilo model kodlarını veya talebinizi yazabilirsiniz..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#005596] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#005596] hover:bg-[#00447c] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Send size={16} />
                  <span>Talebi Gönder</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Corporate Note */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Resmi Profilo Yetkili Bayi Güvencesi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mağazamız üzerinden gerçekleştireceğiniz tüm alışverişler, BSH Ev Aletleri &amp;
                Profilo resmi distribütör garantisi ve yetkili bayi güvencesi altındadır.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <ShieldCheck size={18} className="text-[#005596] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">%100 Orijinal &amp; Faturalı Ürün</strong>
                    Tüm ürünlerimiz resmi distribütör garantili ve fabrikasyon kapalı kutuludur.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <Truck size={18} className="text-[#005596] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Yetkili Montaj &amp; Planlı Teslimat</strong>
                    Profilo Yetkili Servis ekipleri tarafından ücretsiz kurulum ve garanti tescili.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <Clock size={18} className="text-[#005596] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Çalışma Saatlerimiz</strong>
                    Pazartesi - Cumartesi: 08:30 - 20:00 • Pazar: 11:00 - 18:30
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#002b52] text-white space-y-3">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider inline-flex items-center gap-1.5">
                <Headphones size={13} />
                Hızlı Danışmanlık
              </span>
              <h4 className="font-display text-lg font-bold">
                Çeyiz &amp; Toplu Alım Desteği
              </h4>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                4’lü, 5’li ve 6’lı Profilo beyaz eşya paketleri için form üzerinden model kodlarını
                iletebilir, size özel fiyat teklifi talep edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
