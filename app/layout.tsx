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
  title: 'Paşaoğlu Mağazaları — Eviniz İçin Geleceğin Teknolojisi',
  description:
    'Türkiye\'nin en seçkin beyaz eşya ve tüketici elektroniği mağazası. Samsung, LG, Bosch, Apple ve lider markaların en yeni nesil teknolojileri.',
  keywords: ['beyaz eşya', 'elektronik', 'paşaoğlu', 'tv', 'klima', 'buzdolabı'],
  authors: [{ name: 'Paşaoğlu Mağazaları' }],
  openGraph: {
    title: 'Paşaoğlu Mağazaları',
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
