import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import SessionWrapper from '@/components/SessionWrapper';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['300', '400', '600'],
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Real Oviedo Noticias — El diario azul',
  description: 'Todas las noticias, partidos y actualidad del Real Oviedo CF. Información diaria del equipo carbayón.',
  openGraph: {
    title: 'Real Oviedo Noticias',
    description: 'El diario digital del Real Oviedo',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${sourceSerif.variable} ${barlow.variable}`}>
      <body className="bg-oviedo-white text-oviedo-ink antialiased">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
