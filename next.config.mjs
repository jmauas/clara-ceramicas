/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'mercadopago.com.ar',
          },
          {
            protocol: 'https',
            hostname: 'http2.mlstatic.com',
          },
          {
            protocol: 'https',
            hostname: 'http2.mlstatic.com',
          },
          {
            protocol: 'https',
            hostname: 'img.mlstatic.com',
          },
          {
            protocol: 'http',
            hostname: 'img.mlstatic.com',
          },
          {
            protocol: 'https',
            hostname: 'www.mercadopago.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          }
        ],
    },
    transpilePackages: ['next-auth'],
};

export default nextConfig;
