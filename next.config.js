/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // accept all subdomains of googleusercontent.com
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
      },
    ],
  },
  // /archive and /tags were folded into the home feed (?tag=, ?menu=).
  // Query strings carry over, so /tags?tag=X lands on /?tag=X.
  async redirects() {
    return [
      { source: "/archive", destination: "/", permanent: true },
      { source: "/tags", destination: "/", permanent: true },
    ]
  },
}

module.exports = nextConfig
