/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'documents.iplt20.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static-files.cricket-australia.pulselive.com',
        pathname: '/**',
      },{
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // Add other domains here if your CSV has images from elsewhere
    ],
  },
};

export default nextConfig;