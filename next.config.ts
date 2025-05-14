const nextConfig = {
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  images: {
    domains: ['exhibitdes.ru'],
  },
  // <-- именно здесь, на верхнем уровне конфига, а не внутри publicRuntimeConfig
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://26.0.197.27:3000',
    // если заходите без указания порта:
    'http://26.0.197.27',
  ],
};

module.exports = nextConfig;
