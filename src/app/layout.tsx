import type { Metadata } from 'next';
import Script from 'next/script';
import { Orbitron, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import SessionProvider from '@/components/providers/SessionProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeInitializer from '@/components/ThemeInitializer';
import { StructuredData } from '@/components/StructuredData';
import Starfield from '@/components/background/Starfield';
import CookieConsent from '@/components/ui/CookieConsent';
import '@/styles/globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sebstars.io';
const defaultTitle = 'SebStars.io — Architecte logiciel & Développeur Fullstack';
const defaultDescription =
  'SebStars : architecte logiciel et développeur Fullstack. Écosystème React / Next.js, interfaces premium et expériences web avancées. Approche produit et système. Belgique · 100% Remote available.';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: '%s | SebStars.io',
  },
  description: defaultDescription,
  keywords: [
    'architecte logiciel',
    'développeur fullstack',
    'React',
    'Next.js',
    'TypeScript',
    'interfaces premium',
    'expériences web',
    'Belgique',
    'Wallonie',
    'remote',
  ],
  authors: [{ name: 'Sébastien', url: siteUrl }],
  creator: 'Sébastien',
  publisher: 'SebStars.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: defaultTitle,
    description: defaultDescription,
    siteName: 'SebStars.io',
    // Image générée dynamiquement via src/app/opengraph-image.tsx (next/og)
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    // Image générée dynamiquement via opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/favicon.svg',
    shortcut: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cloudflareToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${spaceGrotesk.variable}`} style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
                  document.documentElement.classList.remove('theme-dark', 'theme-light');
                  document.documentElement.classList.add('theme-' + theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* JSON-LD : au début du body (Google accepte body). Pas de duplication. */}
        <StructuredData type="person" />
        <StructuredData type="website" />
        <ThemeInitializer />
        <Starfield />
        {/* Cloudflare Web Analytics - Invisible, RGPD-friendly, pas de cookies */}
        {cloudflareToken && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cloudflareToken}"}`}
            strategy="afterInteractive"
          />
        )}
        <ErrorBoundary>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ErrorBoundary>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
