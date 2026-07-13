import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  // No serverExternalPackages needed — handled by transpilePackages already

  // Add aggressive HTTP caching headers to static assets and pages
  async headers() {
    return [
      {
        // Static assets (JS, CSS, fonts, images) — cache for 1 year (immutable)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Public folder assets
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    // Aggressive caching for optimized images
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },

  // Performance: compress responses, enable React strict mode
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    // Removed cpus: 1 — this was artificially throttling the build AND runtime
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      'recharts',
    ],
  },
};

export default withSentryConfig(withAnalyzer(nextConfig), {
  org: "healthexpress-india",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
