const withTM = require("next-transpile-modules")(["@wishlify/ui"]);

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withTM(nextConfig);
