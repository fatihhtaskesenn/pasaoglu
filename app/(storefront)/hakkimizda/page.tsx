import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Handshake,
  History,
  ShieldCheck,
  Users,
} from 'lucide-react';

const heritageNumbers = [
  { value: '1983', label: 'Kuruluş Yılımız', detail: 'Gaziantep’te ilk adım' },
  { value: '1986', label: 'Profilo Yetkili Bayiliği', detail: 'Kesintisiz BSH iş ortaklığı' },
  { value: '43 Yıl', label: 'Ticari Tecrübe', detail: 'İki kuşaktır süren esnaf güveni' },
  { value: '2 Şube', label: 'Şehreküstü & Akkent', detail: 'Gaziantep merkez showroomlarımız' },
];

const corePillars = [
  {
    icon: Handshake,
    title: 'Sözün Senet Olduğu Esnaf Ahlakı',
    description:
      'Aile büyüklerimizden devraldığımız ticaret terbiyesiyle, müşterilerimize yalnızca bir beyaz eşya değil; yıllarca sürecek bir komşuluk ve güven ilişkisi sunuyoruz.',
  },
  {
    icon: ShieldCheck,
    title: '40 Yılı Aşan Resmi Profilo & BSH Güvencesi',
    description:
      '1986 yılından bu yana Profilo Dayanıklı Ev Aletleri’nin Gaziantep’teki resmi Uzman Yetkili Satıcısı olarak %100 orijinal, fabrikasyon garantili ürünler temin ediyoruz.',
  },
  {
    icon: Users,
    title: 'Kuşaktan Kuşağa Çeyiz ve Ev Kurma Geleneği',
    description:
      '80’li ve 90’lı yıllarda evini kurduğumuz ailelerin bugün evlatlarının ve torunlarının çeyizlerini hazırlamanın haklı gururunu yaşıyoruz.',
  },
];

const honorPlaque = {
  id: 1,
  title: '43. Yıl Onur Plaketi',
  subtitle: 'Profilo / BSH Ev Aletleri Sanayi ve Ticaret A.Ş.',
  signatory: 'Mustafa IŞKINCI — Profilo Kıdemli Satış Direktörü',
  text: 'Sayın Mehmet Ali Paşaoğlu; Profilo’nun yarım asrı aşan yolculuğunda, 43 yıldır yan yana yürümekten gurur ve mutluluk duyuyoruz. Yıllar içinde birlikte büyüttüğümüz; güvene, emeğe ve karşılıklı bağlılığa dayanan bu kıymetli yol arkadaşlığı için teşekkür ederiz.',
  image: '/resim/belgeler/belge-1-43-yil-onur-plaketi.jpeg',
  year: '43. Yıl Onur Ödülü',
};

const framedCertificates = [
  {
    id: 2,
    title: 'Uzman Yetkili Satıcı Belgesi',
    subtitle: 'BSH Ev Aletleri Sanayi ve Ticaret A.Ş.',
    signatory: 'Alper ŞENGÜL (CEO BSH Türkiye) & Mustafa IŞKINCI (Satış Direktörü)',
    text: 'Sayın MEHMET ALİ PAŞAOĞLU; Profilo markalı dayanıklı tüketim malları ve ev aletlerinin resmi "Uzman Yetkili Satıcısı"dır.',
    image: '/resim/belgeler/belge-2-yetkili-satici-belgesi.jpeg',
    year: 'Resmi Yetki Belgesi',
  },
  {
    id: 3,
    title: '2024 Yılı Üstün Performans Belgesi',
    subtitle: 'BSH Türkiye Genel Müdürlüğü',
    signatory: 'Alper ŞENGÜL (CEO BSH Türkiye) & Mustafa IŞKINCI (Satış Direktörü)',
    text: '2024 yılında satış hedeflerine ulaşma konusunda göstermiş olduğunuz üstün performans nedeniyle Sayın Mehmet Ali Paşaoğlu tebrik edilmiş, kurumsal başarısı tescillenmiştir.',
    image: '/resim/belgeler/belge-3-2024-ustun-performans.jpeg',
    year: '2024 Tescili',
  },
  {
    id: 4,
    title: '2022 Yılı Satış Başarı Belgesi',
    subtitle: 'BSH Ev Aletleri Sanayi ve Ticaret A.Ş.',
    signatory: 'Gökhan SIĞIN (CEO BSH Türkiye) & Mustafa IŞKINCI (Satış Direktörü)',
    text: '2022 yılında satış hedeflerine ulaşma ve müşteri memnuniyeti hususunda gösterilen üstün performans takdir edilmiştir.',
    image: '/resim/belgeler/belge-5-2022-basari-belgesi.jpeg',
    year: '2022 Tescili',
  },
  {
    id: 5,
    title: '2021 Yılı Başarı Belgesi',
    subtitle: 'BSH Ev Aletleri Sanayi ve Ticaret A.Ş.',
    signatory: 'Gökhan SIĞIN (CEO BSH Türkiye) & Mustafa IŞKINCI (Satış Direktörü)',
    text: '2021 yılında pazar payı ve yetkili satış hedeflerine ulaşma başarısı nedeniyle Mehmet Ali Paşaoğlu’na tevdi edilmiştir.',
    image: '/resim/belgeler/belge-4-2021-basari-belgesi.jpeg',
    year: '2021 Tescili',
  },
];

