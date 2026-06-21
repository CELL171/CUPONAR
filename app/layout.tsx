import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['500', '700'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CupónAR · Cazá la promo, no la pagues entera',
    template: '%s · CupónAR',
  },
  description:
    'Cupones, descuentos bancarios y promos de billeteras digitales en Argentina. Cargados y verificados por la comunidad.',
  openGraph: {
    title: 'CupónAR',
    description: 'Cupones y promos de Argentina, verificados por la comunidad.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'CupónAR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CupónAR',
    description: 'Cupones y promos de Argentina, verificados por la comunidad.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
