/** @type {import('next').NextConfig} */

let withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  pwa: {
    dest: "public",
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
