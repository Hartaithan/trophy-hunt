const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "static-resource.np.community.playstation.net",
      },
      {
        protocol: "https",
        hostname: "image.api.playstation.com",
      },
      {
        protocol: "https",
        hostname: "psnobj.prod.dl.playstation.net",
      },
    ],
  },
};

module.exports = nextConfig;
