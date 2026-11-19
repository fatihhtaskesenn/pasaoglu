import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';

const brandMetrics = [
  { value: 'Profilo', label: 'Yetkili Satış Bayisi', detail: 'BSH Ev Aletleri resmi güvencesi' },
  { value: '%100', label: 'Orijinal & Garantili', detail: 'Fabrikasyon kapalı kutu ürünler' },
  { value: '2 Şube', label: 'Şehreküstü & Akkent', detail: 'Gaziantep merkez showroomlarımız' },
  { value: 'Aynı Gün', label: 'Hızlı Sevkiyat', detail: 'Gaziantep içi ücretsiz teslimat' },
];

const corePillars = [
  {
    icon: ShieldCheck,
    title: 'Resmi Profilo & BSH Güvencesi',
    description:
      'Profilo Dayanıklı Ev Aletleri’nin Gaziantep’teki yetkili satış mağazası olarak tüm ürünlerimiz %100 orijinal, faturalı ve resmi distribütör garantilidir.',
  },
  {
    icon: Wrench,
    title: 'Ücretsiz Yetkili Servis Kurulumu',
    description:
      'Satın aldığınız tüm beyaz eşya, ankastre, TV ve klima ürünlerinde Profilo Yetkili Servis ekipleri tarafından ücretsiz montaj ve kurulum desteği sağlanır.',
  },
  {
    icon: Users,
    title: 'Çeyiz ve Ev Kurma Danışmanlığı',
    description:
      'Yeni yuva kuran çiftlerimize ve evini yenileyen müşterilerimize bütçeye ve ihtiyaca en uygun 4’lü, 5’li ve 6’lı Profilo çeyiz setlerinde özel avantajlar sunuyoruz.',
  },
];

const serviceHighlights = [
  'Buzdolabı, derin dondurucu, çamaşır ve kurutma makinelerinde geniş stok',
  'Bulaşık makinesi, ankastre set ve fırınlarda en yeni Profilo serileri',
  'Gaziantep içi adrese ücretsiz sevkiyat ve katlara teslimat',
  'Satış sonrası yetkili servis koordinasyonu ve birebir müşteri desteği',
];

export default function HakkimizdaPage() {
  return (
    <div
      className="min-h-screen pt-20 sm:pt-28 pb-14 sm:pb-24 text-slate-900"
      style={{
        background:
          'linear-gradient(180deg, #e2eefc 0%, #f4f8fd 20%, #ffffff 45%, #eaf2fc 72%, #ffffff 100%)',
      }}
    >
      {/* ─── Kurumsal Hero Bandı ───────────── */}
      <section className="bg-gradient-to-br from-[#002b52] via-[#00447c] to-[#005596] text-white relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 py-14 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase text-sky-200">
                <Award size={15} className="text-sky-300" />
                <span>Profilo Yetkili Satış Mağazası • Gaziantep</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.12]">
                Profilo Teknolojisi ile{' '}
                <span className="text-sky-300">Güvenilir Yaşam Alanları</span>
              </h1>
              <p className="text-base sm:text-xl text-blue-100 leading-relaxed max-w-3xl">
                Gaziantep’teki Akkent ve Şehreküstü şubelerimizde; dayanıklılığı, enerji
                tasarrufu ve modern tasarımıyla öne çıkan Profilo beyaz eşya ve elektronik
                ürünlerini yetkili bayi güvencesiyle sunuyoruz.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center max-w-xs w-full space-y-4">
                <div className="relative w-44 h-14">
                  <Image
                    src="/resim/profilobyeazlogo.png"
                    alt="Profilo Yetkili Bayi"
                    fill
                    sizes="176px"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-white tracking-wide uppercase">
                  Resmi Profilo Yetkili Bayi
                </p>
                <p className="text-xs text-blue-100/85 leading-relaxed">
                  BSH Ev Aletleri Sanayi ve Ticaret A.Ş. Resmi Satış Noktası • Gaziantep
                </p>
              </div>
            </div>
          </div>

          {/* 4 Ana Kurumsal Gösterge */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-10 border-t border-white/15">
            {brandMetrics.map((item) => (
              <div
                key={item.label}
                className="bg-white/8 border border-white/15 rounded-xl p-4 sm:p-5 space-y-1"
              >
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-sky-300">
                  {item.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-white">{item.label}</div>
                <div className="text-xs text-blue-200">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 1: Profilo Mağazacılık Anlayışı ─── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-lg bg-[#005596] text-white font-display text-sm sm:text-base font-bold uppercase tracking-wider">
                Profilo Deneyimi
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#005596]">
                Gaziantep Showroomları
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Evinizin Her Köşesi İçin Dayanıklı ve Akıllı Profilo Çözümleri
            </h2>

            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-[1.8]">
              <p>
                Profilo Yetkili Satış Mağazası olarak müşterilerimize yalnızca bir beyaz eşya değil;
                uzun yıllar sorunsuz kullanabilecekleri, enerji verimliliği yüksek ve satış sonrası
                yetkili servis ağıyla korunan bir yaşam konforu sunuyoruz.
              </p>
              <p>
                Buzdolabından çamaşır ve kurutma makinelerine, bulaşık makinelerinden ankastre
                setlere, televizyondan iklimlendirme ve küçük ev aletlerine kadar tüm Profilo
                ürün gruplarını showroomlarımızda yakından inceleyebilirsiniz.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {serviceHighlights.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-700">
                  <CheckCircle2 size={18} className="text-[#005596] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/resim/imageee.png"
                  alt="Profilo Yetkili Satış Mağazası Showroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold">
                <span>Profilo Yetkili Satış Mağazası • Ürün Teşhir ve Danışma</span>
                <span className="text-[#005596] font-mono text-xs">Gaziantep</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 2: Temel Değerlerimiz ─── */}
      <section className="max-w-screen-xl mx-auto px-6 py-12 border-t border-slate-200/90">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005596] border border-blue-200 flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Şube ve Hizmet Kartları */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#005596] inline-flex items-center gap-1.5">
              <Building2 size={14} />
              Akkent Showroom
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Modern Beyaz Eşya & Çeyiz Teşhir Merkezi
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Şahinbey / Akkent bölgesinde geniş showroom alanı, tüm çeyiz setleri ve birebir uzman
              satış danışmanlığı.
            </p>
          </div>

          <div className="md:border-l border-t md:border-t-0 border-slate-200 pt-6 md:pt-0 md:pl-8 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#005596] inline-flex items-center gap-1.5">
              <Truck size={14} />
              Şehreküstü Merkez Şube
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Merkez Satış & Hızlı Sevkiyat Noktası
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Gaziantep merkezde kolay ulaşım, hızlı stok teslimatı ve doğrudan müşteri desteği.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Alt Bağlantı Bandı ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-6">
        <div className="bg-gradient-to-r from-[#003b6f] to-[#005596] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Handshake size={20} className="text-sky-300" />
              <span>Akkent ve Şehreküstü Mağazalarımıza Bekleriz</span>
            </h3>
            <p className="text-sm sm:text-base text-blue-100">
              Şube adreslerimiz, mağaza konumlarımız ve doğrudan iletişim numaralarımız için
              iletişim sayfamızı ziyaret edebilirsiniz.
            </p>
          </div>
          <Link
            href="/iletisim"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#005596] font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
          >
            <span>İletişim & Şubelerimiz</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
