/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2f1697jmhxzla.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/pdf/:path*",
        destination: "https://c616c7hp22.execute-api.ap-south-1.amazonaws.com/dev/pdf/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; worker-src 'self' blob: https://cdnjs.cloudflare.com; connect-src 'self' https://cdnjs.cloudflare.com https://unpkg.com https://d2f1697jmhxzla.cloudfront.net",
          },
        ],
      },
    ];
  },
};

export default nextConfig;