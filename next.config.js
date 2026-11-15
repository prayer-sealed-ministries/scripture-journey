const path = require('node:path')
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true'
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { unoptimized: true },
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  webpack(config) {
    if (staticExport) config.resolve.alias['next-auth/react'] = path.resolve(__dirname, 'lib/static-session.tsx')
    return config
  },
}