export default function HakkimizdaPage() {
  return (
    <div
      className="min-h-screen pt-28 pb-24 text-slate-900"
      style={{
        background:
          'linear-gradient(180deg, #e2eefc 0%, #f4f8fd 20%, #ffffff 45%, #eaf2fc 72%, #ffffff 100%)',
      }}
    >
      {/* ─── Kurumsal Hero & Rakamlarla 43 Yıl Bandı ───────────── */}
      <section className="bg-gradient-to-br from-[#002b52] via-[#00447c] to-[#005596] text-white relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 py-16 sm:py-22 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase text-sky-200">
                <History size={15} className="text-amber-300" />
                <span>Paşaoğlu Mağazaları • Kurumsal Tarihçe (1983 – 2026)</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.12]">
                Geçmişten Gelen Bir Güven,{' '}
                <span className="text-amber-300">43 Yıllık Esnaf Mirası…</span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-3xl">
                Bazı markalar vardır; yalnızca yıllarla değil, insanların hayatlarında bıraktıkları
                izlerle büyür. 1983’ten bugüne Gaziantep’te binlerce yuvanın kurulmasına eşlik eden
                Paşaoğlu ailesinin hikâyesi.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center max-w-xs w-full space-y-3">
                <div className="relative w-36 h-18">
                  <Image
                    src="/resim/43yil-crop.png"
                    alt="43. Yıl"
                    fill
                    sizes="144px"
                    className="object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-white tracking-wide uppercase">
                  1983’ten Günümüze Kesintisiz Hizmet
                </p>
                <p className="text-xs text-blue-100/85 leading-relaxed">
                  BSH Ev Aletleri & Profilo Uzman Yetkili Satıcısı • Gaziantep
                </p>
              </div>
            </div>
          </div>

          {/* 4 Ana Kurumsal Gösterge */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-10 border-t border-white/15">
            {heritageNumbers.map((item) => (
              <div
                key={item.label}
                className="bg-white/8 border border-white/15 rounded-xl p-4 sm:p-5 space-y-1"
              >
                <div className="font-display text-2xl sm:text-4xl font-extrabold text-amber-300">
                  {item.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-white">{item.label}</div>
                <div className="text-xs text-blue-200">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 1: 1983 Kuruluş ve İlk Yıllar (Simetrik 6+6 Izgara) ─── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Sol 6 Sütun: Geniş ve Büyük Metin Bloğu */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-lg bg-[#005596] text-white font-display text-lg font-bold">
                1983
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#005596]">
                Kuruluş ve İlk Adım • Gaziantep
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Aile Büyüklerimizden Devralınan Ticaret Kültürü ve Esnaf Terbiyesi
            </h2>

            <div className="space-y-5 text-slate-700 text-lg sm:text-[19px] leading-[1.85]">
              <p>
                Ben <strong className="text-slate-900">Mehmet Ali Paşaoğlu</strong>. Gaziantep’te
                temelleri 43 yıl önce atılan bu aile işletmesinin bugünlere ulaşmasında emeği, alın
                teri ve sorumluluğu bulunan bir esnaf olarak, geçmişimize büyük bir gururla
                bakıyorum.
              </p>
              <p>
                Meslek hayatıma aile büyüklerimden öğrendiğim değerlerle başladım. Onlardan aldığım
                ticaret kültürünü, yıllar içerisinde kendi tecrübemle birleştirerek büyüttüm. İlk
                günden itibaren tek bir ilkemiz vardı: Kapımızdan içeri giren her müşterimizi kendi
                ailemizden biri gibi ağırlamak ve sattığımız her ürünün arkasında durmak.
              </p>
              <p>
                Gaziantep çarşı kültürünün samimiyetiyle yoğrulan o ilk yıllarda, daktilo ve hesap
                makineleriyle tutulan defterlerimizde yalnızca rakamlar değil, hemşehrilerimizle
                kurduğumuz sarsılmaz dostluklar yazılıydı.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center shrink-0 mt-0.5">
                <Award size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Kurucu İlkemiz: &ldquo;Güven Ticaretten Önce Gelir&rdquo;
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  1983 yılında mütevazı mağaza ofisimizde başlayan yolculuğumuz, sözün senet sayıldığı
                  Gaziantep esnaf geleneğinin en sağlam temsilcilerinden biri haline geldi.
                </p>
              </div>
            </div>
          </div>

          {/* Sağ 6 Sütun: Aynı Oranda (16:9) 2 Dönem Fotoğrafı Alt Alta */}
          <div className="lg:col-span-6 space-y-6">
            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/resim/poglu/poglu-4.jpeg"
                  alt="Kurucumuz Mehmet Ali Paşaoğlu — 1980’li Yıllar Mağaza Ofisi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold">
                <span>Kurucumuz Mehmet Ali Paşaoğlu — 1980’li Yıllar Mağaza Ofisi</span>
                <span className="text-[#005596] font-mono text-xs">Arşiv • 1980’ler</span>
              </figcaption>
            </figure>

            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/resim/poglu/poglu-2.jpeg"
                  alt="İlk Mağaza Ofisi ve Muhasebe Masası Arşivi"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold">
                <span>İlk Mağaza Ofisi ve Muhasebe Masası Arşivi, Gaziantep</span>
                <span className="text-[#005596] font-mono text-xs">Arşiv • Kuruluş Dönemi</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 2: 1986 Profilo Bayiliği & 90'lar Teşhir (Orantısal Bento) ─── */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 border-t border-slate-200/90">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Sol 5 Sütun: Dikey (Portrait 9:16) Arşiv Fotoğrafı - Tam Orantılı */}
          <div className="lg:col-span-5 flex">
            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between w-full space-y-3">
              <div className="relative aspect-[9/14] w-full rounded-xl overflow-hidden bg-slate-100 flex-1">
                <Image
                  src="/resim/poglu/poglu-5.jpeg"
                  alt="Mehmet Ali Paşaoğlu — Tarihi Paşaoğlu Mağazası Beyaz Eşya Teşhir Alanı"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 pt-1 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold">
                <span>Mehmet Ali Paşaoğlu — Tarihi Paşaoğlu Mağazası Teşhir Alanı</span>
                <span className="text-[#005596] font-mono text-xs">1986 – 1990’lar</span>
              </figcaption>
            </figure>
          </div>

          {/* Sağ 7 Sütun: 1986 Hikayesi + Yatay (16:9) Reyon Fotoğrafı */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-lg bg-[#005596] text-white font-display text-lg font-bold">
                  1986 – 1990’lar
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-[#005596]">
                  Profilo Yetkili Bayiliği ve Büyüyen Mağazacılık
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Profilo ile Yarım Asra Yaklaşan Köklü İş Ortaklığı
              </h2>

              <div className="space-y-4 text-slate-700 text-lg sm:text-[19px] leading-[1.85]">
                <p>
                  <strong className="text-slate-900">1986 yılından itibaren</strong> Profilo
                  markasıyla sürdürdüğümüz iş ortaklığımız, bize yalnızca ticari bir tecrübe değil,
                  aynı zamanda binlerce insanın güvenini kazanma fırsatı sundu.
                </p>
                <p>
                  Gaziantep’te başlayan bu yolculukta zaman değişti, teknoloji gelişti, ihtiyaçlar
                  yenilendi. Buzdolabından fırına, çamaşır makinesinden televizyona kadar her yeni
                  teknolojiyi Gaziantep halkıyla buluştururken anlayışımız hiç değişmedi:{' '}
                  <strong className="text-[#005596]">
                    Kaliteli ürün, dürüst ticaret ve koşulsuz müşteri memnuniyeti.
                  </strong>
                </p>
              </div>
            </div>

            {/* Sağ Alt: Yatay (16:9) Beyaz Eşya Reyonu Fotoğrafı */}
            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/resim/poglu/poglu-1.jpeg"
                  alt="Mehmet Ali Paşaoğlu — Mağaza Beyaz Eşya ve Elektronik Reyonu"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 flex items-center justify-between text-xs sm:text-sm text-slate-700 font-semibold">
                <span>Mehmet Ali Paşaoğlu — Beyaz Eşya ve Elektronik Teşhir Reyonu</span>
                <span className="text-[#005596] font-mono text-xs">Arşiv • 1990’lar</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 3: 90'lar Esnaf Dostluğu & Kuşaktan Kuşağa Miras ─── */}
      <section className="max-w-screen-xl mx-auto px-6 py-16 border-t border-slate-200/90">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Sol 6 Sütun: 90'lar ve Günümüze Uzanan Güven */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-lg bg-[#005596] text-white font-display text-lg font-bold">
                1990’lar – Günümüz
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#005596]">
                Esnaf Dayanışması ve İkinci Kuşak Vizyonu
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Her Günü Emekle, Her Yılı Güvenle Kazanılmış 43 Yıl
            </h2>

            <div className="space-y-4 text-slate-700 text-lg sm:text-[19px] leading-[1.85]">
              <p>
                Bugün <strong className="text-slate-900">Paşaoğlu Mağazaları</strong>, geçmişinden
                aldığı güçle geleceğe yürüyen köklü bir aile markasıdır. Şehreküstü Merkez mağazamız
                ve Akkent Showroom şubemizle Gaziantep’in dört bir yanına aynı gün sevkiyat ve
                yetkili servis güvencesi sunuyoruz.
              </p>
              <p>
                Bizim için 43 yıl yalnızca bir zaman dilimi değil; her günü emekle, her yılı güvenle
                kazanılmış bir değerdir. Dün olduğu gibi bugün de ikinci kuşak yöneticilerimizle
                birlikte aynı samimiyetle mağazalarımızın kapısını açıyoruz.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#003b6f] to-[#005596] text-white space-y-2 shadow-sm">
              <p className="font-display text-xl sm:text-2xl font-bold text-amber-300">
                &ldquo;Dünden bugüne değişmeyen tek şey: Size verdiğimiz değer.&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-blue-100">
                Paşaoğlu Mağazaları • 1983’ten Bugüne Gaziantep’in Güvenilir Beyaz Eşya Adresi
              </p>
            </div>
          </div>

          {/* Sağ 6 Sütun: 90'lı Yıllar Mehmet Ali Paşaoğlu ve Arkadaşları Hatıra Fotoğrafı */}
          <div className="lg:col-span-6">
            <figure className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative aspect-[1184/810] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src="/resim/poglu/poglu-7.jpeg"
                  alt="Kurucumuz Mehmet Ali Paşaoğlu (Oturan) ve Arkadaşları — 90’lı Yıllar Mağaza Ofis Hatırası"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm text-slate-700 font-semibold">
                <span>
                  Kurucumuz Mehmet Ali Paşaoğlu (Oturan) ve Arkadaşları — Mağaza Ofis Hatırası
                </span>
                <span className="text-[#005596] font-mono text-xs shrink-0">Arşiv • 1990’lar</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 4: Temel Değerlerimiz & Aile Yönetim Kadrosu ─── */}
      <section className="max-w-screen-xl mx-auto px-6 py-12">
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

        {/* Kurucu ve 2. Nesil Yönetim İmza Kartı (Fotoğrafsız, bağımsız kurumsal kart) */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#005596]">
              Kurucu & Onursal Başkan
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Mehmet Ali Paşaoğlu
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Paşaoğlu Mağazaları Kurucusu (1983)
            </p>
          </div>

          <div className="md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#005596]">
              2. Kuşak Yönetim Kurulu
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Enes Paşaoğlu & Zekeriya Paşaoğlu
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Akkent Showroom & Şehreküstü Merkez Şube Yönetimi
            </p>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 5: BSH & Profilo Resmi Yetki ve Başarı Belgeleri ────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-8 pb-16">
        <div className="border-t border-slate-300/80 pt-16 space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#005596] uppercase">
              Resmi Kurumsal Tescillerimiz
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900">
              Yetkili Satıcı ve Başarı Belgelerimiz
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              BSH Ev Aletleri Sanayi ve Ticaret A.Ş. tarafından kurucumuz{' '}
              <strong className="text-slate-900">Mehmet Ali Paşaoğlu</strong> adına tevdi edilen
              43. Yıl Onur Plaketi, Uzman Yetkili Satıcı Belgesi ve üstün performans ödülleri.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Sol: 43. Yıl Onur Plaketi */}
            <div className="lg:col-span-5 flex">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col w-full">
                <div className="relative aspect-[9/12] w-full bg-slate-950 overflow-hidden flex-1">
                  <Image
                    src={honorPlaque.image}
                    alt={honorPlaque.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 bg-white border-t border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#005596]">
                    {honorPlaque.year}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {honorPlaque.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{honorPlaque.text}</p>
                  <div className="pt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-500">
                    {honorPlaque.signatory}
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: 4 Çerçeveli Belge */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {framedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 bg-white border-t border-slate-200 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#005596]">
                        {cert.year}
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{cert.text}</p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      {cert.signatory}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Alt Bağlantı Bandı ───────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-display text-xl font-bold text-slate-900">
              Akkent ve Şehreküstü Mağazalarımıza Bekleriz
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              Şube adreslerimiz, mağaza görsellerimiz ve doğrudan telefon numaralarımız için
              iletişim sayfamızı ziyaret edebilirsiniz.
            </p>
          </div>
          <Link
            href="/iletisim"
            className="px-6 py-3.5 rounded-xl bg-[#005596] hover:bg-[#00447c] text-white font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
          >
            <span>İletişim & Şubelerimiz</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
