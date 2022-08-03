const withTM = require("next-transpile-modules")([
  "@wishlify/ui",
  "@wishlify/lib",
]);

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
