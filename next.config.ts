import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow development from any origin (fixes cross-origin warning)
  // Add your specific IP address here
  allowedDevOrigins: ['192.168.31.248', '192.168.0.0/16', 'localhost', '127.0.0.1', '*.local'],
  
  // Optimize build
  experimental: {
    // Optimize React rendering
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable compression
  compress: true,

  // Optimize production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
