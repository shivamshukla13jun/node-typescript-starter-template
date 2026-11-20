/** @type {import('next').NextConfig} */
const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:3000';

const nextConfig = {
  reactStrictMode: true,
  // Dev-server proxy so API calls stay same-origin (no CORS needed)
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_PROXY_TARGET}/api/:path*` },
      { source: '/encryption/:path*', destination: `${API_PROXY_TARGET}/encryption/:path*` },
    ];
  },
};

export default nextConfig;
