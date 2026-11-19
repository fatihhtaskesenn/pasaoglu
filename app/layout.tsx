import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Profilo Yetkili Bayi — Eviniz İçin Geleceğin Teknolojisi',
  description:
    'Profilo Yetkili Satış Mağazası. Beyaz eşya, ankastre, TV, klima ve küçük ev aletlerinde yetkili bayi güvencesi ve hızlı teslimat.',
  keywords: ['beyaz eşya', 'elektronik', 'profilo', 'profilo yetkili bayi', 'tv', 'klima', 'buzdolabı'],
  authors: [{ name: 'Profilo Yetkili Bayi' }],
  openGraph: {
    title: 'Profilo Yetkili Bayi',
    description: 'Eviniz İçin Geleceğin Teknolojisi',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="antialiased bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
