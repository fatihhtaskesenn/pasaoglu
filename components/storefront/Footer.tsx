import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Clock, ShieldCheck } from 'lucide-react';

const footerLinks = {
  'Ürünler': [
    { label: 'Beyaz Eşya', href: '/urunler?kategori=beyaz-esya' },
    { label: 'TV & Ses Sistemleri', href: '/urunler?kategori=tv-ses-sistemleri' },
    { label: 'Klima & İklimlendirme', href: '/urunler?kategori=klima' },
    { label: 'Küçük Ev Aletleri', href: '/urunler?kategori=kucuk-ev-aletleri' },
    { label: 'Toplu Çeyiz & Beyaz Eşya Setleri', href: '/setler' },
  ],
  'Kurumsal': [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim & Destek', href: '/iletisim' },
    { label: 'Yetkili Bayi Güvencesi', href: '/hakkimizda' },
    { label: 'Çeyiz & Avantaj Setleri', href: '/setler' },
  ],
  'Müşteri Hizmetleri': [
    { label: 'Teklif & Bilgi Formu', href: '/iletisim' },
    { label: 'Sepetim & Sipariş', href: '/sepet' },
    { label: 'Tüm Ürünleri İncele', href: '/urunler' },
    { label: 'Profilo Yetkili Servis Güvencesi', href: '/hakkimizda' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-paper-raised border-t border-line relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#005596]/40 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative w-48 h-12">
              <Image
                src="/resim/profilologo.png"
                alt="Profilo Yetkili Bayi"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-ink-soft leading-relaxed max-w-sm">
              Profilo Yetkili Satış Mağazası. Beyaz eşya, ankastre, TV, klima ve
              küçük ev aletlerinde resmi bayi güvencesi ile hizmetinizdeyiz.
            </p>
            <p className="text-xs text-steel font-display tracking-widest uppercase">
              Profilo Güvencesiyle Eviniz İçin Geleceğin Teknolojisi
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-600">
              <div className="inline-flex items-center gap-2 text-slate-600 font-medium">
                <ShieldCheck size={14} className="text-[#005596]" />
                <span>Resmi Distribütör &amp; Yetkili Servis Garantili</span>
              </div>
              <div className="inline-flex items-center gap-2 text-slate-500">
                <Clock size={13} className="text-amber-600" />
                <span>Pzt - Cts: 08:30 - 20:00 • Pazar: 11:00 - 18:30</span>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-xs font-semibold text-[#005596] tracking-widest uppercase">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-ink-soft hover:text-[#005596] transition-colors duration-150 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-line" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <p>© 2026 Profilo Yetkili Satış Mağazası. Resmi Bayi Güvencesiyle.</p>
          <div className="flex gap-6">
            <Link href="/hakkimizda" className="hover:text-ink transition-colors">Hakkımızda</Link>
            <Link href="/urunler" className="hover:text-ink transition-colors">Ürünler</Link>
            <Link href="/iletisim" className="hover:text-ink transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
