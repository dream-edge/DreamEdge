/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xygintepfethdohbhsja.supabase.co',
      },
    ],
  },
  // Silence the Apps Router warning in Next.js 15
  experimental: {
    // Silence RSC warnings
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

// Export the configuration
export default nextConfig;
