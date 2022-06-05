/** @type {import('next').NextConfig} */

let withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "https://accounts.safeanzeigen.de/sign-in",
        permanent: true,
      },
    ];
  },
});
