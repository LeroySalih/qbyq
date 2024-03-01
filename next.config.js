/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    
    mdxRs: true,
    serverActions: {
      allowedForwardedHosts: ['shiny-giggle-v6r5g9w9r43p6j7-3000.app.github.dev'],
      allowedOrigins: ["https://shiny-giggle-v6r5g9w9r43p6j7-3000.app.github.dev", "localhost:3000"]
    }
  },
}

const withMDX = require('@next/mdx')();

module.exports = withMDX(nextConfig);
