import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const siteName = 'Secure Starter Demo';
const siteDescription =
  'Next.js + TypeScript frontend example for the Node/TypeScript starter: ' +
  'hybrid RSA + AES-GCM encrypted API client, schema-driven forms, ' +
  'multi-step forms, reusable DataTable and UI components.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Encrypted API + Reusable Components`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: 'Secure Starter' }],
  keywords: ['Next.js', 'TypeScript', 'encrypted api', 'reusable components'],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
  { href: '/users', label: 'Users' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-brand-700">
              {siteName}
            </Link>
            <div className="flex gap-4 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-slate-600 transition hover:text-brand-600"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          Reusable Next.js starter components — encrypted end to end
        </footer>
      </body>
    </html>
  );
}
