import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Phone, MapPin, Clock } from 'lucide-react';

const footerLinks = {
  'Ürünler': [
    { label: 'Beyaz Eşya', href: '/urunler?kategori=beyaz-esya' },
    { label: 'TV & Ses Sistemleri', href: '/urunler?kategori=tv-ses-sistemleri' },
    { label: 'Klima & İklimlendirme', href: '/urunler?kategori=klima' },
    { label: 'Küçük Ev Aletleri', href: '/urunler?kategori=kucuk-ev-aletleri' },
    { label: 'Toplu Çeyiz & Beyaz Eşya Setleri', href: '/setler' },
  ],
  'Kurumsal': [
    { label: 'Hakkımızda (43 Yıl)', href: '/hakkimizda' },
    { label: 'Şubelerimiz & Konum', href: '/iletisim#subeler' },
    { label: 'İletişim & Destek', href: '/iletisim' },
    { label: 'Yetkili Bayi Güvencesi', href: '/hakkimizda' },
  ],
  'Şubelerimiz': [
    { label: 'Akkent Şubesi (Yol Tarifi)', href: 'https://maps.app.goo.gl/b1DrPiti9LznG1Bc8' },
    { label: 'Şehreküstü Şubesi (Yol Tarifi)', href: 'https://maps.app.goo.gl/7mPcVJ6krGBGg5ot7' },
    { label: 'Enes Paşaoğlu: 0537 010 34 27', href: 'tel:+905370103427' },
    { label: 'Zekeriya Paşaoğlu: 0551 044 56 58', href: 'tel:+905510445658' },
    { label: 'Instagram: @pasaoglu_profilo', href: 'https://www.instagram.com/pasaoglu_profilo/' },
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
                src="/resim/pasaoglulogo-crop.png"
                alt="Paşaoğlu Mağazaları"
                fill
                sizes="192px"
                className="object-contain"
              />
            </div>
            <p className="text-sm text-ink-soft leading-relaxed max-w-sm">
              Gaziantep&apos;in 43 yıllık köklü beyaz eşya ve tüketici elektroniği bayisi.
              1983&apos;ten bu yana eviniz için dünya lideri teknolojileri en güvenilir koşullarla sunuyoruz.
            </p>
            <p className="text-xs text-steel font-display tracking-widest uppercase">
              43 Yıldır Eviniz İçin Geleceğin Teknolojisi
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-600">
              <a
                href="tel:+905370103427"
                className="inline-flex items-center gap-2 hover:text-[#005596] font-medium transition-colors"
              >
                <Phone size={13} className="text-[#005596]" />
                <span>Enes Paşaoğlu: +90 537 010 34 27</span>
              </a>
              <a
                href="tel:+905510445658"
                className="inline-flex items-center gap-2 hover:text-[#005596] font-medium transition-colors"
              >
                <Phone size={13} className="text-[#005596]" />
                <span>Zekeriya Paşaoğlu: +90 551 044 56 58</span>
              </a>
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
                {links.map((link) => {
                  const isExternal = link.href.startsWith('http') || link.href.startsWith('tel:');
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-xs sm:text-sm text-ink-soft hover:text-[#005596] transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs sm:text-sm text-ink-soft hover:text-[#005596] transition-colors duration-150 inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-line" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <p>© 2026 Paşaoğlu Mağazaları. 43 Yıllık Resmi Bayi Güvencesiyle.</p>
          <div className="flex gap-6">
            <Link href="/hakkimizda" className="hover:text-ink transition-colors">Hakkımızda</Link>
            <Link href="/iletisim" className="hover:text-ink transition-colors">Şubelerimiz</Link>
            <Link href="/iletisim" className="hover:text-ink transition-colors">İletişim</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
