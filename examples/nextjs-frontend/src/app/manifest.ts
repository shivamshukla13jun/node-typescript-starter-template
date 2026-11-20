import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Secure Starter Demo',
    short_name: 'SecureDemo',
    description: 'Next.js frontend for the encrypted starter API',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2563eb',
    icons: [],
  };
}
