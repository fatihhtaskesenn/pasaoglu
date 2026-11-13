'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  Truck,
  CheckCircle2,
  ChevronLeft,
  MessageCircle,
} from 'lucide-react';

export default function SepetPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCartStore();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<
    'whatsapp' | 'kredi-karti' | 'havale' | 'nakit'
  >('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Gaziantep',
    district: 'Şahinbey',
    address: '',
    orderNotes: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = totalPrice();
  const shipping = 0;
  const finalTotal = subtotal + shipping;

  const generateWhatsAppMessageUrl = (customOrderNo?: string) => {
    const ordNo = customOrderNo || `PSG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const lines = [
      `Merhaba Paşaoğlu Mağazaları, web siteniz üzerinden sipariş vermek istiyorum.`,
      `Sipariş No: ${ordNo}`,
      '',
      '📦 *SİPARİŞ EDİLEN ÜRÜNLER:*',
      ...items.map(({ product, quantity }, idx) => {
        const unit = product.discountedPrice ?? product.price;
        const modelFeature = product.features.find((f) => f.startsWith('Model Kodu:'));
        const modelCode = modelFeature
          ? modelFeature.replace('Model Kodu:', '').trim()
          : product.id.toUpperCase();
        return `${idx + 1}. ${product.name} (${modelCode})\n   Adet: ${quantity} x ${formatPrice(unit)} = ${formatPrice(unit * quantity)}`;
      }),
      '',
      `💰 *TOPLAM TUTAR:* ${formatPrice(finalTotal)} (KDV & Kurulum Dahil)`,
    ];

    if (formData.name || formData.phone || formData.address) {
      lines.push(
        '',
        '📍 *TESLİMAT BİLGİLERİ:*',
        `• Ad Soyad: ${formData.name || '-'}`,
        `• Telefon: ${formData.phone || '-'}`,
        `• Adres: ${formData.address ? `${formData.address} (${formData.district} / ${formData.city})` : `${formData.district} / ${formData.city}`}`
      );
      if (formData.orderNotes) {
        lines.push(`• Sipariş Notu: ${formData.orderNotes}`);
      }
    }

    return `https://wa.me/905370103427?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderNum = `PSG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const waUrl = generateWhatsAppMessageUrl(newOrderNum);
    setOrderNumber(newOrderNum);
    setLastWhatsAppUrl(waUrl);

    if (paymentMethod === 'whatsapp') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    setStep('success');
    clearCart();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#f8fafc] text-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#005596] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Empty Cart State ─────────────────────────────────────────
  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#f8fafc] text-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
            <ShoppingBag size={36} />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Sepetiniz Boş</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Henüz sepetinize bir ürün eklemediniz. Resmi BSH / Profilo garantili beyaz eşya,
            ankastre, televizyon ve küçük ev aletlerimizi inceleyerek sepetinize ekleyebilirsiniz.
          </p>
          <div className="pt-2">
            <Link
              href="/urunler"
              className="inline-flex px-6 py-3 rounded-xl bg-[#005596] hover:bg-[#00447c] text-white text-xs font-bold transition-colors"
            >
              Ürün Kataloğuna Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Order Success State ──────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#f8fafc] text-slate-900 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-[#005596] uppercase tracking-widest">
              Sipariş Talebiniz Oluşturuldu
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Teşekkür Ederiz{formData.name ? `, ${formData.name}` : ''}
            </h1>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Sipariş detaylarınız kaydedildi. Mağaza yetkilimiz en kısa sürede teslimat ve kurulum
              planlaması için sizinle iletişime geçecektir.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl p-6 text-left space-y-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Sipariş Numarası:</span>
              <span className="font-mono font-bold text-[#005596] text-sm">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Teslimat Bölgesi:</span>
              <span className="text-slate-900 font-medium text-right max-w-[220px] truncate">
                {formData.district}, {formData.city}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Sipariş Yöntemi:</span>
              <span className="text-slate-900 font-semibold capitalize">
                {paymentMethod === 'whatsapp'
                  ? 'WhatsApp ile Sipariş'
                  : paymentMethod.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {lastWhatsAppUrl && (
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Mesajını Tekrar Aç</span>
              </a>
            )}
            <Link
              href="/urunler"
              className="px-6 py-3 rounded-xl bg-[#005596] hover:bg-[#00447c] text-white text-xs font-bold transition-colors"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Cart & Checkout Page ────────────────────────────────
  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-14 sm:pb-24 bg-[#f8fafc] text-slate-900">
      <div className="max-w-screen-xl mx-auto px-6 space-y-8">
        {/* Breadcrumb / Stepper */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              {step === 'cart' ? 'Alışveriş Sepeti' : 'Teslimat & Sipariş Onayı'}
            </h1>
            <p className="text-xs text-slate-500">
              {step === 'cart'
                ? `Sepetinizde toplam ${totalItems()} adet ürün bulunmaktadır.`
                : 'Dilerseniz doğrudan WhatsApp üzerinden otomatik sipariş mesajıyla veya form ile tamamlayabilirsiniz.'}
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setStep('cart')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                step === 'cart'
                  ? 'bg-[#005596] text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>1. Sepet</span>
            </button>
            <span className="text-slate-400">→</span>
            <button
              onClick={() => setStep('checkout')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                step === 'checkout'
                  ? 'bg-[#005596] text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>2. Teslimat & Onay</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Items or Checkout Form) */}
          <div className="lg:col-span-8 space-y-6">
            {step === 'cart' ? (
              /* Step 1: Cart Items */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500 font-semibold">
                  <span>Ürün</span>
                  <div className="flex gap-16 mr-8">
                    <span>Adet</span>
                    <span>Tutar</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map(({ product, quantity }) => {
                    const effectivePrice = product.discountedPrice ?? product.price;
                    return (
                      <div
                        key={product.id}
                        className="py-4 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center p-2">
                            <Image
                              src={product.images[0] || '/resim/pasaoglulogo-crop.png'}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="text-[10px] text-[#005596] uppercase tracking-wider font-bold">
                              {product.brand}
                            </span>
                            <Link
                              href={`/urun/${product.slug}`}
                              className="block text-sm font-bold text-slate-900 hover:text-[#005596] line-clamp-1 transition-colors"
                            >
                              {product.name}
                            </Link>
                            <span className="text-xs text-slate-500 font-mono">
                              Birim Fiyat: {formatPrice(effectivePrice)}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                          {/* Quantity */}
                          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={quantity >= product.stock}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="w-24 text-right">
                            <span className="text-sm font-extrabold text-slate-900 font-mono">
                              {formatPrice(effectivePrice * quantity)}
                            </span>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(product.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Ürünü Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between items-center text-xs border-t border-slate-100">
                  <Link
                    href="/urunler"
                    className="inline-flex items-center gap-1 text-[#005596] font-semibold hover:underline"
                  >
                    <ChevronLeft size={14} />
                    <span>Ürün Eklemeye Devam Et</span>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Checkout Form */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Payment / Order Method Selection */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard size={16} className="text-[#005596]" />
                    <span>Satın Alma & Ödeme Yöntemi Seçin</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: 'whatsapp',
                        label: 'WhatsApp ile Satın Al',
                        desc: 'Otomatik Sipariş Mesajı',
                        icon: MessageCircle,
                      },
                      {
                        id: 'kredi-karti',
                        label: 'Kredi Kartı',
                        desc: 'Peşin Fiyatına 6 Taksit',
                        icon: CreditCard,
                      },
                      {
                        id: 'havale',
                        label: 'Havale / EFT',
                        desc: 'Banka Transferi',
                        icon: Building,
                      },
                      {
                        id: 'nakit',
                        label: 'Mağazada / Kapıda',
                        desc: 'Teslimatta Ödeme',
                        icon: Truck,
                      },
                    ].map(({ id, label, desc, icon: Icon }) => {
                      const active = paymentMethod === id;
                      const isWa = id === 'whatsapp';
                      return (
                        <button
                          type="button"
                          key={id}
                          onClick={() => setPaymentMethod(id as any)}
                          className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                            active
                              ? isWa
                                ? 'bg-emerald-50 border-emerald-600 text-slate-900 ring-1 ring-emerald-600'
                                : 'bg-blue-50/70 border-[#005596] text-slate-900 ring-1 ring-[#005596]'
                              : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              active
                                ? isWa
                                  ? 'text-emerald-600'
                                  : 'text-[#005596]'
                                : 'text-slate-400'
                            }
                          />
                          <span className="text-xs font-bold text-slate-900">{label}</span>
                          <span className="text-[10px] text-slate-500">{desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === 'whatsapp' && (
                    <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-emerald-600" />
                        <span>Otomatik WhatsApp Sipariş Mesajı Hazır</span>
                      </p>
                      <p className="text-emerald-800/90 leading-relaxed">
                        Aşağıdaki teslimat bilgilerinizi doldurup onayladığınızda, sepetinizdeki tüm
                        ürünler, model kodları, adetler ve adres bilgileriniz otomatik olarak
                        WhatsApp mesajına dönüştürülerek Paşaoğlu Mağazaları satış hattımıza
                        yönlendirilir.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'kredi-karti' && (
                    <div className="pt-3 space-y-3 border-t border-slate-100">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">
                          Kart Üzerindeki İsim
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="AD SOYAD"
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">
                            Kart Numarası
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, cardNumber: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#005596]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600">
                            Son Kul. (AA/YY)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="AA/YY"
                            value={formData.cardExpiry}
                            onChange={(e) =>
                              setFormData({ ...formData, cardExpiry: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono text-center focus:outline-none focus:border-[#005596]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Information */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck size={16} className="text-[#005596]" />
                    <span>Teslimat & İletişim Bilgileri</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">Ad Soyad</label>
                      <input
                        type="text"
                        required
                        placeholder="Adınız ve Soyadınız"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">Telefon</label>
                      <input
                        type="tel"
                        required
                        placeholder="05XX XXX XX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">
                        E-posta (İsteğe Bağlı)
                      </label>
                      <input
                        type="email"
                        placeholder="ornek@eposta.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">İl</label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600">İlçe</label>
                        <input
                          type="text"
                          required
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596]"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[11px] font-medium text-slate-600">Açık Adres</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Mahalle, cadde, sokak, bina ve daire numarası..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#005596] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-4 sticky top-28">
            <div className="bg-white rounded-2xl p-6 space-y-5 border border-slate-200 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Sipariş Özeti
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Ürün Sayısı</span>
                  <span className="text-slate-900 font-mono font-semibold">
                    {totalItems()} Adet
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Ara Toplam</span>
                  <span className="font-mono text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Teslimat & Yetkili Kurulum</span>
                  <span className="text-emerald-600 font-bold">ÜCRETSİZ</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>KDV</span>
                  <span className="text-slate-500">Dahil (%20)</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Toplam</span>
                  <span className="text-2xl font-extrabold text-[#005596] font-mono">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Direct WhatsApp Purchase Button */}
                <a
                  href={generateWhatsAppMessageUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp ile Satın Al (Otomatik Mesaj)</span>
                </a>

                {step === 'cart' ? (
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-[#005596] hover:bg-[#00447c] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Teslimat Bilgileriyle Devam Et</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-[#005596] hover:bg-[#00447c] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    <span>
                      {paymentMethod === 'whatsapp'
                        ? 'Bilgilerle WhatsApp Siparişini Gönder'
                        : `Siparişi Onayla (${formatPrice(finalTotal)})`}
                    </span>
                  </button>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck size={14} className="text-[#005596]" />
                <span>Paşaoğlu Mağazaları • Resmi Yetkili Bayi Güvencesi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
