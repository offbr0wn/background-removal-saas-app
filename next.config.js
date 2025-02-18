/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    clientMaxBodySize: "5gb", // This sets the maximum body size for client requests

    serverActions: {
      bodySizeLimit: "2gb",
    },
  },
};

module.exports = nextConfig;
