/** @type {import('next').NextConfig} */

let withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
  },
});
