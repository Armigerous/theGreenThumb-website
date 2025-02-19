/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "www.theofficialgreenthumb.com",
      "eit-planttoolbox-prod.s3.amazonaws.com",
      "s3.amazonaws.com",
      "cdn.sanity.io",
    ],
  },
};

module.exports = nextConfig;
