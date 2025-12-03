/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ox.ac.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cam.ac.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.imperial.ac.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ucl.ac.uk',
        port: '',
        pathname: '/**',
      },
      // Add Supabase Storage domain
      {
        protocol: 'https',
        hostname: 'xygintepfethdohbhsja.supabase.co',
        port: '',
        pathname: '/**',
      },
      // Add UoB domain
      {
        protocol: 'https',
        hostname: 'new.uob.ac',
        port: '',
        pathname: '/**',
      },
      // Add Leo Global Overseas domain
      {
        protocol: 'https',
        hostname: 'www.leoglobaloverseas.com',
        port: '',
        pathname: '/**',
      },
      // Add The Visa Depot domain
      {
        protocol: 'https',
        hostname: 'thevisadepot.com',
        port: '',
        pathname: '/**',
      },
      // Add other hostnames if you use images from other external domains
      // {
      //   protocol: 'https',
      //   hostname: 'lh3.googleusercontent.com', // Example for Google user profile images
      //   port: '',
      //   pathname: '/**',
      // },
    ],
    // If you still have issues with Supabase Storage URLs, you might need to add its hostname too
    // domains: ['your-supabase-project-id.supabase.co'], // Example for Supabase storage
  },
  // If you are using experimental features, they would be here
  // experimental: {
  //   appDir: true, // If you're on Next.js 13+ app directory
  // },
};

module.exports = nextConfig; 