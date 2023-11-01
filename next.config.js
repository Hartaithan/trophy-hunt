const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.playstation.net",
      },
      {
        protocol: "http",
        hostname: "**.playstation.net",
      },
      {
        protocol: "https",
        hostname: "**.playstation.com",
      },
      {
        protocol: "http",
        hostname: "**.playstation.com",
      },
    ],
  },
};

module.exports = nextConfig;
